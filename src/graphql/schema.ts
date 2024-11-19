import gql from "graphql-tag";
import { typeDefs } from "./typeDefs";
import { query } from "./query";
import { mutation } from "./mutation";
import { buildASTSchema } from "graphql";

const schemaDef = gql`
    ${typeDefs}
    ${query}
    ${mutation}
`;

const schema = buildASTSchema(schemaDef);

export { schema };
