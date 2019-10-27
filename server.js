const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const port = 3000;
const { login, signup } = require('./user-controller');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.post('/login', login);
app.post('/signup', signup);
app.get('/', (req, res) => res.send('hello world'));
app.get('*', (req, res) => res.status(404).send('Page not found'));
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
})