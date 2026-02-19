import zt from "../zt.js";
import assert from "node:assert";
import test from "node:test";
const suite = test.suite;

zt.setLogLevel(5)

suite("Ziti SDK Context Tests", { timeout: 30000 }, () => {
    test.afterEach(() => {
        zt.zt_shutdown()
    })

    test("zt.shutdown not fail", () => {
        zt.zt_shutdown()
    })

    test("zt.zt_init with bad args", (done) => {
        assert.throws(() => {
            zt.zt_init()
        }, {
            message: "Too few arguments",
            code: "EINVAL"
        })
        assert.throws(() => {
            zt.zt_init("valid-config")
        }, {
            message: "Too few arguments",
            code: "EINVAL"
        })
    })

    test("zt.zt_init with invalid config", (done) => {
        assert.throws(() => {
                zt.zt_init("not-a-valid-config", () => {
                    assert.fail("should not called")
                })
            },
            {
                message: "configuration not found",
                code: 'EINVAL'
            }
        )
        zt.init("not-a-valid-config").then(
            () => {
                assert.fail("should not resolve")
            },
            (err) => {
                assert.strictEqual(err.message, 'configuration not found')
                assert.strictEqual(err.code, 'EINVAL')
            }
        )
        assert.rejects(() => zt.init("not-a-valid-config"),
            {
                code: 'EINVAL',
                message: 'configuration not found'
            })
    })

    test("incomplete config", () => {
        const cfg = {
            id: {
                cert: 'cert',
                key: 'key',
                ca: 'ca'
            }
        }

        const cfgStr = JSON.stringify(cfg)
        assert.throws(() => {
            zt.zt_init(cfgStr, (err) => {
                assert.fail("should not called")
            })
        })
        assert.rejects(() => zt.init(cfgStr), { message: 'configuration is invalid'})
    })

    test("complete but invalid config", async () => {
        const cfg = {
            ztAPI: "http://localhost:6262",
            id: {
                cert: 'cert',
                key: 'key',
                ca: 'ca'
            }
        }

        const cfgStr = JSON.stringify(cfg)
        await assert.rejects(() => zt.init(cfgStr), { message: 'configuration is invalid'})
    })

})