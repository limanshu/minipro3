'use strict';

module.exports = function(Customer) {
  // Customer.beforeRemote('**', function(ctx, user, next) {
  //   console.log(ctx.methodString, 'was invoked remotely'); // users.prototype.save was invoked remotely
  //   next();
  // });
  Customer.afterRemote('**', function(ctx, user, next) {
    if (ctx.result) {
      if (Array.isArray(ctx.result)) {
        ctx.result.forEach(function(result) {
          result.password = undefined;
        });
      } else {
        ctx.result.password = undefined;
      }
    }
    next();
  });
};
