const express = require("express");
const hbs = require("hbs");
const path = require("path");
const https = require("https");
const port = process.env.PORT || 3000;

const app = express();

const publicStaticPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);
app.use(express.static(publicStaticPath));

app.use(express.static("public"));
app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());

// Home page
app.get("", (req, res) => {
  res.render("index");
});

// Weather page
app.get("/weather", (req, res) => {
  res.render("weather");
});

// Newsletter signup page
app.get("/signup", function (req, res) {
  res.render("newsletter");
});

// Acquiring data
app.post("/signup", function (req, res) {
  var firstName = req.body.fname;
  var secondName = req.body.lname;
  var email = req.body.email;

  const data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: secondName,
      },
    }, ],
  };
  const jsonData = JSON.stringify(data);
  const url = "https://us1.api.mailchimp.com/3.0/lists/eed95ab12a";
  const options = {
    method: "POST",
    auth: "Shalini:81d7ae55a37b093439f645253c8c2dda-us1",
  };

  const request = https.request(url, options, function (response) {
    if (response.statusCode == 200) {
      res.render("success");
    } else {
      res.render("failure");
    }

    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
  });
  request.write(jsonData);
  request.end();
});

// Signup fail
app.post("/failure", function (req, res) {
  res.render("newsletter");
});

// Handling any other route
app.get("*", (req, res) => {
  res.send("Page not found!");
});

app.listen(port, () => {
  console.log("Server is up and running on port", port);
});