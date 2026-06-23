const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '../data/nicknames.json');

/* =========================
   SAFE LOAD (NO CRASH)
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
   SAVE
========================= */
function save(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

/* =========================
   SET
========================= */
function set(id, value) {
  const db = load();
  db[id] = value;
  save(db);
}

/* =========================
   REMOVE
========================= */
function remove(id) {
  const db = load();
  delete db[id];
  save(db);
}

module.exports = { load, set, remove };