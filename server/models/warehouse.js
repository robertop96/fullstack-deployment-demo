const bookshelf = require('../bookshelf');

const Warehouse = bookshelf.model('Warehouse', {
  tableName: 'warehouses',
  inventories: function() {
    return this.hasMany('Inventory');
  }
});

module.exports = Warehouse;