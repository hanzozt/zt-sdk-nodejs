// import ziti from '@openziti/ziti-sdk-nodejs';
import ziti from '../ziti.js';

const jwt_path = process.argv[2];

if (!jwt_path) {
    console.error('Usage: node enroll.mjs <jwt_path>');
    process.exit(1);
}

console.log("JS ziti_Enroll() entered ")
const identity = await ziti.enroll(jwt_path).catch((err) => {
    console.log('ziti enrollments failed with error: %o', err);
});

// Note: identity is the Ziti configuration JSON object that can be used for ziti.init()
// or saved to a file for later use.
console.log(identity);