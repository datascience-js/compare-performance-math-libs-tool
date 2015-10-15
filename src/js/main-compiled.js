"use strict";

var express = require("express"),
    path = require("path"),
    cookieParser = require("cookieparser"),
    bodyParser = require("body-parser"),
    Matrix = require("../js/numjs/matrix-compiled.js"),

//Vector     = require('../js/numjs/vector-compiled.js'),
app = express();

/* Test funcs */
var AddMatrices = function AddMatrices(number) {
    var sumOfTimeLoops = 0;

    for (var i = 0; i < number; i++) {
        var hrstart = process.hrtime();

        var m = new Matrix(2, 2);
        m.set(0, 0, 2);
        m.set(0, 1, 7);
        m.set(1, 0, 4);
        m.set(1, 1, 9);

        var b = new Matrix(2, 2);
        b.set(0, 0, 2);
        b.set(0, 1, 7);
        b.set(1, 0, 4);
        b.set(1, 1, 50000);

        var c = m.add(b);

        var hrend = process.hrtime(hrstart);

        //sumOfTimeLoops = sumOfTimeLoops + hrend[1]/1000;// / 1000000;
        // Time in second (hrend is in [second, nanosecond])
        sumOfTimeLoops = sumOfTimeLoops + (hrend[0] + hrend[1] / 1000000000);
    }

    return sumOfTimeLoops / number;
};

var CreateMatrices = function CreateMatrices(number) {
    var sumOfTimeLoops = 0;

    for (var i = 0; i < number; i++) {
        var hrstart = process.hrtime();

        var m = new Matrix(2, 2);
        m.set(0, 0, 2);
        m.set(0, 1, 7);
        m.set(1, 0, 4);
        m.set(1, 1, 9);

        var hrend = process.hrtime(hrstart);

        //sumOfTimeLoops = sumOfTimeLoops + hrend[1]/1000;// / 1000000;
        /*if (best < hrend[1] / 1000000) {
            best = hrend[1] / 1000000;
        }*/

        // Time in second (hrend is in [second, nanosecond])
        sumOfTimeLoops = sumOfTimeLoops + (hrend[0] + hrend[1] / 1000000000);
    }

    return sumOfTimeLoops / number;
};

var MulMatrices = function MulMatrices(number) {
    var sumOfTimeLoops = 0;

    for (var i = 0; i < number; i++) {
        var hrstart = process.hrtime();

        var m = new Matrix(2, 2);
        m.set(0, 0, 2);
        m.set(0, 1, 7);
        m.set(1, 0, 4);
        m.set(1, 1, 9);

        var b = new Matrix(2, 2);
        b.set(0, 0, 2);
        b.set(0, 1, 7);
        b.set(1, 0, 4);
        b.set(1, 1, 50000);

        var c = m.mul(b);

        var hrend = process.hrtime(hrstart);

        // Time in second (hrend is in [second, nanosecond])
        sumOfTimeLoops = sumOfTimeLoops + (hrend[0] + hrend[1] / 1000000000);
    }

    return sumOfTimeLoops / number;
};

var dictonaryOfNumjsFuncs = { AddMatrices: AddMatrices,
    MulMatrices: MulMatrices,
    CreateMatrices: CreateMatrices };

//app.use(cookieParser());
app.use(bodyParser.json()); // for parsing application/json
app.use("/js", express["static"](path.join(__dirname, "../../dist/js")));
app.use("/css", express["static"](path.join(__dirname, "../../dist/css")));
app.use("/img", express["static"](path.join(__dirname, "../../dist/img")));
app.use("/index.html", express["static"](path.join(__dirname, "../../dist/index.html")));

app.get("/getListOfNumjsFuncs", function (req, res, next) {
    var arr = [];
    var i = 0;
    for (var property in dictonaryOfNumjsFuncs) {
        if (dictonaryOfNumjsFuncs.hasOwnProperty(property)) {
            arr.push(property);
            i++;
        }
    }
    res.json(arr);
});

app.get("/getTimeOfNumjsFunctions", function (req, res, next) {
    var statement = req.query.statement,
        number = req.query.number,
        avgTime = 0;

    if (dictonaryOfNumjsFuncs[statement]) {
        avgTime = dictonaryOfNumjsFuncs[statement](number);

        res.json({ time: avgTime });
    } else {
        res.sendStatus(500);
    }
});

app.get("/home", function (req, res) {
    res.send("Hello World!");
});

var server = app.listen(3000, function () {
    var port = server.address().port;

    console.log("app listening at http://localhost:%s/index.html", port);

    // Start WebApi service for getting cpp-eigen-profiling services
    var exeFile = require("child_process").execFile("../exe/Release/WebAPISelfHostEigenProfilingServices.exe", function (err, data) {
        console.log(err);
        console.log(data.toString());
    });

    // Please run: netsh http add urlacl url=http://+:58572/ user=Everyone

    // Start python web server (flask) for getting numpy-profiling services
    var python = require("child_process").exec("python", ["../py/profileNumpy.py"]);
});

//# sourceMappingURL=main-compiled.js.map