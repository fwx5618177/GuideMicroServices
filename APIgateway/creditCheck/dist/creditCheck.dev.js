"use strict";

var checkCredit = function checkCredit(req) {
  return new Promise(function (resolve, reject) {
    console.log("Checking credit with token", req.headers["authorization"]);
    setTimeout(function () {
      reject('No sufficient credits');
    }, 500);
  });
};

var setupCreditCheck = function setupCreditCheck(app, routes) {
  routes.forEach(function (r) {
    if (r.creditCheck) {
      app.use(r.url, function (req, res, next) {
        checkCredit(req).then(function () {
          next();
        })["catch"](function (error) {
          res.status(402).send({
            error: error
          });
        });
      });
    }
  });
};

module.exports = setupCreditCheck;