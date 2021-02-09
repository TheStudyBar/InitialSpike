const fs = require('fs');
const Stream = require('stream');
const os = require('os');

class FileReader {
    constructor(fileToRead) {
        this.fileToRead = fileToRead;
    }

    readToConsole() {
        const inputStream = fs.createReadStream(this.fileToRead, {encoding: 'utf8'});
        let count = 0;
        inputStream.on('data', async (chunk) => {
            await console.log(count);
            count++;
        });

        inputStream.on('error', (err) => {
            console.log(err.stack);
        });
    }
}

function main() {
    if (process.argv.length != 3) {
        console.error("usage: node stream_reading.js <input file>")
        process.exit(1);
    }

    const fileReader = new FileReader(process.argv[1]);
    fileReader.readToConsole();
}

main();
