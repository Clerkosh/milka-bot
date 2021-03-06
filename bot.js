const http = require('http');
var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
var schedule = require('node-schedule');
var fs = require('fs');

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
var stream;
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
    stream = fs.createWriteStream("przypomnienia.txt", {flags:'a'});
    var przypomnienia_remover = setInterval(function(){
        var data = fs.readFileSync('przypomnienia.txt', 'utf-8');
        data2 = data.split(" ");
        var tmp2 = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
        var tmp = tmp2.split(" ");
        var dejta = tmp[0].split("-");
        var tajm = tmp[1].split(":");
        var godz = parseInt(tajm[0])+2;
        var string = dejta[2]+"."+dejta[1]+"."+dejta[0]+";"+godz+":"+tajm[1];
        //console.log(string); --> current date and time;
        for(var i=0;i<data2.length;i++){
            if(data2[i].includes(string))
            {
                var newValue = data.replace(data2[i].toString()+"  ", '');
                fs.writeFileSync('przypomnienia.txt', newValue, 'utf-8');
            }
        }
    },60000);
    var test = setInterval(function() {
        http.get("http://milka-bot.herokuapp.com");
    }, 300000);
});
let timer = 7200;
var j, zaczeto=false;
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
                if(j!=null) j.cancel();
                if(zaczeto){
                    let arg1 = args[1];
                    if(arg1 != null){
                        timer = arg1*60;
                    }else timer = 7200;   
                }else{
                    let arg1 = args[1];
                    if(arg1 != null){
                        timer = arg1*60;
                    }else timer = 7200;
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
                    zaczeto=true;
                }
                bot.sendMessage({
                    to: "561172885922775079",
                    message: "**ROZPOCZĘTO ODLICZANIE!!! ZA " + Math.floor(timer/3600).toString() + ":"+Math.floor((timer/60)%60)+":"+Math.floor(timer%60).toString() +" WYJŚĆ ZE MNĄ!**"
                });
            break;
            case 'cd':
                if(timer != 0){
                    bot.sendMessage({
                        to: "561172885922775079",
                        message: "** Pozostało: **"+ Math.floor(timer/3600).toString() + ":"+Math.floor((timer/60)%60)+":"+Math.floor(timer%60).toString(), 
                    });
                }else {
                    bot.sendMessage({
                        to: "561172885922775079",
                        message: "Timer nie jest włączony.", 
                    });
                }
            break;
            case 'stop':
                bot.uploadFile({
                    to: "561172885922775079",
                    message: "Już mi się nie chcę... dziękuję bardzo.", 
                    file: "juznie.gif"
                });
                if(j!=null) j.cancel();
                timer=0;
            break;
            case 'przypomnij':
                var tekst = args[1];
                var data = args[1].split(".");
                var godzina = args[2].split(":");
                var date = new Date(data[2],data[1]-1,data[0],godzina[0],godzina[1],0);
                var wynik = "";
                for(var i=3;i<args.length;i++){
                    wynik += args[i];
                }
                var linia = tekst + ";" + args[2] + ";" + wynik+" ";
                stream.write(linia);
                
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
            case 'przypomnienia':
                var przypomnienia;
                przypomnienia = fs.readFileSync("przypomnienia.txt", 'utf8');
                    let przyp = przypomnienia.split(" ");
                    for(var j = 0; j<przyp.length-1; j++){
                        var linia = przyp[j].split(";");
                        var data = linia[0];
                        var godzina = linia[1];
                        var tekst = linia[2];
                        bot.sendMessage({
                            to: "561172885922775079",
                            message: j+1+". **"+tekst+"** - "+data+" o godzinie " +godzina +"\n", 
                        });
                    }
            break;
            case 'help':
                bot.sendMessage({
                    to: "561172885922775079",
                    message: "Dostępne komendy:\n```\n!start [ile w minutach]\n!cd ( wyświetla stan timera )"+
                            "\n!stop\n!przypomnij <dd.mm.rrrr><gg:mm><tekst> ( przypomnienie na daną datę )\n!przypomnienia\n```", 
                });
            break;    
            // Just add any case commands if you want to..
         } 
     }
});