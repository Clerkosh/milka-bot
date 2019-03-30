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
        
        switch(cmd) {
            // !ping
            case 'ping':
                bot.sendMessage({
                    to: channelID,
                    message: 'Pong!'
                });
            break;
            case 'start':
                timer = 7200;
                bot.sendMessage({
                    to: "561172885922775079",
                    message: "**ROZPOCZĘTO ODLICZANIE!!! ZA 2H WYJŚĆ ZE MNĄ!**"
                });
                j = schedule.scheduleJob('*/1 * * * * *', function(){
                    console.log(timer);
                    timer = timer-1;
                    if(timer == 0){
                        bot.sendMessage({
                            to: "561172885922775079",
                            message: "SZCZAĆ MI SIĘ CHCĘ!!!",
                            tts: true,
                        });
                        bot.uploadFile({
                            to: "561172885922775079",
                            message: "@everyone SZCZAĆ MI SIĘ CHCĘ!!!",
                            file: "szczac.gif"
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
                bot.uplaodFile({
                    to: "561172885922775079",
                    message: "Już mi się nie chcę... dziękuję bardzo.", 
                    file: "juznie.gif"
                });
                j.cancel();
            break;
            case 'przypomnij':
                var tekst = args[1];
                var data = args[1].split(".");
                var godzina = args[2].split(":");
                var date = new Date(data[2],data[1]-1,data[0],godzina[0],godzina[1],0);
                var wynik = "";
                for(var i=3;i<args.length;i++){
                    wynik += args[i] + " ";
                }
                bot.sendMessage({
                    to: "561172885922775079",
                    message: "Przypomnienie **"+ wynik +"** ustawione na **" + tekst + "** o godzinie **"+args[2]+"**!", 
                });
                var k = schedule.scheduleJob(date, function(){
                    bot.sendMessage({
                        to: "561172885922775079",
                        message: "@everyone Przypomnienie!: **"+ wynik+"**", 
                    });
                });
            break;
            case 'help':
                bot.sendMessage({
                    to: "561172885922775079",
                    message: "Dostępne komendy:\n```\n**!start**\n**!cd** ( wyświetla stan timera )"+
                            "\n**!stop**\n**!przypomnij <dd.mm.rrrr><gg:mm><tekst>** ( przypomnienie na daną datę )\n```", 
                });
            break;    
            // Just add any case commands if you want to..
         } 
     }
});