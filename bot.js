const http = require('http');
var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
var schedule = require('node-schedule');
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});
const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello World\n');
  });
var server_port = process.env.YOUR_PORT || process.env.PORT || 80;
var server_host = process.env.YOUR_HOST || '0.0.0.0';
server.listen(server_port, server_host, function() {
    console.log('Listening on port %d', server_port);
});
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
    var test = setInterval(function() {
        http.get("http://milka-bot.herokuapp.com");
    }, 300000);
});
let timer = 7200;
var j;
bot.on('message', function (user, userID, channelID, message, evt) {
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
       
        args = args.splice(1);
        switch(cmd) {
            // !ping
            case 'ping':
                bot.sendMessage({
                    to: channelID,
                    message: 'Pong!'
                });
            break;
            case 'start':
            timer=7200;
            bot.sendMessage({
                to: "561172885922775079",
                message: "ROZPOCZĘTO ODLICZANIE!!! ZA 2H WYJŚĆ ZE MNĄ!"
            });
            j = schedule.scheduleJob('*/1 * * * * *', function(){
                console.log(timer);
                timer = timer-1;
                if(timer == 0){
                    bot.sendMessage({
                        to: "561172885922775079",
                        message: "@everyone Wyjdź ktoś ze mną!"
                    });
                    bot.sendMessage({
                        to: "561172885922775079",
                        message: "Wyjdź ktoś ze mną!",
                        tts: true,
                    });
                    timer = 7200;
                }
            });
            break;
            case 'cd':
            bot.sendMessage({
                to: "561172885922775079",
                message: "** Pozostało: **"+ Math.floor(timer/3600).toString() + ":"+Math.floor((timer/60)%60)+":"+Math.floor(timer%60).toString(), 
            });
            break;
            case 'stop':
                bot.sendMessage({
                    to: "561172885922775079",
                    message: "Odliczanie przerwane... Napisz !start, aby rozpocząć nowe odliczanie!", 
                });
                j.cancel();
                timer=0;
            break;
            case 'ktojestmistrzem':
                bot.sendMessage({
                    to: "561172885922775079",
                    message: "Pan Tomuś :)", 
                });
                j.cancel();
                timer=0;
            break;

            // Just add any case commands if you want to..
         }
     }
});