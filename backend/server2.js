var express = require('express');
var cors = require('cors');
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var cookieParser = require('cookie-parser')
var session = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(session);
var bodyParser = require('body-parser');
var fs = require('fs');
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })



var app = express();

const url = "mongodb+srv://node_server:xV2aFPw49OTXVahE@realexalpha-yrkmp.mongodb.net/test?retryWrites=true&w=majority";

var store = new MongoDBStore({
    uri: url,
    databaseName: 'RealexAlpha',
    collection: 'sessions'
});

//TODO:
//Handlers: for route types https://www.taniarascia.com/full-stack-cookies-localstorage-react-express/
// Make cookies: secure

//Change for security
var corsOptions = {
    origin: 'https://www.realexinvest.com',
    credentials: true,
    allowHeaders: ['Content-Type'],
    preflightContinue: true,
}
app.use(cors(corsOptions))

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Says it is depreciated but needed for Mongo insertOne
app.use(bodyParser());

app.use(session({
    //key: 'user_sid',
    secret: 'somerandonstuffs',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 600000
    },
    store: store
}));



//Session middleware
//app.set('trust proxy', true);


//app.use(cookieParser('somerandonstuffs'));

// app.use((req, res, next) => {
//     if (req.session.logged_in && !req.session.user) {
//         res.clearCookie('user_sid');        
//     }
//     next();
// });

app.get('/', function(req, res){
    if(req.session.page_views){
       req.session.page_views++;
       res.send("You visited this page " + req.session.page_views + " times");
    } else {
       req.session.page_views = 1;
       res.send("Welcome to this page for the first time!");
    }
});


//Check login status
app.get('/login', function(req, res){
    if(req.session.logged_in){
        req.session.page_views++;
        response = {
            logged_in: true,
            username: req.session.username,
            count: req.session.page_views
        };
        console.log("USER IS LOGGED IN");
        res.end(JSON.stringify(response));
    } else {
        req.session.page_views++;
        response = {
            logged_in: false,
            username: "",
            count: req.session.page_views
        };
        console.log("USER IS NOT LOGGED IN");
        res.end(JSON.stringify(response));
    }
});




//Initial Login
//TODO Async errors (check notes)
 //Probably need to encrypt communication with mongo
 // Trim whitespace from inputs
app.post('/login', function(req, res){
    var username = req.body.username;
    var password = req.body.password;
    //Checking with Mongo 
    try {
        MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
            if (err) throw err;
            db = client.db("RealexAlpha");
            var myPromise = () => {
                return new Promise((resolve, reject) => {
                    db.collection("Users", (err, collection) => {
                        if (err) throw err;
                        if (!username || !password) {
                            resolve(false);
                            return;
                        } 
                        if (username == "" || password == "") {
                            resolve(false);
                            return;
                        }
                        collection.countDocuments({username:username, password:password})
                            .then((result) => {
                                if (result == 1) resolve(true);
                                else {
                                    resolve(false);
                                }
                            } 
                        ) 
                    })
                })
            };
            var callMyPromise = async () => {
                var result = await (myPromise());
                //anything here is executed after result is resolved
                return result;
            };
            callMyPromise().then(function(result) {
                client.close();
                var logged_in = result;
                //Handling mongo response
                console.log(logged_in);
                if(logged_in){
                    if(!req.session.page_views)
                        req.session.page_views = 1;
                    else
                        req.session.page_views++;
                    req.session.logged_in = true;
                    req.session.username = req.body.username;
                    response = {
                        count: req.session.page_views
                    };
                    console.log("USER IS LOGGED INNNER");
                    res.end(JSON.stringify(response));
                } else {
                    req.session.page_views = 1;
                    req.session.logged_in = false;
                    response = {
                        count: 1
                    };
                    console.log("USER IS NOT LOGGED INNER");
                    res.end(JSON.stringify(response));
                }
            });
        }); 
    } catch (e) {
        next(e)
    }
});

app.post('/save', function(req, res){
    var username = req.body.username;
    var id = req.body.id;
    //Checking with Mongo 
    try {
        MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
            if (err) throw err;
            db = client.db("RealexAlpha");
            var myPromise = () => {
                return new Promise((resolve, reject) => {
                    db.collection("Users", (err, collection) => {
                        if (err) throw err;
                        var oldDoc = collection.findOneAndUpdate(
                            {username: username},
                            {"$push": {"saved": id}}
                            //new: true,
                            //upsert : true
                        );
                        resolve(oldDoc); 
                    })
                })
            };
            var callMyPromise = async () => {
                var result = await (myPromise());
                //anything here is executed after result is resolved
                return result;
            };
            callMyPromise().then(function(result) {
                client.close();
                response = {};
                res.end(JSON.stringify(response));
            });
        }); 
    } catch (e) {
        next(e)
    }
});

