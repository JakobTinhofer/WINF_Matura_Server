import fs from 'fs';
import Stream from 'stream';

let templates = [];

function buildTemplate(filename, params){
    const readStream = fs.createReadStream(filename, {encoding: 'utf-8'});
    var char;
    readStream.on('readable', () => {
        while(null !== (char = readable.read(1))){
            console.log(char);
        }
    });
}