'use strict';
var p = require('../../package');
var version = p.version.split('.').shift();
var CONTAINERS_URL =
  '/api' + (version > 0 ? '/v' + version : '') + '/containers/';
module.exports = function(Goodsimg) {
  Goodsimg.upload = function(ctx, options, cb) {
    options = options || {};
    // Firstly, you must create folder  /server/storage/common
    ctx.req.params.container = 'goods';
    /**
     * ctx.req    express request object
     * ctx.result express response object
     */
    Goodsimg.app.models.Container.upload(ctx.req, ctx.result,
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
            objs.push({
              name: item.name,
              type: item.type,
              url: CONTAINERS_URL + item.container +
                '/download/' + item.name,
            });
          });
          Goodsimg.create(objs, function(err, instances) {
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

  Goodsimg.remoteMethod(
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
