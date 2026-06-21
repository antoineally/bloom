const fs = require("fs");
const path = require("path");

const DB_PATH = path.join(__dirname, "../data/birthdays.json");

/* ================= LOAD ================= */
function loadBirthdays() {
  try {
    if (!fs.existsSync(DB_PATH)) return {};

    const raw = fs.readFileSync(DB_PATH, "utf8");
    return JSON.parse(raw || "{}");
  } catch (err) {
    console.error("Load error:", err);
    return {};
  }
}

/* ================= SAVE ================= */
function saveBirthdays(data) {
  try {
    const tmpPath = DB_PATH + ".tmp";

    fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2));
    fs.renameSync(tmpPath, DB_PATH);
  } catch (err) {
    console.error("Save error:", err);
  }
}

/* ================= ADD ================= */
function addBirthday(userId, date) {
  const db = loadBirthdays();

  db[userId] = {
    date,
    updatedAt: Date.now(),
  };

  saveBirthdays(db);
}

/* ================= GET ================= */
function getBirthday(userId) {
  const db = loadBirthdays();
  return db[userId] || null;
}

/* ================= OPTIONAL DELETE ================= */
function deleteBirthday(userId) {
  const db = loadBirthdays();

  if (!db[userId]) return false;

  delete db[userId];
  saveBirthdays(db);
  return true;
}

module.exports = {
  loadBirthdays,
  saveBirthdays,
  addBirthday,
  getBirthday,
  deleteBirthday,
};