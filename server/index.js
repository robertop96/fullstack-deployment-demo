const express = require('express');
const cors = require('cors');
const warehouseRouter = require('./routes/warehouse');
const inventoryRouter = require('./routes/inventory');
const morgan = require('morgan');

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json());

app.use('/api/v1/warehouse', warehouseRouter);
app.use('/api/v1/inventory', inventoryRouter);

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
