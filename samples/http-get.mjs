import zt from '../zt.js';
import http from 'node:http';

// Usage node http-get.mjs <identity.json> <url>
// <url> can be a Ziti service intercept (e.g. http://myserver.zt:8080) or http://<service-name> (port does not matter)
const IDENTITY_FILE = process.argv[2];
const URL    = process.argv[3];

if (!IDENTITY_FILE) {
    console.error('Set ZITI_IDENTITY_FILE to your identity JSON path');
    process.exit(1);
}

console.log('Initializing...');
await zt.init(IDENTITY_FILE);
console.log('Init done');

http.get(URL,
    { agent: zt.httpAgent() },
    (res) => {
        console.log(`HTTP status code: ${res.statusCode} ${res.statusMessage}`);
        for (const k in res.headers) {
            const header = res.headers[k];
            console.log(`  ${k}: ${header}`);
        }
        res.on('data', (chunk) => {
            console.log('Received body chunk:', chunk.toString());
        }).on('end', zt.zt_shutdown)
    });