//Get all properties in Mongo
app.get('/properties', function(req, res){
    //Checking with Mongo 
    try {
        MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
            if (err) throw err;
            db = client.db("RealexAlpha");
            var myPromise = () => {
                return new Promise((resolve, reject) => {
                    db.collection("Properties", (err, collection) => {
                        if (err) throw err;
                        var cursor = collection.find({}, {projection:{documents:0}});//Cut out documents
                        var properties = [];
                        cursor.each(function(err, item) {
                            // If the item is null then the cursor is exhausted/empty and closed
                            if(item == null) {
                                resolve(properties);
                                return;
                            }
                            // otherwise, do something with the item
                            item.cap = item.price / item.rent;
                            properties.push(item);
                        });
                    })
                })
            };
            var callMyPromise = async () => {
                var result = await (myPromise());
                //anything here is executed after result is resolved
                return result;
            };
            callMyPromise().then(function(result) {
                client.close();
                response = {
                    properties: result
                };
                res.end(JSON.stringify(response));
            });
        }); 
    } catch (e) {
        next(e)
    }

});

app.post('/getUser', function(req, res){
    //Checking with Mongo
    var user = req.body.user;
    try {
        MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
            if (err) throw err;
            db = client.db("RealexAlpha");
            var myPromise = () => {
                return new Promise((resolve, reject) => {
                    db.collection("Users", (err, collection) => {
                        if (err) throw err;
                        var property = collection.find({"username":user}, {projection:{password:0}});
                        //This looks dumb
                        property.each(function(err, item) {
                            resolve(item);
                        });
                    })
                })
            };
            var callMyPromise = async () => {
                var result = await (myPromise());
                //anything here is executed after result is resolved
                return result;
            };
            callMyPromise().then(function(result) {
                client.close();
                response = {
                    user: result
                };
                res.end(JSON.stringify(response));
            });
        }); 
    } catch (e) {
        next(e)
    }
});

//Get one property from Mongo by id
app.post('/getProperty', function(req, res){
    //Checking with Mongo
    var id = req.body.id;
    try {
        MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
            if (err) throw err;
            db = client.db("RealexAlpha");
            var myPromise = () => {
                return new Promise((resolve, reject) => {
                    db.collection("Properties", (err, collection) => {
                        if (err) throw err;
                        var property = collection.find({"_id":ObjectID(id)});
                        //This looks dumb
                        property.each(function(err, item) {
                            resolve(item);
                        });
                    })
                })
            };
            var callMyPromise = async () => {
                var result = await (myPromise());
                //anything here is executed after result is resolved
                return result;
            };
            callMyPromise().then(function(result) {
                client.close();
                response = {
                    property: result
                };
                res.end(JSON.stringify(response));
            });
        }); 
    } catch (e) {
        next(e)
    }

});


//Change property status to publish and update user
app.post('/publishProperty', function(req, res){
    //Checking with Mongo
    var id = req.body.id;
    var username = req.body.username
    try {
        MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
            if (err) throw err;
            db = client.db("RealexAlpha");
            var myPromise = () => {
                return new Promise((resolve, reject) => {
                    db.collection("Users", (err, collection) => {
                        if (err) throw err;
                        collection.findOne({username: username}).then(item => {
                            //Make sure they do not already have too many published
                            if(item && item.numPublished >= item.canPublish) {
                                resolve(false);
                                return;
                            }
                            //Otherwise update user and publish this property
                            db.collection("Users", (err, collection) => {
                                if (err) throw err;
                                collection.findOneAndUpdate(
                                    {username: username},
                                    {"$inc": {"numPublished": 1}}
                                    //new: true,
                                    //upsert : true
                                ).then(result => {
                                    db.collection("Properties", (err, collection) => {
                                        if (err) throw err;
                                        collection.findOneAndUpdate(
                                            {_id:ObjectID(id)}, //may need to "_id"
                                            {"$set": {"published": true}}
                                            //new: true,
                                            //upsert : true
                                        ).then(result => {
                                            resolve(true);
                                        });
                                    })    
                                });
                            })  
                        });
                    })
                })
            };
            var callMyPromise = async () => {
                var result = await (myPromise());
                //anything here is executed after result is resolved
                return result;
            };
            callMyPromise().then(function(result) {
                client.close();
                response = {
                    result: result
                };
                res.end(JSON.stringify(response));
            });
        }); 
    } catch (e) {
        next(e)
    }

});


