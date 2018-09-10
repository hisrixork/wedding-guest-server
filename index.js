// set constiables for environment
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const callback = require('./callback');
const mysql = require('mysql');
const atob = require('atob');


app.use(bodyParser.json())
// Add headers
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS, PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
app.use(function (error, req, res, next) {
    if (error instanceof SyntaxError)
        callback.errorCallback("An error occured", res, 400);
    else
        next();
});

const mySqlClient = mysql.createConnection({
    host:     "localhost",
    port:     "3306",
    user:     "root",
    password: "root",
    database: "guest"
});

app.get('/:table', function (req, res) {
    let query = `SELECT * FROM ${req.params.table}`

    mySqlClient.query(query, function (error, results) {
        if (error)
            callback.errorCallback("An error occured", res, 400);
        else
            callback.successCallback(results, null, res, 200);
    })
})

app.get('/users/:city', function (req, res) {
    let query = `SELECT * FROM users WHERE id_city = (SELECT id FROM cities WHERE name = "${atob(decodeURI(req.params.city))}")`

    mySqlClient.query(query, function (error, results) {
        if (error) {
            console.log(error)
            callback.errorCallback("An error occured", res, 400);
        }
        else
            callback.successCallback(results, null, res, 200);
    })
})

app.put('/users/:id', function (req, res) {
    let jsondata = req.body;
    let query = 'UPDATE users SET ok = ' + (jsondata.ok === 1 || jsondata ? 1 : 0)
    query += " WHERE id = " + req.params.id;

    mySqlClient.query(query, function (error, result) {
        if (error) {
            console.log(error)
            callback.errorCallback("An error occured", res, 400);
        }
        else
            callback.successCallback(null, "User successfully modified", res, 200);
    });
})

// Set server port
const server = app.listen(4000, function () {
    const host = "localhost";
    const port = server.address().port;
    console.log("API Restfull listening at http://%s:%s", host, port);
})
