const express = require("express");
const router = express.Router();

const { Comments } = require("../models");
const { Posts } = require("../models");
const { Users } = require("../models");

const auth = require("../middlewares/auth");
const jwt = require("jsonwebtoken");

// 5.댓글 작성 API
// {  "comment": "안녕하세요 댓글입니다."}
//==================================
//
//            댓글 생성
//
//==================================
// 게시글 작성 라우터 만들기
router.post("/comments/:postId", auth, async (req, res) => {
  try {
    let { postId } = req.params;
    const { userId, nickname } = res.locals.user
    const { comment } = req.body;

    // id 정보에 맞는 게시글을 가져온다.
    const post = await Posts.findOne({ where: { postId } });

    // 게시글을 찾지 못할 경우
    if (post == null || post.length === 0 || !userId) {
      return res.status(412).json({ msg: "데이터 형식이 올바르지 않습니다." });
    }

    if (!comment) {
      return res.status(412).json({ msg: "댓글 내용을 입력해주세요" });
    }

    // DB에 등록되는 입력값
    await Comments.create({ postId, userId, nickname,comment });

    res.status(200).json({ message: "댓글을 생성하였습니다." });
  } catch (error) {
    return res.status(400).json({ msg: "댓글 작성에 실패하였습니다." });
  }
});

//   4.  댓글 목록 조회 API
//     - 제일 최근 작성된 댓글을 맨 위에 정렬하기
//==================================
//
//           댓글 목록 조회
//
//==================================
router.get("/comments/:postId", async (req, res) => {
  try {
    // params를 통해 게시글 id 값을 가져옴
    const {postId} = req.params;
    // id 정보에 맞는 댓글 정보를 가져온다.
    const comments = await Comments.findAll({ 
        where : {postId},
        raw : true,
        order: [["createdAt","DESC"]],
     });

     console.log(comments)

    // 맞는 정보가 없을 경우
    if (comments == null || comments.length === 0) {
      throw err
    }

    res.json({
      data : comments
    });
  } catch (error) {
    return res.status(400).json({ msg: "데이터 형식이 올바르지 않습니다." });
  }
});

// 6. 댓글 수정 API
// {  "comment": "수정된 댓글입니다."}
// # 400 댓글 수정에 실패한 경우
// {"errorMessage": "댓글 수정이 정상적으로 처리되지 않았습니다.”}
//==================================
//
//            댓글 수정
//
//==================================
router.put("/comments/:commentId", async (req, res) => {
//   try {
    // params를 통해 댓글 id 값을 가져옴
    let {commentId} = req.params;
    const { comment } = req.body;
    const { userId } = res.locals.user

    const changeComment = await Comments.findOne({
        where: { commentId },
      });
          // 댓글을 찾을 수 없는 경우
    if (changeComment == null || changeComment.length === 0) {
        return res.status(404).json({ msg: "댓글이 존재하지 않습니다." });
      }

    if (!comment) {
      return res.status(412).json({ msg: "데이터 형식이 올바르지 않습니다." });
    }

    // 비밀번호가 맞으면 수정 해준다.
    if (userId === changeComment.userId) {
        await Comments.update({ comment }, { where: { commentId } });
        return res.status(200).json({ msg: "댓글을 수정하였습니다." });
      }
//     } catch (error) {
//     return res.status(400).json({ msg: "댓글 수정에 실패하였습니다." });
//   }
});

// 7. 댓글 삭제 API
// # 400 댓글 삭제에 실패한 경우
// {"errorMessage": "댓글 삭제가 정상적으로 처리되지 않았습니다.”}
//==================================
//
//             댓글 삭제
//
//==================================
router.delete("/comments/:commentId", async (req, res) => {
  try {
    // 코멘트 id를 받아옴
    let {commentId} = req.params;
    const { userId } = res.locals.user

    // id에 맞는 정보 하나를 불러온다.
    const delComment = await Comments.findOne({where : { commentId }});

    // 값을 찾지 못할 경우
    if (delComment == null || delComment.length === 0) {
      return res.status(404).json({ msg: "댓글이 존재하지 않습니다." });
    }

    if (delComment.userId !== userId || userId == undefined) {
        throw err
      }

    // 모두 통과하면 댓글을 지움
    await Comments.destroy({where: {commentId}});
    return res.status(200).json({ message: "댓글을 삭제하였습니다." });
  } catch (error) {
    return res.status(400).json({ msg: "댓글 삭제에 실패하였습니다." });
  }
});

module.exports = router;
