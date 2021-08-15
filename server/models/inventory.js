const bookshelf = require('../bookshelf');

const Inventory = bookshelf.model('Inventory', {
  tableName: 'inventories',
  warehouse: function() {
    return this.belongsTo('Warehouse');
  }
});

module.exports = Inventory;