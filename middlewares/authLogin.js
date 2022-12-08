require("dotenv").config();
const jwt = require("jsonwebtoken");

// 로그인 되어 있는 유저일 경우 Error를 반환한다.
module.exports = (req, res, next) => {
  try {
    if (!req.cookies) {
      next();
      return;
    }
    
    const accessToken = req.cookies.accessToken
    const cookies = validateAccessToken(accessToken);

    if (cookies) {
      return res.status(403).send({
        errorMessage: "이미 로그인이 되어있습니다.",
      });
    }
    next();

  } catch (error) {
    return res.status(400).send({
      errorMessage: "잘못된 접근입니다.",
    });
  }
};


// Access Token을 검증합니다.
function validateAccessToken(accessToken) {
    try {
      jwt.verify(accessToken, process.env.KEY); // JWT를 검증합니다.
      return true;
    } catch (error) {
      return false;
    }
  }