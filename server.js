/**
 * Created by zhengliuyang on 2018/8/22.
 */
const http = require('http');
const fs = require('fs');
http.createServer((request, response) => {
    let url = request.url;
    let staticPath = ['image', 'js', 'lib', 'mdl', 'style'];
    let urlArr = url.split('/');
    let type = urlArr[1];
    if(type && staticPath.indexOf(type) > -1) {
        let filename = urlArr[2];
        let ext = filename.split('.')[1];
        switch (ext) {
            case 'css':
                response.writeHead(200, {'Content-Type': 'text/css'});
                break;
            case 'png':
                response.writeHead(200, {'Content-Type': 'image/png'});
                break;
            case 'svg':
                response.writeHead(200, {'Content-Type': 'image/svg+xml'});
                break;
            case 'js':
                response.writeHead(200, {'Content-Type': 'text/javascript'});
                break;
        }
        let filepath = `./buildSrc/${urlArr[1]}/${urlArr[2]}`;
        fs.access(filepath, fs.constants.F_OK, (err) => {
            if(err) {
                response.end('');
            }else {
                fs.readFile(`./buildSrc/${urlArr[1]}/${urlArr[2]}`,`${ext == 'png'?'':'utf-8'}`,(err,data) => {
                    if(err){
                        throw err ;
                    }
                    response.end(data);
                });
            }
        });
    }else {
        if(url == '/console') {
            response.writeHead(200, {'Content-Type': 'html'});
            fs.readFile('./buildSrc/console.html','utf-8',(err,data) => {
                if(err){
                    throw err ;
                }
                response.end(data);
            });
        }else if(url == '/guide') {
            response.writeHead(200, {'Content-Type': 'html'});
            fs.readFile('./buildSrc/guide.html','utf-8',(err,data) => {
                if(err){
                    throw err ;
                }
                response.end(data);
            });
        }else if(url == '/googlef8bec91694884603.html'){
            fs.readFile('./buildSrc/googlef8bec91694884603.html','utf-8',(err,data) => {
                if(err){
                    throw err ;
                }
                response.end(data);
            });
        }else {
            response.end('');
        }
    }
}).listen(8888);
