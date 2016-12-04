const http = require('http');
const https = require('https');
const crypto = require('crypto');

const HOST = 'api.line.me'; 
const REPLY_PATH = '/v2/bot/message/reply';//リプライ用
const CH_SECRET = "6da16a76c7390db72c8c42808f34e8eb" || 'null'; //Channel Secretを指定
const CH_ACCESS_TOKEN = "s/DA31gIk+EQFVnbRtMion/rLciELBwurXTbkKyj7VmTnkzNfze0GZFBtZ8xCmXnnu/0gZ8objtdBIIRHs5lXYh8jsqETvkKu0u4tRYDTEiaUuHYbcKMvblU0ZQLgUyaptF38/WnJWbZ5dge/1F1qAdB04t89/1O/w1cDnyilFU=" || 'null'; //Channel Access Tokenを指定
const SIGNATURE = crypto.createHmac('sha256', CH_SECRET);
const PORT = process.env.PORT || 3000;

// http.createServer(function (request, response) {
//   response.writeHead(200, {'Content-Type': 'text/plain'});
//   response.end(`Hello World\n ${CH_SECRET} / ${CH_ACCESS_TOKEN}`);
// }).listen(PORT);
 
// console.log(`Server running at http://127.0.0.1:${PORT}/`);

/**
 * httpリクエスト部分
 */
const client = (replyToken, SendMessageObject) => {    
    let postDataStr = JSON.stringify({ replyToken: replyToken, messages: SendMessageObject });
    let options = {
        host: HOST,
        port: 443,
        path: REPLY_PATH,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'X-Line-Signature': SIGNATURE,
            'Authorization': `Bearer ${CH_ACCESS_TOKEN}`
        }
    };

    return new Promise((resolve, reject) => {
        let req = https.request(options, (res) => {
                    let body = '';
                    res.setEncoding('utf8');
                    res.on('data', (chunk) => {
                        body += chunk;
                    });
                    res.on('end', () => {
                        resolve(body);
                    });
        });

        req.on('error', (e) => {
            reject(e);
        });
        req.write(postDataStr);
        req.end();
    });
};

http.createServer((req, res) => {    
    if(req.url !== '/' || req.method !== 'POST'){
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end(`${process.env.WEBSITE_NODE_DEFAULT_VERSION} / ${CH_SECRET} / ${CH_ACCESS_TOKEN}`);
    }

    let body = '';
    req.on('data', (chunk) => {
        body += chunk;
    });        
    req.on('end', () => {
      if(body == ''){
        console.log(`bodyはから`);
        return;
      }
      
        let WebhookEventObject = JSON.parse(body).events[0]; 
        //メッセージが送られて来た場合
        if(WebhookEventObject.type === 'message'){
            let SendMessageObject;
            if(WebhookEventObject.message.type === 'text'){
                SendMessageObject = [{
                    type: 'text',
                    text: WebhookEventObject.message.text
                }];
            }
            client(WebhookEventObject.replyToken, SendMessageObject)
            .then((body)=>{
                console.log(body);
            },(e)=>{console.log(e)});
        }

        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('su');
    });

}).listen(PORT);

console.log(`Server running at ${PORT}`);

/*

{
    "name"        : "worker",
    "script"      : "./app.js", 
    "instances"   : 1,
    "merge_logs"  : true,
    "log_date_format" : "YYYY-MM-DD HH:mm",
    "watch": ["./app.js"],
    "watch_options": {
    "followSymlinks": true,
    "usePolling"   : true,
    "interval"    : 5
    }
}
*/