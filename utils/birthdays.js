const Database = require('better-sqlite3');
const db = new Database('./data/birthdays.db');

// init table
db.prepare(`
    CREATE TABLE IF NOT EXISTS birthdays (
        userId TEXT PRIMARY KEY,
        date TEXT NOT NULL
    )
`).run();

function load() {
    return db.prepare(`
        SELECT userId, date FROM birthdays
    `).all().reduce((acc, row) => {
        acc[row.userId] = row.date;
        return acc;
    }, {});
}

function setBirthday(userId, date) {
    db.prepare(`
        INSERT INTO birthdays (userId, date)
        VALUES (?, ?)
        ON CONFLICT(userId) DO UPDATE SET date = excluded.date
    `).run(userId, date);
}

function removeBirthday(userId) {
    db.prepare(`
        DELETE FROM birthdays WHERE userId = ?
    `).run(userId);
}

function getBirthday(userId) {
    return db.prepare(`
        SELECT date FROM birthdays WHERE userId = ?
    `).get(userId);
}

module.exports = {
    load,
    setBirthday,
    removeBirthday,
    getBirthday
};