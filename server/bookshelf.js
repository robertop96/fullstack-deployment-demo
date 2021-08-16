const knexConfig =
  process.env.NODE_ENV === "production"
    ? require("./knexfile").production
    : require("./knexfile").development;
const knex = require("knex")(knexConfig);
const bookshelf = require("bookshelf")(knex);

module.exports = bookshelf;
