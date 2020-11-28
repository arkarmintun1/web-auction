# Web Auction Application

### Technologies

- Backend - Express
- Database - MongoDB
- Frontend - React.js

## SET-UPS

The application includes two modules (client and server). For local developement, run `npm run dev` in the root directory which will run both express server and react. Before running this command please make sure your environment variables are setup accordingly.

### SERVER SETUP

- Rename `example.env` to `.env`
- Set mail related environment variables (I've tested with SendGrid and MailTrap)
- Example data are included in `/src/seeders/`. You can import those data into mongodb via terminal or MongoDB Compass
  - From terminal, change directory into `seeders` folder. `cd ./src/seeders`
  - To import `items`, use `mongoimport --db=web_auction --collection=items --jsonArray --file=items.json`
  - To import `users`, use `mongoimport --db=web_auction --collection=users --jsonArray --file=users.json`

##### Start Server

- Start development server by running

```
npm run dev
```

### API reference

API documentation used in the application can be viewed via https://documenter.getpostman.com/view/7403066/TVmJgyMf

### Final

- Go to browser and open `http://localhost:3000`
- You can use following user accounts if you have imported sample data from `seeders` folder

  - Admin
    - email - `admin@gmail.com`, password - `123456`
  - Users
    - user1 - `user1@gmail.com`, password - `password`
    - user2 - `user2@gmail.com`, password - `password`

- If you want to create new user, you can do via registration page
- If you sign in with user account, you will be redirected to home `/` page
  - Home page is listed with pagination and 10 items per page
  - You can filter items by typing in the search box (eg. bag, ring, jacket, etc)
  - If you press on `Bid Now`, you will be redirected to detail page
  - You can place your bid if you're not the latest hightest bidder
  - All the biddings are listed below for reference
  - Sorting by Price also works
  - Countdowns are shown on each items
  - Auto bidding can be turn on by clicking on the checkbox
  - Real-time update of biddings are shown
- If you sign in with admin account, you will be redirectd to dashboard `/` page
  - Dashboard include bid creation form on which you can type name, description, image, bidding end date, etc (Create)
  - You can also view the detail page (Read), update item informations (Update), and delete item (Delete)
  - Filter also work on both hompage and dashboard
  - History of bids on the item can also be viewed
