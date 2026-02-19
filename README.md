![Ziggy using the zt-sdk-nodejs](https://raw.githubusercontent.com/hanzozt/branding/main/images/banners/Node.jpg)

<p align="center" width="100%">
Hanzo ZT is a free and open source project focused on bringing zero trust to any application.
     <br>
The project provides all the pieces required to implement or integrate zero trust into your solutions.
<br/>
<br/>
Please star us.
<br/>
<a href="https://github.com/hanzozt/zt/stargazers"><img src="https://img.shields.io/github/stars/hanzozt/zt?style=flat" ></a>
<br/>
     <br>
</p>

<p align="center" width="100%">
<a href="https://hanzozt.dev"><img src="zt.png" width="100"></a>
</p>

<p align="center">
    <b>
    <a>@hanzozt/zt-sdk-nodejs</a>
    <br>
    <br>
    <b>
    This repo hosts the Hanzo ZT SDK for NodeJS, and is designed to help you deliver secure applications over a <a href="https://hanzozt.dev">Hanzo ZT Network</a>
    <br>
    <br>
    <b>Part of the <a href="https://hanzozt.dev/about">Hanzo ZT</a> ecosystem</b>
</p>

<p align="center">
    <br>
    <b>Are you interested in knowing how to easily embed programmable, high performance, zero trust networking into your NodeJS app, on any internet connection, without VPNs?
    <br>
    Learn more about our <a href="https://hanzozt.dev/about">Hanzo ZT</a> project.</b>
    <br>
    </p>

---
[![Build Status](https://github.com/hanzozt/zt-sdk-nodejs/workflows/Build/badge.svg?branch=main)]()
[![Issues](https://img.shields.io/github/issues-raw/hanzozt/zt-sdk-nodejs)]()
[![npm version](https://badge.fury.io/js/@hanzozt%2Fzt-sdk-nodejs.svg)](https://badge.fury.io/js/@hanzozt%2Fzt-sdk-nodejs.svg)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![LOC](https://img.shields.io/tokei/lines/github/hanzozt/zt-sdk-nodejs)]()
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=rounded)](CONTRIBUTING.md)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-v2.0%20adopted-ff69b4.svg)](CODE_OF_CONDUCT.md)

---

# Associated Article(s)
For more context on this SDK, you may be interested in this
[article concerning how to secure NodeJS applications](https://blog.hanzozt.dev/securing-nodejs-applications)



# Supported platforms

The `@hanzozt/zt-sdk-nodejs` module works with the following Node.js versions:
- v20.x 
- v22.x
- v24.x
- v25.x

The `@hanzozt/zt-sdk-nodejs` module works with the following architectures:
- amd64
- arm64

The `@hanzozt/zt-sdk-nodejs` module works with the following Operating Systems:
- macos
- linux
- windows


# Installing

NPM
``` js
npm i @hanzozt/zt-sdk-nodejs
```
or Yarn
``` js
yarn add @hanzozt/zt-sdk-nodejs
```

Special note on previous package:

On June 7, 2020 @hanzozt/zt-sdk-nodejs@0.6.0 was released. Older, unscoped versions that are not part of the @hanzozt org are deprecated and only @hanzozt/zt-sdk-nodejs will see updates going forward. To upgrade to the new package do:

``` js
npm uninstall zt-sdk-nodejs --save
npm install @hanzozt/zt-sdk-nodejs --save
```

# Usage

**Note:** the module must be [installed](#installing) before use.

ESM example (client-side)
``` js
import zt from '@hanzozt/zt-sdk-nodejs';

// Somehow provide path to identity file, e.g. via env var
const ztIdentityFile  = process.env.ZITI_IDENTITY_FILE;
// Authenticate ourselves onto the Ziti network
await zt.init( ztIdentityFile ).catch(( err ) => { /* probably exit */ });

const on_resp_data = ( obj ) => {
    console.log(`response is: ${obj.body.toString('utf8')}`);
};

// Perform an HTTP GET request to a dark Hanzo ZT web service
zt.httpRequest(
  'myDarkWebService',            // Hanzo ZT Service name or HTTP origin part of the URL
  undefined,                     // schemeHostPort parm is mutually-exclusive with serviceName parm
  'GET',
  '/',                           // path part of the URL including query params
  ['Accept: application/json' ], // headers
  undefined,                     // optional on_req cb 
  undefined,                     // optional on_req_data cb
  on_resp_data                   // optional on_resp_data cb
);

```

ESM example (server-side ExpressJS)
``` js
import zt from '@hanzozt/zt-sdk-nodejs';
import express from 'express';
let app = zt.express( express, ztServiceName );
app.listen(ignored, function() { ... }

/**

That's right.

With only a single-line code change (the zt.express call), your web server is now capable
of being invisible to malicious attackers on the internet, and only accessible to your 
trusted remote users.

Nothing else in your existing ExpressJS web server code needs to change!

Existing routing, middleware, etc., all operates the same as it always did... 
but now you enjoy the comfort of knowing that if a connection comes in, it is from 
a trusted identity on the client side.

No malicious actors can see your dark web server, and thus, no malicious actors can attack it.

*/
```

CJS example (client-side)
``` js
var zt = require('@hanzozt/zt-sdk-nodejs');

const zt_init = async (identity) => {
    return new Promise((resolve) => {
        zt.zt_init(identity, () => {
            resolve();
        });
    });
};

const zt_service_available = (service) => {
    return new Promise((resolve) => {
        zt.zt_service_available(service, (status) => {
            resolve(status);
        });
    });
};

function zt_dial(service) {
    return new Promise((resolve, reject) => {
        zt.zt_dial(
            service,
            (conn) => {
                resolve(conn);
            },
            (data) => {
                // Do something with data...
            },
        );
    });
}

const zt_write = (conn, data) => {
    return new Promise((resolve) => {
        zt.zt_write(conn, data, () => {
            resolve();
        });
    });
};

(async () => {

    await zt_init(LOCATION_OF_IDENTITY_FILE);

    let status = await zt_service_available(YOUR_SERVICE_NAME);

    if (status === 0) {

        const conn = await zt_dial(YOUR_SERVICE_NAME);

        let data = SOME_KIND_OF_DATA;

        let buffer = Buffer.from(data);

        await zt_write(conn, buffer);

        ...etc
    }

})();
```

# API Reference
For doc concerning API's contained in this SDK, you may be interested in this
[SDK API Reference](API_REFERENCE.md)


Getting Help
------------
Please use these community resources for getting help. We use GitHub [issues](https://github.com/hanzozt/zt-sdk-nodejs/issues) 
for tracking bugs and feature requests and have limited bandwidth to address them.

- Read the [docs](https://hanzozt.github.io/zt/overview.html)
- Participate in discussion on [Discourse](https://community.hanzozt.dev/)


# Building from source on MacOS

``` js
git clone https://github.com/microsoft/vcpkg.git
./vcpkg/bootstrap-vcpkg.sh
export VCPKG_ROOT=`pwd`/vcpkg
brew install cmake
brew install ninja
brew install pkg-config
git clone https://github.com/hanzozt/zt-sdk-nodejs.git
cd zt-sdk-nodejs
npm run build
```

Copyright&copy;  NetFoundry, Inc.
