const express = require("express");
const router = express.Router();

const { Posts } = require("../models")

//==================================
//
//            게시글 조회
//
//==================================
// 게시글 조회 라우터 만들기
router.get("/posts", async (req, res) => {
    try {
      // 모든 post를 불러옴
      // sort 이용해 내림차순 정렬
      const posts = await Posts.find({}).sort({ createdAt: -1 });
  
      // map 함수를 통해 원하는 정보만 가져옴
      const data = posts.map((post) => {
        return {
          postId: post._id,
          user: post.user,
          title: post.title,
          createdAt: post.createdAt,
        };
      });
  
      // 리스폰으로 데이터를 불러옴.
      // 데이터는 위에 지정해준 값
      return res.json({ data });
    } catch (error) {
      console.error("Catch 에러 발생!!");
      return res.status(400).json({ msg: "데이터 형식이 올바르지 않습니다." });
    }
  });