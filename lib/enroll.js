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


/**
 * enroll    Enrolls a Ziti Identity using the provided JWT file path.
 * The callback receives an error (if any) or the Ziti configuration JSON upon successful enrollment.
 *
 * if callback is not provided, returns a Promise that resolves with the Ziti configuration JSON or rejects with an error.
 *
 * @param {*} jwt_path 
 * @param {*} on_enroll_cb callback (err, cfg) => {}  where cfg is the Ziti configuration object
 * @return {Promise|undefined} Returns a Promise if no callback is provided, otherwise returns undefined.
 */
const enroll = ( jwt_path, on_enroll_cb ) => {

  if (on_enroll_cb) {
    ziti.ziti_enroll(jwt_path, (err, cfg) => {
        if (err) {
            on_enroll_cb(err);
        } else {
            on_enroll_cb(undefined, JSON.parse(cfg));
        }
    });
    return undefined;
  }

  return new Promise((resolve, reject) => {
      try {
          ziti.ziti_enroll(jwt_path, (err, cfg) => {
              if (err) {
                  reject(err);
              } else {
                  resolve(JSON.parse(cfg));
              }
          });
      } catch (e) {
          reject(e);
      }
  });

}

exports.enroll = enroll;
