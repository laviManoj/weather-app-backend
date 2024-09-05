const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Weather {
    id: ID
    location: String!
    temperature: Float!
    description: String!
    icon: String!
    date: String!
  }

  type Query {
    currentWeather(location: String!): Weather!
    historicalWeather(location: String!, from: String!, to: String!): [Weather!]!
  }

  type Mutation {
    saveWeather(location: String!, temperature: Float!, description: String!, icon: String!): Weather!
  }
`;

module.exports = typeDefs;