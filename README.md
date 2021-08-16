# Full-Stack app deployment using Netlify and Heroku

In this demo we will be deploying a full stack application. We will deploy our client (React code) and server (Express server) codebases separately, and connect them for production environment.

Both projects' starter code are in `/starter` folder. Unpack `client.zip` and `server.zip` files and move the unpacked `/client` and `/server` folders into the root folder (where this `README.md` lives).

## Testing Locally

### Setting up your local database and npm packages

Make sure to check `knexfile.js` for MySQL config and update it accordingly to match your local setup. Keep in mind you will need to create a `deploy_demo` schema on your local MySQL server to be able to run migrations. Or feel free to create schema with your own name, but be sure to update the `knexfile`.

To run migrations and seeds, `cd` into the `/server` folder and run `npm run migrate` and then `npm run seed`.

Test out if the project is working on your local machine:

- `cd` into both `/client` and `/server` folder and run `npm i` in each.

### Server

To start your Node server, run `npm run server` inside the `/server` folder. Note the port number.

### Client

1. Check `/client/package.json` and verify that the `proxy` property in line 37 is pointing to your correct port number on localhost.

   - NOTE: If you check `/client/src/App.js`, you'll notice we're going a relative API URL and not an absolute URL. That `proxy` property is the way we can do that.

2. Run `npm start` inside `/client` folder.

Confirm that your application works as expected (ie: Warehouses and Inventories pages load correctly).

## Server Deployment

We will be deploying our server to Heroku. To start with:

