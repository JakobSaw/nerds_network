DROP TABLE IF EXISTS userprofiles;

CREATE TABLE userprofiles (
    userid VARCHAR PRIMARY KEY,
    username VARCHAR NOT NULL,
    introduction VARCHAR,
    studies VARCHAR,
    university VARCHAR,
    workplace VARCHAR,
    idea VARCHAR,
    superpower VARCHAR,
    interests VARCHAR,
    movies VARCHAR,
    books VARCHAR,
    games VARCHAR,
    avatar VARCHAR,
    bg VARCHAR,
    pic VARCHAR,
    created_At TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);