var express = require("express");
var cors = require("cors");
var bodyParser = require("body-parser");
const { check, validationResult, param } = require("express-validator");
// custom module
const {
  searchPerson,
  insertPerson,
  updatePerson,
  deletePerson,
} = require("./model/lab101.model");

// load .env
require("dotenv").config();

// check Validator
const formsaveDataValidator = [
  check("firstname").not().isEmpty().withMessage("Please input your Firstname"),
  check("lastname").not().isEmpty().withMessage("Please input your Lastname"),
];

// start express
var app = express();
app.use(cors());

const rawBodySaver = (req, res, buf, encoding) => {
  if (buf && buf.length) {
    req.rawBody = buf.toString(encoding || "utf8");
  }
};

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json({ verify: rawBodySaver }));

// start ejs (Embedded JavaScript templates)
app.set("view engine", "ejs");

// list data
app.get("/", async function (req, res) {
  let results = await searchPerson(res);
  res.render("listdata", {
    resultsPerson: results.recordset,
  });
});

// input form
app.get("/form", function (req, res) {
  res.render("formdata");
});

// update form
app.get("/update/:id", function (req, res) {
  console.log(req.params.id);
  // query for get name
  // ...

  res.render("updatedata", {
    idPerson: req.params.id,
  });
});

// delete form
app.get("/delete/:id", async function (req, res) {
  console.log(req.params.id);
  // query for get name
  // ...
  let results = await deletePerson(res,req.params.id);
  if (results == 1) {
    return res.redirect("/");
  } else {
    console.log(results);
  }
});

// insert new record
app.post("/formsave", formsaveDataValidator, async function (req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.render("formdata", {
      initData: req.body,
      errorData: errors.mapped(),
    });
  } else {
    let my_paylaod = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
    };

    console.log("insert new record: " + my_paylaod);

    let results = await insertPerson(res, my_paylaod);

    if (results == 1) {
      return res.redirect("/");
    } else {
      console.log(results);
    }
  }
});

app.post("/updatesave", formsaveDataValidator, async function (req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.render("updatedata", {
      initData: req.body,
      errorData: errors.mapped(),
    });
  } else {
    let my_paylaod = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      id: req.body.idperson,
    };

    console.log("update: " + my_paylaod);

    let results = await updatePerson(res, my_paylaod);

    if (results == 1) {
      return res.redirect("/");
    } else {
      console.log(results);
    }
  }
});

app.listen(process.env.PORT, () => {
  console.log("server run at port " + process.env.PORT);
});
