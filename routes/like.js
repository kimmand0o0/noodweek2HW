const express = require("express");
const router = express.Router();

const { Users } = require("../models");
const { Posts } = require("../models");
const { PostLikes } = require("../models");
const auth = require("../middlewares/auth");
const jwt = require("jsonwebtoken");
const { get } = require("./signup");

// 8. 게시글 좋아요 API
//==================================
//
//          게시글 좋아요
//
//==================================
router.put("/posts/:postId/like", auth, async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = jwt.verify(req.cookies.accessToken, process.env.KEY);

    const post = await Posts.findOne({ where: { postId } });
    const user = await Users.findOne({ where: { userId } });

    let postLike = post.postLike;

    if (post == null || post.length === 0) {
      return res.status(404).json({ msg: "게시글 조회에 실패하였습니다." });
    }
    //로그인 토큰을 전달했을 때에만 좋아요 할 수 있게 하기
    if (user == null || user.length === 0) {
      throw err;
    }

    const islike = await PostLikes.findOne({
      where: { postId, userId },
    });

    // islike가 null일 경우 (좋아요 하지 않은 상태)
    if (!islike) {
      postLike += 1;
      await Posts.update({ postLike }, { where: { postId } });
      await PostLikes.create({
        postId,
        userId,
        nickname: user.nickname,
      });
      return res
        .status(200)
        .json({ message: "게시글의 좋아요를 등록하였습니다." });
    }

    //로그인 토큰에 해당하는 사용자가 좋아요 한 글에 한해서, 좋아요 취소 할 수 있게 하기
    const postLikeId = islike.dataValues.postLikeId;
    postLike -= 1;
    await Posts.update({ postLike }, { where: { postId } });
    await PostLikes.destroy({ where: { postLikeId } });
    res.status(200).json({ message: "게시글의 좋아요를 취소하였습니다." });
  } catch (err) {
    return res.status(400).json({ msg: "게시글 좋아요에 실패하였습니다." });
  }
});

// 9. 좋아요 게시글 조회 API
//     - 로그인 토큰을 전달했을 때에만 좋아요 게시글 조회할 수 있게 하기
//     - 로그인 토큰에 해당하는 사용자가 좋아요 한 글에 한해서, 조회할 수 있게 하기
//     - 제일 좋아요가 많은 게시글을 맨 위에 정렬하기
//==================================
//
//         좋아요 게시글 조회
//
//==================================
router.get("/posts/like", async (req, res) => {
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
      order: [["postLike", "DESC"]],
    });

    res.status(200).json({ data: posts });
  } catch (error) {
    return res
      .status(400)
      .json({ msg: "좋아요 게시글 조회에 실패하였습니다." });
  }
});

module.exports = router;
