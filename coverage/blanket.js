/*jslint node: true, nomen: true, devel : true, unparam : true, bitwise: true */
require('blanket')({
    // Only files that match the pattern will be instrumented
    pattern: [
        'app.js',
        '/routes/index.js',
        '/routes/todo.js',
        '/routes/user.js'
    ]
});