import gql from "graphql-tag";

const mutation = gql`
    type Mutation {
        createUser(
            name: String!
            email: String!
            phone: String
            status: String
            about: String
            photoUrl: String
            ruc: String
            isOrganization: Boolean!
            password: String!
            roleId: Int!
        ): User

        updateProfile(
            email: String
            phone: String
            about: String
            password: String
        ): User
    }
`;

export { mutation };
