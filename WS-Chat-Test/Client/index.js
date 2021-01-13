const ws = require('ws');
const client = new ws("http://localhost:42069")

client.on('open', () => {
    console.log('The WebSocket is open.');
});

client.on('message', msg => {
    var jMsg = JSON.parse(msg);
    console.log(`(${jMsg.user}) ${jMsg.message}`);
});

client.on('close', () => {
    console.log('The WebSocket is now closed.');
    console.log('You may now hit CTRL + C if the program doesn\'t automatically quit the program.');
});

process.stdin.on('data', (dataR) => {
    var data = dataR.toString();
    data = data.replace(/\n/,'').replace(/\r/,'');
    if(data.startsWith('/dm')) console.log(`DM command detected in "${data}".`);
    client.send(data);
});