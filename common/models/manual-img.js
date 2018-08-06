'use strict';
var p = require('../../package');
var version = p.version.split('.').shift();
var CONTAINERS_URL =
  '/api' + (version > 0 ? '/v' + version : '') + '/containers/';
module.exports = function(Manualimg) {
  Manualimg.upload = function(ctx, options, cb) {
    options = options || {};
    // Firstly, you must create folder  /server/storage/common
    ctx.req.params.container = 'manual';
    /**
     * ctx.req    express request object
     * ctx.result express response object
     */
    Manualimg.app.models.Container.upload(ctx.req, ctx.result,
      options, function(err, fileObj) {
        if (err) {
          return cb(null, {
            status: 'failed',
            message: err.message,
          });
        } else {
          // The 'file'below should be the same as field name in the form
          var fileInfoArr = fileObj.files.file;
          var objs = [];
          fileInfoArr.forEach(function(item) {
            console.log(item.name)
            console.log(item.type)
            console.log(item.container)
            objs.push({
              name: item.name,
              type: item.type,
              url: CONTAINERS_URL + item.container +
                '/download/' + item.name,
            });
          });
          Manualimg.create(objs, function(err, instances) {
            if (err) {
              return cb(null, {
                message: err.message,
              });
            } else {
              cb(null, instances);
            }
          });
        }
      });
  };

  Manualimg.remoteMethod(
    'upload', {
      description: 'Upload a file or more files',
      accepts: [
        {arg: 'ctx', type: 'object', http: {source: 'context'}},
        {arg: 'options', type: 'object', http: {source: 'query'}},
      ],
      returns: {
        arg: 'fileObject', type: 'object', root: true,
      },
      http: {verb: 'post'},
    });
};
