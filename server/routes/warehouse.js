const express = require('express');
const router = express.Router();
const Warehouse = require('../models/warehouse');

// Get all warehouses
router.get('/', (_req, res) => {
  Warehouse
    .fetchAll()
    .then(warehouses => {
      res.status(200).json(warehouses);
    });
});

// Create a new warehouse
router.post('/', (req, res) => {
  new Warehouse({
    name: req.body.name,
    position: req.body.position,
    manager: req.body.manager,
    address: req.body.address,
    phone: req.body.phone,
    email: req.body.email,
    categories: JSON.stringify(req.body.categories)
  })
  .save()
  .then(newWarehouse => {
    res.status(200).json(newWarehouse);
  })
});

// Get single warehouse (with inventories)
router.get('/:id', (req, res) => {
  Warehouse
    .where({ id: req.params.id })
    .fetch({ withRelated: ['inventories'] })
    .then(warehouse => {
      res.status(200).json(warehouse);
    })
    .catch((err) => {
      console.log(err)
      res.status(400).json({ error: 'No warehouse with this ID' })
    });
});

// Update a warehouse
router.put('/:id', (req, res) => {
  Warehouse
    .where({ id: req.params.id })
    .fetch()
    .then(warehouse => {
      warehouse.save({
        name: req.body.name ? req.body.name : warehouse.attributes.name,
        position: req.body.position ? req.body.position : warehouse.attributes.position,
        manager: req.body.manager ? req.body.manager : warehouse.attributes.manager,
        address: req.body.address ? req.body.address : warehouse.attributes.address,
        phone: req.body.phone ? req.body.phone : warehouse.attributes.phone,
        email: req.body.email ? req.body.email : warehouse.attributes.email,
        categories: req.body.categories.length ? JSON.stringify(req.body.categories) : warehouse.attributes.categories
      })
      .then(updatedWarehouse => {
        res.status(200).json(updatedWarehouse);
      })
    })
});

// Delete a warehouse
router.delete('/:id', (req, res) => {
  Warehouse
    .where({ id: req.params.id })
    .destroy()
    .then(() => {
      res.status(204).json({ status: "Deleted" });
    })
});

module.exports = router;