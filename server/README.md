- create a **models** folder

- add **warehouse.js** file and following code to it.

```
    const bookshelf = require("../bookshelf");

    const Warehouse = bookshelf.model("Warehouse", {
        tableName: "warehouses",
        inventories: function() {
            return this.hasMany("Inventory");
        }
    });

    module.exports = Warehouse;

```

- add **inventory.js** file and following code to it.

```
    const bookshelf = require("../bookshelf");

    const Inventory = bookshelf.model("Inventory", {
        tableName: "inventories",
        warehouse: function() {
            return this.belongsTo("Warehouse");
        }
    });

    module.exports = Inventory;

```

- here we define how **warehouse** and **inventory** models are related to each other using _hasMany_ and _belongsTo_ function. Please read [documentation](https://bookshelfjs.org/tutorials.html) to read more about how different associations can work for your data models

- now we can go and create routes for both **warehouse** and **inventory** related CRUD operations. This is how you can setup your minimal backend express server.

- **index.js** file

```
    const express = require("express");

    const warehouseRoute = require("./routes/warehouse");
    const inventoryRoute = require("./routes/inventory");

    const app = express();
    const PORT = process.env.PORT || 5000;

    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    app.use("/warehouse", warehouseRoute);
    app.use("/inventory", inventoryRoute);

    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}.`);
    });

```

- **routes/warehouse.js** file

- **Get all Warehouses (GET)**

```
    const express = require("express");
    const Warehouse = require("../models/warehouse");
    const router = express.Router();

    router
    .route("/")
    .get((req, res) => {
        Warehouse.where(req.query)
        .fetchAll({ withRelated: ["inventories"] })
        .then(warehouses => {
            res.status(200).json(warehouses);
        });
    })
```

- **Create a Warehouse (POST)**

```
    const express = require("express");
    const Warehouse = require("../models/warehouse");
    const router = express.Router();

    router
    .route("/")
    .post((req, res) => {
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
            res.status(201).json({ newWarehouse });
        });
    });
```

- **Get a single Warehouse (GET)**

```
    const express = require("express");
    const Warehouse = require("../models/warehouse");
    const router = express.Router();

    router
    .route("/:id")
    .get((req, res) => {
        Warehouse.where(req.params)
        .fetch({ withRelated: ["inventories"] })
        .then(warehouse => {
            res.status(200).json(warehouse);
        });
    })
```

- **Update a single warehouse (PUT)**

```
    const express = require("express");
    const Warehouse = require("../models/warehouse");
    const router = express.Router();

    router
    .route("/:id")
    .put((req, res) => {
        Warehouse.where("id", req.params.id)
        .fetch()
        .then(warehouse => {
            warehouse
            .save({
                name: req.body.name ? req.body.name : warehouse.name,
                position: req.body.position
                ? req.body.position
                : warehouse.position,
                manager: req.body.manager ? req.body.manager : warehouse.manager,
                address: req.body.address ? req.body.address : warehouse.address,
                phone: req.body.phone ? req.body.phone : warehouse.phone,
                email: req.body.email ? req.body.email : warehouse.email,
                categories: JSON.stringify(req.body.categories)
                ? JSON.stringify(req.body.categories)
                : warehouse.categories
            })
            .then(updatedWarehouse => {
                res.status(200).json({ updatedWarehouse });
            });
        });
    })
```

- **Delete a single warehouse (DELETE)**

```
    const express = require("express");
    const Warehouse = require("../models/warehouse");
    const router = express.Router();

    router
    .route("/:id")
    .delete((req, res) => {
        Warehouse.where("id", req.params.id)
        .destroy()
        .then(deletedWarehouse => {
            res.status(200).json({ deletedWarehouse });
        });
    });

    module.exports = router;

```

- **routes/inventory.js** file

- **Get all Inventories (GET)**

```
    const express = require("express");
    const Inventory = require("../models/inventory");
    const Warehouse = require("../models/warehouse");
    const router = express.Router();

    router
    .route("/")
    .get((req, res) => {
        Inventory.where(req.query)
        .fetchAll({ withRelated: ["warehouse"] })
        .then(inventories => {
            res.status(200).json({ inventories });
        });
    })
```

- **Create an inventory (POST)**

```
    const express = require("express");
    const Inventory = require("../models/inventory");
    const Warehouse = require("../models/warehouse");
    const router = express.Router();

    router
    .route("/")
    .post((req, res) => {
        Warehouse.where("id", req.body.warehouseId)
        .fetch()
        .then(warehouse => console.log("Warehouse found"))
        .catch(warehouse => {
            res.status(404).json({ error: "Please provide valid warehouse id" });
        });
        new Inventory({
        name: req.body.name,
        description: req.body.description,
        warehouse_id: req.body.warehouseId,
        quantity: req.body.quantity,
        status: req.body.status
        })
        .save()
        .then(newInventory => {
            res.status(201).json({ newInventory });
        });
    });
```

- **Get a single Inventory (GET)**

```
    const express = require("express");
    const Inventory = require("../models/inventory");
    const Warehouse = require("../models/warehouse");
    const router = express.Router();

    router
    .route("/:id")
    .get((req, res) => {
        Inventory.where(req.params)
        .fetch({ withRelated: ["warehouse"] })
        .then(inventory => {
            res.status(200).json({ inventory });
        });
    })
```

- **Update a single inventory (PUT)**

```
    const express = require("express");
    const Inventory = require("../models/inventory");
    const Warehouse = require("../models/warehouse");
    const router = express.Router();

    router
    .route("/:id")
    .put((req, res) => {
        if (req.body.warehouseId) {
        Warehouse.where("id", req.body.warehouseId)
            .fetch()
            .then(warehouse => console.log("Warehouse found"))
            .catch(warehouse => {
            res.status(404).json({ error: "Please provide valid warehouse id" });
            });
        }

        Inventory.where("id", req.params.id)
        .fetch()
        .then(inventory => {
            inventory
            .save({
                name: req.body.name ? req.body.name : inventory.name,
                description: req.body.description
                ? req.body.description
                : inventory.description,
                warehouse_id: req.body.warehouseId
                ? req.body.warehouseId
                : inventory.warehouse_id,
                quantity: req.body.quantity
                ? req.body.quantity
                : inventory.quantity,
                status: req.body.status ? req.body.status : inventory.status
            })
            .then(updatedInventory => {
                res.status(200).json({ updatedInventory });
            });
        });
    })
```

- **Delete a single inventory (DELETE)**

```
    const express = require("express");
    const Inventory = require("../models/inventory");
    const Warehouse = require("../models/warehouse");
    const router = express.Router();

    router
    .route("/:id")
    .delete((req, res) => {
        Inventory.where("id", req.params.id)
        .destroy()
        .then(deletedInventory => {
            res.status(200).json({ deletedInventory });
        });
    });

    module.exports = router;
```

- `{ withRelated: ["inventories"] }` & `{ withRelated: ["warehouse"] }` will allow us to return all inventories for a warehouse while querying a warehouse and return warehouse details while querying for inventory.
