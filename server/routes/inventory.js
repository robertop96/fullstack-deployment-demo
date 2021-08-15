const express = require('express');
const router = express.Router();
const Inventory = require('../models/inventory');
const Warehouse = require('../models/warehouse');

// Get all inventories
router.get('/', (_req, res) => {
  Inventory
    .fetchAll()
    .then(inventories => {
      res.status(200).json(inventories);
    });
});

// Create a new inventory
router.post('/', (req, res) => {
  Warehouse
    .where({ id: req.body.warehouseId })
    .fetch()
    .then(() => {
      new Inventory({
        name: req.body.name,
        description: req.body.description,
        warehouse_id: req.body.warehouseId,
        quantity: req.body.quantity,
        status: req.body.status
      })
      .save()
      .then(newInventory => {
        res.status(200).json(newInventory);
      })
    })
    .catch(() => {
      return res.status(404).json({ error: "Please provide a valid warehouse ID" })
    });
});

// Get single inventory (with warehouse)
router.get('/:id', (req, res) => {
  Inventory
    .where({ id: req.params.id })
    .fetch({ withRelated: ['warehouse'] })
    .then(inventory => {
      res.status(200).json(inventory);
    })
    .catch((err) => {
      console.log(err)
      res.status(400).json({ error: 'No inventory with this ID' })
    });
});

// Update an inventory
router.put('/:id', (req, res) => {
  if (req.body.warehouseId) {
    Warehouse.where("id", req.body.warehouseId)
      .fetch()
      .then(() => {
        Inventory.where("id", req.params.id)
          .fetch()
          .then(inventory => {
            inventory
              .save({
                name: req.body.name ? req.body.name : inventory.attributes.name,
                description: req.body.description ? req.body.description : inventory.attributes.description,
                warehouse_id: req.body.warehouseId ? req.body.warehouseId : inventory.attributes.warehouse_id,
                quantity: req.body.quantity ? req.body.quantity : inventory.attributes.quantity,
                status: req.body.status ? req.body.status : inventory.attributes.status
              })
              .then(updatedInventory => {
                res.status(200).json({ updatedInventory });
              });
          });
      })
      .catch(() => {
        res.status(404).json({ error: "Please provide valid warehouse id" });
      });
  } else {
    res.status(400).json({ error: "Please provide warehouse id" });
  }
});

// Delete an inventory
router.delete('/:id', (req, res) => {
  Inventory
    .where({ id: req.params.id })
    .destroy()
    .then(() => {
      res.status(204).json({ status: "Deleted" });
    })
});

module.exports = router;