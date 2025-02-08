// const sqlite3 = require('sqlite3').verbose();
// const db = new sqlite3.Database('./messages.db');
// db.serialize(() => {
//   db.run(`CREATE TABLE IF NOT EXISTS messages (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     senderEmail TEXT,
//     senderFirstName TEXT,
//     senderLastName TEXT,
//     content TEXT,
//     date TEXT
//   )`);
// });

// module.exports = {
//   fetchAll: () => {
//     return new Promise((resolve, reject) => {
//       db.all("SELECT * FROM messages ORDER BY date DESC", (err, rows) => {
//         if (err)
//           reject(err);
//         const messages = rows.map(row => ({
//           id: row.id,
//           sender: {
//             Email: row.senderEmail,
//             firstName: row.senderFirstName,
//             lastName: row.senderLastName
//           },
//           content: row.content,
//           date: row.date
//         }));
//         resolve(messages);
//       });
//     });
//   },
//   addMessage: (content, user) => {
//     return new Promise((resolve, reject) => {
//       const now = new Date();
//       const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
//       const date_time = `${days[now.getDay()]}, ${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}, ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
//       const query = "INSERT INTO messages (senderEmail, senderFirstName, senderLastName, content, date) VALUES (?, ?, ?, ?, ?)";
//       db.run(query, [user.Email, user.firstName, user.lastName, content, date_time], function(err) {
//         if (err)
//           reject(err);
//         resolve({
//           id: this.lastID,
//           sender: {
//             Email: user.Email,
//             firstName: user.firstName,
//             lastName: user.lastName
//           },
//           content: content,
//           date: date_time
//         });
//       });
//     });
//   },
//   searchMessage: (content) => {
//     return new Promise((resolve, reject) => {
//       const query = "SELECT * FROM messages WHERE content LIKE ? ORDER BY date DESC";
//       db.all(query, [`%${content}%`], (err, rows) => {
//         if (err)
//           reject(err);
//         const messages = rows.map(row => ({
//           id: row.id,
//           sender: {
//             Email: row.senderEmail,
//             firstName: row.senderFirstName,
//             lastName: row.senderLastName
//           },
//           content: row.content,
//           date: row.date
//         }));
//         resolve(messages);
//       });
//     });
//   },
//   editMessage: (msg_id, new_content, user) => {
//     return new Promise((resolve, reject) => {
//       const now = new Date();
//       const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
//       const date_time = `${days[now.getDay()]}, ${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}, ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
//       const query = "UPDATE messages SET content = ?, date = ? WHERE id = ? AND senderEmail = ?";
//       db.run(query, [new_content, date_time, msg_id, user.Email], function(err) {
//         if (err)
//           reject(err);
//         if (this.changes === 0)
//           reject('Message not found or you are not authorized to edit it.');
        
//         resolve({
//           id: msg_id,
//           sender: {
//             Email: user.Email,
//             firstName: user.firstName,
//             lastName: user.lastName
//           },
//           content: new_content,
//           date: date_time
//         });
//       });
//     });
//   },
//   deleteMessage: (msg_id, user) => {
//     return new Promise((resolve, reject) => {
//       const query = "DELETE FROM messages WHERE id = ? AND senderEmail = ?";
//       db.run(query, [msg_id, user.Email], function(err) {
//         if (err)
//           reject(err);
//         if (this.changes === 0) {
//           reject('Message not found or you are not authorized to delete it.');
//         }
//         resolve({ message: 'Message deleted successfully.' });
//       });
//     });
//   },
//   getUpdate: () => {
//     var result = 0;
//       db.get("SELECT MAX(updated_at) as lastUpdated FROM messages", (err, row) => {
//         if (!err && row)
//           result = row.lastUpdated || 0;
//     });
//     return result;
//   }
// };
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./messages.db');
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    senderEmail TEXT,
    senderFirstName TEXT,
    senderLastName TEXT,
    content TEXT,
    date TEXT,
    updated_at INTEGER DEFAULT (strftime('%s', 'now')) -- Store timestamp
  )`);
});

module.exports = {
  fetchAll: () => {
    return new Promise((resolve, reject) => {
      db.all("SELECT * FROM messages ORDER BY date DESC", (err, rows) => {
        if (err) reject(err);
        const messages = rows.map(row => ({
          id: row.id,
          sender: {
            Email: row.senderEmail,
            firstName: row.senderFirstName,
            lastName: row.senderLastName
          },
          content: row.content,
          date: row.date
        }));
        resolve(messages);
      });
    });
  },

  addMessage: (content, user) => {
    return new Promise((resolve, reject) => {
      const now = new Date();
      const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const date_time = `${days[now.getDay()]}, ${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}, ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
      
      const query = "INSERT INTO messages (senderEmail, senderFirstName, senderLastName, content, date, updated_at) VALUES (?, ?, ?, ?, ?, strftime('%s', 'now'))";
      db.run(query, [user.Email, user.firstName, user.lastName, content, date_time], function(err) {
        if (err) reject(err);
        resolve({
          id: this.lastID,
          sender: {
            Email: user.Email,
            firstName: user.firstName,
            lastName: user.lastName
          },
          content: content,
          date: date_time
        });
      });
    });
  },

  searchMessage: (content) => {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM messages WHERE content LIKE ? ORDER BY date DESC";
      db.all(query, [`%${content}%`], (err, rows) => {
        if (err) reject(err);
        const messages = rows.map(row => ({
          id: row.id,
          sender: {
            Email: row.senderEmail,
            firstName: row.senderFirstName,
            lastName: row.senderLastName
          },
          content: row.content,
          date: row.date
        }));
        resolve(messages);
      });
    });
  },

  editMessage: (msg_id, new_content, user) => {
    return new Promise((resolve, reject) => {
      const now = new Date();
      const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const date_time = `${days[now.getDay()]}, ${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}, ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
      
      const query = "UPDATE messages SET content = ?, date = ?, updated_at = strftime('%s', 'now') WHERE id = ? AND senderEmail = ?";
      db.run(query, [new_content, date_time, msg_id, user.Email], function(err) {
        if (err) reject(err);
        if (this.changes === 0) reject('Message not found or you are not authorized to edit it.');

        resolve({
          id: msg_id,
          sender: {
            Email: user.Email,
            firstName: user.firstName,
            lastName: user.lastName
          },
          content: new_content,
          date: date_time
        });
      });
    });
  },

  deleteMessage: (msg_id, user) => {
    return new Promise((resolve, reject) => {
      const query = "DELETE FROM messages WHERE id = ? AND senderEmail = ?";
      db.run(query, [msg_id, user.Email], function(err) {
        if (err) reject(err);
        if (this.changes === 0) reject('Message not found.');
        resolve({ message: 'Message deleted successfully.' });
      });
    });
  },

  getUpdate: () => {
    return new Promise((resolve, reject) => {
      db.get("SELECT MAX(updated_at) as lastUpdated FROM messages", (err, row) => {
        if (err) reject(err);
        resolve(row?.lastUpdated || 0);
      });
    });
  }
};
