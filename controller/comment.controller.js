const CommentService = require("../service/comment.service");
const errorCheck = require("../middlewares/errorCheck");

class CommentController {
  commentService = new CommentService();

  CreateComment = async (req, res) => {
    try {
      let { postId } = req.params;
      const { userId } = res.locals.user;
      const { comment } = req.body;

      await this.commentService.CreateComment(postId, userId, comment);
      res.status(200).json({ message: "댓글을 생성하였습니다." });
    } catch (err) {
      return errorCheck(err, res);
    }
  };

  FindComment = async (req, res) => {
    try {
      const { postId } = req.params;

      const comments = await this.commentService.FindComment(postId);
      res.json({
        data: comments,
      });
    } catch (error) {
      return errorCheck(err, res);
    }
  };

  UpdateComment = async (req, res) => {
    try {
      let { commentId } = req.params;
      const { comment } = req.body;
      const { userId } = res.locals.user;
      await this.commentService.UpdateComment(commentId, comment, userId);
      return res.status(200).json({ msg: "댓글을 수정하였습니다." });
    } catch (err) {
      if (!err) {
        errorCheck("FailUpdateComment", res);
      } else {
        return errorCheck(err, res);
      }
    }
  };

  DeleteComment = async (req, res) => {
    try {
      let { commentId } = req.params;
      const { userId } = res.locals.user;
      
      await this.commentService.DeleteComment(commentId, userId);
      return res.status(200).json({ message: "댓글을 삭제하였습니다." });
    } catch (err) {
        return errorCheck (err, res)
    }
  };
}

module.exports = CommentController;
