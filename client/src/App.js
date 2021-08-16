import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import Nav from "./Nav";
import Warehouse from "./Warehouse";
import Inventory from "./Inventory";
import "bulma/css/bulma.css";
import axios from "axios";

class App extends Component {
  state = {
    warehouses: [],
    inventories: [],
  };

  componentDidMount() {
    const getWarehouses = axios.get(`/api/v1/warehouse`);
    const getInventories = axios.get(`/api/v1/inventory`);

    axios.all([getWarehouses, getInventories]).then((responses) => {
      this.setState({
        warehouses: responses[0].data,
        inventories: responses[1].data,
      });
    });
  }
  render() {
    return (
      <div className="container is-fluid">
        <Nav />
        <Switch>
          <Redirect from="/" to="/warehouse" exact />
          <Route
            path="/warehouse"
            render={(props) => (
              <Warehouse warehouses={this.state.warehouses} {...props} />
            )}
          />
          <Route
            path="/inventory"
            render={(props) => (
              <Inventory inventories={this.state.inventories} {...props} />
            )}
          />
        </Switch>
      </div>
    );
  }
}

export default App;
