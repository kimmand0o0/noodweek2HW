const UserService = require("../service/user.service");
const errorCheck = require("../middlewares/errorCheck");

class SignupController {
  userService = new UserService();

  CreateUser = async (req, res) => {
    try {
      const { nickname, password, confirm } = req.body;
      await this.userService.checkBody(nickname, password, confirm);
      await this.userService.findUser(nickname);
      await this.userService.createUser(nickname, password);
      return res.status(200).json({ message: "회원 가입에 성공하였습니다." });
    } catch (err) {
      return errorCheck(err, res);
    }
  };
}

module.exports = SignupController;
