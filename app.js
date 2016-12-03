const http = require('http');
const PORT = process.env.PORT || 3000;
const USERNAME = process.env.USERNAME || 'World';

http.createServer(function (request, response) {
  response.writeHead(200, {'Content-Type': 'text/plain'});
  response.end(`Hello ${USERNAME}\n`);
}).listen(PORT);

console.log(`Server running at http:localhost:${PORT}`);