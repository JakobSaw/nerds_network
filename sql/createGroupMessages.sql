DROP TABLE IF EXISTS group_messages;

CREATE TABLE group_messages (
    id SERIAL PRIMARY KEY,
    senderid VARCHAR NOT NULL,
    sendername VARCHAR NOT NULL,
    group_name VARCHAR NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);