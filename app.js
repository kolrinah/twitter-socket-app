var http = require('http');
var express = require('express'),
    app = module.exports.app = express();
var server = http.createServer(app);

const credentials = require('./credentials');

var twitter = require('ntwitter'),
    io = require('socket.io').listen(server),
    options = ['venezuela','cuba'];
    optionA = 0,
    optionB = 0,
    total = 0;

server.listen(3003);

var twit = new twitter({
    consumer_key: credentials.consumer_key,
    consumer_secret: credentials.consumer_secret,
    access_token_key: credentials.access_token_key,
    access_token_secret: credentials.access_token_secret
});

twit.stream('statuses/filter', { track: options }, function(stream){
    stream.on('data', function (data) {
        var text = data.text.toLowerCase();
        var option = '';
        if (text.indexOf(options[0]) !== -1) {
            optionA++
            total++
            option = 'optionA';
        }
        if (text.indexOf(options[1]) !== -1) {
            optionB++
            total++
            option = 'optionB';
        }
        io.sockets.volatile.emit('tweet', {
            user: data.user.screen_name,
            text: data.text,
            avatar: data.user.profile_image_url_https,
            option: option,
            optionA: (optionA/total) * 100, 
            optionB: (optionB/total) * 100
        });
    });
});

app.get('/', function (req, res) {
    res.sendFile( __dirname + '/index.html');
});