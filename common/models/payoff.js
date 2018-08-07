'use strict';
var request = require('request');
module.exports = function(Payoff) {
  Payoff.afterRemote('count', function(ctx, affectedModelInstance, next) {
    request.post({
      url: 'http://localhost:3000/api/v1/refunds/',
      method: 'POST',
      json: {
        orderID: 1,
        customID: 1,
        status: 0,
        content: 'nihao',
      },
    }, function(err, res) {
      if (err) console.error(err);
      next();
    });
  });
};
