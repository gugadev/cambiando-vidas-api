import gql from "graphql-tag";

const query = gql`
    type Query {
        me(token: String!): User
        getUserById(id: Int!): User
    }
`;

export { query };
