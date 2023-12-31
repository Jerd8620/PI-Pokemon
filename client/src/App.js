import React from "react";
import { Route, Switch } from "react-router-dom";
import Landing from "./components/landing/Landing.jsx";
import Home from "./components/home/Home.jsx";
import PokemonDetail from "./components/pokemonDetail/PokemonDetail.jsx";
import Create from "./components/create/Create.jsx";

function App() {
  return (
      <>
          <Switch>
              <Route exact path="/" component={Landing} />
              <Route exact path="/home" component={Home} />
              <Route path="/pokemon/:id" component={PokemonDetail} />
              <Route path="/create" component={Create} />
          </Switch>
      </>
  );
}

export default App;
