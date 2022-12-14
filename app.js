require("dotenv").config();

const express = require("express");
const app = express();


const { tokenObject } = require('./controller/login.controller')

app.use(express.json());
console.log("body-parser 준비 완료 XD");

//쿠키토큰을 위하여 사용
const cookieParser = require("cookie-parser");
app.use(cookieParser());
console.log("cookie-parser 준비 완료 >)");

app.set("port", process.env.PORT || 8080);

//메인화면 설정
app.get("/", (req, res) => {
  res.send("안녕하세요, 항해99 10기 E반 김혜란 입니다.");
});

//라우터 연결 해줌
app.use("/api", require("./routes/index"));

app.use((error, req, res, next) => {
  res
    .status(400)
    .json({ message: "데이터 형식이 올바르지 않습니다." });
});

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기 중");
});
