const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/licenseDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.get('/', (req, res) => {
    res.render('login');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            username: req.body.username,
            password: hashedPassword,
            license: req.body.license
        });
        await user.save();
        res.redirect('/');
    } catch {
        res.redirect('/register');
    }
});

app.post('/login', async (req, res) => {
    const user = await User.findOne({ username: req.body.username });
    if (user == null) {
        return res.redirect('/');
    }
    try {
        if (await bcrypt.compare(req.body.password, user.password)) {
            res.render('dashboard', { username: user.username });
        } else {
            res.redirect('/');
        }
    } catch {
        res.redirect('/');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
