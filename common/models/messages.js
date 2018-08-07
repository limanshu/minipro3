'use strict';
var loopback = require('loopback');
module.exports = function(Messages) {
  Messages.beforeRemote('create', function(ctx, unused, next) {
    if (ctx.accessToken) {
      next();
    } else {
      next(new Error('must be logged in to create'));
    }
  });
  Messages.afterRemote('findById', function(ctx, messages, next) {
    var app = loopback();
    console.log('messages has been find', messages);
    console.log(app.models);
    next();
  });

  Messages.observe('access', function logQuery(ctx, next) {
    console.log('Accessing %s matching %s',
      ctx.Model.modelName, ctx.query.where);
    next();
  });
  //
  // Messages.observe('access', function limitToTenant(ctx, next) {
  //   ctx.query.where.tenantId = loopback.getCurrentContext().tenantId;
  //   next();
  // });
};
