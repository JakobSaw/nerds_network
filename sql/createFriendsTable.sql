DROP TABLE IF EXISTS friends;

CREATE TABLE friends (
    id SERIAL PRIMARY KEY,
    senderid VARCHAR NOT NULL,
    sendername VARCHAR NOT NULL,
    senderavatar VARCHAR NOT NULL,
    senderbg VARCHAR NOT NULL,
    senderpic VARCHAR NOT NULL,
    receiverid VARCHAR NOT NULL,
    receivername VARCHAR NOT NULL,
    receiveravatar VARCHAR NOT NULL,
    receiverbg VARCHAR NOT NULL,
    receiverpic VARCHAR NOT NULL,
    accepted BOOLEAN NOT NULL,
    created_At TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);