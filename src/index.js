import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

//CHAKRA PROVIDER
import { ChakraProvider } from "@chakra-ui/react";

import { ApolloProvider } from "@apollo/client";
import client from "./client/client";

ReactDOM.render(
  <ApolloProvider client={client}>
    <ChakraProvider>
      <App />
    </ChakraProvider>
  </ApolloProvider>,
  document.getElementById("root")
);
