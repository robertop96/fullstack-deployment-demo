const inventoryData = require("../seed_data/inventories");
const warehouseData = require("../seed_data/warehouses");

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex("warehouses")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("warehouses").insert(warehouseData);
    })
    .then(() => {
      return knex("inventories").del();
    })
    .then(() => {
      // Inserts seed entries
      return knex("warehouses")
        .pluck("id")
        .then(warehouseIds => {
          return warehouseIds;
        });
    })
    .then(warehouseIds => {
      const inventoryDataWithWarehouseIds = inventoryData.map(inventory => {
        inventory.warehouse_id =
          warehouseIds[Math.floor(Math.random() * warehouseIds.length)];
        return inventory;
      });
      return knex("inventories").insert(inventoryDataWithWarehouseIds);
    });
};
