const { next } = require("cli");
const PostRepository = require("../repository/post.repository");

class PostService {
  postRepository = new PostRepository();

  FindPostLikesAll = async (userId) => {
    return this.postRepository.FindPostLikesAll(userId);
  };
  FindPostAll = async () => {
    return this.postRepository.FindPostAll();
  };
  Posting = async (userId, title, content) => {
    if (!title || !content) {
      throw "PostingDataError";
    }
    return this.postRepository.Posting(userId, title, content);
  };
  FindPostOne = async (postId) => {
    const post = await this.postRepository.FindPostOne(postId);

    if (post == null || post.length === 0) {
      throw "FailPostLookup";
    }
    return post;
  };
  BodyCheck = async (title, content) => {
    if (!title || !content) {
      throw "PostingDataError";
    }
    next();
  };
  PostUpdate = async (postId, title, content, postLike) => {
    return this.postRepository.PostUpdate(postId, title, content, postLike);
  };
  DeletePost = async (delPost, userId) => {
    if (delPost == null || delPost.length === 0) {
      throw "NotExistPost";
    }
    if (delPost.userId !== userId || userId == undefined) {
      throw err;
    }
    return this.postRepository.DeletePost(delPost.postId);
  };
  PostLike = async (postId, userId) => {
    const post = await this.postRepository.FindPostOne(postId);
    const user = await this.postRepository.findUserOne(userId);
    
    if (post == null || post.length === 0) {
      throw "FailPostLookup";
    }
    if (user == null || user.length === 0) {
      throw "FailPostLike";
    }
    let postLike = post.postLike;
    const islike = await this.postRepository.FindPostLikeOne(postId, userId);

    // islike가 null일 경우 (좋아요 하지 않은 상태)
    if (!islike) {
      postLike += 1;
      await this.postRepository.PostUpdate(
        postId,
        post.title,
        post.content,
        postLike
      );
      await this.postRepository.CreatePostLike(postId, userId);
      throw "CreatePostLike";
    }
    //로그인 토큰에 해당하는 사용자가 좋아요 한 글에 한해서, 좋아요 취소 할 수 있게 하기
    const postLikeId = islike.postLikeId;
    postLike -= 1;
    await this.postRepository.PostUpdate(
        postId,
        post.title,
        post.content,
        postLike
      );
    await this.postRepository.DeletePostLike(postLikeId)
    throw "DeletePostLike";
  };
}

module.exports = PostService;
