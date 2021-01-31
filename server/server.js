//*##################################
//*###### SETTINGS & MODULES #######
//*#################################

const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server, {
    allowRequest: (req, callback) =>
        callback(null, req.headers.referer.startsWith("http://localhost:3000")),
}); // for Heroku, add ||"webadress from heroku"
const compression = require("compression");
const path = require("path");
const db = require("./db");
const { hash, compare } = require("./bc");
const cookieSession = require("cookie-session");
const cookieSessionMiddleware = cookieSession({
    secret: `I'm always angry.`,
    maxAge: 1000 * 60 * 60 * 24 * 14,
});
const csurf = require("csurf");
const cryptoRandomString = require("crypto-random-string");
const { sendEmail } = require("./ses");
const s3 = require("./s3");
const { s3Url } = require("./config");
const multer = require("multer");
const uidSafe = require("uid-safe");
const { truncate } = require("fs");
const { json } = require("express");
let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require("./secrets"); // in dev they are in secrets.json which is listed in .gitignore
}

//*##################################
//*######    MIDDLEWARES     #######
//*#################################

app.use(compression());

app.use(express.static(path.join(__dirname, "..", "client", "public")));

app.use(
    express.json({
        extended: false,
    })
);

app.use(express.urlencoded({ extended: false }));

const diskStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, path.resolve(__dirname + "/uploads"));
    },
    filename: function (req, file, callback) {
        uidSafe(24)
            .then((uid) => {
                callback(null, uid + path.extname(file.originalname));
            })
            .catch((err) => callback(err));
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});

