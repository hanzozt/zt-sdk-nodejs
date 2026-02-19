const zt = require("../zt.js");
const assert = require("node:assert");
const test = require("node:test");
const suite = test.suite;

suite("Ziti SDK Addon Tests", () => {
    test("zt.exports tests", () => {
        assert(typeof zt.zt_sdk_version === "function", "zt_sdk_version should be a function");
        assert(typeof zt.enroll === "function", "zt_enroll should be a function");
        assert(typeof zt.setLogger === "function", "zt_set_logger should be a function");

    })
    test("zt_sdk_version test", () => {
        const result = zt.zt_sdk_version();
        console.log("zt_sdk_version() result is: ", result);
        assert(result !== "", "zt_sdk_version should not return an empty string");
    })
})





