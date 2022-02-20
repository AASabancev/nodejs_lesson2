
const express = require('express');
const app = express();

const connections = [];

const interval = process.argv[2] || 1000;
const maxTime = process.argv[3] || 10;

const sendMessage = () => {
  setTimeout(() => {
    connections.forEach((obj, i) => {
      const currentDate = new Date();
      const connectedTime = obj.startDate;
      const diffSec = Math.round((currentDate - connectedTime) / 1000);

      obj.res.write(`Client #${i}, Date: ${currentDate.toISOString()}, Connected seconds: ${diffSec}\n`);

      if (diffSec > maxTime) {
        obj.res.write(`Your connection is too long (MAX: ${maxTime} sec.)\n`);
        obj.res.end();
        delete (connections[i]);
      }
    });

    sendMessage();
  }, interval);
};

app.get('/', function (req, res, next) {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Transfer-Encoding', 'chunked');
  res.write(`Hello!, Your settings interval:${interval}, maxTime:${maxTime}\n`);
  connections.push({
    startDate: new Date(),
    res: res
  });
});

sendMessage();

app.listen(3000, function () {
  console.log('Example app listening on port 3000');
});
