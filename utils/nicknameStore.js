const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '../data/nicknames.json');

/* =========================
   MEMORY DB
========================= */
let db = load();

/* =========================
   LOAD FROM FILE
========================= */
function load() {
    try {
        if (!fs.existsSync(FILE)) return {};

        const data = fs.readFileSync(FILE, 'utf8');

        if (!data || data.trim() === '') return {};

        return JSON.parse(data);
    } catch (err) {
        console.error("⚠️ JSON corrupted → resetting file");
        fs.writeFileSync(FILE, '{}');
        return {};
    }
}

/* =========================
   SAVE TO FILE
========================= */
function save() {
    fs.writeFileSync(FILE, JSON.stringify(db, null, 2));
}

/* =========================
   GET ALL DATA
========================= */
function getAll() {
    return db;
}

/* =========================
   SET ENTRY
========================= */
function set(id, value) {
    db[id] = value;
    save();
}

/* =========================
   REMOVE ENTRY
========================= */
function remove(id) {
    delete db[id];
    save();
}

/* =========================
   OPTIONAL MANUAL RELOAD
========================= */
function reload() {
    db = load();
    return db;
}

module.exports = {
    getAll,
    set,
    remove,
    reload
};
