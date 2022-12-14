module.exports = (err, res) => {
  console.log(err);
  switch (err) {
    case "DataError":
      return res
        .status(400)
        .json({ errorMessage: "요청한 데이터 형식이 올바르지 않습니다." });

    case "PasswordError":
      return res
        .status(412)
        .json({ errorMessage: "패스워드가 일치하지 않습니다." });

    case "NicknameCheckError":
      return res
        .status(412)
        .json({ errorMessage: "닉네임의 형식이 일치하지 않습니다." });

    case "PasswordCheckError":
      return res
        .status(412)
        .json({ errorMessage: "패스워드 형식이 일치하지 않습니다." });

    case "NicknameOverlap":
      return res.status(412).json({ errorMessage: "중복된 닉네임입니다." });

    case "NameOrPwError":
      return res
        .status(412)
        .json({ errorMessage: "닉네임 또는 패스워드를 확인해주세요." });

    case "FailLoginError":
      return res.status(400).json({ errorMessage: "로그인에 실패하였습니다." });

    case "FailLikeLookup":
      return res
        .status(400)
        .json({ errorMessage: "좋아요 게시글 조회에 실패하였습니다." });

    case "FailPostLookup":
      return res.status(404).json({ msg: "게시글 조회에 실패하였습니다." });

    case "PostingDataError":
      return res
        .status(412)
        .json({ message: "데이터 형식이 올바르지 않습니다." });

    case "PostingError":
      return res.status(400).json({ msg: "게시글 작성에 실패하였습니다." });

    case "FailPostModify":
      return res.status(400).json({ msg: "게시글 수정에 실패하였습니다." });

    case "FailDeletePost":
      return res
        .status(400)
        .json({ msg: "게시글이 정상적으로 삭제되지 않았습니다." });

    case "NotExistPost":
      return res.status(404).json({ msg: "게시글이 존재하지 않습니다." });

    case "FailPostLike":
      return res.status(400).json({ msg: "게시글 좋아요에 실패하였습니다." });

    case "CreatePostLike":
      return res
        .status(200)
        .json({ message: "게시글의 좋아요를 등록하였습니다." });

    case "DeletePostLike" : 
      return res.status(200).json({ message: "게시글의 좋아요를 취소하였습니다." });

      case "ExistComment" : 
      return res.status(412).json({ msg: "댓글 내용을 입력해주세요" });

      case "FailCreateComment" :
        return res.status(400).json({ msg: "댓글 작성에 실패하였습니다." });

        case "IsComment" :
          return res.status(404).json({ msg: "댓글이 존재하지 않습니다." });

          case "FailUpdateComment" : 
          return res.status(400).json({ msg: "댓글 수정에 실패하였습니다." });

          case "FailDeleteComment" : 
          return res.status(400).json({ msg: "댓글 삭제에 실패하였습니다." });


    default:
      return res
        .status(400)
        .json({ errorMessage: "요청한 데이터 형식이 올바르지 않습니다." });
  }
};
