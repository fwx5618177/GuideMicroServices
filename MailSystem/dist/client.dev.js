"use strict";

var smtp = require('smtp-protocol');

var fs = require('fs');

smtp.connect('localhost', 9025, function (mail) {
  mail.helo('example.com');
  mail.from('substack@example.com');
  mail.to('root@example.com');
  mail.data();
  fs.createReadStream('./text.txt').pipe(mail.message());
  mail.quit();
});