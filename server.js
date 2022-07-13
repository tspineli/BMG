const express = require("express");
const fs = require("fs");
const app = express();
const scripts = require("./scripts");


app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));


app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.get("/concluido", (req, res) => {
  res.sendFile(__dirname + "/views/concluido.html");
});

app.get("/env", scripts.env); 

app.get("/teste", scripts.teste); 

app.get("/redir", scripts.redir); 

app.post("/form", scripts.criacontrato); 

app.post("/criaenv", scripts.criaenv);

app.get("/credito", (req,res) => {
  res.sendFile(__dirname + "/views/credito.html");
});

app.get("/simulador", (req,res) => {
  res.render(__dirname + "/views/simulador");
});

app.get("/close", (req, res) => {
  res.sendFile(__dirname + "/views/close.html");
});

module.exports = app;

// listen for requests :)
// const listener = app.listen(3000, () => {
//   console.log("Your app is listening on port " + listener.address().port);
// });
