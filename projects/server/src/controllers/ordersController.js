// Import Sequelize
const { sequelize } = require("../../models");
const { Op } = require("sequelize");

// Import models
const db = require("../../models/index");
const user_addresses = db.user_addresses;
const users = db.users;
const orders = db.orders;

const request = require("request");

module.exports = {
    createOrder: async (req, res) => {
        const t = await sequelize.transaction();

        try {
            
        } catch (error) {
            
        }
    },

}