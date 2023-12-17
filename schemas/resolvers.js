const { User, Book } = require('../models');  
const { signToken } = require('../utils/auth'); 

const resolvers = {
    Query: {
      me: async (_, args, context) => {
        if (context.user) {
          const userData = await User.findOne({ _id: context.user._id });
          return userData;
        }
        throw new Error('You are not authenticated.');
      },
    },
    Mutation: {
      login: async (_, { email, password }) => {
        const user = await User.findOne({ email });
  
        if (!user) {
          throw new Error('Invalid email or password.');
        }
  
        const correctPassword = await user.isCorrectPassword(password);
  
        if (!correctPassword) {
          throw new Error('Invalid email or password.');
        }
  
        const token = signToken(user);
  
        return { token, user };
      },
      addUser: async (_, { username, email, password }) => {
        const user = await User.create({ username, email, password });
        const token = signToken(user);
  
        return { token, user };
      },
      saveBook: async (_, args, context) => {
        if (context.user) {
          const updatedUser = await User.findOneAndUpdate(
            { _id: context.user._id },
            { $push: { savedBooks: args } },
            { new: true }
          );
          return updatedUser;
        }
        throw new Error('You are not authenticated.');
      },
      removeBook: async (_, { bookId }, context) => {
        if (context.user) {
          const updatedUser = await User.findOneAndUpdate(
            { _id: context.user._id },
            { $pull: { savedBooks: { bookId } } },
            { new: true }
          );
          return updatedUser;
        }
        throw new Error('You are not authenticated.');
      },
    },
  };

module.exports = resolvers;