var path = require('path');
var archive = require('../helpers/archive-helpers');
var http = require('./http-helpers');
var url = require('url');
var fs = require('fs');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  var pathname = url.parse(req.url);
  console.log("Serving request type " + req.method + " for url " + req.url);
  if( req.method === 'POST'){
    var string = '';
    req.on('data',function (chunk) {
      string += chunk;
    });
    req.on('end',function(){
      string = string.slice(4);
      archive.readListOfUrls(function(array) {
        if (archive.isUrlInList(string,array)){
          fs.readFile(archive.paths.archivedSites+'/'+ string +'.html', function (err, data){
            res.writeHead(200, http.headers);
            res.end(data);
          });
        } else {
          archive.addUrlToList(string);
          fs.readFile(__dirname+'/public/loading.html', function (err, data) {
            res.writeHead(200, http.headers);
            res.end(data);
          });
        }
      });
    });
  } else if (pathname.pathname === '/www.google.com') {
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
