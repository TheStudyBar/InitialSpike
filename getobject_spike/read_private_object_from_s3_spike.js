const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const fs = require('fs');

// Specify the AWS Region, such as "us-east-1".
const REGION = "us-east-2";

// Set the parameters.
// Specify the name of the bucket and the object to return.

// Create an Amazon S3 client service object.

const run = async (bucket, object, outputStream) => {
    try {
         const s3ClientParams = {
            region: REGION
        }
        const s3GetObjectParams = {
            Bucket: bucket,
            Key: object,
            ResponseContentType: "image/png"
        };
        const s3 = new S3Client(s3ClientParams);
        const data = await s3.send(new GetObjectCommand(s3GetObjectParams));
        console.log("Success, bucket returned", data);
        await data.Body.pipe(outputStream);
    } catch (err) {
        console.log("Error", err);
    }
};

function main() {
    if (process.argv.length < 4 || process.argv.length > 5) {
        console.log("usage: node " + process.argv[1] + " <bucket> <file> <output_file");
        process.exit(1);
    }

    let outputStream = process.stdout;
    if (process.argv.length == 5) {
        outputStream = fs.createWriteStream(process.argv[4], {encoding: "binary", flags: 'w', autoClose:true});
    }

    run(process.argv[2], process.argv[3], outputStream);
}

main();
