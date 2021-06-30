import { Button } from "@chakra-ui/react";

import { Container, Flex } from "@chakra-ui/react";

import { Stack, VStack, Box } from "@chakra-ui/react";

import { Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";

import { Input } from "@chakra-ui/react";

import { useToast } from "@chakra-ui/react";

// import { PhoneIcon, CheckIcon , SmallAddIcon} from "@chakra-ui/icons";

import { Spinner, Center } from "@chakra-ui/react";

import { useRef, useState } from "react";

import { useQuery, useMutation } from "@apollo/client";
import { GET_EMPLOYEES, ADD_EMPLOYEE, DELETE_EMPLOYEE, UPDATE_EMPLOYEE } from "./client/client";

//MAIN APP FUNCTION COMPONENT
function App() {
  const [addEmployee, { loading: addEmployeesLoading }] = useMutation(ADD_EMPLOYEE);
  const { data, loading: getEmployees } = useQuery(GET_EMPLOYEES);
  const [delete_employee] = useMutation(DELETE_EMPLOYEE);
  const [update_employee , { loading:updateEmployeesLoading }] = useMutation(UPDATE_EMPLOYEE);
  const toast = useToast();

  const [edit, setEdit] = useState(false);

  const [employeeId, setEmployeeId] = useState();



  const addNewEmployee = () => {
    setEdit(false);
    document.getElementById("employee_form").reset();
  }


  //ADD EMPLOYEE LOGIC
  const nameRef = useRef();
  const surnameRef = useRef();
  const addressRef = useRef();
  const postcodeRef = useRef();
  const telephoneRef = useRef();
  const emailRef = useRef();



  const updateEmployee = () => {
    console.log(employeeId)
    const updatedName = nameRef.current.value;
    const updatedSurname = surnameRef.current.value;
    const updatedAddress = addressRef.current.value;
    const updatedPostcode = postcodeRef.current.value;
    const updatedTelephone = telephoneRef.current.value;
    const updatedEmail = emailRef.current.value;

    update_employee({
      variables: {
        id: employeeId,
        name: updatedName,
        surname: updatedSurname,
        address: updatedAddress,
        postcode: updatedPostcode,
        telephone: updatedTelephone,
        email: updatedEmail
      },
      optimisticResponse: true,
      update: (cache) => {
        const existingEmployees = cache.readQuery({ query: GET_EMPLOYEES });
        const newEmployees = existingEmployees.employees.map(e => {
          if (e.id === employeeId) {
            return { ...e, name: e.name, surname: e.surname, address: e.address, postcode: e.postcode, telephone: e.telephone, email: e.email };
          } else {
            return e;
          }
        });
        cache.writeQuery({
          query: GET_EMPLOYEES,
          data: { employees: newEmployees }
        });
      }
    }).then(()=>{
      document.getElementById('employee_form').reset();
      toast({
        title: "Employee Updated Successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
        variant: "top-accent",
      });
      setEdit(false);
    })

  }

  const saveEmployee = () => {
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
    setEmployeeId(employee.id);
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
                  <Button isLoading={ !edit ? addEmployeesLoading: updateEmployeesLoading} onClick={!edit ? saveEmployee : updateEmployee}>
                    Save
                  </Button>
                  {edit && <Button onClick={() => { setEdit(false); document.getElementById('employee_form').reset() }}>Cancel</Button>}


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
