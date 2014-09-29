var http = require('http');
var https = require('https');
var url = require('url');
var fs = require('fs');

// url: http://popplers5.bandcamp.com/download/track?enc=mp3-128&fsig=d30261419e687ff7d2c348bcd3057c4a&id=2904237271&stream=1&ts=1411644905.0
// redirect url: http://p1.bcbits.com/download/track/98fcf9e59142e158b9cdc4a540d17228/mp3-128/2904237271?fsig=ed0bf010ab38ad05546ff5b0f0e956c0&id=2904237271&stream=1&ts=1411948800.0&e=1411948860&rs=32&ri=960&h=0f8997ee4893bf02b56cee604a50d2cc

http.createServer(function(request, response){
	console.log('request came');
	
	var data = '';
	request.on('data', function(chunk){
		data += chunk;
	});
	request.on('end', function(){
		console.log('request data parsed');
		
		var track = JSON.parse(data);
		var filePath = 'tracks/' + track.artist + ' - ' + track.song + '.mp3';
		
		if(!fs.existsSync(filePath)) {
			var file = fs.createWriteStream(filePath);
			downloadTrack(track.downloadUrl, file, function(){
				response.writeHead(200, 'OK', {});
				response.end();
			});
		}
		
	});
}).listen(8000);

console.log('listening...');

var downloadTrack = function(downloadUrl, file, cb){
	var client = downloadUrl.indexOf('https') > -1 
				? https 
				: http;

	client.get(downloadUrl, function(response1){
		console.log('redirect url received');
		
		var location = response1.headers.location;
		if(location) {
			client = location.indexOf('https') > -1 
			? https 
			: http;
			client.get(location, function(response2){
				console.log('track received');
				
				response2.pipe(file);
				console.log('track saved');
				
				cb();
			});
		}
	});
};











