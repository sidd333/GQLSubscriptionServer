import { gql } from 'apollo-server-core';

const userTypeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    posts: [Post]
  }

  type Post {
    id: ID!
    title: String!
    content: String!
    author: User!
  }

  input CreateUserInput {
    name: String!
    email: String!
  }

  type Query {
    users(limit: Int, offset: Int): [User]
    user(id: ID!): User
  }

  type Mutation {
    createUser(input: CreateUserInput!): User
    updateUser(id: ID!, name: String, email: String): User
    deleteUser(id: ID!): User
  }
  
  type Subscription {
    userAdded: User
  }
`;

export default userTypeDefs;
