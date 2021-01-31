const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        `postgres:postgres:postgres@localhost:5432/goodNeighbor`
);

//#################################
//#### REGISTRATION AND LOGIN #####
//#################################

module.exports.addUser = (firstName, lastName, email, hashedPw) => {
    const q = `INSERT INTO users (first, last, email, password ) 
    VALUES ($1, $2, $3, $4) 
    RETURNING id`;
    const params = [firstName, lastName, email, hashedPw];
    return db.query(q, params);
};

module.exports.checkUserPW = (email) => {
    const q = `SELECT password FROM users WHERE email = ($1)`;
    const params = [email];
    return db.query(q, params);
};

module.exports.getUserIdByEmail = (email) => {
    const q = `SELECT id FROM users WHERE email = ($1)`;
    const params = [email];
    return db.query(q, params);
};

module.exports.getUserData = (userId) => {
    const q = `SELECT * FROM users WHERE id = ($1)`;
    const params = [userId];
    return db.query(q, params);
};

module.exports.addCode = (email, code) => {
    const q = `INSERT INTO reset_codes (email, code) 
    VALUES ($1, $2) 
    RETURNING *`;
    const params = [email, code];
    return db.query(q, params);
};

module.exports.compareCodes = () => {
    const q = `SELECT * FROM reset_codes WHERE CURRENT_TIMESTAMP - timestamp < INTERVAL '10 minutes'`;
    // const params = [code];
    return db.query(q);
};

module.exports.editPassword = (hashedPw, email) => {
    const q = `UPDATE users 
    SET password = $1
    WHERE email = $2`;
    const params = [hashedPw, email];
    return db.query(q, params);
};

//#################################
//###### ACCOUNT SETTINGS #########
//#################################

module.exports.addProfilePic = (picUrl, userId) => {
    const q = `UPDATE users SET profile_pic = $1
    WHERE id = $2
    RETURNING profile_pic`;
    const params = [picUrl, userId];
    return db.query(q, params);
};

module.exports.deleteProfilePic = (id) => {
    return db.query(
        `UPDATE users
        SET profile_pic = NULL
        WHERE id = $1`,
        [id]
    );
};

module.exports.getProfilePic = (id) => {
    return db.query(
        `SELECT profile_pic FROM users
        WHERE id = $1`,
        [id]
    );
};

module.exports.updateBio = (bio, userId) => {
    const q = `UPDATE users SET bio = $1
    WHERE id = $2
    RETURNING bio`;
    const params = [bio, userId];
    return db.query(q, params);
};

module.exports.addAddress = (
    postal_code,
    house_number,
    street,
    city,
    userId
) => {
    const q = `INSERT INTO user_profile (postal_code, house_number, street, city, user_id)
VALUES ($1, $2, $3, $4, $5)
ON CONFLICT (user_id)
DO UPDATE SET postal_code = $1, house_number = $2, street = $3, city = $4
RETURNING *`;
    const params = [postal_code, house_number, street, city, userId];
    return db.query(q, params);
};

module.exports.deleteFromUsers = (userId) => {
    const q = `DELETE FROM users WHERE id = $1`;
    const params = [userId];
    return db.query(q, params);
};
module.exports.deleteFromuProfile = (userId) => {
    const q = `DELETE FROM users WHERE id = $1`;
    const params = [userId];
    return db.query(q, params);
};

module.exports.getAllUserData = (id) => {
    const q = `SELECT users.id, first, last, email, bio, profile_pic, postal_code, house_number, street, city, user_profile.user_id
FROM users
LEFT JOIN user_profile
ON users.id = user_profile.user_id
WHERE users.id = $1`;
    const params = [id];
    return db.query(q, params);
};

module.exports.editRegistrationDataWithPW = (
    first,
    last,
    email,
    hashedPw,
    id
) => {
    const q = `UPDATE users 
    SET first = $1, last = $2, email = $3, password = $4
    WHERE id = $5`;
    const params = [first, last, email, hashedPw, id];
    return db.query(q, params);
};

module.exports.editRegistrationDataWithoutPW = (
    firstName,
    lastName,
    email,
    id
) => {
    const q = `UPDATE users
    SET first = $1, last = $2, email = $3
    WHERE id = $4`;
    const params = [firstName, lastName, email, id];
    return db.query(q, params);
};

