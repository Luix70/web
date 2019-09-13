var fs = require('fs');
var https=require('https');

fs.writeFile(__dirname + '/autotext.html','<h1>Olé</h1>',function(error){
    if (error){
        console.log(error);
    }else{
        console.log('ole');
    }
});

var urlImg = 'https://indesan.com/resources/images/Colecciones/armonia/Image%202472.jpg'
https.get(urlImg , function(response){
    response.pipe(fs.createWriteStream(__dirname + '/autoFoto.jpg'));
});