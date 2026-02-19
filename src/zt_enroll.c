/*
Copyright NetFoundry Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

https://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

#include "zt-nodejs.h"
#include <stc/cstr.h>
/**
 *
 */
typedef struct {
    napi_threadsafe_function tsfn_on_enroll;
    int err;
    cstr err_msg;
    cstr config;
} EnrollAddonData;

static void EnrollAddonData_drop(EnrollAddonData* data) {
  cstr_drop(&data->err_msg);
  cstr_drop(&data->config);
  free(data);
}
/**
 * This function is responsible for calling the JavaScript callback function 
 * that was specified when the zt_enroll(...) was called from JavaScript.
 */
static void CallJs_on_enroll(napi_env env, napi_value js_cb, void* context, void* d) {

  napi_status status;

  ZITI_NODEJS_LOG(DEBUG, "entered");

  // This parameter is not used.
  (void) context;

  // Retrieve the EnrollItem created by the worker thread.
  EnrollAddonData* data = (EnrollAddonData*)d;

  ZITI_NODEJS_LOG(DEBUG, "enroll status: %d/%s", data->err, cstr_str(&data->err_msg));
  ZITI_NODEJS_LOG(DEBUG, "item->config: %s", cstr_str(&data->config));
  napi_release_threadsafe_function(data->tsfn_on_enroll, napi_tsfn_release);

  // env and js_cb may both be NULL if Node.js is in its cleanup phase, and
  // items are left over from earlier thread-safe calls from the worker thread.
  // When env is NULL, we simply skip over the call into Javascript
  if (env != NULL) {
    NAPI_GLOBAL(env, global);

    if (data->err != ZITI_OK) {
      napi_value err, err_str;
      NAPI_CHECK(env, "create error string",
                 napi_create_string_utf8(env, cstr_str(&data->err_msg), cstr_size(&data->err_msg), &err_str));
      NAPI_CHECK(env, "create error", napi_create_error(env, NULL, err_str, &err));
      NAPI_CHECK(env, "callback with error", napi_call_function(env, global, js_cb, 1, &err, NULL));
    } else {
      napi_value result[2];
      NAPI_CHECK(env, "get undefined", napi_get_undefined(env, &result[0]));
      NAPI_CHECK(env, "create config string",
                 napi_create_string_utf8(env, cstr_str(&data->config), cstr_size(&data->config), &result[1]));
      NAPI_CHECK(env, "callback with success", napi_call_function(env, global, js_cb, 2, result, NULL));
    }
  }
}


/**
 * 
 */
void on_zt_enroll(const zt_config *cfg, int status, const char *err, void *ctx) {
  napi_status nstatus;

  ZITI_NODEJS_LOG(DEBUG, "\nstatus: %d, \nerr: %s,\nctx: %p", status, err, ctx);

  EnrollAddonData* addon_data = (EnrollAddonData*)ctx;
  addon_data->err = status;
  if (err) {
    cstr_assign(&addon_data->err_msg, err);
  }
  if (cfg != NULL) {
    size_t len;
    char *output_buf = zt_config_to_json(cfg, 0, &len);
    cstr_assign(&addon_data->config, output_buf);
    free(output_buf);
  }

  // Initiate the call into the JavaScript callback. 
  // The call into JavaScript will not have happened 
  // when this function returns, but it will be queued.
  nstatus = napi_call_threadsafe_function(
      addon_data->tsfn_on_enroll,
      addon_data,
      napi_tsfn_blocking);
  if (nstatus != napi_ok) {
    ZITI_NODEJS_LOG(ERROR, "Unable to napi_call_threadsafe_function");
  }
}

static napi_value z_enroll(napi_env env, const napi_callback_info info) {
  napi_status status;
  napi_value jsRetval;
  napi_valuetype js_cb_type;

  zt_log_init(thread_loop, ZITI_LOG_DEFAULT_LEVEL, NULL);

  ZITI_NODEJS_LOG(DEBUG, "entered");

  size_t argc = 2;
  napi_value args[2];
  status = napi_get_cb_info(env, info, &argc, args, NULL, NULL);
  if (status != napi_ok) {
    napi_throw_error(env, NULL, "Failed to parse arguments");
  }

  if (argc < 2) {
    ZITI_NODEJS_LOG(DEBUG, "Too few arguments");
    napi_throw_error(env, "EINVAL", "Too few arguments");
    return NULL;
  }

  // Obtain location of JWT file
  size_t result;
  char *jwt = NULL;
  NAPI_CHECK(env, "get JWT", napi_get_value_string_utf8(env, args[0], jwt, 0, &result));
  jwt = malloc(result + 1);
  NAPI_CHECK(env, "get JWT", napi_get_value_string_utf8(env, args[0], jwt, result + 1, &result));
  jwt[result] = 0;

  // Obtain ptr to JS callback function
  // napi_value js_cb = args[1];
  napi_typeof(env, args[1], &js_cb_type);
  if (js_cb_type != napi_function) {
    ZITI_NODEJS_LOG(DEBUG, "args[1] is NOT a napi_function");
  } else {
    ZITI_NODEJS_LOG(DEBUG, "args[1] IS a napi_function");
  }
  EnrollAddonData* addon_data = calloc(1, sizeof(*addon_data));

  // Create a string to describe this asynchronous operation.
  NAPI_LITERAL(env, work_name, "N-API on_zt_enroll");

  // Convert the callback retrieved from JavaScript into a thread-safe function (tsfn)
  // which we can call from a worker thread.
  NAPI_CHECK(env, "create thread-safe function",
             napi_create_threadsafe_function(
                     env, args[1], NULL, work_name,
                     0, 1, NULL, NULL, NULL, CallJs_on_enroll,
                     &(addon_data->tsfn_on_enroll)));

  // Initiate the enrollment
  zt_enroll_opts opts = {0};
  opts.token = jwt;
  int rc = zt_enroll(&opts, thread_loop, on_zt_enroll, addon_data);
  free(jwt);

  if (rc != ZITI_OK) {
    ZITI_NODEJS_LOG(ERROR, "zt_enroll failed: %d/%s", rc, zt_errorstr(rc));
    napi_throw_error(env, NULL, zt_errorstr(rc)); // does not return
    return NULL;
  }

  NAPI_UNDEFINED(env, undefined);
  return undefined;
}

ZNODE_EXPOSE(zt_enroll, z_enroll)
