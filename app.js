const express = require('express');
const morgan = require('morgan');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const sequelize = require('./src/db/sequelize')

const app = express();
const port = 3030;

app
.use(bodyParser.json()) // Parse JSON request bodies
.use(favicon(__dirname = 'C:\\Users\\Mous\\Desktop\\projet tutor\\image.ico')) // Serve favicon
.use(morgan('dev')) // Log requests to the console

sequelize.initDb()

app.get('/', (req, res) => {
  res.send('Hello express!');
})
// Importer les routes
require('./src/routes/login')(app);
require('./src/routes/logout')(app);
// On gère les routes 404.
app.use(({res}) => {
  const message = 'Impossible de trouver la ressource demandée ! Vous pouvez essayer une autre URL.'
	res.status(404).json({message});
});

app.listen(port,()=> console.log(`app running at http://localhost:${port}`))
