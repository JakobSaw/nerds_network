const spicedPg = require("spiced-pg"),
    database = "socialnetwork",
    username = "postgres",
    password = "postgres",
    db = spicedPg(
        process.env.DATABASE_URL ||
            `postgres:${username}:${password}@localhost:5432/${database}` // PORT 5432 is reserved for SQL
    );

// Onboarding
module.exports.addUser = (userid, username, email, password) => {
    const q = `INSERT INTO users (userid, username, email, password) VALUES ($1, $2, $3, $4);`,
        params = [userid, username, email, password];
    return db.query(q, params);
};
module.exports.findUserViaMail = (email) => {
    const q = `SELECT * FROM users WHERE email = $1;`,
        params = [email];
    return db.query(q, params);
};
module.exports.findUserViaUsername = (username) => {
    const q = `SELECT * FROM users WHERE username = $1;`,
        params = [username];
    return db.query(q, params);
};

// Add Profile
module.exports.addUserProfile = (
    userid,
    username,
    introduction,
    studies,
    university,
    workplace,
    idea,
    superpower,
    interests,
    movies,
    books,
    games,
    avatar,
    bg,
    pic
) => {
    const q = `INSERT INTO userprofiles (userid, username, introduction, studies, university, workplace, idea, superpower, interests, movies, books, games, avatar, bg, pic) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) ON CONFLICT (userid) DO UPDATE SET username=$2, introduction=$3, studies=$4, university=$5, workplace=$6, idea=$7, superpower=$8, interests=$9, movies=$10, books=$11, games=$12, avatar=$13, bg=$14, pic=$15;`,
        params = [
            userid,
            username,
            introduction,
            studies,
            university,
            workplace,
            idea,
            superpower,
            interests,
            movies,
            books,
            games,
            avatar,
            bg,
            pic,
        ];
    return db.query(q, params);
};
//

// Friends Data
module.exports.findFriends = (id) => {
    const q = `SELECT * FROM friends WHERE receiverid = $1 OR senderid = $1;`,
        params = [id];
    return db.query(q, params);
};
module.exports.addFriendRequest = (
    senderid,
    sendername,
    senderavatar,
    senderbg,
    senderpic,
    receiverid,
    receivername,
    receiveravatar,
    receiverbg,
    receiverpic
) => {
    const q = `INSERT INTO friends (senderid, sendername, senderavatar, senderbg, senderpic, receiverid, receivername, receiveravatar, receiverbg, receiverpic, accepted) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);`,
        params = [
            senderid,
            sendername,
            senderavatar,
            senderbg,
            senderpic,
            receiverid,
            receivername,
            receiveravatar,
            receiverbg,
            receiverpic,
            false,
        ];
    return db.query(q, params);
};
module.exports.addFriend = (receiverid, senderid) => {
    const q = `UPDATE friends SET accepted = true WHERE EXISTS (SELECT * FROM friends WHERE receiverid = $1 AND senderid = $2);`,
        params = [receiverid, senderid];
    return db.query(q, params);
};
module.exports.deleteFriend = (id, senderid) => {
    const q = `DELETE FROM friends WHERE receiverid = $1 AND senderid = $2;`,
        params = [id, senderid];
    return db.query(q, params);
};
//

// Update Friends
module.exports.updateSenderFriends = (avatar, bg, pic, id) => {
    const q = `UPDATE friends SET senderavatar = $1, senderbg = $2, senderpic = $3 WHERE senderid = $4;`,
        params = [avatar, bg, pic, id];
    return db.query(q, params);
};
module.exports.updateReceiverFriends = (avatar, bg, pic, id) => {
    const q = `UPDATE friends SET receiveravatar = $1, receiverbg = $2, receiverpic = $3 WHERE receiverid = $4;`,
        params = [avatar, bg, pic, id];
    return db.query(q, params);
};
//

// Chat Messages
module.exports.getChatMessages = (senderid, receiverid) => {
    const q = `SELECT * FROM chat_messages WHERE senderid = $1 AND receiverid = $2 OR senderid = $2 AND receiverid = $1;`,
        params = [senderid, receiverid];
    return db.query(q, params);
};
module.exports.addChatMessage = (senderid, receiverid, message) => {
    const q = `INSERT INTO chat_messages (senderid, receiverid, message) VALUES ($1, $2, $3);`,
        params = [senderid, receiverid, message];
    return db.query(q, params);
};
module.exports.getGroupMessages = () => {
    return db.query(`SELECT * FROM group_messages;`);
};
module.exports.addGroupMessage = (
    senderid,
    sendername,
    group_name,
    message
) => {
    const q = `INSERT INTO group_messages (senderid, sendername, group_name, message) VALUES ($1, $2, $3, $4);`,
        params = [senderid, sendername, group_name, message];
    return db.query(q, params);
};
//

//

// Find
module.exports.findUserProfile = (userid) => {
    const q = `SELECT * FROM userprofiles WHERE userid = $1;`,
        params = [userid];
    return db.query(q, params);
};
module.exports.findMatchingUsers = (str) => {
    return db.query(
        `SELECT username, userid FROM users WHERE username ILIKE $1;`,
        ["%" + str + "%"]
    );
};
module.exports.findMatchingStudies = (str) => {
    return db.query(
        `SELECT studies, userid, username, avatar, bg, pic FROM userprofiles WHERE studies ILIKE $1;`,
        ["%" + str + "%"]
    );
};
module.exports.findMatchingUniversities = (str) => {
    return db.query(
        `SELECT university, userid, username, avatar, bg, pic FROM userprofiles WHERE university ILIKE $1;`,
        ["%" + str + "%"]
    );
};
module.exports.findMatchingWorkplaces = (str) => {
    return db.query(
        `SELECT workplace, userid, username, avatar, bg, pic FROM userprofiles WHERE workplace ILIKE $1;`,
        ["%" + str + "%"]
    );
};
module.exports.findMatchingIdeas = (str) => {
    return db.query(
        `SELECT idea, userid, username, avatar, bg, pic FROM userprofiles WHERE idea ILIKE $1;`,
        ["%" + str + "%"]
    );
};
module.exports.findMatchingSuperpowers = (str) => {
    return db.query(
        `SELECT superpower, userid, username, avatar, bg, pic FROM userprofiles WHERE superpower ILIKE $1;`,
        ["%" + str + "%"]
    );
};
module.exports.findMatchingInterests = (str) => {
    return db.query(
        `SELECT interests, userid, username, avatar, bg, pic FROM userprofiles WHERE interests ILIKE $1;`,
        ["%" + str + "%"]
    );
};
module.exports.findMatchingMovies = (str) => {
    return db.query(
        `SELECT movies, userid, username, avatar, bg, pic FROM userprofiles WHERE movies ILIKE $1;`,
        ["%" + str + "%"]
    );
};
module.exports.findMatchingBooks = (str) => {
    return db.query(
        `SELECT books, userid, username, avatar, bg, pic FROM userprofiles WHERE books ILIKE $1;`,
        ["%" + str + "%"]
    );
};
module.exports.findMatchingGames = (str) => {
    return db.query(
        `SELECT games, userid, username, avatar, bg, pic FROM userprofiles WHERE games ILIKE $1;`,
        ["%" + str + "%"]
    );
};
