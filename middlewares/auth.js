const jwt = require("jsonwebtoken");
const { Users } = require("../models");

// 3. 로그인 검사
//  - `아래 API를 제외하고` 모두 로그인 토큰을 전달한 경우만 정상 response를 전달받을 수 있도록 하기
//    - 회원가입 API
//    - 로그인 API
//    - 게시글 목록 조회 API
//    - 게시글 조회 API
//    - 댓글 목록 조회 API
//  - 로그인 토큰을 전달하지 않은 채로 로그인이 필요한 API를 호출한 경우 "로그인이 필요합니다." 라는 에러 메세지를 response에 포함하기
//  - 로그인 토큰을 전달한 채로 로그인 API 또는 회원가입 API를 호출한 경우 "이미 로그인이 되어있습니다."라는 에러 메세지를 response에 포함하기

// module.exports = (req, res, next) => {
//   const { authorization } = req.headers;
//   const [authType, authToken] = (authorization || "").split(" ");

//   if (!authToken || authType !== "Bearer") {
//     res.status(401).send({
//       errorMessage: "로그인 후 이용 가능한 기능입니다.",
//     });
//     return;
//   }

//   try {
//     const { userId } = jwt.verify(process.env.KEY);
//     User.findByPk(userId).then((user) => {
//       res.locals.user = user;
//       next();
//     });
//   } catch (err) {
//     res.status(401).send({
//       errorMessage: "로그인 후 이용 가능한 기능입니다.",
//     });
//   }
// };

module.exports = (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;

  // 토큰이 없을 경우
  if (!refreshToken && !accessToken)
    return res.status(400).json({ message: "로그인이 필요합니다." });

  // validateAccessToken() = 엑세스 토큰 확인
  const isAccessTokenValidate = validateAccessToken(accessToken);
  const isRefreshTokenValidate = validateRefreshToken(refreshToken);

  // 리프레시 토큰이 없을 경우
  if (!isRefreshTokenValidate)
    return res.status(419).json({ message: "로그인이 필요합니다." });

  // AccessToken을 확인 했을 때 만료일 경우
  if (!isAccessTokenValidate) {
    const accessTokenId = tokenObject[refreshToken];
    if (!accessTokenId)
      return res.status(419).json({ message: "로그인이 필요합니다." });
    // 새로운 엑세스 토큰을 만들어준다.
    const newAccessToken = createAccessToken(accessTokenId);
    return res.cookie("accessToken", newAccessToken);
  }
  next();
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

// Refresh Token을 검증합니다.
function validateRefreshToken(refreshToken) {
  try {
    jwt.verify(refreshToken, process.env.KEY); // JWT를 검증합니다.
    return true;
  } catch (error) {
    return false;
  }
}

// Access Token의 Payload를 가져옵니다.
function getAccessTokenPayload(accessToken) {
  try {
    const payload = jwt.verify(accessToken, process.env.KEY); // JWT에서 Payload를 가져옵니다.
    return payload;
  } catch (error) {
    return null;
  }
}
