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
    ageYears: Int!
    ageMonths: Int!
    observations: String
    castrated: Boolean!
    vaccines: Int[]
    breedId: Int!
    rescuerId: Int!
    adopterId: Int!
    createdAt: String!
    updatedAt: String
    updatedBy: Int
    updatedReason: String
    breed: Breed!
    rescuer: User
    adopter: User
    photos: CasesPhotos[]
}

type CasesPhotos {
    id: Int!
    photoUrl: String!
    caseId: Int!
}

type User {
    id: ID!
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
    createdAt: String!
    updatedAt: String
    role: Role
    adoptions: Case[]
    rescues: Case[]
}
`;

export { typeDefs };
