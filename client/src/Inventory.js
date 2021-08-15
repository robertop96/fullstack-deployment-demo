import React from "react";

export default function Inventory({ inventories }) {
  const mappedInventories = inventories.map(inventory => {
    return (
      <div className="container is-fluid" key={inventory.id}>
        <div className="card">
          <header className="card-header">
            <p className="card-header-title">{inventory.name}</p>
          </header>
          <div className="card-content">
            <div className="content">{inventory.description}</div>
            <div className="content">{inventory.quantity}</div>
            <div className="content">{inventory.status}</div>
            <div className="content">{inventory.warehouse_id}</div>
          </div>
        </div>
      </div>
    );
  });

  return inventories.length > 0 ? (
    <div className="container is-fluid">{mappedInventories}</div>
  ) : (
    <progress className="progress is-small is-primary" max="100">
      15%
    </progress>
  );
}
