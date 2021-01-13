# SomeChat
Some shitty chat program I made using Node.JS

### Also the privacy of the users would be better if you used some kind of proxy for the server, proxies are easy to make you just need to do the following code.
```js
const net = require("net");
const proxy = net.createServer();

proxy.on("connection", (client) => {
  var targetClient = net.createSocket({
    host: "google.com",
    port: 6969
  });
  targetClient.on('data', data => client.write(data));
  client.on('data', data => targetClient.write(data));
  client.on('end', () => targetClient.end());
  targetClient.on('end', () => client.end());
});

proxy.on('listening', () => console.log('Listening.'))

proxy.listen(6969);
```
