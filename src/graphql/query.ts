import gql from "graphql-tag";

const query = gql`
    type Query {
        me: User
        getUserById(id: Int!): User
        roles: [Role]
        breeds: [Breed]
        vaccines: [Vaccine]
        cases: [Case]
        getCaseById(id: Int!): Case
    }
`;

export { query };
