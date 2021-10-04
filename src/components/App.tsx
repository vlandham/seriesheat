import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { QueryParamProvider } from "use-query-params";
import "./App.css";

import Home from "./Home";

const App = () => {
  return (
    <ChakraProvider>
      <Router>
        <QueryParamProvider ReactRouterRoute={Route}>
          <Route path="/" exact={true} component={Home} />
        </QueryParamProvider>
      </Router>
    </ChakraProvider>
  );
};

export default App;
