
# API Reference
Hanzo ZT SDK for Node.js


* [@hanzozt/zt-sdk-nodejs](#module_@hanzozt/zt-sdk-nodejs)
    * [~close(conn)](#module_@hanzozt/zt-sdk-nodejs..close) ⇒ <code>void</code>
    * [~dial(serviceName, isWebSocket, onConnect, onData)](#module_@hanzozt/zt-sdk-nodejs..dial) ⇒ <code>void</code>
    * [~express(express, serviceName)](#module_@hanzozt/zt-sdk-nodejs..express) ⇒ <code>\*</code>
    * [~httpRequest(serviceName, schemeHostPort, method, path, headers, onRequest, onResponse, onResponseData)](#module_@hanzozt/zt-sdk-nodejs..httpRequest) ⇒ <code>void</code>
    * [~httpRequestData(req, data, onRequestData)](#module_@hanzozt/zt-sdk-nodejs..httpRequestData) ⇒ <code>void</code>
    * [~httpRequestEnd(req)](#module_@hanzozt/zt-sdk-nodejs..httpRequestEnd) ⇒ <code>void</code>
    * [~init(identityPath)](#module_@hanzozt/zt-sdk-nodejs..init) ⇒ <code>number</code>
    * [~setLogLevel(level)](#module_@hanzozt/zt-sdk-nodejs..setLogLevel) ⇒ <code>void</code>
    * [~serviceAvailable(serviceName, onServiceAvailable)](#module_@hanzozt/zt-sdk-nodejs..serviceAvailable) ⇒ <code>void</code>
    * [~write(conn, data, onWrite)](#module_@hanzozt/zt-sdk-nodejs..write) ⇒ <code>void</code>
    * [~onDataCallback](#module_@hanzozt/zt-sdk-nodejs..onDataCallback) : <code>function</code>
    * [~onConnectCallback](#module_@hanzozt/zt-sdk-nodejs..onConnectCallback) ⇒ <code>void</code>
    * [~onRequestCallback](#module_@hanzozt/zt-sdk-nodejs..onRequestCallback) ⇒ <code>void</code>
    * [~onResonseCallback](#module_@hanzozt/zt-sdk-nodejs..onResonseCallback) ⇒ <code>void</code>
    * [~onResonseDataCallback](#module_@hanzozt/zt-sdk-nodejs..onResonseDataCallback) ⇒ <code>void</code>
    * [~onRequestDataCallback](#module_@hanzozt/zt-sdk-nodejs..onRequestDataCallback) ⇒ <code>void</code>
    * [~onServiceAvailableCallback](#module_@hanzozt/zt-sdk-nodejs..onServiceAvailableCallback) ⇒ <code>void</code>
    * [~onWriteCallback](#module_@hanzozt/zt-sdk-nodejs..onWriteCallback) ⇒ <code>void</code>

<a name="module_@hanzozt/zt-sdk-nodejs..close"></a>

### @hanzozt/zt-sdk-nodejs~close(conn) ⇒ <code>void</code>
Close a Ziti connection.

**Kind**: inner method of [<code>@hanzozt/zt-sdk-nodejs</code>](#module_@hanzozt/zt-sdk-nodejs)  
**Returns**: <code>void</code> - No return value.  

| Param | Type | Description |
| --- | --- | --- |
| conn | <code>number</code> | A Ziti connection handle. |

<a name="module_@hanzozt/zt-sdk-nodejs..dial"></a>

### @hanzozt/zt-sdk-nodejs~dial(serviceName, isWebSocket, onConnect, onData) ⇒ <code>void</code>
Create a connection to Ziti Service.

**Kind**: inner method of [<code>@hanzozt/zt-sdk-nodejs</code>](#module_@hanzozt/zt-sdk-nodejs)  
**Returns**: <code>void</code> - No return value.  

| Param | Type | Description |
| --- | --- | --- |
| serviceName | <code>string</code> | The name of the Ziti Service to connect to |
| isWebSocket | <code>boolean</code> | True or False indicator concerning whether this connection if bi-directional. |
| onConnect | <code>onConnectCallback</code> | The callback that receives the connection handle. |
| onData | <code>onDataCallback</code> | The callback that receives incoming data from the connection. |

<a name="module_@hanzozt/zt-sdk-nodejs..express"></a>

### @hanzozt/zt-sdk-nodejs~express(express, serviceName) ⇒ <code>\*</code>
Wrap ExpressJS to facilitate hosting (listening) on a Ziti Service instead of a TCP port.

**Kind**: inner method of [<code>@hanzozt/zt-sdk-nodejs</code>](#module_@hanzozt/zt-sdk-nodejs)  
**Returns**: <code>\*</code> - The wrapped express() object.  

| Param | Type | Description |
| --- | --- | --- |
| express | <code>\*</code> | The express() object. |
| serviceName | <code>string</code> | The name of the Ziti Service being served (hosted). |

<a name="module_@hanzozt/zt-sdk-nodejs..httpRequest"></a>

### @hanzozt/zt-sdk-nodejs~httpRequest(serviceName, schemeHostPort, method, path, headers, onRequest, onResponse, onResponseData) ⇒ <code>void</code>
Initiate an HTTP request to a Ziti Service.

**Kind**: inner method of [<code>@hanzozt/zt-sdk-nodejs</code>](#module_@hanzozt/zt-sdk-nodejs)  
**Returns**: <code>void</code> - No return value.  

| Param | Type | Description |
| --- | --- | --- |
| serviceName | <code>string</code> | The name of the Ziti Service to send the request. (mutually exclusive with url) |
| schemeHostPort | <code>string</code> | The scheme/host/port (e.g. http://myserver.zt:8080) of a Ziti service-config/intercept to send the request. (mutually exclusive with serviceName) |
| method | <code>string</code> | The REST verb to use (e.g. `GET`, `POST`). |
| path | <code>string</code> | The URL PATH to use on the request (can include HTTP query parms). |
| headers | <code>Array.&lt;string&gt;</code> | The HTTP Headers to use on the request. |
| onRequest | <code>onRequestCallback</code> | The callback that receives the request handle. |
| onResponse | <code>onResonseCallback</code> | The callback that receives the HTTP Response. |
| onResponseData | <code>onResonseDataCallback</code> | The callback that receives the HTTP Response data. |

<a name="module_@hanzozt/zt-sdk-nodejs..httpRequestData"></a>

### @hanzozt/zt-sdk-nodejs~httpRequestData(req, data, onRequestData) ⇒ <code>void</code>
Send payload data for HTTP POST request to a Ziti Service.

**Kind**: inner method of [<code>@hanzozt/zt-sdk-nodejs</code>](#module_@hanzozt/zt-sdk-nodejs)  
**Returns**: <code>void</code> - No return value.  

| Param | Type | Description |
| --- | --- | --- |
| req | <code>number</code> | A Ziti HttpRequest handle. |
| data | <code>Buffer</code> | The HTTP payload data to send. |
| onRequestData | <code>onRequestDataCallback</code> | The callback that acknowleges the send. |

<a name="module_@hanzozt/zt-sdk-nodejs..httpRequestEnd"></a>

### @hanzozt/zt-sdk-nodejs~httpRequestEnd(req) ⇒ <code>void</code>
Terminate payload data transmission for HTTP POST request to a Ziti Service.

**Kind**: inner method of [<code>@hanzozt/zt-sdk-nodejs</code>](#module_@hanzozt/zt-sdk-nodejs)  
**Returns**: <code>void</code> - No return value.  

| Param | Type | Description |
| --- | --- | --- |
| req | <code>number</code> | A Ziti HttpRequest handle. |

<a name="module_@hanzozt/zt-sdk-nodejs..init"></a>

### @hanzozt/zt-sdk-nodejs~init(identityPath) ⇒ <code>number</code>
Initialize the Ziti session and authenticate with control plane.

**Kind**: inner method of [<code>@hanzozt/zt-sdk-nodejs</code>](#module_@hanzozt/zt-sdk-nodejs)  
**Returns**: <code>number</code> - A status value ranging from 0 to 255.  

| Param | Type | Description |
| --- | --- | --- |
| identityPath | <code>string</code> | File system path to the identity file. |

<a name="module_@hanzozt/zt-sdk-nodejs..setLogLevel"></a>

### @hanzozt/zt-sdk-nodejs~setLogLevel(level) ⇒ <code>void</code>
Set the logging level.

**Kind**: inner method of [<code>@hanzozt/zt-sdk-nodejs</code>](#module_@hanzozt/zt-sdk-nodejs)  
**Returns**: <code>void</code> - No return value.  

| Param | Type | Description |
| --- | --- | --- |
| level | <code>number</code> | 0=NONE, 1=ERROR, 2=WARN, 3=INFO, 4=DEBUG, 5=TRACE |

<a name="module_@hanzozt/zt-sdk-nodejs..serviceAvailable"></a>

### @hanzozt/zt-sdk-nodejs~serviceAvailable(serviceName, onServiceAvailable) ⇒ <code>void</code>
Set the logging level.

**Kind**: inner method of [<code>@hanzozt/zt-sdk-nodejs</code>](#module_@hanzozt/zt-sdk-nodejs)  
**Returns**: <code>void</code> - No return value.  

| Param | Type | Description |
| --- | --- | --- |
| serviceName | <code>string</code> | The name of the Ziti Service being queried. |
| onServiceAvailable | <code>onServiceAvailableCallback</code> | The callback that returns results of the query. |

<a name="module_@hanzozt/zt-sdk-nodejs..write"></a>

### @hanzozt/zt-sdk-nodejs~write(conn, data, onWrite) ⇒ <code>void</code>
write data to a Ziti connection.

**Kind**: inner method of [<code>@hanzozt/zt-sdk-nodejs</code>](#module_@hanzozt/zt-sdk-nodejs)  
**Returns**: <code>void</code> - No return value.  

| Param | Type | Description |
| --- | --- | --- |
| conn | <code>number</code> | A Ziti connection handle. |
| data | <code>Buffer</code> | The data to send. |
| onWrite | <code>onWriteCallback</code> | The callback that returns status of the write. |

<a name="module_@hanzozt/zt-sdk-nodejs..onDataCallback"></a>

### @hanzozt/zt-sdk-nodejs~onDataCallback : <code>function</code>
This callback is part of the `dial` API.

**Kind**: inner typedef of [<code>@hanzozt/zt-sdk-nodejs</code>](#module_@hanzozt/zt-sdk-nodejs)  

| Param | Type | Description |
| --- | --- | --- |
| conn | <code>number</code> | A Ziti connection handle. |

<a name="module_@hanzozt/zt-sdk-nodejs..onConnectCallback"></a>

### @hanzozt/zt-sdk-nodejs~onConnectCallback ⇒ <code>void</code>
This callback is part of the `dial` API.

**Kind**: inner typedef of [<code>@hanzozt/zt-sdk-nodejs</code>](#module_@hanzozt/zt-sdk-nodejs)  
**Returns**: <code>void</code> - No return value.  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Buffer</code> | Incoming data from the Ziti connection. |

<a name="module_@hanzozt/zt-sdk-nodejs..onRequestCallback"></a>

### @hanzozt/zt-sdk-nodejs~onRequestCallback ⇒ <code>void</code>
This callback is part of the `httpRequest` API.

**Kind**: inner typedef of [<code>@hanzozt/zt-sdk-nodejs</code>](#module_@hanzozt/zt-sdk-nodejs)  
**Returns**: <code>void</code> - No return value.  

| Param | Type | Description |
| --- | --- | --- |
| req | <code>number</code> | A Ziti HttpRequest handle. |

<a name="module_@hanzozt/zt-sdk-nodejs..onResonseCallback"></a>

### @hanzozt/zt-sdk-nodejs~onResonseCallback ⇒ <code>void</code>
This callback is part of the `httpRequest` API.

**Kind**: inner typedef of [<code>@hanzozt/zt-sdk-nodejs</code>](#module_@hanzozt/zt-sdk-nodejs)  
**Returns**: <code>void</code> - No return value.  

| Param | Description |
| --- | --- |
| resp | Incoming response from the HTTP request. |
| resp.req | The request handle. |
| resp.code | The HTTP status code. |
| resp.headers | The HTTP Headers on the response. |

<a name="module_@hanzozt/zt-sdk-nodejs..onResonseDataCallback"></a>

### @hanzozt/zt-sdk-nodejs~onResonseDataCallback ⇒ <code>void</code>
This callback is part of the `httpRequest` API.

**Kind**: inner typedef of [<code>@hanzozt/zt-sdk-nodejs</code>](#module_@hanzozt/zt-sdk-nodejs)  
**Returns**: <code>void</code> - No return value.  

| Param | Description |
| --- | --- |
| respData | Incoming response data from the HTTP request. |
| respData.req | The request handle. |
| respData.len | The length of the response body. |
| respData.body | The response body. |

<a name="module_@hanzozt/zt-sdk-nodejs..onRequestDataCallback"></a>

### @hanzozt/zt-sdk-nodejs~onRequestDataCallback ⇒ <code>void</code>
This callback is part of the `httpRequestData` API.

**Kind**: inner typedef of [<code>@hanzozt/zt-sdk-nodejs</code>](#module_@hanzozt/zt-sdk-nodejs)  
**Returns**: <code>void</code> - No return value.  

| Param | Description |
| --- | --- |
| reqData | Incoming status data from the HTTP request. |
| respData.req | The request handle. |
| respData.status | positive value indicates successful transmit. |

<a name="module_@hanzozt/zt-sdk-nodejs..onServiceAvailableCallback"></a>

### @hanzozt/zt-sdk-nodejs~onServiceAvailableCallback ⇒ <code>void</code>
This callback is part of the `serviceAvailable` API.

**Kind**: inner typedef of [<code>@hanzozt/zt-sdk-nodejs</code>](#module_@hanzozt/zt-sdk-nodejs)  
**Returns**: <code>void</code> - No return value.  

| Param | Description |
| --- | --- |
| availability | results of the query. |
| availability.status | 0 means `available and OK`, <0 means `unavailable` |
| availability.permissions | 1 means the identity can dial, 2 means the identity can bind |

<a name="module_@hanzozt/zt-sdk-nodejs..onWriteCallback"></a>

### @hanzozt/zt-sdk-nodejs~onWriteCallback ⇒ <code>void</code>
This callback is part of the `write` API.

**Kind**: inner typedef of [<code>@hanzozt/zt-sdk-nodejs</code>](#module_@hanzozt/zt-sdk-nodejs)  
**Returns**: <code>void</code> - No return value.  

| Param | Description |
| --- | --- |
| status | 0 means success, <0 means failure. |


* * *
