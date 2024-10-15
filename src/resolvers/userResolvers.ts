import User from '../models/userModel';
import { PubSub } from 'graphql-subscriptions';

const pubsub = new PubSub();

const userResolvers = {
  Query: {
    users: async () => await User.find().populate('posts'),
    user: async (_: any, { id }: { id: string }) => await User.findById(id).populate('posts'),
  },
  Mutation: {
    createUser: async (_: any, { input }: { input: { name: string; email: string } }) => {
      const { name, email } = input;
      const user = new User({ name, email });
      await user.save();
      
      // Publish the new user event
      pubsub.publish('USER_ADDED', { userAdded: user });
      
      return user;
    },    
    updateUser: async (_: any, { id, name, email }: { id: string; name?: string; email?: string }) => {
      const user = await User.findById(id);
      if (!user) throw new Error('User not found');

      // Update user fields if provided
      if (name) user.name = name;
      if (email) user.email = email;

      await user.save();

      // Publish the updated user event
      pubsub.publish('USER_ADDED', { userAdded: user });

      return user;
    },
  },
  Subscription: {
    userAdded: {
      subscribe: () => pubsub.asyncIterator(['USER_ADDED']), // Listen for USER_ADDED events
    },
  },
};

export default userResolvers;
