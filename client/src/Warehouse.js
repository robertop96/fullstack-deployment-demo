import React from "react";

export default function Warehouse({ warehouses }) {
  const mappedWarehouses = warehouses.map(warehouse => {
    return (
      <div className="container is-fluid" key={warehouse.id}>
        <div className="card">
          <header className="card-header">
            <p className="card-header-title">{warehouse.name}</p>
          </header>
          <div className="card-content">
            <div className="content">{warehouse.position}</div>
            <div className="content">{warehouse.manager}</div>
            <div className="content">{warehouse.address}</div>
            <div className="content">{warehouse.phone}</div>
            <div className="content">{warehouse.email}</div>
            <div className="content">{warehouse.categories}</div>
          </div>
        </div>
      </div>
    );
  });

  return warehouses.length > 0 ? (
    <div className="container is-fluid">{mappedWarehouses}</div>
  ) : (
    <progress className="progress is-small is-primary" max="100">
      15%
    </progress>
  );
}
