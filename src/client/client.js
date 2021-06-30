import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

const client = new ApolloClient({
  uri: "https://employees.hasura.app/v1/graphql",
  cache: new InMemoryCache(),
  headers: {
    "X-Hasura-Admin-Secret":
      "8D8dhJ7mTwsbx1dXeODK6af8389F2dSZnjUe5p1HBdCiFLW1ibqeYpsW4vrlWcTj",
  },
});


export const GET_EMPLOYEES = gql`
  query employees {
    employees {
      id
      name
      email
      address
      surname
      postcode
      telephone
    }
  }
`;

export const ADD_EMPLOYEE = gql`
  mutation add_employee(
    $name: String!
    $surname: String!
    $address: String!
    $postcode: String!
    $telephone: String!
    $email: String!
  ) {
    insert_employees(
      objects: {
        name: $name
        surname: $surname
        address: $address
        postcode: $postcode
        telephone: $telephone
        email: $email
      }
    ) {
      returning {
        id
      }
    }
  }
`;

export const DELETE_EMPLOYEE = gql`mutation delete_employee($id: Int!) {
  delete_employees(where: {id: {_eq: $id}}){
    affected_rows
  }
}`;


export const UPDATE_EMPLOYEE = gql`
mutation ($id: Int, $name: String!, $surname: String!, $address: String!, $postcode: String!, $telephone: String!, $email: String!) {
  update_employees(_set: {name: $name, surname: $surname, postcode: $postcode, telephone: $telephone, email: $email, address: $address}, where: {id: {_eq: $id}}) {
    returning {
      id
      name
      surname
      address
      postcode
      telephone
      email
    }
  }
}

`;

export default client;
