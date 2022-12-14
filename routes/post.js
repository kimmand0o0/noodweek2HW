const express = require("express");
const router = express.Router();

const PostController = require('../controller/post.controller');
const postController = new PostController()

const auth = require("../middlewares/auth");


// 9. 좋아요 게시글 조회 API
//     - 로그인 토큰을 전달했을 때에만 좋아요 게시글 조회할 수 있게 하기
//     - 로그인 토큰에 해당하는 사용자가 좋아요 한 글에 한해서, 조회할 수 있게 하기
//     - 제일 좋아요가 많은 게시글을 맨 위에 정렬하기
//==================================
//
//         좋아요 게시글 조회
//
//==================================
router.get("/like", auth, postController.PostLikeLookup);

//==================================
//
//            게시글 조회
//
//==================================
// 게시글 조회 라우터 만들기
router.get("/", postController.PostLookup);

// # 412 Title의 형식이 비정상적인 경우
// {"errorMessage": "게시글 제목의 형식이 일치하지 않습니다."}
// # 412 Content의 형식이 비정상적인 경우
// {"errorMessage": "게시글 내용의 형식이 일치하지 않습니다."}
//==================================
//
//            게시글 작성
//
//==================================
router.post("/", auth, postController.Posting);

//==================================
//
//            게시글 상세
//
//==================================
router.get("/:postId", postController.FindPostOne);

//{  "title": "안녕하새요 수정된 게시글 입니다.",  "content": "안녕하세요 content 입니다."}
// # 412 Title의 형식이 비정상적인 경우
// {"errorMessage": "게시글 제목의 형식이 일치하지 않습니다."}
// # 412 Content의 형식이 비정상적인 경우
// {"errorMessage": "게시글 내용의 형식이 일치하지 않습니다."}
// # 401 게시글 수정이 실패한 경우
// {"errorMessage": "게시글이 정상적으로 수정되지 않았습니다.”}
//==================================
//
//            게시글 수정
//
//==================================
router.put("/:postId", auth, postController.PostModify);

// # 401 게시글 삭제에 실패한 경우
// {"errorMessage": "게시글이 정상적으로 삭제되지 않았습니다.”}
//==================================
//
//            게시글 삭제
//
//==================================
router.delete("/:postId", auth, postController.DeletePost);

// 8. 게시글 좋아요 API
//==================================
//
//          게시글 좋아요
//
//==================================
router.put("/:postId/like", auth, postController.PostLike);


module.exports = router;
