import { gql } from 'apollo-server-core';

const postTypeDefs = gql`
  type Post {
    id: ID!
    title: String!
    content: String!
    author: User!
  }

  type Query {
    posts: [Post]
    post(id: ID!): Post
  }

  type Mutation {
    createPost(title: String!, content: String!, authorId: ID!): Post
  }
`;

export default postTypeDefs;
