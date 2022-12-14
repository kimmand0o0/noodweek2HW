const express = require("express");
const router = express.Router();

const authLogin = require("../middlewares/authLogin")

const SignupController = require('../controller/signup.controller');
const signupController = new SignupController()

// 1. 회원 가입 API
//   닉네임은 `최소 3자 이상, 알파벳 대소문자(a~z, A~Z), 숫자(0~9)`로 구성하기
//   비밀번호는 `최소 4자 이상이며, 닉네임과 같은 값이 포함된 경우 회원가입에 실패`로 만들기
//   비밀번호 확인은 비밀번호와 정확하게 일치하기
//   닉네임, 비밀번호, 비밀번호 확인을 request에서 전달받기
//   데이터베이스에 존재하는 닉네임을 입력한 채 회원가입 버튼을 누른 경우 "중복된 닉네임입니다." 라는 에러메세지를 response에 포함하기
// {  "nickname": "Developer",  "password": "1234",  "confirm": "1234"}

//==================================
//
//        sign up - 회원가입
//
//==================================
router.post("/", authLogin, signupController.CreateUser)

module.exports = router;
