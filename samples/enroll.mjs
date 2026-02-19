// import zt from '@hanzozt/zt-sdk-nodejs';
import zt from '../zt.js';

const jwt_path = process.argv[2];

if (!jwt_path) {
    console.error('Usage: node enroll.mjs <jwt_path>');
    process.exit(1);
}

console.log("JS zt_Enroll() entered ")
const identity = await zt.enroll(jwt_path).catch((err) => {
    console.log('zt enrollments failed with error: %o', err);
});

// Note: identity is the Ziti configuration JSON object that can be used for zt.init()
// or saved to a file for later use.
console.log(identity);