app.use(cookieSessionMiddleware);
io.use(function (socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

app.use(csurf());

app.use(function (req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});

app.use(express.static("public"));

//##################################
//########### ROUTES ##############
//#################################

app.post("/register", (req, res) => {
    const { first, last, email, password } = req.body;
    if (!first || !last || !password || !email || !email.includes("@")) {
        console.log("invalid input into fields");
        res.json({
            error: true,
        });
    } else {
        hash(password)
            .then((hashedPW) => {
                console.log(hashedPW);
                db.addUser(first, last, email, hashedPW)
                    .then(({ rows }) => {
                        // console.log(rows);
                        req.session.userId = rows[0].id;
                        // req.session.logedin = true;
                        res.json({ success: true });
                    })
                    .catch((err) => {
                        console.log("error in registration", err);
                        res.json({ error: true });
                    });
            })
            .catch((err) => {
                console.log("error in hashing password", err);
                res.json({ error: true });
            });
    }
});

app.post("/login", (req, res) => {
    const { email, password } = req.body;
    if (!password || !email) {
        console.log("invalid input into fields");
        res.json({
            error: true,
        });
    } else {
        db.checkUserPW(email)
            .then(({ rows }) => {
                let hashedPW = rows[0].password;
                return compare(password, hashedPW).then((result) => {
                    console.log(result);
                    if (result) {
                        db.getUserIdByEmail(email)
                            .then(({ rows }) => {
                                req.session.userId = rows[0].id;
                                res.json({ success: true });
                            })
                            .catch((err) => {
                                console.log("error in logging", err);
                                res.json({ error: true });
                            });
                    } else {
                        return;
                    }
                });
            })
            .catch((err) => {
                console.log(
                    "error in logging, Email or Password is incorrect",
                    err
                );
                res.json({ error: true });
            });
    }
});

app.post("/password/reset/start", (req, res) => {
    const { email } = req.body;
    if (email == null) {
        res.json({ error: true });
    }
    db.getUserIdByEmail(email)
        .then(({ rows }) => {
            if (rows.length == 0) {
                res.json({
                    error: true,
                });
            } else {
                console.log("RESET 1", rows);
                const secretCode = cryptoRandomString({
                    length: 6,
                });
                return db.addCode(email, secretCode).then(({ rows }) => {
                    console.log("RESET 2", rows);
                    return sendEmail(
                        "arizk991@gmail.com",
                        rows[0].code,
                        "here is your code to reset your password"
                    )
                        .then(() => {
                            res.json({ sucess: true });
                        })
                        .catch((err) => {
                            console.log("error in sending email", err);
                            res.json({ error: true });
                        });
                });
            }
        })
        .catch((err) => {
            console.log("error in getting email", err);
            res.json({ error: true });
        });
});

// app.post("/password/reset/verify", (req, res) => {
//     const { password, code } = req.body;
//     db.compareCodes()
//         .then(({ rows }) => {
//             let match = rows.find((item) => item.code === code);
//             if (match) {
//                 console.log("RESET 3", rows);
//                 return hash(password).then((hashedPW) => {
//                     db.editPassword(hashedPW, match.email)
//                         .then(({ rows }) => {
//                             console.log("RESET 4", rows);
//                             if (rows) {
//                                 res.json({ sucess: true });
//                             }
//                         })
//                         .catch((err) => {
//                             console.log("error in editing the password", err);
//                             res.json({ error: true });
//                         });
//                 });
//             }
//         })
//         .catch((err) => {
//             console.log("error in comparing the codes", err);
//             res.json({ error: true });
//         });
// });

app.post("/password/reset/verify", (req, res) => {
    const { code, pw } = req.body;
    db.compareCodes()
        .then(({ rows }) => {
            let match = rows.find((item) => item.code === code);
            if (match) {
                return hash(pw)
                    .then((hashedPw) => {
                        return db.editPassword(hashedPw, match.email);
                    })
                    .then(() => {
                        console.log(
                            "successfully updated pw in database table users"
                        );
                        res.json({
                            error: false,
                        });
                    })
                    .catch((err) => {
                        console.log(
                            "error in db.updatePw() or in hash(): ",
                            err
                        );
                    });
            } else {
                res.json({
                    error: true,
                });
            }
        })
        .catch((err) => {
            console.log("error in db.validateResetCode(): ", err);
        });
});

app.get("/user", (req, res) => {
    db.getAllUserData(req.session.userId)
        .then(({ rows }) => {
            console.log({ ...rows, sucess: true });
            res.json({ ...rows, sucess: true });
        })
        .catch((err) => console.log("error", err));
});

//##########
// Upload profilr pic and delete profile Pic
//#########
app.post(
    "/user/upload/profile-pic",
    uploader.single("image"),
    s3.upload,
    (req, res) => {
        const { filename } = req.file;
        const url = s3Url + filename;
        const userId = req.session.userId;
        if (req.file) {
            db.addProfilePic(url, userId)
                .then(({ rows }) => {
                    // if (rows[0].profile_pic) {
                    //     const filename = rows[0].profile_pic.replace(s3Url, "");
                    //     s3.delete(filename);
                    // }
                    res.json(rows[0]);
                })
                .catch((err) => {
                    console.log("error adding profile pic", err);
                    res.json({ error: true });
                });
        } else {
            res.json({ error: true });
        }
    }
);

app.get("/user/delete/profile-pic", (req, res) => {
    const id = req.session.userId;
    db.getProfilePic(id)
        .then(({ rows }) => {
            const url = rows[0].profile_pic;
            if (url) {
                return url;
            } else {
                throw new Error("No image in database");
            }
        })
        .then((url) => {
            db.deleteProfilePic(id).then(() => {
                const filename = url.replace(s3Url, "");
                s3.delete(filename);
                res.json({ success: true });
            });
        })
        .catch((err) => {
            console.log(err);
            res.json({ success: false });
        });
});

app.post("/update-bio", (req, res) => {
    const { draftBio } = req.body;
    console.log(draftBio);
    const userId = req.session.userId;
    if (req.body) {
        db.updateBio(draftBio, userId)
            .then(({ rows }) => {
                res.json(rows[0]);
            })
            .catch((err) => {
                console.log("error adding bio", err);
                res.json({ error: true });
            });
    } else {
        res.json({ error: true });
    }
});

app.get(`/user-data/:id`, (req, res) => {
    console.log(req.params.id);
    db.getUserData(req.params.id)
        .then(({ rows }) => {
            res.json(rows);
        })
        .catch((err) => {
            console.log("error in getting other profile:", err);
            res.json({ error: true });
        });
});
//*##################################
//*####   ACCOUNT SETTINGS ######
//*#################################
app.post("/user/address", (req, res) => {
    const { postal_code, house_number, street, city } = req.body;

    console.log(postal_code, house_number, street, city);
    const userId = req.session.userId;
    db.addAddress(postal_code, house_number, street, city, userId)
        .then(({ rows }) => {
            console.log(rows);
            res.json({ success: true });
        })
        .catch((err) => {
            console.log("error in /user/address", err);
            res.json({ error: true });
        });
});

app.post("/user/account/edit", (req, res) => {
    const {
        first,
        last,
        email,
        password,
        postal_code,
        house_number,
        street,
        city,
    } = req.body;
    const userId = req.session.userId;
    if (password) {
        hash(password).then((hashedPw) => {
            console.log(hashedPw);
            db.editRegistrationDataWithPW(first, last, email, hashedPw, userId)
                .then(() => {
                    db.editProfileData(
                        postal_code,
                        house_number,
                        street,
                        city,
                        userId
                    ).then(() => {
                        res.json({ success: true });
                    });
                })
                .catch((err) => {
                    console.log("error in updating address", err);
                    res.json({ error: true });
                });
        });
    } else {
        db.editRegistrationDataWithoutPW(first, last, email, userId)
            .then(() => {
                db.editProfileData(
                    postal_code,
                    house_number,
                    street,
                    city,
                    userId
                ).then(() => {
                    res.json({ success: true });
                });
            })
            .catch((err) => {
                console.log("error in updating without password", err);
                res.json({ error: true });
            });
    }
});

//*##################################
//*####  ADD TOOL/ GET TOOLS  ######
//*#################################
app.post("/add-tool", (req, res) => {
    const { type, title, description, condition } = req.body;
    const userId = req.session.userId;
    req.session.toolId = null;
    db.addTool(type, title, description, condition, userId)
        .then(({ rows }) => {
            console.log(rows);
            req.session.toolId = rows[0].id;
            res.json({ ...rows, success: true });
        })
        .catch((err) => {
            console.log("error in /add-tool", err);
            res.json({ error: true });
        });
});

app.post("/add/item/pic", uploader.single("image"), s3.upload, (req, res) => {
    const { filename } = req.file;
    const url = s3Url + filename;
    const userId = req.session.userId;
    const toolId = req.session.toolId;
    console.log("url", url);
    if (req.file) {
        db.addToolPic(url, userId, toolId)
            .then(({ rows }) => {
                // if (rows[0].url) {
                //     const filename = rows[0].url.replace(s3Url, "");
                //     s3.delete(filename);
                // }
                res.json(rows[0]);
            })
            .catch((err) => {
                console.log("error adding tool pic", err);
                res.json({ error: true });
            });
    } else {
        res.json({ error: true });
    }
});

app.get("/tool/delete/pic", (req, res) => {
    const id = req.session.userId;
    db.getToolPic(id)
        .then(({ rows }) => {
            const url = rows[0].url;
            if (url) {
                return url;
            } else {
                throw new Error("No image in database");
            }
        })
        .then((url) => {
            db.deleteToolPic(id).then(() => {
                const filename = url.replace(s3Url, "");
                s3.delete(filename);
                res.json({ success: true });
            });
        })
        .catch((err) => {
            console.log("error deleting tool pic", err);
            res.json({ success: false });
        });
});

app.get("/item/:toolid", (req, res) => {
    console.log("yes!");
    const { id, toolid } = req.params;
    console.log(id, toolid);
    db.getToolinfo(toolid)
        .then(({ rows }) => {
            console.log(rows);
            res.json(rows);
        })
        .catch((err) => {
            console.log("error in /item/:toolid", err);
            res.json({ success: false });
        });
});

//*##################################
//*####      GET ALL ITEMS     ######
//*### make-available/ unavaliable ##
//*##################################

app.get("/get-items", (req, res) => {
    const userId = req.session.userId;
    db.getAllItems(userId)
        .then(({ rows }) => {
            res.json(rows);
        })
        .catch((err) => {
            console.log("error in /get-items", err);
            res.json({ success: false });
        });
});

app.post("/make-unavailable", (req, res) => {
    const userId = req.session.userId;
    const { itemId } = req.body;

    db.makeUnavailable(userId, itemId)
        .then(() => {
            res.json({ success: true });
        })
        .catch((err) => {
            console.log("error in /make-unavailable", err);
            res.json({ success: false, error: true });
        });
});

app.post("/make-available", (req, res) => {
    const userId = req.session.userId;
    const { itemId } = req.body;
    console.log({ itemId });
    db.makeAvailable(userId, itemId)
        .then(() => {
            res.json({ success: true });
        })
        .catch((err) => {
            console.log("error in /make-available", err);
            res.json({ success: false, error: true });
        });
});

app.post("/remove-item", (req, res) => {
    const userId = req.session.userId;
    const { itemId } = req.body;
    db.removeItem(userId, itemId)
        .then(() => {
            res.json({ success: true });
        })
        .catch((err) => {
            console.log("error in /remove-item", err);
            res.json({ success: false, error: true });
        });
});

//*##################################
//*####        BORROW BTN        ####
//*##################################
const BUTTON_TEXT = {
    MAKE_REQUEST: "Borrow Item",
    CANCEL_REQUEST: "Cancel Request",
    MAKE_UNAVAILABLE: "Make Unavailable",
    MAKE_AVAILABLE: "Make Available",
};
app.get("/request-status/:itemId", (req, res) => {
    const userId = req.session.userId;
    const { itemId } = req.params;
    console.log(itemId);
    db.getOwnerId(itemId)
        .then(({ rows }) => {
            console.log(rows);
            if (rows[0].user_id === userId) {
                if (rows[0].available === true) {
                    res.json(BUTTON_TEXT.MAKE_UNAVAILABLE);
                } else {
                    res.json(BUTTON_TEXT.MAKE_AVAILABLE);
                }
            } else {
                db.checkStatus(itemId, userId).then(({ rows }) => {
                    if (!rows[0]) {
                        res.json(BUTTON_TEXT.MAKE_REQUEST);
                    }
                    if (rows[0]) {
                        if (rows[0].accepted == false) {
                            // if (rows[0].sender_id == userId) {
                            res.json(BUTTON_TEXT.CANCEL_REQUEST);
                            // }
                        }
                    }
                });
            }
        })
        .catch((err) => {
            console.log("error in .. /request-status", err);
            res.json({ error: true });
        });
});

app.post("/update/request-status", (req, res) => {
    const userId = req.session.userId;
    const { action, itemId } = req.body;
    console.log("itemid update request", itemId);

    if (action === BUTTON_TEXT.MAKE_REQUEST) {
        db.getOwnerId(itemId)
            .then(({ rows }) => {
                const ownerId = rows[0].user_id;
                db.sendBorrowRequest(itemId, ownerId, userId).then(() => {
                    res.json(BUTTON_TEXT.CANCEL_REQUEST);
                });
            })
            .catch((err) =>
                console.log("error in .. make Borrow Request", err)
            );
    }
    if (action === BUTTON_TEXT.CANCEL_REQUEST) {
        db.cancelBorrowRequest(itemId, userId)
            .then(() => {
                res.json(BUTTON_TEXT.MAKE_REQUEST);
            })
            .catch((err) =>
                console.log("error in .. CANCEL Borrow Request", err)
            );
    }
    if (action === BUTTON_TEXT.MAKE_UNAVAILABLE) {
        db.makeUnavailable(userId, itemId)
            .then(() => {
                res.json(BUTTON_TEXT.MAKE_AVAILABLE);
            })
            .catch((err) =>
                console.log("error in .. btn make unavailable", err)
            );
    }
    if (action === BUTTON_TEXT.MAKE_AVAILABLE) {
        db.makeAvailable(userId, itemId)
            .then(() => {
                res.json(BUTTON_TEXT.MAKE_UNAVAILABLE);
            })
            .catch((err) => console.log("error in .. btn make Available", err));
    }
});

//*##################################
//*####     HandleBorrowReq      ####
//*##################################

app.get("/borrow-requests", (req, res) => {
    const userId = req.session.userId;
    db.getBorrowRequests(userId)
        .then(({ rows }) => {
            res.json(rows);
            console.log(rows);
        })
        .catch((err) => {
            console.log("error in /borrow-requests", err);
            res.json({ success: false });
        });
});

app.post("/accept-req", (req, res) => {
    const userId = req.session.userId;
    const { itemId, borwerId, val } = req.body;
    const { date } = val;

    db.acceptBorrowRequest(itemId, userId)
        .then(() => {
            db.handleBorrowRequest(date, borwerId, itemId).then(() => {
                res.json({ success: true });
            });
        })
        .catch((err) => {
            console.log("error in /accept-req or handel", err);
            res.json({ success: false });
        });
});

app.post("/reject-req", (req, res) => {
    const userId = req.session.userId;
    const { itemId } = req.body;
    db.rejectBorrowRequest(itemId, userId)
        .then(() => {
            res.json({ success: true });
        })
        .catch((err) => {
            console.log("error in /reject-req", err);
            res.json({ success: false });
        });
});

//##################################
//####      Add Coordinates   ######
//#################################

app.post("/user-location", (req, res) => {
    const userId = req.session.userId;
    const { lng, lat, placeId } = req.body;
    db.addCoordinates(lat, lng, placeId, userId)
        .then(({ rows }) => {
            console.log(rows);
            res.json({ success: true });
        })
        .catch((err) => {
            console.log("error in /user-location", err);
            res.json({ success: false, error: true });
        });
});

//*##################################
//*######  SEARCH COMPONENT  #######
//*#################################

app.get(`/find/recent/items`, (req, res) => {
    const userId = req.session.userId;

    db.getUserLoc(userId)
        .then(({ rows }) => {
            const { lng, lat } = rows[0];
            console.log(lng, lat);
            db.getRecentItems(lat, lng).then((data) => {
                console.log(data.rows);
                res.json(data.rows);
            });
        })
        .catch((err) => console.log("error in /find/recent/items", err));
});

app.get(`/find/items/:query`, (req, res) => {
    const { query } = req.params;
    const titel = query.replace(/^:+/, "");
    const userId = req.session.userId;

    db.getUserLoc(userId)
        .then(({ rows }) => {
            const { lng, lat } = rows[0];
            console.log(lng, lat);
            db.searchFor(titel, lat, lng).then((data) => {
                console.log(data.rows);
                res.json(data.rows);
            });
        })
        .catch((err) => console.log("error in /find/items/:query", err));
});

//##################################
//####   /WELCOME /LOGOUT /*  ######
//#################################
app.get("/welcome", (req, res) => {
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    }
});

app.get("/logout", (req, res) => {
    req.session = null;
    res.sendStatus(200);
});

app.get("*", function (req, res) {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    }
});

server.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
