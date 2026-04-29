const Usage = require('../models/Usage');

const DAILY_LIMIT = 3;

function getToday() {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

async function checkAndIncrement(ip) {
  const today = getToday();

  let doc = await Usage.findOne({ ip, date: today });

  if (!doc) {
    doc = new Usage({ ip, date: today, count: 1 });
    await doc.save();
    return { allowed: true, remaining: DAILY_LIMIT - 1 };
  }

  if (doc.count >= DAILY_LIMIT) {
    return { allowed: false, remaining: 0 };
  }

  doc.count += 1;
  await doc.save();

  return { allowed: true, remaining: DAILY_LIMIT - doc.count };
}

module.exports = { checkAndIncrement };