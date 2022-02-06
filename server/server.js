const express = require("express"),
    app = express(),
    compression = require("compression"),
    path = require("path"),
    cookieSession = require("cookie-session"),
    { hash, compare } = require("./bc"),
    crypto = require("crypto"),
    {
        addUser,
        findUserViaMail,
        findUserViaUsername,
        addUserProfile,
        findUserProfile,
        findMatchingUsers,
        findMatchingStudies,
        findMatchingUniversities,
        findMatchingWorkplaces,
        findMatchingIdeas,
        findMatchingSuperpowers,
        findMatchingInterests,
        findMatchingMovies,
        findMatchingBooks,
        findMatchingGames,
        addFriend,
        findFriends,
        deleteFriend,
        addFriendRequest,
        updateSenderFriends,
        updateReceiverFriends,
        getChatMessages,
        addChatMessage,
        getGroupMessages,
        addGroupMessage,
    } = require("./db"),
    multer = require("multer"),
    uidSafe = require("uid-safe"),
    diskStorage = multer.diskStorage({
        destination: function (req, file, callback) {
            callback(null, path.join(__dirname, "uploads"));
        },
        filename: function (req, file, callback) {
            uidSafe(24).then(function (uid) {
                callback(null, uid + path.extname(file.originalname));
            });
        },
    }),
    uploader = multer({
        storage: diskStorage,
        limits: {
            fileSize: 2097152,
        },
    }),
    aws = require("aws-sdk"),
    fs = require("fs");
// Deploy

// Middleware
app.use(compression());
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "client", "public")));
if (process.env.NODE_ENV == "production") {
    app.use((req, res, next) => {
        if (req.headers["x-forwarded-proto"].startsWith("https")) {
            return next();
        }
        res.redirect(`https://${req.hostname}${req.url}`);
    });
}
app.use((req, res, next) => {
    res.setHeader("x-frame-options", "deny");
    next();
});
app.use(express.urlencoded({ extended: false }));
//

// Socket
const server = require("http").Server(app);
const io = require("socket.io")(server, {
    allowRequest: (req, callback) =>
        callback(
            null,
            req.headers.referer.startsWith("http://localhost:3000") ||
                req.headers.referer.startsWith(
                    "https://nerdnetwork.herokuapp.com/"
                ) ||
                req.headers.referer.startsWith(
                    "https://wwww.nerdnetwork.herokuapp.com/"
                )
        ),
});
//

// Cookie Session
let sessionSecret;
if (process.env.NODE_ENV == "production") {
    sessionSecret = process.env.SESSION_SECRET;
} else {
    sessionSecret = require("./secrets.json").SESSION_SECRET;
}
const cookieSessionMiddleware = cookieSession({
    secret: sessionSecret,
    maxAge: 1000 * 60 * 60 * 24 * 14,
    sameSite: true,
});
app.use(cookieSessionMiddleware);
io.use(function (socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});
//

// Onboarding
app.get("/checkCookie", function (req, res) {
    res.json({
        user: req.session.user,
    });
});
app.post("/registration", async (req, res) => {
    if (!req.body) {
        return res.sendStatus(500);
    }
    const { username, email, password } = req.body;
    // Create ID
    const id = crypto.randomBytes(4).toString("hex");
    // Hash the Password
    const hashedPassord = await hash(password);
    try {
        await addUser(id, username, email, hashedPassord.hash);
        req.session.user = {
            id,
            username,
            email,
        };
        return res.json({ success: true });
    } catch (err) {
        res.json(err);
    }
});
app.post("/login", async (req, res) => {
    if (!req.body) {
        return res.sendStatus(500);
    }
    const { userinfo, password } = req.body;
    // get User from info
    let foundUser;
    if (userinfo.includes("@")) {
        foundUser = await findUserViaMail(userinfo);
    } else {
        foundUser = await findUserViaUsername(userinfo);
    }
    if (!foundUser.rows.length) {
        return res.json({ notfound: true });
    } else {
        // Compare Passwords
        const compared = await compare(password, foundUser.rows[0].password);
        if (!compared) {
            return res.json({ wrongpassword: true });
        } else {
            req.session.user = {
                id: foundUser.rows[0].userid,
                username: foundUser.rows[0].username,
                email: foundUser.rows[0].email,
            };
            res.json({ success: true });
        }
    }
});
app.get("/logout", (req, res) => {
    req.session.user = null;
    res.json({ success: true });
});
//

