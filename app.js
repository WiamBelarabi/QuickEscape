const express = require('express');
const morgan = require('morgan');
const favicon = require('serve-favicon');
const path = require('path');
const bodyParser = require('body-parser');
const sequelize = require('./src/db/sequelize');

const app = express();
const port = 3030;
// tell Express to use EJS
app.set('view engine', 'ejs');
// views folder
app.set('views', path.join(__dirname, 'views'));

app
  .use(bodyParser.json()) // Parse JSON request bodies
  .use(bodyParser.urlencoded({ extended: false })) // Parse form bodies
  .use(express.static(path.join(__dirname, 'public')))
  .use(favicon(__dirname = 'C:\\Users\\Mous\\Desktop\\projet tutor\\image.ico')) // Serve favicon
  .use(morgan('dev')); // Log requests to the console

sequelize.initDb();

// Page routes
app.get('/', (req, res) => {
  res.render('index', { title: 'Home', page: 'home', pageScript: 'home.js' });
});

app.get('/login', (req, res) => {
  res.render('login', { title: 'Login', page: 'login', pageScript: 'login.js' });
});

app.get('/signup', (req, res) => {
  res.render('signup', { title: 'Sign Up', page: 'signup', pageScript: 'signup.js' });
});

app.get('/trips', (req, res) => {
  res.render('trips', { title: 'Trips', page: 'trips', pageScript: 'trips.js' });
});

app.get('/trips/:id', (req, res) => {
  res.render('trip-details', { title: 'Trip Details', page: 'trip-details', pageScript: 'trip-details.js', tripId: req.params.id });
});

app.get('/my-reservations', (req, res) => {
  res.render('my-reservations', { title: 'My Reservations', page: 'my-reservations', pageScript: 'my-reservations.js' });
});

app.get('/profile', (req, res) => {
  res.render('profile', { title: 'Profile', page: 'profile', pageScript: 'profile.js' });
});

app.get('/admin/trips', (req, res) => {
  res.render('admin-trips', { title: 'Admin Trips', page: 'admin-trips', pageScript: 'admin-trips.js' });
});

app.get('/admin/reservations', (req, res) => {
  res.render('admin-reservations', { title: 'Admin Reservations', page: 'admin-reservations', pageScript: 'admin-reservations.js' });
});

// API routes
require('./src/routes/login')(app);
require('./src/routes/logout')(app);
require('./src/routes/signup')(app);
require('./src/routes/addTrip')(app);
require('./src/routes/editTrip')(app);
require('./src/routes/deleteTrip')(app);
require('./src/routes/findTrip')(app);
require('./src/routes/tripDetails')(app);
require('./src/routes/reserve')(app);
require('./src/routes/findReservations')(app);
require('./src/routes/adminFindReservation')(app);
require('./src/routes/profile')(app);

// 404
app.use(({ res }) => {
  const message = 'Resource not found. Try another URL.';
  res.status(404).json({ message });
});

app.listen(port, () => console.log(`app running at http://localhost:${port}`));
