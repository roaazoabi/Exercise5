const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './users.db'
});
const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    Email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'users',
    timestamps: false
});
sequelize.sync();
module.exports = {
    getUsers: async () => {
        try {
            const users = await User.findAll();
            return users.map(user => ({
                Email: user.Email,
                firstName: user.firstName,
                lastName: user.lastName,
                Password: user.password
            }));
        } 
        catch (error) {
            throw error;
        }
    },
    addUser: async (user) => {
        try {
            const newUser = await User.create({
                Email: user.Email,
                firstName: user.firstName,
                lastName: user.lastName,
                password: user.Password
            });
            return {
                Email: newUser.Email,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                Password: newUser.password
            };
        } 
        catch (error) {
            throw error;
        }
    }
};