// Profile
app.post("/updateprofile", async (req, res) => {
    const {
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
    } = req.body;
    const updateUserProfile = await addUserProfile(
        req.session.user.id,
        req.session.user.username,
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
        avatar || "noAvatar",
        bg,
        pic || "noPic"
    );
    if (!updateUserProfile) {
        return res.json({ success: false });
    } else {
        res.json({ success: true });
    }
});
app.get("/getprofile", async (req, res) => {
    const { userid } = req.query;
    const profile = await findUserProfile(userid);
    if (!profile.rows.length) {
        return res.json({ notfound: true });
    } else {
        res.json(profile.rows[0]);
    }
});
app.get("/results", async (req, res) => {
    const { str } = req.query;
    let all = [];
    const userResults = await findMatchingUsers(str);
    const studiesResults = await findMatchingStudies(str);
    const universityResults = await findMatchingUniversities(str);
    const workplaceResults = await findMatchingWorkplaces(str);
    const ideaResults = await findMatchingIdeas(str);
    const superpowerResults = await findMatchingSuperpowers(str);
    const interestsResults = await findMatchingInterests(str);
    const moviesResults = await findMatchingMovies(str);
    const booksResults = await findMatchingBooks(str);
    const gamesResults = await findMatchingGames(str);
    all = [
        ...all,
        ...userResults.rows,
        ...studiesResults.rows,
        ...universityResults.rows,
        ...workplaceResults.rows,
        ...ideaResults.rows,
        ...superpowerResults.rows,
        ...interestsResults.rows,
        ...moviesResults.rows,
        ...booksResults.rows,
        ...gamesResults.rows,
    ];
    // console.log(all);
    res.json(all);
});
app.post("/uploadpic", uploader.single("file"), async (req, res) => {
    let secrets;
    if (process.env.NODE_ENV == "production") {
        secrets = process.env;
    } else {
        secrets = require("./secrets");
    }

    const s3 = new aws.S3({
        accessKeyId: secrets.AWS_KEY || process.env.AWS_KEY,
        secretAccessKey: secrets.AWS_SECRET || process.env.AWS_SECRET,
    });

    const { filename, mimetype, size, path } = req.file;

    const promise = s3
        .putObject({
            Bucket: "spicedling",
            ACL: "public-read",
            Key: filename,
            Body: fs.createReadStream(path),
            ContentType: mimetype,
            ContentLength: size,
        })
        .promise();

    promise
        .then(() => {
            res.json(`https://s3.amazonaws.com/spicedling/${filename}`);
        })
        .catch((err) => {
            // uh oh
            console.log(err);
        });
});
//

// Friends
app.get("/get/myprofile", async (req, res) => {
    const { id } = req.session.user;
    try {
        const friends = await findFriends(id);
        return res.json({
            success: true,
            friends: friends.rows,
        });
    } catch (err) {
        res.json(err);
    }
});
app.get("/get/nerdprofile", async (req, res) => {
    const { userid } = req.query;
    try {
        const profile = await findUserProfile(userid);
        const friends = await findFriends(userid);
        return res.json({
            success: true,
            profile: profile.rows,
            friends: friends.rows,
        });
    } catch (err) {
        res.json(err);
    }
});
app.post("/add/request", async (req, res) => {
    const {
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
    } = req.body;
    try {
        await addFriendRequest(
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
        );
        return res.json({ success: true });
    } catch (err) {
        res.json(err);
    }
});
app.get("/add/friend", async (req, res) => {
    const { senderid, receiverid } = req.query;
    const { id } = req.session.user;
    try {
        if (senderid === id) {
            // I was the Sender
            await addFriend(receiverid, id);
        } else {
            // I was NOT the Sender
            await addFriend(id, senderid);
        }
        return res.json({ success: true });
    } catch (err) {
        res.json(err);
    }
});
app.get("/delete", async (req, res) => {
    const { senderid, receiverid } = req.query;
    const { id } = req.session.user;
    try {
        if (senderid === id) {
            // I was the Sender
            await deleteFriend(receiverid, id);
        } else {
            // I was NOT the Sender
            await deleteFriend(id, senderid);
        }
        return res.json({ success: true });
    } catch (err) {
        res.json(err);
    }
});
app.post("/update", async (req, res) => {
    const { avatar, bg, pic, id } = req.body;
    console.log("req.body :>> ", req.body);
    try {
        await updateSenderFriends(avatar, bg, pic, id);
        await updateReceiverFriends(avatar, bg, pic, id);
        return res.json({ success: true });
    } catch (err) {
        res.json(err);
    }
});
//

// Application
app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});
server.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
//

// Socket Connection
io.on("connection", async function (socket) {
    // Safety Check
    if (!socket.request.session.user.id) {
        return socket.disconnect(true);
    }
    //

    const myId = socket.request.session.user.id;

    // Get all Friends
    let allFriendsIds = [];
    const allFriends = await findFriends(myId);
    if (allFriends.rows.length > 0) {
        allFriends.rows.forEach((current) => {
            if (current.senderid !== myId) {
                allFriendsIds.push(current.senderid);
            } else if (current.receiverid !== myId) {
                allFriendsIds.push(current.receiverid);
            }
        });
    }
    let allMessages = [];
    if (allFriendsIds.length > 0) {
        allFriendsIds.forEach(async (current, i) => {
            const allMessagesFromCurrent = await getChatMessages(current, myId);
            if (allMessagesFromCurrent.rows.length > 0) {
                allMessages = [...allMessages, ...allMessagesFromCurrent.rows];
            }
            if (i + 1 === allFriendsIds.length) {
                socket.emit("chatMessages", allMessages);
            }
        });
    }

    // Get all GroupMessages
    const allGroupMessages = await getGroupMessages();
    if (allGroupMessages.rows.length > 0) {
        socket.emit("groupMessages", allGroupMessages.rows);
    }

    // onNewChatMessage
    socket.on("newChatMessage", async ({ senderid, receiverid, message }) => {
        // add message to DB
        try {
            await addChatMessage(senderid, receiverid, message);
        } catch (err) {
            console.log("Error", err);
        }
        // emit to all connected clients
        io.emit("newChatMessage", { senderid, receiverid, message });
    });

    // onNewGroupMessage
    socket.on(
        "newGroupMessage",
        async ({ senderid, sendername, group_name, message }) => {
            // Add to DB
            try {
                await addGroupMessage(
                    senderid,
                    sendername,
                    group_name,
                    message
                );
            } catch (err) {
                console.log("Error", err);
            }
            // Emit to all connected Clients
            io.emit("newGroupMessage", {
                senderid,
                sendername,
                group_name,
                message,
            });
        }
    );
    //
});
//
