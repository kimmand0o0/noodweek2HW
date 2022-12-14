const express = require("express");
const router = express.Router();

const authLogin = require("../middlewares/authLogin")
const { LoginController } = require("../controller/login.controller")
const loginController = new LoginController()

let tokenObject = {}

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
router.post("/", authLogin, loginController.Login );





module.exports = router
