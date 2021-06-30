import { Button } from "@chakra-ui/react";

import { Container, Flex } from "@chakra-ui/react";

import { Stack, VStack, Box } from "@chakra-ui/react";

import { Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";

import { Input } from "@chakra-ui/react";

import { useToast } from "@chakra-ui/react";

// import { PhoneIcon, CheckIcon , SmallAddIcon} from "@chakra-ui/icons";

import { Spinner, Center } from "@chakra-ui/react";

import { useRef, useState, useEffect } from "react";

import { useQuery, useMutation } from "@apollo/client";
import { GET_EMPLOYEES, ADD_EMPLOYEE, DELETE_EMPLOYEE } from "./client/client";

//MAIN APP FUNCTION COMPONENT
function App() {
  const [addEmployee, { loading: addEmployees }] = useMutation(ADD_EMPLOYEE);
  const { data, loading: getEmployees } = useQuery(GET_EMPLOYEES);
  const [delete_employee] = useMutation(DELETE_EMPLOYEE);
  const toast = useToast();

  const [edit, setEdit] = useState(false);



  const addNewEmployee = () => {
    setEdit(false);
    console.log(edit);
    document.getElementById("employee_form").reset();
  }


  //ADD EMPLOYEE LOGIC
  const nameRef = useRef();
  const surnameRef = useRef();
  const addressRef = useRef();
  const postcodeRef = useRef();
  const telephoneRef = useRef();
  const emailRef = useRef();

  const updateEmployee=()=>{
    console.log('Update Employee');
  }

  const saveEmployee = (event) => {
    const enteredName = nameRef.current.value;
    const enteredSurname = surnameRef.current.value;
    const enteredAddress = addressRef.current.value;
    const enteredPostcode = postcodeRef.current.value;
    const enteredTelephone = telephoneRef.current.value;
    const enteredEmail = emailRef.current.value;

    addEmployee({
      variables: {
        name: enteredName,
        surname: enteredSurname,
        address: enteredAddress,
        postcode: enteredPostcode,
        telephone: enteredTelephone,
        email: enteredEmail,
      },
      refetchQueries: [{ query: GET_EMPLOYEES }],
    }).then(() => {
      document.getElementById("employee_form").reset();
      toast({
        title: "Employee Saved Successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
        variant: "top-accent",
      });
    });
  };

  const deleteEmployee = ({ id }) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to Delete Employee?"
    );
    if (isConfirmed) {
      delete_employee({
        variables: { id },
        optimisticResponse: true,
        update: (cache) => {
          const existingEmployees = cache.readQuery({ query: GET_EMPLOYEES });
          const newEmployees = existingEmployees.employees.filter(
            (e) => e.id !== id
          );
          cache.writeQuery({
            query: GET_EMPLOYEES,
            data: { employees: newEmployees },
          });
        },
      }).then(() => {
        toast({
          title: "Employee Deleted!",
          status: "info",
          duration: 5000,
          isClosable: true,
          position: "top",
          variant: "top-accent",
        });
      });
    }
  };

  const editEmployee = (employee) => {
    setEdit(true);
    nameRef.current.value = employee.name;
    surnameRef.current.value = employee.surname;
    addressRef.current.value = employee.address;
    postcodeRef.current.value = employee.postcode;
    telephoneRef.current.value = employee.telephone;
    emailRef.current.value = employee.email;

    console.log(edit);


  }

  //Spinner if its getting employees or employees are loading
  if (getEmployees) {
    return (
      <Center mt={80}>
        {" "}
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Container maxW="container.xl">
      <VStack
        boxShadow="md"
        mt={50}
        p={10}
        border="ridge"
        spacing={10}
        align="stretch"
      >
        <Button
          onClick={addNewEmployee}
        // onClick={ toggleEdit }
        >Add New Employee</Button>
        {/* ADD EMPLOYEE FORM COMPONENT */}
        <Box>
          <form id="employee_form">
            <Flex>
              <Center>
                <Stack spacing={5} m="5">
                  <Input type="text" placeholder="Name" ref={nameRef} />

                  <Input type="text" placeholder="Surname" ref={surnameRef} />
                </Stack>

                <Stack spacing={5}>
                  <Input type="text" placeholder="Address" ref={addressRef} />

                  <Input
                    type="text"
                    placeholder="Post Code"
                    ref={postcodeRef}
                  />
                </Stack>

                <Stack spacing={5} m="5">
                  <Input
                    type="text"
                    placeholder="Telephone"
                    ref={telephoneRef}
                  />

                  <Input
                    type="text"
                    placeholder="Email Address"
                    ref={emailRef}
                  />
                </Stack>

                <Stack spacing={5}>
                  <Button isLoading={addEmployees} onClick={ !edit ?  saveEmployee :updateEmployee}>
                    Save
                  </Button>
                  { edit && <Button>Cancel</Button> }
                    

                </Stack>
              </Center>
            </Flex>
          </form>
        </Box>

        {/* Show Employee Table Component */}
        <Box>
          <Table>
            <Thead bg="black">
              <Tr>
                <Th color="white">Name</Th>
                <Th color="white">Surname</Th>
                <Th color="white">Address</Th>

                <Th color="white">Postcode</Th>
                <Th color="white">Telephone</Th>
                <Th color="white">Email Address</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.employees.map((employee) => (
                <Tr
                  _hover={{ bg: "#E2E8F0", cursor: "pointer" }}
                  id={employee.id}
                  key={employee.id}
                >
                  <Td>{employee.name}</Td>
                  <Td>{employee.surname}</Td>
                  <Td>{employee.address}</Td>
                  <Td>{employee.postcode}</Td>
                  <Td>{employee.telephone}</Td>
                  <Td>{employee.email}</Td>
                  <Td>
                    <Button
                      // onClick={toggleEdit}
                      onClick={() => editEmployee(employee)}
                      _hover={{ bg: "green" }}
                      mr="2"
                      bg="black"
                      color="white"
                    >
                      Edit
                    </Button>
                    <Button



                      onClick={() => deleteEmployee(employee)}
                      _hover={{ bg: "green" }}
                      bg="black"
                      color="white"
                    >
                      Delete
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </VStack>
    </Container>
  );
}

export default App;
