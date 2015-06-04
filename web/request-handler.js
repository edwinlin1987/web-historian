var path = require('path');
var archive = require('../helpers/archive-helpers');
var httphelpers = require('./http-helpers');
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
      archive.isURLArchived(string, function(exists) {
        if (exists){
          fs.readFile(archive.paths.archivedSites+'/'+ string +'.html', function (err, data){
            res.writeHead(200, httphelpers.headers);
            res.end(data);
          });
        } else {
          archive.readListOfUrls(function(array) {
            if (!archive.isUrlInList(string, array)) {
              archive.addUrlToList(string);
            }
          });
          fs.readFile(__dirname+'/public/loading.html', function (err, data) {
            res.writeHead(200, httphelpers.headers);
            res.end(data);
          });
        }
      });
    });
  } else {
    fs.readFile(__dirname+'/public/index.html', function (err, data) {
        res.writeHead(200, httphelpers.headers);
        res.end(data);
      });
  }

  else if (req.url === '/') {
    if( req.method === 'GET') {
      console.log('----------------------------------');
      fs.readFile(__dirname+'/public/index.html', function (err, data) {
        console.log();
        res.writeHead(200, httphelpers.headers);
        res.end(data);
      });
    }

  }

  else  {
    var status =404;
    res.writeHead(status,httphelpers.headers);
    res.end();
  }
};
