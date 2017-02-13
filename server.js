'use strict';

const http = require('http');
const PORT = process.env.PORT || 3000;

http.createServer((req, res) => {    
    if(req.url === '/' || req.method !== 'POST'){
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('hello!!!');
    }
    if(req.url === '/hoge' && req.method === 'GET'){
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('world');
    }

    let body = '';
    req.on('data', (chunk) => {
        body += chunk;
    });        
    req.on('end', () => {
        if(body === ''){
          console.log('bodyが空です。');
          return;
        }

        let WebhookEventObject = JSON.parse(body).events[0];  
        if(WebhookEventObject.type === 'beacon'){
            console.log('beacon発見');
            console.log(WebhookEventObject);
            return;
        }  
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('success');
    });

}).listen(PORT);

console.log(`Server running at ${PORT}`);