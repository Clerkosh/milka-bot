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
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
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
                    message: "Odliczanie przerwane...", 
                });
                j.cancel();
            break;

            // Just add any case commands if you want to..
         }
     }
});