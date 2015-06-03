var path = require('path');
var archive = require('../helpers/archive-helpers');
var http = require('./http-helpers');
var url = require('url');
var fs = require('fs');
// require more modules/folders here!

exports.handleRequest = function (req, res) {

  var pathname = url.parse(req.url);
  //console.log(req._po);
  console.log("Serving request type " + req.method + " for url " + req.url);
  if( req.method === 'POST'){
    var status = 200;
    res.writeHead(status,http.headers);
    res.end('')

  }

  if (pathname.pathname === '/www.google.com') {
    if( req.method === 'GET') {
      var status = 200;
      res.writeHead(status,http.headers);
      res.end('google');
    }
    if( req.method === 'POST'){
      var status = 302;
      fs.appendFile(archive.paths.list,req._postData.url + '\n');
      res.writeHead(status,http.headers);
      res.end();
    }
  }

  else if (req.url === '/') {
    if( req.method === 'GET') {
      console.log('----------------------------------');
      fs.readFile(__dirname+'/public/index.html', function (err, data) {
        console.log();
        res.writeHead(200, http.headers);
        res.end(data);
      });
    }
    if( req.method === 'POST'){
      var status = 302;
      fs.appendFile(archive.paths.list,req._postData.url + '\n');
      res.writeHead(status,http.headers);
      res.end();
    }
  }

  else  {
    var status =404;
    res.writeHead(status,http.headers);
    res.end();
  }
};
