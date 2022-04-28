var express = require("express");
var path = require("path");
var fs = require("fs"); //in cmd :   npm install fs -s
var app = express();
const bodyParser = require("body-parser");
var session = require("express-session");
app.use(
  session({
    secret: "343ji43j4n3jn4jk3n",
    resave: true,
    saveUninitialized: true,
  })
);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));

//___________________________________coding starts here____________
var usernames = JSON.parse(fs.readFileSync("usernamefile.json"));
var passwords = JSON.parse(fs.readFileSync("passwordfile.json"));

app.get("/", function (req, res) {
  res.render("login", { title: "Express", msg2: "" });
});

var txt = "";
app.get("/registration", function (req, res) {
  res.render("registration", { title: "Registration", msg: "" });
});
console.log(usernames);
app.post('/login.username', function(req, res) {
  res.render('registration', { title: 'registration' });
});
var err = "username already exists";
app.post('/login.registration', function(req, res) {
  res.render('registration', { title: 'registration' });
});

let loadpass = function () {
  try {
    let bufferedData = fs.readFileSync("passwordfile.json");
    let stringData = bufferedData.toString();
    let pass = JSON.parse(stringData);
    return pass;
  } catch (error) {
    return "empty";
  }
};

app.post("/register", function (req, res) {
  //var usr=registration.getElementById("user").value
  var usr = req.body.username; // u0
  var pass = req.body.password; // p
  console.log(usr); // u1
  console.log(pass);
  if (usr == "") {
    console.log("empty username or password");
    var err = "empty username or password";
    res.render("registration.ejs", { msg: err });
  }
  if (pass == "") {
    console.log("empty username or password");
    var err = "empty username or password";
    res.render("registration.ejs", { msg: err });
  }
  if (usr == "" && pass == "") {
    console.log("empty username or password");
    var err = "empty username or password";
    res.render("registration.ejs", { msg: err });
  }
  if (check(usr, usernames)) {
    console.log("username already exists");
    var err = "username already exists";
    res.render("registration", { msg: err });
  } else {
    // p
    usernames.push(usr); // u2
    // console.log(usernames)              //
    passwords.push(pass); //
    var un = JSON.stringify(usernames); //
    console.log(un);
    var pw = JSON.stringify(passwords);
    console.log(pw); //
    fs.writeFileSync("usernamefile.json", un);
    fs.writeFileSync("passwordfile.json", pw);
    console.log("registration successful");
    var success = "registration successful";
    res.render("registration.ejs", { msg: success });

    // req.flash('error_mesg', 'A User with this name already exisit !!');
  }
});

function check(item, list) {
  for (i = 0; i < list.length; i++) {
    if (item == list[i]) {
      return true;
    }
  }
  return false;
}

if (process.env.PORT) {
  app.listen(process.env.PORT);
}
app.listen(3000);

//_______________________________login start___________________________________

app.post("/", function (req, res) {
  if (
    indexofusr(req.body.username, usernames) ===
    indexofpass(req.body.password, passwords)
  ) {
    req.session.name = req.body.username;
    res.render("home");
  } else res.render("login.ejs", { msg2: "wrong username or password" });
});

function indexofusr(a, b) {
  for (i = 0; i < b.length; i++) {
    if (a == b[i]) {
      return i;
    }
  }
  console.log("username. plz check username or register");
  return -1;
}
function indexofpass(a, b) {
  for (i = 0; i < b.length; i++) {
    if (a == b[i]) {
      return i;
    }
  }
  console.log("password incorrect . plz check username or register");
  return -2;
}

//_______________________________login end___________________________________

//__________________________________________________search start________________________________________________________________

app.post("/search", function (req, res) {
  //use .substring right away
  allfiles = [
    "action",
    "conjuring",
    "darkknight",
    "drama",
    "fightclub",
    "godfather",
    "godfather2",
    "home",
    "horror",
    "scream",
    "watchlist",
  ];
  resultats = matches(req.body.Search, allfiles);
  mssg3 = "";
  if (resultats.length == 0) mssg3 = "no matches for your search";
  res.render("searchresults", { msg3: mssg3, res: resultats });
});

