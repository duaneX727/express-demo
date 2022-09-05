require('./middleware/connect2DB');
const debug = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db');
const config = require('config');
const morgan = require('morgan');
const helmet = require('helmet');

const logger = require('./middleware/logger');
const courses = require('./routes/courses');
const home = require('./routes/home');
const express = require('express');
const app = express(); // by convention we call the object app

app.set('view engine', 'pug');
app.set('views', './views');// default
app.use(helmet());
app.use(express.json()); // returns a piece of middleware
app.use(express.urlencoded({extended: true}));// key=value&key=value
app.use(express.static('public'));
app.use('/api/courses', courses);
app.use(helmet());
app.use('/', home);
// Configuration
//  console.log('Application Name: ' + config.get('name'));
//  console.log('Mail Server: ' + config.get('mail.host'));
//  console.log('Mail Password: ' + config.get('mail.password'));

if(app.get('env') === 'development'){
  app.use(morgan('tiny'));
  //console.log('Morgan enabled...')
  debug('Morgan enabled...');
}
// Db work ...
dbDebugger('Connected to the database...');

app.use('/middleware/logger.js',logger);


// PORT
const port = process.env.PORT || 3000;

app.listen(port,() => {
  console.log(`Listening on port: ${port}...`);
});