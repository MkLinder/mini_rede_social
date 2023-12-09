require('dotenv').config();
const express = require('express');
const route = require('./routes');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());
app.use(route);

app.listen(process.env.PORT, () => {
  console.log(
    `Server is runnign at port: http://localhost:${process.env.PORT}`
  );
});
