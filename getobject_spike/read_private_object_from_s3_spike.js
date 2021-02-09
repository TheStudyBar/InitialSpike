const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { STSClient, AssumeRoleCommand } = require("@aws-sdk/client-sts");
const fs = require('fs');

// Specify the AWS Region, such as "us-east-1".
const REGION = "us-east-2";

// Set the parameters.
// Specify the name of the bucket and the object to return.
const stsParams = {
    DurationSeconds: 900,
    RoleArn: "arn:aws:iam::249332642842:role/TSBMainBucketReadOnlyAccessRole",
    RoleSessionName: "GetBucketContentsTempSession"
};

// Create an Amazon S3 client service object.

const run = async () => {
    try {
        const stsClient = new STSClient({ region: REGION});
        const stsData = await stsClient.send(new AssumeRoleCommand(stsParams));
        const accessParams =  {
            accessKeyId: stsData.Credentials.AccessKeyId,
            secretAccessKey: data.Credentials.SecretAccessKey,
            sessionToken: stsData.Credentials.SessionToken
        };

        const s3ClientParams = {
            region: REGION,
            accessKeyId: stsData.Credentials.AccessKeyId,
            secretAccessKey: stsData.Credentials.SecretAccessKey,
            sessionToken: stsData.Credentials.SessionToken
        }
        const s3GetObjectParams = {
            Bucket: "thestudybar-initialspike",
            Key: "bbutton-headshot-850x850.png",
        };
        const s3 = new S3Client(s3ClientParams);
        const data = await s3.send(new GetObjectCommand(s3GetObjectParams));
        //console.log("Success, bucket returned", data);
        const outputWriter = process.stdout;
        await data.Body.pipe(outputWriter);
    } catch (err) {
        console.log("Error", err);
    }
};
run();

