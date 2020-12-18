const http = require('http');
const qs = require('querystring');
const fs = require('fs');
const bodyparser = require('body-parser');

var items = [];

var server = http.createServer(function(req, res){
    //console.log('request: ',req);
    if(req.url == '/'){
        switch(req.method){
            case 'POST':{
                console.log("Post request...");
                add(req, res);

            }
            break;
            case 'GET':{
                console.log('Get request...');
                show(res);
            }
            break;
            default:{
                console.log(req.method, ' is request type...');
            }
        }
    }
    else{
        res.setStatusCode = 500;
        res.setHeader('Content-Type', 'text/plain');
        res.end('500, bad request...');
    }
}).listen(3000, function(){
    console.log('Listening at port 3000...');
});

function show(res){
    var list = '';
    items.forEach(element => {
        list += '<li>'+element+'</li>';
    });
    var html = ''; 
    fs.readFile('./index.html', 'utf8', function(err, data){
        if(err){
            throw err;
        }
        else{
            html = data.replace('<!--list-->', list);
            //console.log('data is: ',html, list);
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(html);
            res.end();
        }
    });
}

function add(req, res){
    var body='';
    req.setEncoding('utf8');
    req.on('data',function(chunk){body+=chunk});
    req.on('end',function(){
        var obj=qs.parse(body);
        console.log('body is: ',body);
        items.push(obj.item);
        show(res);
    });
}