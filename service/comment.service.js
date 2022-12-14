const CommentRepository = require("../repository/comment.repository");
const PostRepository = require("../repository/post.repository");

const jwt = require("jsonwebtoken");

class CommentService {
  commentRepository = new CommentRepository();
  postRepository = new PostRepository();

  CreateComment = async (postId, userId, comment) => {
    const post = await this.postRepository.FindPostOne(postId);
    if (post == null || post.length === 0 || !userId) {
      throw "PostingDataError";
    }
    if (!comment) {
      throw "ExistComment";
    }
    return this.commentRepository.CreateComment(postId, userId, comment);
  };

  FindComment = async (postId) => {
    const comments = await this.commentRepository.CommentFindAll(postId);
    if (comments == null || comments.length === 0) {
      throw "DataError";
    }
    return comments;
  };

  UpdateComment = async (commentId, comment, userId) => {
    const changeComment = await this.commentRepository.CommentFindOne(
      commentId
    );
    if (changeComment == null || changeComment.length === 0) {
      throw "IsComment";
    }
    if (!comment) {
      throw "PostingDataError";
    }
    if (userId !== changeComment.userId) {
      throw "PostingDataError";
    }
    return this.commentRepository.UpdateComment(comment, commentId);
  };

  DeleteComment = async (commentId, userId) => {
    const delComment = await this.commentRepository.CommentFindOne(commentId);
    if (delComment == null || delComment.length === 0) {
      throw "IsComment";
    }
    if (delComment.userId !== userId || userId == undefined) {
      throw "FailDeleteComment";
    }
    return this.commentRepository.DeleteComment(commentId)
  };
}

module.exports = CommentService;
