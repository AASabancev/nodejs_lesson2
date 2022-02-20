require('dotenv').config();
const express = require('express');
const app = express();

let connections = [];

const sendMessage = () => {
  setTimeout(() => {
    const currentDate = new Date();
    console.log(`Current date: ${currentDate.toISOString()}`);

    connections = connections.map((obj, i) => {
      const diffSec = Math.round((currentDate - obj.startDate) / 1000);

      if (diffSec > process.env.CLEAR_INTERVAL) {
        obj.startDate = new Date();
        obj.res.write(`Current Date: ${currentDate.toISOString()}\n`);
      }
      return obj;
    });

    sendMessage();
  }, process.env.INTERVAL);
};

app.get('/', function (req, res, next) {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Transfer-Encoding', 'chunked');
  connections.push({
    startDate: new Date(),
    res: res
  });
});

sendMessage();

app.listen(3000, function () {
  console.log(`Hello!, Your settings INTERVAL:${process.env.INTERVAL}, CLEAR_INTERVAL:${process.env.CLEAR_INTERVAL}`);
  console.log('Example app listening on port 3000');
});
