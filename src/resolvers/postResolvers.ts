import Post from '../models/postModel';
import User from '../models/userModel';

const postResolvers = {
  Query: {
    posts: async () => await Post.find().populate('author'),
    post: async (_: any, { id }: { id: string }) => await Post.findById(id).populate('author'),
  },
  Mutation: {
    createPost: async (_: any, { title, content, authorId }: { title: string; content: string; authorId: string }) => {
      const post = new Post({ title, content, author: authorId });
      await post.save();
      await User.findByIdAndUpdate(authorId, { $push: { posts: post._id } });
      return post;
    },
  },
};

export default postResolvers;
