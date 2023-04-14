var express = require('express');
var app = express();
var path = require('path');
const fs = require('fs');
const cors = require('cors');
app.use(cors())

app.use(express.static('build'))


const dir=path.join(__dirname, "images");
let images=[];

function getImages(arr, callback) {
    fs.readdir(dir, function (err, files) {
      if (err) {
        return console.log("Unable to scan directory: " + err);
      }
      files.forEach(function (file) {
         arr.push(file);
      });
      console.log("value ==> " + arr); 
      callback(arr);
      });
    }

    getImages(images, (content) => {
     console.log("content: ", content);
   });


var mime = {
    jpg: 'image/jpeg',
    png: 'image/png',
};

app.get('/images/*', function (req, res) {
    var imgname = req.path.replace("/images/", "")
    var file = path.join(dir, imgname.replace(/\/$/, '/index.html'));
    if (file.indexOf(dir + path.sep) !== 0) {
        return res.status(403).end('Forbidden');
    }
    var type = mime[path.extname(file).slice(1)] || 'text/plain';
    var s = fs.createReadStream(file);
    s.on('open', function () {
        res.set('Content-Type', type);
        s.pipe(res);
    });
    s.on('error', function () {
        res.set('Content-Type', 'text/plain');
        res.status(404).end('Not found');
    });
});

app.get('/imageList', function (req, res) {
    res.json(images)
});

const PORT = process.env.PORT || 3001
app.listen(PORT, function () {
    console.log(`Server running on port  ${PORT}`);
});
