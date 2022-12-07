require("dotenv").config();

const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const { Users } = require("../models");

// 2. 로그인 API
// 닉네임, 비밀번호를 request에서 전달받기
// 로그인 버튼을 누른 경우 닉네임과 비밀번호가 데이터베이스에 등록됐는지 확인한 뒤,
// 하나라도 맞지 않는 정보가 있다면"닉네임 또는 패스워드를 확인해주세요."라는 에러 메세지를 response에 포함하기
// 로그인 성공 시 로그인 토큰을 클라이언트에게 Cookie로 전달하기

// {  "nickname": "Developer",  "password": "1234"}

//==================================
//
//          Login - 로그인
//
//==================================
router.post("/login", async (req, res) => {
  try {
    //닉네임, 비밀번호를 request에서 전달받기
    const { nickname, password } = req.body;

    // 다시 암호화 해준 후 비교한다.
    const secretPW = crypto
      .createHash(process.env.PW_KEY)
      .update(password)
      .digest(process.env.INCOD);

    // 입력한 닉네임과 일치하는 유저 정보를 DB에서 가져 찾아보기
    const existsUser = await Users.findOne({
      where: {
        nickname,
        password: secretPW,
      },
    });

    // 로그인 버튼을 누른 경우 닉네임과 비밀번호가 데이터베이스에 등록됐는지 확인한 뒤,
    // 하나라도 맞지 않는 정보가 있다면 "닉네임 또는 패스워드를 확인해주세요."라는 에러 메세지를 response에 포함하기
    if (!existsUser) {
      return res
        .status(412)
        .json({ errorMessage: "닉네임 또는 패스워드를 확인해주세요." });
    }

    // 로그인 성공 시 로그인 토큰을 클라이언트에게 Cookie로 전달하기
    //tokenObject[refreshToken] = id; // Refresh Token을 가지고 해당 유저의 정보를 서버에 저장합니다.
    const accessToken = createAccessToken(existsUser.userId)
    res.cookie("accessToken", accessToken); // Access Token을 Cookie에 전달한다.
    res.cookie("refreshToken", createRefreshToken()); // Refresh Token을 Cookie에 전달한다.

    return res
      .status(200)
      .json({ token : accessToken });
  } catch (err) {
    res.status(400).send({ errorMessage: "로그인에 실패하였습니다." });
  }
});

function createAccessToken(userId) {
  const accessToken = jwt.sign(
    { userId },
    process.env.KEY, // 시크릿 키
    { expiresIn: "10m" } // 유효 시간
  );

  return accessToken;
}

// Refresh Token을 생성합니다.
function createRefreshToken() {
  const refreshToken = jwt.sign(
    {}, // JWT 데이터z
    process.env.KEY, // 시크릿 키
    { expiresIn: "7d" } // Refresh Token이 7일 뒤에 만료되도록 설정합니다.
  );

  return refreshToken;
}

module.exports = router;
