let http = require('http');

http.createServer(function(req, res){
    res.writeHead(200, {'Content-Type' : 'text/html'});
    res.end('555');
}).listen(3000, () => console.log("Server is successfully!"));