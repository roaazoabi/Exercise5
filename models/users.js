const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./users.db');
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    Email TEXT UNIQUE,
    firstName TEXT,
    lastName TEXT,
    password TEXT
  )`);
});

module.exports = {
  getUsers: () => {
    return new Promise((resolve, reject) => {
      db.all("SELECT * FROM users", (err, rows) => {
        if (err) {
          reject(err);
        } 
        else {
          const users = rows.map(row => ({
            Email: row.Email,
            firstName: row.firstName,
            lastName: row.lastName,
            Password: row.password,
          }));
          resolve(users);
        }
      });
    });
  },
  addUser: (user) => {
    return new Promise((resolve, reject) => {
      const query = "INSERT INTO users (Email, firstName, lastName, password) VALUES (?, ?, ?, ?)";
      db.run(query, [user.Email, user.firstName, user.lastName, user.Password], function(err) {
        if (err) {
          reject(err);
        } 
        else {
          resolve({
            Email: user.Email,
            firstName: user.firstName,
            lastName: user.lastName,
            Password: user.Password
          });
        }
      });
    });
  }
};