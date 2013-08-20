var STORAGE_ID = 'todo-mvc';
if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');

    // clear storage
    //localStorage.clear();
}

if (typeof _ === "undefined" || _ === null) {
    var _ = require('underscore');
}


/*
 * GET home page.
 */

exports.list = function (req, res) {
    res.json(getData());
};

exports.create = function (req, res) {
    processStorageReq('create', req.body);
    res.json(req.body);
};

exports.update = function (req, res) {
    processStorageReq('update', req.body);
    res.json(req.body);
};

exports.remove = function (req, res) {
    processStorageReq('delete', {id: req.params.id });
    res.json(req.body);
};


function processStorageReq(op, record) {
    var store = getData();
    if (op === 'update') {
        var i = 0, aUpdated = [], len = store.length;
        for (; i < len; i++) {
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
        var time = Date.now(), uid = uuid();
        _.extend(record, { id: uid, _id: uid, updated_at: time, created_at: time });
        store.push(record);
    } else if (op === 'delete') {
        var j = 0, aDeleted = [], ll = store.length;
        for (; j < ll; j++) {
            if (store[j].id !== record.id) {
                aDeleted.push(store[j]);
            }
        }
        store = aDeleted;
    } else {
        throw new Error('Operation not supported')
    }

    saveData(store);
}


function getData() {
    return JSON.parse(localStorage.getItem(STORAGE_ID) || '[]');
}

function saveData(todos) {
    localStorage.setItem(STORAGE_ID, JSON.stringify(todos));
}

function uuid() {
    var mask = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
    return (function (mask) {
        return mask.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }(mask));
}