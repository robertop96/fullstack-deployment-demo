import React from 'react';
import { Link, withRouter } from "react-router-dom";

const Nav = (props) => {
  return (
    <div className="tabs is-large">
      <ul>
        <li className={props.location.pathname === '/warehouse' ? "is-active" : ""}>
          <Link to="/warehouse">Warehouses</Link>
        </li>
        <li className={props.location.pathname === '/inventory' ? "is-active" : ""}>
          <Link to="/inventory">Inventories</Link>
        </li>
      </ul>
    </div>
  );
};

export default withRouter(Nav);