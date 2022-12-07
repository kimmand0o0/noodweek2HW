module.exports = (err, res) => {
  switch (err) {
    case "DataError":
      res
        .status(400)
        .json({ errorMessage: "요청한 데이터 형식이 올바르지 않습니다." });
      break;

    case "PasswordError":
      res.status(412).json({ errorMessage: "패스워드가 일치하지 않습니다." });
      break;

    case "NicknameCheckError":
      res
        .status(412)
        .json({ errorMessage: "닉네임의 형식이 일치하지 않습니다." });
      break;

    case "NicknameOverlapError":
      res.status(412).json({ errorMessage: "중복된 닉네임입니다." });
      break;

    case "NameOrPwError":
      res
        .status(412)
        .json({ errorMessage: "닉네임 또는 패스워드를 확인해주세요." });
      break;

    case "FailLoginError":
      res.status(400).json({ errorMessage: "로그인에 실패하였습니다." });
      break;

    default:
      res
        .status(400)
        .json({ errorMessage: "요청한 데이터 형식이 올바르지 않습니다." });
      break;
  }
};

// const NicknameCheckError = {
//     name : NicknameCheckError,
//     status : 400,
//     message : "요청한 데이터 형식이 올바르지 않습니다."
// }
// res.status(err.status).json({message : err.message})
