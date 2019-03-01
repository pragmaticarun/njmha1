var http = require('http')
var url = require('url')
var StringDecoder = require('string_decoder').StringDecoder;
var config = require('./config');

var httpServer = http.createServer(function(req,res){
    requestHandler(req,res);
});

httpServer.listen(config.httpPort,function(){
    console.log(config.name + " Server started listening " + config.httpPort);
});

var requestHandler = function(req,res) {
    var parsedUrl = url.parse(req.url,true);
    var path = parsedUrl.pathname;
    path = path.replace(/^\/+|\/+$/g,'');
    var queryString = parsedUrl.query;

    var decoder = new StringDecoder('utf-8');

    var buffer = '';
    req.on('data', function(data) {
        buffer += decoder.write(data);
    });

    req.on('end',function(){
        buffer += decoder.end();
        console.log(path);
        var chosenHandler = typeof(router[path]) !== 'undefined' ? router[path] : handlers.notFound;

        data = {
            'path':path,
            'queryString':queryString,
            'payload':buffer
        };

        chosenHandler(data,function(statusCode,response) {
            statusCode = typeof(statusCode) == 'number' ? statusCode : 500;
            response   = typeof(response) == 'object' ? response: {};
            var payloadString = JSON.stringify(response);
            res.setHeader('Content-Type','application/json');
            res.writeHead(statusCode)
            res.end(payloadString);
        });
    });
};

var handlers = {};
handlers.hello = function(data,callback) {
    callback(200,{'welcomeMessage':'Thanks for signing up. Look around and indulge yourself'});
};

handlers.notFound = function(data,callback) {
    callback(404);
};

var router = {
    'hello' : handlers.hello
};
