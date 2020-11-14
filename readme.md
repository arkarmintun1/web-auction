# Web Auction Application

### Technologies

- Backend - Express
- Database - MongoDB
- Frontend - React.js

## SET UPS

The application inclues two modules (client and server). For local development, you will need to run client and server in seperate terminal windows (or run with concurrently). In production, you will build react.js code with `npm run build` and move the build folder into the server folder.

### SERVER SETUP

- Rename `example.env` to .env
- Example data are included in seeders folder `items-data.json`. You can import those data into mongodb via terminal or MongoDB Compass

##### Start Server

```
cd server
npm run start
```

### CLIENT SETUP

- Open another terminal

```
cd client
npm run start
```
