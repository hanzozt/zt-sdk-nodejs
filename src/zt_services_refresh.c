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
#include <time.h> 

void zt_services_refresh(zt_context ztx, bool now);


/**
 * 
 */
napi_value _zt_services_refresh(napi_env env, const napi_callback_info info) {
  napi_status status;
  napi_value jsRetval;

  ZITI_NODEJS_LOG(INFO, "zt_services_refresh initiated");

  // Now, call the C-SDK to refresh the services list
  zt_services_refresh(ztx, true);

  status = napi_create_int32(env, 0 /* always succeed here */, &jsRetval);
  if (status != napi_ok) {
    napi_throw_error(env, NULL, "Unable to create return value");
  }

  return jsRetval;
}


/**
 * 
 */
void expose_zt_services_refresh(napi_env env, napi_value exports) {
  napi_status status;
  napi_value fn;

  status = napi_create_function(env, NULL, 0, _zt_services_refresh, NULL, &fn);
  if (status != napi_ok) {
    napi_throw_error(env, NULL, "Unable to wrap native function '_zt_services_refresh");
  }

  status = napi_set_named_property(env, exports, "zt_services_refresh", fn);
  if (status != napi_ok) {
    napi_throw_error(env, NULL, "Unable to populate exports for 'zt_services_refresh");
  }

}

