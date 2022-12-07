require("dotenv").config();

const express = require("express");
const { userInfo } = require("os");
const { stringify } = require("querystring");
const router = express.Router();
const crypto = require("crypto");

const { Users } = require("../models");

const { Op } = require("sequelize");

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
router.post("/signup", async (req, res) => {
  try {
    // 닉네임, 비밀번호, 비밀번호 확인을 request에서 전달받기
    const { nickname, password, confirm } = req.body;

    if (!nickname || !password || !confirm) {
      throw err
    }

    // 비밀번호(password)와 비밀번호확인(confirm) 비교
    // 비밀번호 확인은 비밀번호와 정확하게 일치하기
    if (password !== confirm) {
      return res
        .status(412)
        .json({ errorMessage: "패스워드가 일치하지 않습니다." });
    }

    // 비밀번호는 `최소 4자 이상이며, 닉네임과 같은 값이 포함된 경우 회원가입에 실패`로 만들기
    if (password.length < 4 || password.indexOf(nickname) !== -1) {
      return res
        .status(412)
        .json({ errorMessage: "패스워드 형식이 일치하지 않습니다." });
    }

    //닉네임은 `최소 3자 이상, 알파벳 대소문자(a~z, A~Z), 숫자(0~9)`로 구성하기
    if (!/^(?=.*[a-zA-Z])(?=.*\d).{3,}$/.test(nickname)) {
      return res
        .status(412)
        .json({ errorMessage: "닉네임의 형식이 일치하지 않습니다." });
    }

    //데이터베이스에 존재하는 닉네임을 입력한 채 회원가입 버튼을 누른 경우
    //"중복된 닉네임입니다." 라는 에러메세지를 response에 포함하기
    // Users 테이블에서 nickname 같은 게 있는 지 찾아본다.
    const existsUser = await Users.findAll({
      where: {
        // op.or = 또는
        // [조건] : [{키:값}, {키:값}, {키:값}] 으로 찾아오기
        [Op.or]: [{ nickname: nickname }],
      },
    });
    // existsUser 값이 있는 지 확인해보고 값이 있으면 에러 던지기
    if (existsUser.length !== 0) {
      return res.status(412).json({ errorMessage: "중복된 닉네임입니다." });
    }

    // 비밀번호 암호화. crypto 모듈로 단방향 해시 암호화 진행
    const secretPW = crypto
      .createHash(process.env.PW_KEY)
      .update(password)
      .digest(process.env.INCOD);

    // 비밀번호 확인과 닉네임 중복 체크 완료하면 DB에 정보를 등록 후 결과 내보내주기
    await Users.create({ nickname, password : secretPW });
    res.status(200).json({ message: "회원 가입에 성공하였습니다." });
  } catch (err) {
    res
      .status(400)
      .json({ errorMessage: "요청한 데이터 형식이 올바르지 않습니다." });
  }
});

module.exports = router;
