import gql from "graphql-tag";

const typeDefs = gql`
    type Role {
        id: Int!
        name: String!
    }

    type Breed {
        id: Int!
        name: String!
    }

    type Vaccine {
        id: Int!
        name: String!
    }

    type Case {
        id: Int!
        name: String!
        about: String!
        age_years: Int!
        age_months: Int!
        observations: String
        castrated: Boolean!
        vaccines: [Int]
        breed_id: Int!
        rescuer_id: Int!
        adopter_id: Int!
        created_at: String!
        updated_at: String
        updated_by: Int
        updated_reason: String
        breed: Breed!
        rescuer: User
        adopter: User
        photos: [CasesPhotos]
    }

    type CasesPhotos {
        id: Int!
        photo_url: String!
        caseId: Int!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        phone: String
        status: String
        about: String
        photo_url: String
        ruc: String
        is_organization: Boolean!
        password: String!
        roleId: Int!
        created_at: String!
        updated_at: String
        role: Role
        adoptions: [Case]
        rescues: [Case]
    }
`;

export { typeDefs };
