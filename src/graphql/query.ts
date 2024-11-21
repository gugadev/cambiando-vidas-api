import gql from "graphql-tag";

const query = gql`
    type Query {
        me: User
        getUserById(id: Int!): User
    }
`;

export { query };
