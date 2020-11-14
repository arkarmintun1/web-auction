# Web Auction Application

### Technologies

- Backend - Express
- Database - MongoDB
- Frontend - React.js

## SET UPS

The application inclues two modules (client and server). For local development, you will need to run client and server in seperate terminal windows (or run with concurrently). In production, you will build react.js code with `npm run build` and move the build folder into the server folder.

### SERVER SETUP

- Rename `example.env` to `.env`
- Example data are included in `server/src/seeders/items-data.json`. You can import those data into mongodb via terminal or MongoDB Compass
  - `cd` into `seeders` folder and run `mongoimport --db=web_auction --collection=items --file=items-array.json --jsonArray`

##### Start Server

```
cd server
npm install
npm run start
```

### CLIENT SETUP

- Open another terminal

```
cd client
npm install
npm run start
```

### Final

- Go to browser and open `localhost:3002`
- You will se user name and password fileds

  - Admin
    - {email - `admin@gmail.com`, password - `password`}
  - Users
    - {user1 - `user1@gmail.com`, password - `password`}
    - {user2 - `user2@gmail.com`, password - `password`}

- Since authentication flow is not properly handled yet, you will lose your login state after refresh.
- If you sign in with user account, you will be redirected to home `/` page
  - Home page is listed with pagination and 10 items per page
  - You can filter items by typing in the search box (eg. bag, ring, jacket, etc)
  - If you press on `Bid Now`, you will be redirected to detail page
  - You can place your bid if you're not the latest hightest bidder
  - All the biddings are listed below for reference
  - Sorting by Price also works
  - Countdowns are shown on each items
- If you sign in with admin account, you will be redirectd to dashboard `/` page
  - Dashboard include bid creation form on which you can type name, description, image, bidding end date, etc (Create)
  - You can also view the detail page (Read), update item informations (Update), and delete item (Delete)
  - Filter also work on both hompage and dashboard
  - History of bids on the item can also be viewed
