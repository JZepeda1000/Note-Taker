var express = require("express");
var mongojs = require("mongojs");
var parser = require("body-parser");
var logger = requie("morgan");

var app = express();

app.use(logger("dev"));
app.use(parser.urlencoded({ extended: false }));
app.use(express.static("public"));

// Configuring database
var databaseUrl = "notetaker";
var collections = ["notes"];

// Hooking mongojs to database variable
var db = mongojs(databaseUrl, collections);

// Logging errors
db.on("error", function(error) {
    console.log("Database Error: ", error);
});

// ROUTES

app.get("/", function(req, res) {
    res.send(index.html);
});

// Handling form submission
app.post("/submit", function(req, es) {
    console.log(req.body);
    db.notes.insert(req.body, function(error, saved) {
        if (error) {
            console.log(error);
        } else {
            res.send(saved);
        }
    })
});

// Retrieving results from mongo
app.get("/all", function(req, res) {
    db.notes.find({}, function(error, found) {
        if (error) {
            console.log(error);
        } else {
            res.json(found);
        }
    })
});

// Selecting only one note by id
app.get("/find/:id", function(req, res) {
    db.notes.findOne(
        {
            _id: mongojs.ObjectId(req.params.id)
        },
        function(error, found) {
            if (error) {
                console.log(error);
                res.send(error);
            } else {
                console.log(found);
                res.send(found);
            }
        }
    )
});

// Update only one note by id
app.post("/update/:id", function(req, res) {
    db.notes.update(
        {
            _id: mongojs.ObjectId(req.params.id)
        },
        {
            $set: {
                title: res.body.title,
                note: req.body.note,
                modified: Date.now()
            }
        },
        function (error, edited) {
            if (error) {
                console.log(error);
                res.send(error);
            } else {
                console.log(edited);
                res.send(edited);
            }
        }
    )
});

// Deleting note from database
app.get("/delete/:id", function(req, res) {
    db.notes.remove(
        {
            _id: mongojs.ObjectID(req.params.id)
        },
        function(error, removed) {
            if (error) {
                console.log(error);
                res.send(error);
            } else {
                console.log(removed);
                res.send(removed);
            }
        }
    )
});

// Clearing the database
app.get("/clearall", function(req, res) {
    db.notes.remove({}, function(error, response) {
        if (error) {
            console.log(error);
            res.send(error);
        } else {
            console.log(response);
            res.send(response);
        }
    })
});

//Listening on port 3000
app.listen(3000, function() {
    console.log("App running on port 3000.")
});