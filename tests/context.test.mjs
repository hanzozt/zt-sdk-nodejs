import ziti from "../ziti.js";
import assert from "node:assert";
import test from "node:test";
const suite = test.suite;

ziti.setLogLevel(5)

suite("Ziti SDK Context Tests", { timeout: 30000 }, () => {
    test.afterEach(() => {
        ziti.ziti_shutdown()
    })

    test("ziti.shutdown not fail", () => {
        ziti.ziti_shutdown()
    })

    test("ziti.ziti_init with bad args", (done) => {
        assert.throws(() => {
            ziti.ziti_init()
        }, {
            message: "Too few arguments",
            code: "EINVAL"
        })
        assert.throws(() => {
            ziti.ziti_init("valid-config")
        }, {
            message: "Too few arguments",
            code: "EINVAL"
        })
    })

    test("ziti.ziti_init with invalid config", (done) => {
        assert.throws(() => {
                ziti.ziti_init("not-a-valid-config", () => {
                    assert.fail("should not called")
                })
            },
            {
                message: "configuration not found",
                code: 'EINVAL'
            }
        )
        ziti.init("not-a-valid-config").then(
            () => {
                assert.fail("should not resolve")
            },
            (err) => {
                assert.strictEqual(err.message, 'configuration not found')
                assert.strictEqual(err.code, 'EINVAL')
            }
        )
        assert.rejects(() => ziti.init("not-a-valid-config"),
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
            ziti.ziti_init(cfgStr, (err) => {
                assert.fail("should not called")
            })
        })
        assert.rejects(() => ziti.init(cfgStr), { message: 'configuration is invalid'})
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
        await assert.rejects(() => ziti.init(cfgStr), { message: 'configuration is invalid'})
    })

})