require('dotenv').config()

const express = require("express");
const app = express();

//Router 불러오기
const router = express.Router();

app.use(express.json());
console.log("body-parser 준비 완료 XD")

//쿠키토큰을 위하여 사용
const cookieParser = require('cookie-parser')
app.use(cookieParser());
console.log("cookie-parser 준비 완료 >)")

app.set('port', process.env.PORT || 8080);

//메인화면 설정
app.get('/', (req, res) => {
    res.send('안녕하세요, 항해99 10기 E반 김혜란 입니다.')
  })

//라우터 연결 해줌
app.use('/api', require('./routes/signup'))
app.use('/api', require('./routes/login'))
app.use('/api', require('./routes/post'))
app.use('/api', require('./routes/comment'))
// app.use('/api', require('./routes/postLike'))
// app.use('/api', require('./routes/commentLike'))

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중')
  })