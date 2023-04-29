const fs = require('fs');
const http = require('http');
const https = require('https');
const net = require('net');
const { SocksClient } = require('socks');
const proxycheck = require('checker-proxy');
var path = require("path");
var colors = require('colors');

const Status = require("./Handlers/Functions");

const proxySet = new Set();


if (process.argv.length !== 4) {
    console.log(`                       
        Usage: node ${path.basename(__filename)} <input> <ms>
        Usage: node ${path.basename(__filename)} urls.txt 25
        -------------------------------------------------------
        Socialify.app | API ProxyChecker
        Made for Socialif By @Liam1337                                       
    `.rainbow);
    process.exit(0);
}
//console.log(process.argv.length);

// node main.js urls.txt test.txt http 25
console.log(process.argv[1]) // url path
//console.log(process.argv[2]) // urls.txt
const urlslist = process.argv[2];
//console.log(process.argv[3]) // test.txt
//const output = process.argv[3];
//console.log(process.argv[4]) // http
//const protocol = process.argv[4];
//console.log(process.argv[5]) // 25
const timeout = process.argv[3];
//return 0;

const urls = readUrlsFromFile(urlslist);
if (!(fs.existsSync(urlslist))) {
    console.log(`${Status.ErrorColor} ${urlslist} was not found`);
    process.exit();
}

async function main() {
    try {
      await Promise.all(urls.map(url => {
        return scrapeProxies(url).then(proxies => {
          addProxiesToSet(proxies, proxySet);
        });
      }));
      console.log(`${Status.InfoColor}  ${proxySet.size} proxies found`);
      const allProxies = Array.from(proxySet).join('\n');
      fs.writeFileSync('all.txt', allProxies, { encoding: 'utf8', flag: 'w' });
      
      // Sequentially check http, socks4, and socks5 protocols
      const protocols = ["http", "socks4", "socks5"];
      for (const protocol of protocols) {
        console.log(`${Status.DebugColor} checking ${protocol.toUpperCase()} proxies and saving in ${protocol}.txt`);
        await checkproxfr(protocol, `${protocol}.txt`);
      }
    } catch (error) {
      console.error(error);
    }
}
  

function readUrlsFromFile(filename) {
  try {
    const data = fs.readFileSync(filename, 'utf8');
    return data.split('\n').filter(url => url.trim() !== '');
  } catch (error) {
    console.error(error);
    return [];
  }
}

// This function takes a URL and returns a Promise that resolves to an array of proxy IP addresses and port numbers
function scrapeProxies(url) {
    return new Promise((resolve, reject) => {
      // Determine whether the URL uses the HTTPS or HTTP protocol, and set the `client` variable accordingly.
      const client = url.startsWith('https') ? https : http;
      // Make a GET request to the URL, with a timeout of 5 seconds.
      client.get(url, { timeout: 5000 }, response => {
        let body = '';
        // As data is received from the response, add it to the `body` string.
        response.on('data', chunk => {
          body += chunk;
        });
        // When the response ends, extract the IP addresses and port numbers from the `body` string using a regular expression.
        response.on('end', () => {
          const regex = /(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}:\d+)/g;
          const matches = body.match(regex) || [];
          // Resolve the Promise with the array of matches.
          resolve(matches);
        });
      // If there's an error with the request, log the error to the console and resolve the Promise with an empty array.
      }).on('error', error => {
        console.error(error);
        resolve([]);
      });
    });
  }
  
function addProxiesToSet(proxies, proxySet) {
  proxies.forEach(proxy => {
    proxySet.add(proxy);
  });
}

function checkproxfr(protocol, saved){

    // console.log("==================")
    // console.log(protocol)
    // console.log(saved)
    // console.log("==================")
    var i = 0;
    var p = 0;
    var s = 0;
    
    ignoreNames = ['RequestError', 
                   'StatusCodeError', 
                   'CaptchaError', 
                   'CloudflareError', 
                   'ParseError', 
                   'ParserError', 
                   'ReferenceError', 
                   'AssertionError',
                   'Error'
                  ],
    
    ignoreCodes = ['ECONNRESET', 
                   'ERR_ASSERTION', 
                   'ECONNREFUSED', 
                   'EPIPE', 
                   'EHOSTUNREACH', 
                   'ETIMEDOUT', 
                   'ESOCKETTIMEDOUT', 
                   'EPROTO', 
                   'ERR_ASSERTION'
                  ];
                  let config = {
                    type: protocol,
                    url: 'https://google.com/',
                    file: saved,
                    timeout: timeout
                }
                  
                let l = require('fs').readFileSync("all.txt", 'utf-8').replace(/\r|\"/gi, '').split("\n")
                
                l.forEach(a => {
                    proxycheck.check({
                        url: config.url,
                        type: config.type,
                        proxy: a,
                        timeout: timeout
                    }).then(r => {
                        i++ // AllProxyChecked++
                        if (r.code !== 200) {
                      s++ // BadProxy++
                            console.info(`[\x1b[91mx\x1b[0m] \x1b[91mInvalid ${protocol} proxy \x1b[0m: \x1b[91m${r.proxy.replace("http://", "")} \x1b[0m#${i} (Out checked: \x1b[95m${i}\x1b[0m/\x1b[95m${l.length} \x1b[0m- \x1b[91m${s}\x1b[0m/\x1b[91m${l.length} \x1b[0minvalid proxies)\x1b[0m`)
                        } else if (r.code == 200) {
                            require('fs').appendFileSync(config.file, a + '\n')
                      p++ // GoodProxy++
                      console.info(`[\x1b[92m!\x1b[0m] \x1b[92mValid ${protocol} proxy \x1b[0m: \x1b[92m${r.proxy.replace("http://", "")} \x1b[0m#${i} (Out checked: \x1b[95m${i}\x1b[0m/\x1b[95m${l.length} \x1b[0m- \x1b[92m${p}\x1b[0m/\x1b[92m${l.length} \x1b[0mvalid proxies)\x1b[0m`)
                        }
                    }).catch(e => {
                      //return error
                        console.error(e);
                        process.exit();
                    })
                })
                 
                return {
                    proxy: String,
                    type: String,
                    code: Number
                }
                  
                return {
                    proxy: String,
                    type: String,
                    code: { type: Number, default: 500 },
                    err: String
                }
}

console.log(`${Status.DebugColor} Scraping proxys ...`);
main();


//Warning/Error Handler
process.on('uncaughtException', function (e) {
    if (e.code && ignoreCodes.includes(e.code) || e.name && ignoreNames.includes(e.name)) return !1;
    console.warn(e);
}).on('unhandledRejection', function (e) {
    if (e.code && ignoreCodes.includes(e.code) || e.name && ignoreNames.includes(e.name)) return !1;
    console.warn(e);
}).on('warning', e => {
    if (e.code && ignoreCodes.includes(e.code) || e.name && ignoreNames.includes(e.name)) return !1;
    console.warn(e);
}).setMaxListeners(0);