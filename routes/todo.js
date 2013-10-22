/*jslint node: true, nomen: true, devel : true, unparam : true, bitwise: true */
/*global describe, it */

var STORAGE_ID = 'todo-mvc',
    localStorage = global.localStorage,
    _ = global._;
if (typeof localStorage !== "object" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');

    // clear storage
    //localStorage.clear();
}

if (typeof _ !== "object" || _ === null) {
    _ = require('underscore');
}

function getData() {
    "use strict";
    return JSON.parse(localStorage.getItem(STORAGE_ID) || '[]');
}

function saveData(todos) {
    "use strict";
    localStorage.setItem(STORAGE_ID, JSON.stringify(todos));
}

function uuid() {
    "use strict";
    var mask = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
    return (function (mask) {
        return mask.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }(mask));
}

function processStorageReq(op, record) {
    "use strict";
    var store = getData(),
        i,
        j,
        ll,
        aUpdated,
        aDeleted,
        len,
        time,
        uid;
    if (op === 'update') {
        i = 0;
        aUpdated = [];
        len = store.length;
        for (i = 0; i < len; i += 1) {
            if (store[i].id === record.id) {
                _.extend(record, { updated_at: Date.now() });
                aUpdated.push(record);
            } else {
                aUpdated.push(store[i]);
            }
        }
        // reassign outdated store to new array
        store = aUpdated;
    } else if (op === 'create') {
        time = Date.now();
        uid = uuid();
        _.extend(record, { id: uid, _id: uid, updated_at: time, created_at: time });
        store.push(record);
    } else if (op === 'delete') {
        j = 0;
        aDeleted = [];
        ll = store.length;
        for (j = 0; j < ll; j += 1) {
            if (store[j].id !== record.id) {
                aDeleted.push(store[j]);
            }
        }
        store = aDeleted;
    }

    saveData(store);
}


/*
 * GET home page.
 */

exports.list = function (req, res) {
    "use strict";
    res.json(getData());
};

exports.create = function (req, res) {
    "use strict";
    processStorageReq('create', req.body);
    res.json(req.body);
};

exports.update = function (req, res) {
    "use strict";
    processStorageReq('update', req.body);
    res.json(req.body);
};

exports.remove = function (req, res) {
    "use strict";
    processStorageReq('delete', {id: req.params.id });
    res.json(req.body);
};