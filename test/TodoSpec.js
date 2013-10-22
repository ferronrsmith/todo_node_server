/*jslint node: true, nomen: true, devel : true, unparam : true */
/*global describe, it */

var expect = require('chai').expect,
    request = require('supertest'),
    app = require('../app').app;

describe('', function () {
    "use strict";
    it('Expect that the Title Text is present when navigating to / path', function () {
        request(app)
            .get('/')
            .expect(200)
            .end(function (err, res) {
                expect(err).to.eql(null);
                expect(res.text.indexOf("Todo Node Calendar")).to.be.above(-1);
            });
    });

    it('Expect that the default user text is shown when navigating to the /users path', function () {
        request(app)
            .get('/users')
            .expect(200)
            .end(function (err, res) {
                expect(err).to.eql(null);
                expect(res.text).to.eql('respond with a resource');
            });
    });

    it('Expect that the default user text is shown when navigating to the /users path', function () {
        request(app)
            .get('/todo')
            .set('Accept', 'application/json')
            .expect(200)
            .end(function (err, res) {
                expect(err).to.eql(null);
                var data = JSON.parse(res.text);
                expect(data.length).to.above(0);
            });
    });

    it('Expect that a new record is added when the create method is called', function (done) {
        request(app)
            .post('/todo')
            .send({"title": "scrum", "completed": false })
            .end(function (err, res) {
                var resq = JSON.parse(res.text);
                expect(resq.id).to.not.eql(undefined);
                expect(resq.created_at).to.not.eql(undefined);
                expect(resq.updated_at).to.not.eql(undefined);
                done();
            });
    });

    it('Expect that the record complete property is modified', function (done) {
        request(app)
            .get('/todo')
            .set('Accept', 'application/json')
            .expect(200)
            .end(function (err, res) {
                var data = JSON.parse(res.text),
                    lastRec = data[data.length - 1],
                    chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890",
                    returnValue = "",
                    x,
                    randString = (function () {
                        for (x = 0; x < 30; x += 1) {
                            chars.charAt(Math.floor(Math.random() * 62));
                        }
                        return returnValue;
                    }());

                // right way would be to use extend
                lastRec.completed = true;
                lastRec.title =  randString;

                request(app)
                    .put('/todo/' + lastRec.id)
                    .send(lastRec)
                    .expect(200)
                    .end(function (err, res) {
                        var resq = JSON.parse(res.text);
                        expect(resq.completed).to.eql(true);
                        expect(resq.title).to.eql(randString);
                        done();
                    });
            });
    });

    it('Expect that the record is removed from the todo collection', function (done) {
        request(app)
            .get('/todo')
            .set('Accept', 'application/json')
            .expect(200)
            .end(function (err, res) {
                var data = JSON.parse(res.text),
                    lastRec = data[data.length - 1];
                request(app)
                    .del('/todo/' + lastRec.id)
                    .send({"title": "scrum", "completed": true })
                    .expect(200)
                    .end(function (err, res) {
                        var exist = false;
                        data.forEach(function (element) {
                            if (element.id === exist) {
                                exist = true;
                            }
                        });
                        expect(exist).to.eql(false);
                        done();
                    });
            });
    });

});