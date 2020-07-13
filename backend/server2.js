var express = require('express');
var cors = require('cors');
var MongoClient = require('mongodb').MongoClient;
var cookieParser = require('cookie-parser')
var session = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(session);

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
    origin: 'http://127.0.0.1:3000',
    credentials: true
}
app.use(cors(corsOptions))

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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
            user: req.session.username,
            count: req.session.page_views
        };
        console.log("USER IS LOGGED IN");
        res.end(JSON.stringify(response));
    } else {
        req.session.page_views++;
        response = {
            logged_in: false,
            user: "",
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



var server = app.listen(8080, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})