module.exports.editProfileData = (
    postal_code,
    house_number,
    street,
    city,
    user_id
) => {
    const q = `INSERT INTO user_profile (postal_code, house_number, street, city, user_id)
VALUES ($1, $2, $3, $4, $5)
ON CONFLICT (user_id)
DO UPDATE SET postal_code = $1, house_number = $2, street = $3, city = $4`;
    const params = [
        postal_code || null,
        house_number || null,
        street || null,
        city || null,
        user_id,
    ];
    return db.query(q, params);
};

module.exports.addCoordinates = (lat, lng, placeId, userId) => {
    const q = `INSERT INTO map_coordinates (lat, lng, place_id, user_id)
VALUES ($1, $2, $3, $4)
ON CONFLICT (user_id) DO UPDATE
SET lat = $1, lng = $2, place_id = $3
RETURNING *`;
    const params = [lat, lng, placeId, userId];
    return db.query(q, params);
};

//#################################
//#### TOOLS/ TOOL Profile ########
//#################################

module.exports.addTool = (type, title, description, condition, userId) => {
    const q = `INSERT INTO tools (type, title, description, condition, user_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *`;
    const params = [type, title, description, condition, userId];
    return db.query(q, params);
};

module.exports.addToolPic = (picUrl, userId, toolId) => {
    const q = `UPDATE tools SET url = $1
    WHERE user_id = $2 AND id= $3
    RETURNING *`;
    const params = [picUrl, userId, toolId];
    return db.query(q, params);
};

module.exports.deleteToolPic = (userId, picId) => {
    return db.query(
        `UPDATE tools
        SET url = NULL
        WHERE user_id = $1 AND id = $2`,
        [userId, picId]
    );
};

module.exports.getToolPic = (userId, toolId) => {
    return db.query(
        `SELECT url FROM tools
        WHERE user_id = $1 AND id = $2`,
        [userId, toolId]
    );
};

module.exports.getToolinfo = (toolId) => {
    return db.query(
        `SELECT * FROM tools
        WHERE id = $1`,
        [toolId]
    );
};

//##################################
//####      GET ALL ITEMS     ######
//### make-available/ unavaliable ##
//##################################

module.exports.getAllItems = (userId) => {
    const q = `SELECT * FROM tools
    WHERE user_id = $1 OR recipient_id = $1`;
    const params = [userId];
    return db.query(q, params);
};

module.exports.makeUnavailable = (userId, itemId) => {
    return db.query(
        `UPDATE tools
        SET available = false
        WHERE user_id = $1 AND id = $2`,
        [userId, itemId]
    );
};

module.exports.makeAvailable = (userId, itemId) => {
    return db.query(
        `UPDATE tools
        SET available = true
        WHERE user_id = $1 AND id = $2`,
        [userId, itemId]
    );
};

module.exports.removeItem = (userId, itemId) => {
    const q = `DELETE FROM tools
    WHERE user_id = $1 AND id = $2`;
    const params = [userId, itemId];
    return db.query(q, params);
};

//*##################################
//*####        BORROW BTN        ####
//*##################################

module.exports.getOwnerId = (itemId) => {
    const q = `SELECT * FROM tools
    WHERE id = $1`;
    const params = [itemId];
    return db.query(q, params);
};

module.exports.checkStatus = (itemId, userId) => {
    const q = `SELECT * FROM requests
    WHERE item_id = $1 AND borwer_id = $2`;
    const params = [itemId, userId];
    return db.query(q, params);
};

module.exports.sendBorrowRequest = (itemId, ownerId, borwerId) => {
    const q = `INSERT INTO requests (item_id, owner_id, borwer_id) 
    VALUES ($1, $2, $3) 
    RETURNING *`;
    const params = [itemId, ownerId, borwerId];
    return db.query(q, params);
};

module.exports.cancelBorrowRequest = (itemId, borwerId) => {
    const q = `DELETE FROM requests
    WHERE item_id = $1 AND borwer_id = $2`;
    const params = [itemId, borwerId];
    return db.query(q, params);
};

//*##################################
//*####     HandleBorrowReq      ####
//*##################################

