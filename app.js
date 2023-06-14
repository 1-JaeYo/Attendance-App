const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDbStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');

const errorController = require('./controllers/error');
const User = require('./models/user')

const MONGODB_URI = 
    'mongodb+srv://Jae:password!@cluster0.baawr5a.mongodb.net/attendance';

const app = express();
const store = new MongoDbStore({
    uri: MONGODB_URI,
    collection: 'sessions'
});
const csrfProtection = csrf();

app.set('view engine', 'ejs');
app.set('views', 'views');

const authRoutes = require('./routes/auth');
const attendanceRoutes = require('./routes/attendance');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
    session({
        secret: 'my secret',
        resave: false,
        saveUninitialized: false,
        store: store
    })
);
app.use(csrfProtection);
app.use(flash())

app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
});

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.post('/attendance', async (req, res) => {
    const attendance = new Attendance(req.body);
    try {
        await attendance.save();
        res.status(201).send(attendance);
    } catch (error) {
        res.status(400).send(error);
    }
});

app.get('/attendance', async (req, res) => {
    try {
        const attendance = await Attendance.find({});
        res.status(200).send(attendance);
    } catch (error) {
        res.status(500).send(error);
    }
});




app.use(authRoutes);
app.use(attendanceRoutes);

app.use(errorController.get404);

mongoose
    .connect(
        MONGODB_URI
    )
    .then(result => {
        console.log('Connected');
        app.listen(4000);
    })
    .catch(err => {
        console.log(err);
    });