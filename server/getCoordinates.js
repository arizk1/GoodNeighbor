module.exports.getCoordinates = (bearerToken, callback) => {
    const config = {
        method: "GET",
        host: "api.twitter.com",
        path:
            "/1.1/statuses/user_timeline.json?screen_name=taylorswift13&tweet_mode=extended",
        headers: {
            Authorization: "Bearer " + bearerToken,
        },
    };

    function tweetsCallback(res) {
        if (res.statusCode !== 200) {
            callback(res.statusCode);
            return;
        }
        let body = "";
        res.on("data", (chunk) => (body += chunk));
        res.on("end", () => {
            const tweets = JSON.parse(body);
            callback(null, tweets);
        });
    }

    const req = https.request(config, tweetsCallback);

    req.end();
};

`https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,
+Mountain+View,+CA&key=YOUR_API_KEY`;
