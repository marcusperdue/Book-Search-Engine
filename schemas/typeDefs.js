const { gql } = require('apollo-server-express');

// Define your custom types
const typeDefs = gql`
  type User {
    _id: ID!
    username: String!
    email: String!
    bookCount: Int
    savedBooks: [Book]
  }

`;

module.exports = typeDefs;
