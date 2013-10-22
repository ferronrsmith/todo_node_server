/*jslint node: true, nomen: true, devel : true, unparam : true */

/*
 * GET home page.
 */

exports.index = function (req, res) {
    "use strict";
    res.render('index', { title: 'Todo Node Calendar' });
};