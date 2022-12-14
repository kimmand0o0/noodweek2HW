const { Users } = require("../models");
const { Posts } = require("../models");
const { PostLikes } = require("../models");

const { Op } = require("sequelize");

class PostRepository {
  FindPostLikesAll = async (userId) => {
    await Posts.findAll({
      raw: true,
      where: { userId },
      include: [
        {
          model: Users,
          attributes: ["nickname"],
        },
      ],
      // 내림차순 정렬
      order: [["postLike", "DESC"]],
    });
  };

  FindPostAll = async () => {
    return Posts.findAll({
      raw: true,
      include: {
        model: Users,
        attributes: ["nickname"],
      },
      order: [["createdAt", "DESC"]],
    });
  };

  Posting = async (userId, title, content) => {
    return Posts.create({ userId, title, content });
  };

  FindPostOne = async (postId) => {
    return Posts.findOne({
      where: {
        postId,
      },
      raw: true,
      include: {
        model: Users,
        attributes: ["nickname"],
      },
    });
  };

  PostUpdate = async (postId ,title, content, postLike) => {
    const updateAt = Date.now()
    return Posts.update({ title, content, postLike, updateAt }, { where: { postId } });
  }

  DeletePost = async (postId) => {
   return Posts.destroy({ where: { postId } });
  }

  FindPostLikeOne = async (postId, userId) => {
    return PostLikes.findOne({
        raw : true,
        where: { [Op.and]: [{ postId} ,{userId}] },
      });
  }

  CreatePostLike = async (postId, userId) => {
    return PostLikes.create({ postId, userId });
  }

  DeletePostLike = async (postLikeId) => {
    return PostLikes.destroy({ where: { postLikeId } });
  }

  findUserOne = async (userId) => {
    return Users.findOne({ raw: true, where: { userId } });
  };
}

module.exports = PostRepository;
