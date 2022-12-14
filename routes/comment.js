const express = require("express");
const router = express.Router();

const CommentController = require('../controller/comment.controller');
const commentController = new CommentController()

const auth = require("../middlewares/auth");

// 5.댓글 작성 API
// {  "comment": "안녕하세요 댓글입니다."}
//==================================
//
//            댓글 생성
//
//==================================
// 게시글 작성 라우터 만들기
router.post("/:postId", auth, commentController.CreateComment);

//   4.  댓글 목록 조회 API
//     - 제일 최근 작성된 댓글을 맨 위에 정렬하기
//==================================
//
//           댓글 목록 조회
//
//==================================
router.get("/:postId", commentController.FindComment);

// 6. 댓글 수정 API
// {  "comment": "수정된 댓글입니다."}
// # 400 댓글 수정에 실패한 경우
// {"errorMessage": "댓글 수정이 정상적으로 처리되지 않았습니다.”}
//==================================
//
//            댓글 수정
//
//==================================
router.put("/:commentId", auth, commentController.UpdateComment);

// 7. 댓글 삭제 API
// # 400 댓글 삭제에 실패한 경우
// {"errorMessage": "댓글 삭제가 정상적으로 처리되지 않았습니다.”}
//==================================
//
//             댓글 삭제
//
//==================================
router.delete("/:commentId", auth, commentController.DeleteComment);

module.exports = router;
