const { Users } = require("../models");
const { Op } = require("sequelize");

class UserRepository {
  createUser = async (nickname, password) => {
    return Users.create({ nickname, password });
  };

  findUser = async (nickname) => {
    return Users.findAll({ raw: true, where: { [Op.or]: [{ nickname }] } });
  };

  existsUser = async (nickname, password) => {
    const User = await Users.findOne({
      raw: true,
      where: { [Op.and]: [{ nickname} ,{password}] },
    });
    return User;
  };
}

module.exports = UserRepository;
