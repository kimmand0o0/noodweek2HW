const { Comments } = require("../models");

class CommentRepository {
  CreateComment = async (postId, userId, comment) => {
    return Comments.create({ postId, userId, comment });
  };

  CommentFindAll = async (postId) => {
    return Comments.findAll({
      where: { postId },
      raw: true,
      order: [["createdAt", "DESC"]],
    });
  };

  CommentFindOne = async (commentId) => {
    return Comments.findOne({
      where: { commentId },
    });
  };

  UpdateComment = async (comment, commentId) => {
    return Comments.update({ comment }, { where: { commentId } });
  }

  DeleteComment = async (commentId) => {
    return Comments.destroy({where: {commentId}});
  }
}

module.exports = CommentRepository;
