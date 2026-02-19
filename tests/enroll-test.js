const bindings = require('bindings')('zt_sdk_nodejs')

const result = bindings.zt_sdk_version();
const binary = require('@mapbox/node-pre-gyp');
const path = require('path')
const binding_path = binary.find(path.resolve(path.join(__dirname,'../package.json')));
const zt = require(binding_path);
require('assert').notEqual(result,"");

console.log("using zt version: " + zt.zt_sdk_version())



const zt_Enroll = async (jwt_path) => {
    console.log("JS zt_Enroll() entered ")
    return new Promise((resolve, reject) => {
        let rc = zt.zt_enroll(
            jwt_path,
            (data) => {
              return resolve(data);
            }
          );
    });
};


(async () => {

    let jwt_path = process.argv[2];

    let data = await zt_Enroll(jwt_path).catch((data) => {
        console.log('JS zt_enroll failed with error code (%o/%s)', data.status, data.err);
    });

    if (data && data.identity) {
        console.log("data.identity is:\n\n%s\n", data.identity);
    }

    process.exit(0);

})();
