const UserService = require("../service/user.service");
const errorCheck = require("../middlewares/errorCheck");

let tokenObject = {}

class LoginController {
    userService = new UserService();

  Login = async (req, res) => {
    try {
      const { nickname, password } = req.body;

      const existsUser = await this.userService.existsUser(nickname, password);

      const accessToken = this.userService.createAccessToken(existsUser.userId);
      const refreshToken = this.userService.createRefreshToken();
      tokenObject[refreshToken] = existsUser.userId;

      res.cookie("accessToken", accessToken); // Access Token을 Cookie에 전달한다.
      res.cookie("refreshToken", refreshToken); // Refresh Token을 Cookie에 전달한다.

      return res.status(200).json({ token: accessToken });
    } catch (err) {
      errorCheck(err, res);
      return;
    }
  };
}

module.exports = { LoginController, tokenObject }
