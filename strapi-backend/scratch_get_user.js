const Database = require('better-sqlite3');
const db = new Database('./.tmp/data.db');

try {
  // Get list of tables
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
  console.log("Tables:", tables.map(t => t.name));

  // Find booking-related tables
  const bookingTables = tables.filter(t => t.name.includes('booking') || t.name.includes('tour'));
  console.log("Booking/Tour Tables:", bookingTables.map(t => t.name));

  // If bookings table exists, query all entries
  const bookingsTable = tables.find(t => t.name === 'bookings');
  if (bookingsTable) {
    const bookings = db.prepare("SELECT * FROM bookings").all();
    console.log("Bookings Count:", bookings.length);
    if (bookings.length > 0) {
      console.log("First booking entry:", JSON.stringify(bookings[0], null, 2));
    }
  } else {
    // Maybe plural or something else? Let's check matching tables
    for (const bt of bookingTables) {
      const count = db.prepare(`SELECT count(*) as count FROM ${bt}`).all()[0].count;
      console.log(`Table ${bt} count:`, count);
      if (count > 0) {
        const rows = db.prepare(`SELECT * FROM ${bt} LIMIT 1`).all();
        console.log(`First row in ${bt}:`, JSON.stringify(rows[0], null, 2));
      }
    }
  }
} catch (err) {
  console.error(err);
} finally {
  db.close();
}
