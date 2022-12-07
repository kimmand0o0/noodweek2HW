const express = require("express");
const router = express.Router();

const { Users } = require("../models");
const { Posts } = require("../models");
const auth = require("../middlewares/auth");
const jwt = require("jsonwebtoken");

//==================================
//
//            게시글 조회
//
//==================================
// 게시글 조회 라우터 만들기
router.get("/posts", async (req, res) => {
  try {
    // 모든 post를 불러옴
    const posts = await Posts.findAll({
      raw: true,
      attributes: [
        "postId",
        "userId",
        "nickname",
        "title",
        "createdAt",
        "updatedAt",
        "postLike",
      ],
      // 내림차순 정렬
      order: [["createdAt","DESC"]],
    });

    res.status(200).json({ data: posts });
  } catch (error) {
    return res.status(400).json({ msg: "게시글 조회에 실패하였습니다." });
  }
});

// # 412 Title의 형식이 비정상적인 경우
// {"errorMessage": "게시글 제목의 형식이 일치하지 않습니다."}
// # 412 Content의 형식이 비정상적인 경우
// {"errorMessage": "게시글 내용의 형식이 일치하지 않습니다."}
//==================================
//
//            게시글 작성
//
//==================================
router.post("/posts", auth, async (req, res) => {
  //예상할 수 없는 err는 try catch로 잡아줌
  try {
    const { title, content } = req.body;
    const { userId, nickname } = res.locals.user

    // body값이 제대로 들어오지 않았을 경우
    if (!title || !content) {
      return res
        .status(412)
        .json({ message: "데이터 형식이 올바르지 않습니다." });
    }

    // DB 등록되는 입력값
    await Posts.create({ userId, title, nickname, content, postLike: 0 });
    return res.status(200).json({ message: "게시글 작성에 성공하였습니다." });
  } catch (error) {
    return res.status(400).json({ msg: "게시글 작성에 실패하였습니다." });
  }
});

//==================================
//
//            게시글 상세
//
//==================================
router.get("/posts/:postId", async (req, res) => {
  try {
    // params를 통해 id 값을 가져옴
    let { postId } = req.params;

    // 상세 정보 찾아오기
    const post = await Posts.findAll({
      where: {
        postId,
      },
      raw: true,
      attributes: [
        "postId",
        "userId",
        "nickname",
        "title",
        "content",
        "createdAt",
        "updatedAt",
        "postLike",
      ],
    });

    //id에 맞는 정보가 없을 경우
    if (post == null || post.length === 0) {
      throw err;
    }

    // 원하는 정보만 찍어주기
    res.status(200).json({ data: post });
  } catch (error) {
    return res.status(400).json({ msg: "게시글 조회에 실패하였습니다." });
  }
});

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
router.put("/posts/:postId", auth, async (req, res) => {
  try {
  const { postId } = req.params;
  const { title, content } = req.body;
  const { userId } = res.locals.user

  if (!title || !content) {
    return res.status(412).json({ msg: "데이터 형식이 올바르지 않습니다." });
  }

  const changePost = await Posts.findOne({
    where: { postId },
  });
  // 바꿀 게시글 정보를 못 찾을 경우
  if (changePost == null || changePost.length === 0) {
    return res.status(404).json({ msg: "게시글 조회에 실패하였습니다." });
  }

  // 작성자가 같을 경우에만 변경
  if (userId === changePost.userId) {
    await Posts.update({ title, content, updateAt }, { where: { postId } });
    return res.status(200).json({ msg: "게시글을 수정하였습니다." });
  }
  } catch (error) {
    return res.status(400).json({ msg: "게시글 수정에 실패하였습니다." });
  }
});

// # 401 게시글 삭제에 실패한 경우
// {"errorMessage": "게시글이 정상적으로 삭제되지 않았습니다.”}
//==================================
//
//            게시글 삭제
//
//==================================
router.delete("/posts/:postId", auth, async (req, res) => {
  try {
    let { postId } = req.params;
    const { userId } = res.locals.user

    const delPost = await Posts.findOne({
      where: { postId },
    });

    // 값을 못찾을 경우
    if (delPost == null || delPost.length === 0) {
      return res.status(404).json({ msg: "게시글이 존재하지 않습니다." });
    }

    if (delPost.userId !== userId || userId == undefined) {
      throw err
    }

    //모두 통과하면 게시글을 지움
    await Posts.destroy({where: {postId}});
    return res.status(200).json({ message: "게시글을 삭제하였습니다." });
  } catch (error) {
    return res.status(400).json({ msg: "게시글이 정상적으로 삭제되지 않았습니다." });
  }
});


module.exports = router;
