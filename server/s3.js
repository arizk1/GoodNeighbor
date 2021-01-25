const aws = require("aws-sdk");
const fs = require("fs");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require("./secrets"); // in dev they are in secrets.json which is listed in .gitignore
}

const s3 = new aws.S3({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
});

module.exports.upload = (req, res, next) => {
    const { filename, mimetype, size, path } = req.file;
    console.log("Path", path);
    const promise = s3
        .putObject({
            Bucket: "arizkbucket",
            ACL: "public-read",
            Key: filename,
            Body: fs.createReadStream(path),
            ContentType: mimetype,
            ContentLength: size,
        })
        .promise();

    promise
        .then(() => {
            // it worked!!!
            console.log("amazon upload complete :) ");
            next();
            fs.unlink(path, () => {});
        })
        .catch((err) => {
            // uh oh
            console.log(" Something wrong with S3", err);
            res.sendStatus(500);
        });

    module.exports.delete = (req, res, next) => {
        const promise = s3
            .deleteObject({
                Bucket: "arizkbucket",
                Key: req.session.userid + "/" + filename,
            })
            .promise();
        promise
            .then(() => {
                console.log("amazon deletion complete :)");
                next();
            })
            .catch((err) => {
                console.log("Something went wrong with delete S3", err);
                res.sendStatus(500);
            });
    };

    module.exports.delete = (filename) => {
        const params = {
            Bucket: "arizkbucket",
            Key: filename,
        };
        const promise = s3
            .deleteObject(params, (err, data) => {
                if (err) {
                    console.log(err);
                }
            })
            .promise();

        promise
            .then(() => {
                console.log("successfully deleted image");
            })
            .catch((err) => {
                console.log(err);
            });
    };
};
