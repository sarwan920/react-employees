import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

const client = new ApolloClient({
  uri: "https://employees.hasura.app/v1/graphql",
  cache: new InMemoryCache(),
  headers: {
    "X-Hasura-Admin-Secret":
      "8D8dhJ7mTwsbx1dXeODK6af8389F2dSZnjUe5p1HBdCiFLW1ibqeYpsW4vrlWcTj",
  },
});

// {
//    "object": {
//   "employee_name":  "Muhammad Ishaque",
//    "employee_surname":  "Nizamani",
//    "employee_address":  "Tando Soomro",
//     "employee_postcode": "70010",
//     "employee_telephone": "252525258778",
//      "employee_email": "ishaque@gmail.com"
//    }
//   }

// export const ADD_EMPLOYEE = gql`
//   mutation add_employee($employee: employees_insert_input!) {
//     insert_employees_one(object: $object) {
//       returning{
//         employee_id
//       }
//     }
//   }
// `;

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

export const DELETE_EMPLOYEE=gql`mutation delete_employee($id: Int!) {
  delete_employees(where: {id: {_eq: $id}}){
    affected_rows
  }
}`

export default client;
