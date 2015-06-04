var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var http = require('http-request');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  'siteAssets' : path.join(__dirname, '../web/public'),
  'archivedSites' : path.join(__dirname, '../archives/sites'),
  'list' : path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for jasmine tests, do not modify
exports.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback){
  fs.readFile(exports.paths.list, function (err, data) {
     callback(data.toString().split('\n'));
  });
};

exports.isUrlInList = function(string, array){
  return _.contains(array, string);
};

exports.addUrlToList = function(string){
  fs.appendFile(exports.paths.list, string + '\n');
};

exports.isURLArchived = function(string, callback){ //string = 'www.youtube.com'
  fs.exists(exports.paths.archivedSites + '/' + string + '.html', function (exists) {
    callback(exists);
  });
};

exports.downloadUrls = function(){
  exports.readListOfUrls(function (array) {
    _.each(array, function (string) {
      http.get('http://'+string, exports.paths.archivedSites + '/' + string + '.html', function (err, res) {
        console.log('success!');
      });
    });
  });
};
