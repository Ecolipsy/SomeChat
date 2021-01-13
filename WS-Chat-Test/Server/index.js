const ws = require('ws');
const srv = new ws.Server({
    port: 42069
});
var users = [];

srv.on('connection', (cli) => {
    users.push(cli);
    function sendCli(message){cli.send(JSON.stringify({user: "SYSTEM", message}))}
    users.forEach(user => {
        user.send(JSON.stringify({user: "SYSTEM", message: `User ${users.indexOf(cli).toString()} has joined the chat.`}));
    });
    cli.on('close', () => {
        users.forEach(user => {
            user.send(JSON.stringify({user: "SYSTEM", message: `User ${users.indexOf(cli).toString()} has left the chat.`}));
        });
        users.splice(users.indexOf(cli),1);
    });
    cli.on('message', msg => {
        console.log(`(${users.indexOf(cli).toString()}) ${msg}`);
        function findDm(){
            var sp = msg.split(' ');
            var args = msg.replace(sp[0]+' '+sp[1]+' ','');
            if(!sp[1]) return cli.send(JSON.stringify({user: "SYSTEM", message: "You need to specify the user you want to DM."}));
            if(isNaN(sp[1]) || users[sp[1]] === undefined) return sendCli("The argument specified is not a valid ID, usage: /dm <UserID> <message>.");
            if(args.startsWith(" ") || args == "") return sendCli('DM cannot be empty.');
            users[sp[1]].send(JSON.stringify({user: `[DM] ${users.indexOf(cli)} -> You`, message: args}));
            cli.send(JSON.stringify({user: `[DM] You -> ${sp[1]}`, message: args}));
            console.log(`[${users.indexOf(cli)} -> ${sp[1]}] ${args}`);
        }
        if(msg.startsWith('/dm')) return findDm();
        if(msg.startsWith('/disconnect')) return cli.close();
        if(msg.startsWith(" ") || msg == "") return sendCli('Message cannot be empty.');
        users.forEach(user => {
            user.send(JSON.stringify({user: users.indexOf(cli).toString(), message: msg}));
        });
    });
});

process.stdin.on('data', (rdata) => {
    var data = rdata.toString();
    users.forEach(user => {
        user.send(JSON.stringify({user: "SYSTEM", message: data}));
    });
});

srv.on('listening', () => console.log(`Listening to port ${srv.options.port}.`));