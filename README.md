# Full-Stack app deployment using Netlify and Heroku

In this demo we will be deploying a full stack application. We will deploy our client (React code) and server (Express server) codebases separately, and connect them for production environment.

Both projects' starter code are in `/starter` folder. Unpack `client.zip` and `server.zip` files and move the unpacked `/client` and `/server` folders into the root folder (where this `README.md` lives).

## Testing Locally

First, test out if the project is working on your local machine:

- `cd` into both `/client` and `/server` folder and run `npm i` in each.

### Server

Make sure to check `knexfile.js` for MySQL config and update it accordingly to match your local setup. Keep in mind you will need to create a `deploy_demo` schema on your local MySQL server to be able to run migrations. Or feel free to create schema with your own name, but be sure to update the `knexfile`.

To run migrations and seeds, `cd` into the `/server` folder and run `npm run migrate` and then `npm run seed`.

To start your Node server, run `npm run server`.

### Client

Run `npm start` inside `/client` folder.

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
- Go to *Resources* Tab. Click in add on search bar and search for **JawsDB MySQL** for SQL database (you can also use **mLab MongoDB** if you are using NoSQL MongoDB for your own projects).
- Provision free version of JawsDB Database as Service and click next. Make sure you select the free version. You will need to add Credit Card information the first time to be able to provision additional services, but it won't charge you anything.
- Go to *Settings* tab, click on **Reveal Config Vars** button. Make sure you have a config var entry there that is pointing to JawsDB URL called `JAWSDB_URL`.
- If not, you can manually add one. On *Resources* tab click on JAWSDB MySQL instance and it will open a new page for you with database details. Copy the connection string that is available on top of the page in format **mysql://username:password@host:port/database**. Back on *Settings* tab add a config var. `JAWSDB_URL` & above connection string will be the key value pair. Enter them in the textbox.
- Goto Buildpacks section under *Settings* tab. Click on add buildpack and search for nodejs. Add it as your buildpack. You should see heroku/nodejs once you have successfully added it.

### MySQL Configuration

- In your `/server` folder open config file with datababase connections. For Knex/Bookshelf it will be **knexfile.js**
- Add your production database connection (Heroku JawsDB) to your JSON:

```
module.exports = {
  development: {
    client: "mysql",
    connection: {
      host: "127.0.0.1",
      user: "root",
      password: "rootroot",
      database: "deploy_demo",
      charset: "utf8"
    }
  },
  production: {
    client: "mysql",
    connection: process.env.JAWSDB_URL
  }
};
```

Update your `bookshelf.js` file to conditionally set the right Knex config for the environment:

```
const knexConfig = process.env.NODE_ENV === "production"
  ? require("./knexfile").production
  : require("./knexfile").development;
```

### Logging Middleware

- Install `morgan` logger middleware by running `npm i morgan`
- Configure morgan for dev and production (add this to `server/index.js` after `cors` middleware):

```
const morgan = require('morgan');
...
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
```

### Creating a start script

- In `package.json` add a new script that will start the production server:

```
"scripts: {
  ...,
  "start": "node index.js"
}
```

### Deploying to Heroku

- Commit all your changes by running `git add .` and `git commit -m "Initial deploy to Heroku"`.
- To deploy to Heroku you simply need to push your code to the Heroku remote (that is automatically set up for you when you `heroku create` command earlier in the codealong) by running `git push heroku master`.
- You will the see deployment log in your Terminal, it will take a minute or so, after which you should get a success message saying something like "Released vX".
- If you face errors, go to your app on Heroku webpage & click on more dropdown select and select view logs. Logs will tell you what exactly went wrong. Search for help on stackoverflow.
- By selecting a NodeJS buildpack in an earlier step, Heroku automatically knows how to install the dependencies for your application and run the app by running `npm start` script you added in an earlier step.
- Before you open your app for the first time, we need to run migrations and seeds on your Heroku server.
- On your app dashboard click on *More* dropdown and select *Run console* and then type `bash` and click *Run* or press Enter
- This will log you in to a root folder of where your application is deployed. Run `npm run migrate` and `npm run seed` to populate your DB data on Heroku DB.
- Now you can close the console and open your app. Try navigating to `https://your-app-name.herokuapp.com/warehouse` to confirm that your server and DB are working correctly. 
- To re-deploy any changes to your server you would just repeat the process of committing your changes and pushing it to Heroku by using `git push heroku master`

## Client Deployment

We will be deploying our client to Netlify. To start with:

- Create a [Netlify](https://app.netlify.com/signup) account.
- Use your GitHub account to sign up as that will allow you to seamlessly deploy your repos.

### Setting up routing redirect

- To ensure that our React Router still works as expected, we need to set up a server redirect for Netlify to handle routing on the client-side
- In the `/client/public` folder create a file named `_redirects` and insert this code:

```
/*    /index.html   200
```

### Pushing client code to remote

- Go into your `/client` folder and `git init` a new Git repo.
- Commit your initial client code by running `git add .` and `git commit -m "Initial client deploy"`.
- Create a new repo on GitHub and connect your local `/client` repo to GitHub remote (following the usual GitHub new repo process).

### Connecting Netlify to our remote

- In Netlify dashboard click on *New site from Git* button.
- Select GitHub to connect your account for Continuous Deployment.
- If you don't see your new repo in a list you can click on *Configure the Netlify app on GitHub.* and in *Repository Access* section select the repository you want deployed, or select *All repositories* to have Netlify access all your repos (don't worry, they will not be automatically deployed).
- Back on the *Create a new site* interface click on the repo you want to deploy
- Netlify will automatically recognize that this is a React application and set the sensible defaults, that you don't need to change.
- Click on *Show advanced* button and then *New variable*, and add a `REACT_APP_API_URL` variable with a value of `https://your-app-name.herokuapp.com`. You can see in your client `App.js` that this variable will automatically get set from environment variable and point to the right API_URL both on local and in production.
- Click on *Deploy Site*.
- You can view the progress of deployment by clicking *Deploying your site* link.
- To re-deploy any changes to your client you would just repeat the process of committing your changes and pushing it to GitHub by using `git push` and Netlify will automatically pick up the changes and re-deploy your application.