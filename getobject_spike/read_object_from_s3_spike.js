const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");

// Specify the AWS Region, such as "us-east-1".
const REGION = "us-east-2";

// Set the parameters.
// Specify the name of the bucket and the object to return.
const params = { Bucket: "thestudybar-public-test-bucket-delete-me", Key: "BABinSTL_workouts-2.csv" };

// Create an Amazon S3 client service object.
const s3 = new S3Client({ region: REGION });

const run = async () => {
    try {
        const data = await s3.send(new GetObjectCommand(params));
        console.log("Success, bucket returned", data);
    } catch (err) {
        console.log("Error", err);
    }
};
run();