function matches(str, opts) {
  matching = [];
  for (k = 0; k < opts.length; k++) {
    if (issub(str, opts[k])) matching.push(opts[k]);
  }
  return matching;
}

function issub(smol, longer) {
  var fit = true;
  for (i = 0; i < longer.length - smol.length; i++) {
    for (j = 0; j < smol.length; j++) {
      var fit = true;
      if (smol[j] != longer[i + j]) fit = false;
    }
    if (fit == true) return true;
  }
  return false;
}

let getMyWatchList = function () {
  let bufferedData1 = fs.readFileSync("watchList.json");
  let dataString = bufferedData1.toString();
  let list = JSON.parse(dataString);
  for (i = 0; i < MyWatchListF.length; i++) {
    if (MyWatchListF[i][0].localeCompare(req.session.name) == 0) {
      list = getMyWatchList[i];
    }
  }
  return list;
};

//__________________________________________________search end________________________________________________________________


//_________________________________________________________gets__________________________________________

app.get("/search", function (req, res) {
  res.render("searchresults");
});

app.get("/horror", function (req, res) {
  res.render("horror");
});

app.get("/watchlist", function (req, res) {
  var lizt = getMyWatchList;
  res.render("watchlist", { finaly: lizt });
});

app.get("/action", function (req, res) {
  res.render("action");
});

app.get("/drama", function (req, res) {
  res.render("drama");
});

app.get("/godfather", function (req, res) {
  res.render("godfather", { msg: "" });
});

app.get("/godfather2", function (req, res) {
  res.render("godfather2", { msg: "" });
});

app.get("/darkknight", function (req, res) {
  res.render("darkknight", { msg: "" });
});

app.get("/fightclub", function (req, res) {
  res.render("fightclub", { msg: "" });
});

app.get("/scream", function (req, res) {
  res.render("scream", { msg: "" });
});

app.get("/conjuring", function (req, res) {
  res.render("conjuring", { msg: "" });
});

function AddThisMovie(req, res, s) {
  console.log("MyWatchListF");

  var watch = fs.readFileSync("watchList.json");
  console.log("1");
  var MyWatchListF = JSON.parse(watch.toString());
  console.log("2");
  console.log(MyWatchListF);

  var list = [];

  list.push(req.session.name);
  list.push(s);
  //CASE 1 array is empty
  if (MyWatchListF.length == 0) {
    MyWatchListF.push(list);
  }
  //--------------------------------------------------
  else {
    console.log(req.session.name);
    var flagUser = false;
    var flag = false;
    for (i = 0; i < MyWatchListF.length; i++) {
      if (MyWatchListF[i][0].localeCompare(req.session.name) == 0) {
        //i found my user
        flagUser = true;
        //add this movie to the array if it's not in my array already
        for (j = 0; j < MyWatchListF[i].length; j++) {
          if (MyWatchListF[i][j] == s) {
            //I found it {

            res.render(s, { msg: "the movie is alreay added" });
            flag = true;
            break;
          }
        }
        if (flag == false) {
          MyWatchListF[i].push(s);
        }
      }
    }
    if (flagUser == false) {
      MyWatchListF.push(list);
    }
  }

  var final = JSON.stringify(MyWatchListF);
  fs.writeFileSync("watchList.json", final);
}

//_________________________________________________________posts__________________________________________

app.post("/godfather", function (req, res) {
  AddThisMovie(req, res, "godfather");
});

app.post("/godfather2", function (req, res) {
  AddThisMovie(req, res, "godfather2");
});

app.post("/darkknight", function (req, res) {
  console.log("posted");
  AddThisMovie(req, res, "darkknight");
});

app.post("/fightclub", function (req, res) {
  AddThisMovie(req, res, "fightclub");
});

app.post("/scream", function (req, res) {
  AddThisMovie(req, res, "scream");
});

app.post("/conjuring", function (req, res) {
  AddThisMovie(req, res, "conjuring");
});

//___________________________________coding ends here____________

module.exports = app;
