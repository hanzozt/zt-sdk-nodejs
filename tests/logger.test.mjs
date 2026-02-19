import zt from "../zt.js";
import test from "node:test";
import assert from "node:assert";
import { setTimeout as delay } from 'node:timers/promises';

test('setLogger test', async () => {
    const messages = [];
    zt.setLogger(
        (msg) => {
            messages.push(msg);
        }
    );

    zt.setLogLevel(5);
    await delay(1000);
    assert(messages.length > 0, "Logger callback should have been called at least once");
    assert(messages.some(msg => msg.message.includes("set log level")),
        "Logger should contain log level set message"
    );
})




