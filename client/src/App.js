import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import Nav from "./Nav";
import Warehouse from "./Warehouse";
import Inventory from "./Inventory";
import "bulma/css/bulma.css";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

class App extends Component {
  state = {
    warehouses: [],
    inventories: []
  };

  componentDidMount() {
    const getWarehouses = axios.get(`${API_URL}/warehouse`);
    const getInventories = axios.get(`${API_URL}/inventory`);
    
    axios.all([getWarehouses, getInventories]).then((responses) => {
      this.setState({
        warehouses: responses[0].data,
        inventories: responses[1].data
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
            render={props => (
              <Warehouse warehouses={this.state.warehouses} {...props} />
            )}
          />
          <Route
            path="/inventory"
            render={props => (
              <Inventory inventories={this.state.inventories} {...props} />
            )}
          />
        </Switch>
      </div>
    );
  }
}

export default App;