//Change property status to publish and update user
app.post('/unpublishProperty', function(req, res){
    //Checking with Mongo
    var id = req.body.id;
    var username = req.body.username
    try {
        MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
            if (err) throw err;
            db = client.db("RealexAlpha");
            var myPromise = () => {
                return new Promise((resolve, reject) => {
                    //unpublish this property and update user
                    db.collection("Properties", (err, collection) => {
                        if (err) throw err;
                        collection.findOneAndUpdate(
                            {_id:ObjectID(id)}, //may need to "_id"
                            {"$set": {"published": false}}
                            //new: true,
                            //upsert : true
                        ).then(result => {
                            db.collection("Users", (err, collection) => {
                                if (err) throw err;
                                collection.findOneAndUpdate(
                                    {username: username},
                                    {"$inc": {"numPublished": -1}}
                                    //new: true,
                                    //upsert : true
                                ).then(result => {
                                    resolve(true);
                                });
                            })    
                        });
                    })  
                })
            };
            var callMyPromise = async () => {
                var result = await (myPromise());
                //anything here is executed after result is resolved
                return result;
            };
            callMyPromise().then(function(result) {
                client.close();
                response = {
                    result: result
                };
                res.end(JSON.stringify(response));
            });
        }); 
    } catch (e) {
        next(e)
    }

});



//Delete one property from Mongo by id
app.post('/deleteProperty', function(req, res){
    //Checking with Mongo
    var id = req.body.id;
    var username = req.body.username;
    try {
        MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
            if (err) throw err;
            db = client.db("RealexAlpha");
            var myPromise = () => {
                return new Promise((resolve, reject) => {
                    //Check if published
                    db.collection("Properties", (err, collection) => {
                        if (err) throw err;
                        collection.findOne({_id:ObjectID(id)}).then(item => {
                            var published = item.published;
                            //delete property
                            collection.deleteOne({"_id":ObjectID(id)}).then((result) => {
                                if(result.deletedCount == 1) {
                                    //Update user's numPublished
                                    if (published) {
                                        db.collection("Users", (err, collectionUser) => {
                                            if (err) throw err;
                                            collectionUser.findOneAndUpdate(
                                                {username: username},
                                                {"$inc": {"numPublished": -1}}
                                                //new: true,
                                                //upsert : true
                                            ).then(result => {
                                                resolve(true);
                                            });
                                        })
                                    } else {
                                        resolve(true);
                                    }
                                } else {
                                    resolve(false);
                                }
                            })
                        });
                    })    
                })
            };
            var callMyPromise = async () => {
                var result = await (myPromise());
                //anything here is executed after result is resolved
                return result;
            };
            callMyPromise().then(function(result) {
                client.close();
                response = {
                    result: result
                };
                res.end(JSON.stringify(response));
            });
        }); 
    } catch (e) {
        next(e)
    }

});


//Remove one property from saved list
app.post('/unsaveProperty', function(req, res){
    //Checking with Mongo
    var id = req.body.id;
    var username = req.body.username
    try {
        MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
            if (err) throw err;
            db = client.db("RealexAlpha");
            var myPromise = () => {
                return new Promise((resolve, reject) => {
                    db.collection("Users", (err, collection) => {
                        if (err) throw err;
                        collection.findOneAndUpdate(
                            {username: username},
                            {"$pull": {"saved": id}}
                            //new: true,
                            //upsert : true
                        ).then(result => {
                            resolve(true);
                        });
                    })
                })
            };
            var callMyPromise = async () => {
                var result = await (myPromise());
                //anything here is executed after result is resolved
                return result;
            };
            callMyPromise().then(function(result) {
                client.close();
                response = {
                    result: result
                };
                res.end(JSON.stringify(response));
            });
        }); 
    } catch (e) {
        next(e)
    }

});




// Add property to Mongo
var cpUpload = upload.fields([{ name: 'picture', maxCount: 1 }, { name: 'documents', maxCount: 8 }])
app.post('/addProperty', cpUpload, function(req, res){
    var documents = [];
    if(req.files['documents']){
        documents = req.files['documents'].map((document) =>
            fs.readFileSync(document.path)
        );
    }
    var property = {
        picture: fs.readFileSync(req.files['picture'][0].path),
        address: req.body.address,
        price: req.body.price,
        rent: req.body.rent,
        owner: req.body.owner,
        documents: documents
    };
    //Checking with Mongo 
    try {
        MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
            if (err) throw err;
            db = client.db("RealexAlpha");
            var myPromise = () => {
                return new Promise((resolve, reject) => {
                    db.collection("Properties", (err, collection) => {
                        if (err) throw err;
                        resolve(collection.insertOne(property));
                    })
                })
            };
            var callMyPromise = async () => {
                await (myPromise());
                //anything here is executed after result is resolved
                return;
            };
            callMyPromise().then(function() {
                client.close();
                response = {
                    success: true
                };
                res.end(JSON.stringify(response));
            });
        }); 
    } catch (e) {
        next(e)
    }
});


var server = app.listen(8080, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})
