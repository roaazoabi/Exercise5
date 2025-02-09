const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './messages.db',
});
const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  senderEmail: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  senderFirstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  senderLastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  date: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  updated_at: {
    type: DataTypes.INTEGER,
    defaultValue: Math.floor(Date.now() / 1000),
  },
}, {
  timestamps: false,
});
sequelize.sync();
module.exports = {
  fetchAll: async () => {
    const messages = await Message.findAll({ order: [['date', 'DESC']] });
    return messages.map(msg => ({
      id: msg.id,
      sender: {
        Email: msg.senderEmail,
        firstName: msg.senderFirstName,
        lastName: msg.senderLastName,
      },
      content: msg.content,
      date: msg.date,
    }));
  },
  addMessage: async (content, user) => {
    const now = new Date();
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const date_time = `${days[now.getDay()]}, ${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}, ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    const message = await Message.create({
      senderEmail: user.Email,
      senderFirstName: user.firstName,
      senderLastName: user.lastName,
      content,
      date: date_time,
      updated_at: Math.floor(Date.now() / 1000),
    });
    return {
      id: message.id,
      sender: {
        Email: user.Email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      content,
      date: date_time,
    };
  },
  searchMessage: async (content) => {
    const messages = await Message.findAll({
      where: {
        content: { [Sequelize.Op.like]: `%${content}%` },
      },
      order: [['date', 'DESC']],
    });
    return messages.map(msg => ({
      id: msg.id,
      sender: {
        Email: msg.senderEmail,
        firstName: msg.senderFirstName,
        lastName: msg.senderLastName,
      },
      content: msg.content,
      date: msg.date,
    }));
  },
  editMessage: async (msg_id, new_content, user) => {
    const message = await Message.findOne({ where: { id: msg_id, senderEmail: user.Email } });
    if (!message) throw new Error('Message not found.');
    const now = new Date();
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const date_time = `${days[now.getDay()]}, ${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}, ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    await message.update({ content: new_content, date: date_time, updated_at: Math.floor(Date.now() / 1000) });
    return {
      id: msg_id,
      sender: {
        Email: user.Email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      content: new_content,
      date: date_time,
    };
  },
  deleteMessage: async (msg_id, user) => {
    const result = await Message.destroy({where:{id: msg_id, senderEmail: user.Email}});
    if (result === 0) throw new Error('Message not found.');
    return { message: 'Message deleted successfully.' };
  },
  getUpdate: async () => {
    const lastUpdated = await Message.max('updated_at');
    return lastUpdated || 0;
  },
};