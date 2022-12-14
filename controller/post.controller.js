const PostService = require("../service/post.service");
const errorCheck = require("../middlewares/errorCheck");

class PostController {
  postService = new PostService();

  PostLikeLookup = async (req, res) => {
    try {
      const { userId } = res.locals.user;
      const posts = await this.postService.FindPostLikesAll(userId);
      res.status(200).json({ data: posts });
    } catch (err) {
      return errorCheck(err, res);
    }
  };

  PostLookup = async (req, res) => {
    try {
      // 모든 post를 불러옴
      const posts = await this.postService.FindPostAll();
      res.status(200).json({ data: posts });
    } catch (err) {
      return errorCheck(err, res);
    }
  };

  Posting = async (req, res) => {
    try {
      const { title, content } = req.body;
      const { userId } = res.locals.user;

      await this.postService.Posting(userId, title, content);
      return res.status(200).json({ message: "게시글 작성에 성공하였습니다." });
    } catch (err) {
      return errorCheck(err, res);
    }
  };

  FindPostOne = async (req, res) => {
    try {
      // params를 통해 id 값을 가져옴
      let { postId } = req.params;

      const post = await this.postService.FindPostOne(postId);

      res.status(200).json({ data: post });
    } catch (err) {
      return errorCheck(err, res);
    }
  };

  PostModify = async (req, res) => {
    try {
      const { postId } = req.params;
      const { title, content } = req.body;
      const { userId } = res.locals.user;

      await this.postService.BodyCheck(title, content);
      const changePost = await this.postService.FindPostOne(postId);

      if (userId === changePost.userId) {
        await this.postService.PostUpdate(
          postId,
          title,
          content,
          changePost.postLike
        );
        return res.status(200).json({ msg: "게시글을 수정하였습니다." });
      }
      throw err;
    } catch (err) {
      return errorCheck(err, res);
    }
  };

  DeletePost = async (req, res) => {
    try {
      let { postId } = req.params;
      const { userId } = res.locals.user;

      const delPost = await this.postService.FindPostOne(postId);
      await this.postService.DeletePost(delPost, userId);
      return res.status(200).json({ message: "게시글을 삭제하였습니다." });
    } catch (err) {
      if (!err) {
        return errorCheck("FailDeletePost", res);
      } else {
        return errorCheck(err, res);
      }
    }
  };

  PostLike = async (req, res) => {
    try {
      const { postId } = req.params;
      const { userId } = res.locals.user;

     await this.postService.PostLike(postId, userId);
     return console.log("좋아요 완료")
    } catch (err) {
        return errorCheck(err, res);
    }
  };
}

module.exports = PostController;