module.exports.getBorrowRequests = (userId) => {
    const q = `SELECT * FROM requests
    WHERE owner_id = $1 OR borwer_id = $1`;
    const params = [userId];
    return db.query(q, params);
};

module.exports.acceptBorrowRequest = (itemId, borwerId) => {
    const q = `UPDATE requests
        SET accepted = true
        WHERE item_id = $1 AND borwer_id = $2`;
    const params = [itemId, borwerId];
    return db.query(q, params);
};
module.exports.handleBorrowRequest = (date, borwerId, itemId) => {
    const q = `UPDATE tools 
    SET available = false, until = $1, recipient_id = $2
    WHERE id = $3`;
    const params = [date, borwerId, itemId];
    return db.query(q, params);
};

module.exports.rejectBorrowRequest = (itemId, userId) => {
    const q = `DELETE FROM requests
    WHERE item_id = $1 AND borwer_id = $2`;
    const params = [itemId, userId];
    return db.query(q, params);
};

//*##################################
//*####     SEARCH - HOME PAGE   ####
//*##################################

module.exports.searchFor = (titel, userLtd, userLng) => {
    const q = `SELECT tools.id, tools.type, tools.title, tools.url, tools.available, tools.user_id, tools.recipient_id, tools.description, tools.until, users.first, users.last, users.profile_pic, map_coordinates.lat, map_coordinates.lng, map_coordinates.user_id
FROM tools
JOIN map_coordinates ON (tools.user_id = map_coordinates.user_id)
JOIN users ON (users.id = map_coordinates.user_id)
WHERE (tools.title ILIKE $1 AND (((acos(sin(($2*pi()/180)) * sin((map_coordinates.lat*pi()/180))+cos(($2*pi()/180)) * cos((map_coordinates.lat*pi()/180)) * cos((($3 - map_coordinates.lng)*pi()/180))))*180/pi())*60*1.1515*1.609344) <= 3)`;
    const params = [`${titel}%`, userLtd, userLng];
    return db.query(q, params);
};

module.exports.getUserLoc = (userId) => {
    return db.query(
        `SELECT * FROM map_coordinates 
    WHERE user_id = $1`,
        [userId]
    );
};

module.exports.getUserDeadlines = (userId) => {
    return db.query(
        `SELECT * FROM tools 
    WHERE recipient_id = $1`,
        [userId]
    );
};

module.exports.getToolDetails = (toolId) => {
    return db.query(
        `SELECT * FROM tools 
    WHERE id = $1`,
        [toolId]
    );
};
module.exports.getRecentItems = (userLtd, userLng) => {
    const q = `SELECT tools.id, tools.type, tools.title, tools.url, tools.available, tools.user_id, tools.recipient_id, tools.description, tools.until, users.first, users.last, users.profile_pic, map_coordinates.lat, map_coordinates.lng, map_coordinates.user_id
FROM tools
JOIN map_coordinates ON (tools.user_id = map_coordinates.user_id)
JOIN users ON (users.id = map_coordinates.user_id)
WHERE ((((acos(sin(($1*pi()/180)) * sin((map_coordinates.lat*pi()/180))+cos(($1*pi()/180)) * cos((map_coordinates.lat*pi()/180)) * cos((($2 - map_coordinates.lng)*pi()/180))))*180/pi())*60*1.1515*1.609344) <= 3)
ORDER BY tools.id DESC LIMIT 3`;
    const params = [userLtd, userLng];
    return db.query(q, params);
};

`SELECT tools.id, tools.type, tools.title, tools.url, tools.available, tools.user_id, tools.recipient_id, tools.until, users.first, users.last, users.profile_pic, map_coordinates.lat, map_coordinates.lng, map_coordinates.user_id
FROM tools
JOIN map_coordinates ON (tools.user_id = map_coordinates.user_id)
LEFT JOIN users ON (users.id = map_coordinates.user_id)
WHERE (tools.title ILIKE 'a%' AND (((acos(sin((52.50573*pi()/180)) * sin((map_coordinates.lat*pi()/180))+cos((52.50573*pi()/180)) * cos((map_coordinates.lat*pi()/180)) * cos(((13.34786 - map_coordinates.lng)*pi()/180))))*180/pi())*60*1.1515*1.609344) <= 3)`;
