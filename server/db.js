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

module.exports.compareCodes = (code) => {
    const q = `SELECT * FROM reset_codes WHERE CURRENT_TIMESTAMP - timestamp < INTERVAL '10 minutes' AND code = ($1);`;
    const params = [code];
    return db.query(q, params);
};

module.exports.editPassword = (hashedPw, userId) => {
    const q = `UPDATE users 
    SET password = $1
    WHERE id = $2`;
    const params = [hashedPw, userId];
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
    RETURNING *`;
    const params = [
        postal_code || null,
        house_number || null,
        street || null,
        city || null,
        userId,
    ];
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
JOIN user_profile
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

module.exports.getToolPic = (userId, picId) => {
    return db.query(
        `SELECT url FROM tools
        WHERE user_id = $1 AND id = $2`,
        [userId, picId]
    );
};
