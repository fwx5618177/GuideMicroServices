"use strict";

var Articles = function Articles(options) {
  this.add({
    service: 'articles',
    cmd: 'ping'
  }, function (msg, res) {
    console.log('>>>>>>>>Articles received!');
    res(null, {
      response: ' micro service articles: reponse, ',
      data: msg.data + ','
    });
  });
};

module.exports = Articles;