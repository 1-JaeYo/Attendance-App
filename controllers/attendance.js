const user = require("../models/user");

exports.getIndex = (req, res, next) => {
    res.render('includes/index', {
        pageTitle: 'Shop',
        path: '/',
    });
};