- Create an account on [Heroku](https://signup.heroku.com/login).
- Install Heroku CLI using this [link](https://devcenter.heroku.com/articles/getting-started-with-nodejs#set-up).
- Open Terminal/Command Prompt and run `heroku --version` to check for proper installation of Heroku CLI.
- Run `heroku login` to login into Heroku using CLI.
- Inside of your `/server` folder run `git init` to initialize your server repo.
- Inside of your `/server` folder run `heroku create` to create an app instance with a unique url. This is the url we will deploy our app to.

#### Heroku Configuration

- Login into [Heroku](https://id.heroku.com/login).
- The app you created should appear on dashboard.
- Click on your app url.
- Go to _Resources_ Tab. Click in add on search bar and search for **JawsDB MySQL** for SQL database (you can also use **mLab MongoDB** if you are using NoSQL MongoDB for your own projects).
- Provision free version of JawsDB Database as Service and click next. Make sure you select the free version, Kitefin Shared.
  - **IMPORTANT NOTE:** You will need to add Credit Card information the first time to be able to provision additional services, but it won't charge you anything.
- Go to _Settings_ tab, click on **Reveal Config Vars** button. Make sure you have a config var entry there that is pointing to JawsDB URL called `JAWSDB_URL`.
- If not, you can manually add one. On _Resources_ tab click on JAWSDB MySQL instance and it will open a new page for you with database details. Copy the connection string that is available on top of the page in format **mysql://username:password@host:port/database**. Back on _Settings_ tab add a config var. `JAWSDB_URL` & above connection string will be the key value pair. Enter them in the textbox.
- Goto Buildpacks section under _Settings_ tab. Click on add buildpack and search for nodejs. Add it as your buildpack. You should see heroku/nodejs once you have successfully added it.

### MySQL Configuration

- In your `/server` folder open config file with datababase connections. For Knex/Bookshelf it will be **knexfile.js**
- Add your production database connection (Heroku JawsDB) to your JSON:

```js
module.exports = {
  development: {
    client: "mysql",
    connection: {
      host: "127.0.0.1",
      user: "root",
      password: "rootroot",
      database: "deploy_demo",
      charset: "utf8",
    },
  },
  production: {
    client: "mysql",
    connection: process.env.JAWSDB_URL,
  },
};
```

Update your `bookshelf.js` file to conditionally set the right Knex config for the environment:

```js
const knexConfig =
  process.env.NODE_ENV === "production"
    ? require("./knexfile").production
    : require("./knexfile").development;
```

### Logging Middleware

- Install `morgan` logger middleware by running `npm i morgan`
- Configure morgan for dev and production (add this to `server/index.js` after `cors` middleware):

```js
const morgan = require('morgan');
...
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
```

### Tell Heroku that certain paths are related to the React app

- We need to tell Heroku that one particular folder will have static assets -- the React app that was generated at `/client/build/index.html`. Inside `/server/index.js`, add the following:

```js
const path = require("path");
...
if (process.env.NODE_ENV === "production") {
  // Serve any static files
  app.use(express.static(path.resolve(__dirname, "..", "client", "build")));
}
```

- Ordering does matter here. If you have any routes that will need to be authenticated, the middleware to set the static paths need to be BEFORE setting the authenticated route middleware.

- You'll also need to add this at the END of your routes, before the `app.listen()`:

```js
if (process.env.NODE_ENV === "production") {
  // Handle React routing, return all requests to React app
  app.get("*", (request, response) => {
    response.sendFile(
      path.resolve(__dirname, "..", "client", "build", "index.html")
    );
  });
}
```

- In the above code, we've said: "we've already routed you to the right places if you were trying to hit an API endpoint. If you've given me something else, I'm assuming this is part of the React App, and we'll load that so React Router can do its thing."
  - That's also why we were especially careful that API endpoints started with `/api/v1`.

### Creating a start script in the root directory

- In the root directory, create a new `package.json` file using `npm init -y`. From here, add two new scripts that will start the production server:

```js
  "scripts": {
    "start": "npm start --prefix server",
    "heroku-postbuild": "NPM_CONFIG_PRODUCTION=false npm install --prefix client && npm install --prefix server && npm run build --prefix client"
  },
```

- An explanation of what's going on:
  - `start`: Running this at our root directory, will run `npm start --prefix server`: "Run `npm start`, but run that command at `/server/package.json`."
  - `heroku-postbuild`: We're taking advantage of the fact Heroku will run `npm run heroku-postbuild` _automatically_ after building out the production server. `NPM_CONFIG_PRODUCTION=false` tells heroku to [explicitly ignore `devDependencies`](https://devcenter.heroku.com/articles/nodejs-support#only-installing-dependencies), then run `npm install` in the `/client` directory, then `npm install` in the `/server` directory, then `npm run build` in the client directory to [create a production build](https://create-react-app.dev/docs/production-build/) on your React app.

### Deploying to Heroku

- Commit all your changes by running `git add .` and `git commit -m "Initial deploy to Heroku"`.
- To deploy to Heroku you simply need to push your code to the Heroku remote (that is automatically set up for you when you `heroku create` command earlier in the codealong) by running `git push heroku master`.
- You will the see deployment log in your Terminal, it will take a minute or so, after which you should get a success message saying something like "Released vX".
- If you face errors, go to your app on Heroku webpage & click on more dropdown select and select view logs. Logs will tell you what exactly went wrong. Search for help on stackoverflow.
- By selecting a NodeJS buildpack in an earlier step, Heroku automatically knows how to install the dependencies for your application and run the app by running `npm start` script you added in an earlier step.
- If you tried to open your heroku app, the React app _should_ run, but it'll time out calling the API. Why? Because we connected we pointed our database to the correct URL, but _we haven't created a database yet!_

#### Migrating and seeding your production DB

Before you open your app for the first time, we need to run migrations and seeds on your Heroku server.

- On your app dashboard click on _More_ dropdown and select _Run console_ and then type `bash` and click _Run_ or press Enter
- This will log you in to a root folder of where your application is deployed. Run `cd server`, then `npm run migrate` and `npm run seed` to populate your DB data on Heroku DB.
- Now you can close the console and open your app. Try navigating to `https://your-app-name.herokuapp.com/warehouse` to confirm that your server and DB are working correctly.
- To re-deploy any changes to your server, you would repeat the process of committing your changes and pushing it to Heroku by using `git push heroku master`.
