# Proxy Scrapper & Checker

**Educational Purposes ONLY!**
I do not condone or encourage unauthorized or illegal use of this script and will not be held responsible for such use cases.

Scrape your proxys from different api providers

This script scrapes a list of URLs for proxy IP addresses and ports, then checks the proxies for connectivity using the HTTP, SOCKS4, and SOCKS5 protocols. The program takes two command line arguments: the name of a file containing a list of api urls, and a timeout value in milliseconds for the proxy checks. The output is written to files named http.txt, socks4.txt, and socks5.txt.

Proxy Checker Using [checker-proxy]

[![NPM](https://nodei.co/npm/checker-proxy.png)](https://www.npmjs.com/package/checker-proxy)

## Basic Usage

### Install npm packages

```js
// Node.JS Install all npm packages
npm i
```

### Usage

```js
node main.js <input> <ms>

//Example
node main.js urls.txt 25
```

![image](https://i.imgur.com/YFv92GD.png)

* `Feel Free To Use The Source`
* `Source Made By Liam1337`
