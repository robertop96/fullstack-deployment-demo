const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const warehouseRouter = require("./routes/warehouse");
const inventoryRouter = require("./routes/inventory");

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(express.json());

// Ordering does matter. If you have any routes that will need to be
// authenticated, this will need to be BEFORE setting the authenticated
// route middleware.
if (process.env.NODE_ENV === "production") {
  // Serve any static files
  app.use(express.static(path.resolve(__dirname, "..", "client", "build")));
}

app.use("/api/v1/warehouse", warehouseRouter);
app.use("/api/v1/inventory", inventoryRouter);

// Ordering does matter. This should be at the end, right before the
// app.listen().
if (process.env.NODE_ENV === "production") {
  // Handle React routing, return all requests to React app
  app.get("*", (request, response) => {
    response.sendFile(
      path.resolve(__dirname, "..", "client", "build", "index.html")
    );
  });
}

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
