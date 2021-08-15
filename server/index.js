const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const warehouseRouter = require('./routes/warehouse');
const inventoryRouter = require('./routes/inventory');

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json());

app.use('/warehouse', warehouseRouter);
app.use('/inventory', inventoryRouter);

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
})