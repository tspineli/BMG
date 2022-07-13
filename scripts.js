var axios = require("axios");
const docusign = require("docusign-esign");
var request = require("request");
const fs = require("fs");
const configuracoes = require('./configuracoesDS');
const accountid = configuracoes.accountid;
const jwt = require("./jwt");

async function env(req, res) {
  let base64id = req.query.id;

  var fileURL = "./public/data/" + base64id + ".json";
  var arq = fs.readFileSync(fileURL);
  var obj = JSON.parse(arq);
  let nome = obj.nome;
  let email = obj.email;
  let idenv = obj.envid;
  let cuid = obj.cuid;

  //let redirect = req.protocol + "://" + req.get("host") + "/concluido";
  let redirect = "https://postsign.docusign.com/postsigning/pt-BR/finish-signing";
  let token = await jwt.geratoken();

  let dsApiClient = new docusign.ApiClient();
  dsApiClient.setBasePath("https://demo.docusign.net/restapi");
  dsApiClient.addDefaultHeader("Authorization", "Bearer " + token);
  docusign.Configuration.default.setDefaultApiClient(dsApiClient);

  let envelopesApi = new docusign.EnvelopesApi();

  let recipientViewRequest = docusign.RecipientViewRequest.constructFromObject({
    authenticationMethod: "biometric",
    clientUserId: cuid,
    returnUrl: redirect,
    userName: nome,
    email: email
  });

  let pagina = await envelopesApi.createRecipientView(accountid, idenv, {
    recipientViewRequest: recipientViewRequest
  });
  console.log(pagina);
  res.redirect(pagina.url);
}

async function criaenv(req, res) {
  let token = await jwt.geratoken();
  let data = req.body;
  let codigo = Date.now().toString();
  let buff = new Buffer.from(codigo);
  let base64id = buff.toString("base64");
  let fullface = "https://fullfacelab.com/FFWebDocusign/biometria?cpf="+data.cpf+"&redirecturl=";
  let redirurl = fullface + req.protocol + "://" + req.get("host") + "/env?id=" + encodeURI(base64id);
console.log(redirurl);
  
  let envelopeDefinition = docusign.EnvelopeDefinition.constructFromObject({
    templateId: "b27047bb-7fc5-4d27-8845-109535fd6663",
    status: "sent"
  });

  let Cliente = docusign.TemplateRole.constructFromObject({
    roleName: "Cliente",
    clientUserId: "123",
//    embeddedRecipientStartURL: redirurl,
    email: data.email,
    name: data.nome,
    recipientId: "1"
  });

  envelopeDefinition.templateRoles = [Cliente];

  let dsApiClient = new docusign.ApiClient();
  dsApiClient.setBasePath("https://demo.docusign.net/restapi");
  dsApiClient.addDefaultHeader("Authorization", "Bearer " + token);
  docusign.Configuration.default.setDefaultApiClient(dsApiClient);

  let envelopesApi = new docusign.EnvelopesApi();
  let results = await envelopesApi.createEnvelope(accountid, {
    envelopeDefinition: envelopeDefinition
  });

  const envelopeId = results.envelopeId;
  console.log(envelopeId);

  var objeto = {};
  objeto.nome = data.nome;
  objeto.email = data.email;
  objeto.envid = envelopeId;
  objeto.cuid = "123";
  let texto = JSON.stringify(objeto);
  console.log(texto);

  var fileURL = "./public/data/" + base64id + ".json";
  fs.writeFileSync(fileURL, texto, function(err) {
    if (err) throw err;
  });

res.redirect(redirurl);
//  res.end("Envelope Enviado");
}

async function criacontrato (req, res) {
  console.log("na funcao");
  let token = await jwt.geratoken();
  console.log(token);
  let data = req.body;
  console.log(data);
  
  let envelopeDefinition = docusign.EnvelopeDefinition.constructFromObject({
    templateId: "fd499ac3-37c3-41ba-81f0-7fcf683dc61d",
    status: "sent"
  });

  let Cliente = docusign.TemplateRole.constructFromObject({
    roleName: "Cliente",
    email: data.email,
    name: data.nome+" "+data.sobrenome,
    recipientId: "1"
  });

  console.log("ok1");

  envelopeDefinition.templateRoles = [Cliente];

  let dsApiClient = new docusign.ApiClient();
  dsApiClient.setBasePath("https://demo.docusign.net/restapi");
  dsApiClient.addDefaultHeader("Authorization", "Bearer " + token);
  docusign.Configuration.default.setDefaultApiClient(dsApiClient);

  let envelopesApi = new docusign.EnvelopesApi();
  let results = await envelopesApi.createEnvelope(accountid, {
    envelopeDefinition: envelopeDefinition
  });

  const envelopeId = results.envelopeId;
  console.log(envelopeId);

res.redirect('./');
}

async function criaenv2(req, res) {
  if (req.body.nome2==""){criaenv(req,res);return;};
  let token = await jwt.geratoken();
  let data = req.body;
  let codigo = Date.now().toString();
  let codigo2 = Date.now().toString()+"b";
  let buff = new Buffer.from(codigo);
  let buff2 = new Buffer.from(codigo2);
  let base64id = buff.toString("base64");
  let base64id2 = buff2.toString("base64");
  let fullface = "https://fullfacelab.com/FFWebDocusign/biometria?cpf="+data.cpf+"&redirecturl=";
  let fullface2 = "https://fullfacelab.com/FFWebDocusign/biometria?cpf="+data.cpf2+"&redirecturl=";
  let redirurl = fullface + req.protocol + "://" + req.get("host") + "/env?id=" + encodeURI(base64id);
  let redirurl2 = fullface2 + req.protocol + "://" + req.get("host") + "/env?id=" + encodeURI(base64id2);
console.log(redirurl);
  
  let envelopeDefinition = docusign.EnvelopeDefinition.constructFromObject({
    templateId: "08991704-f5b7-485f-a85d-9763454d6580",
    status: "sent"
  });

  let Cliente = docusign.TemplateRole.constructFromObject({
    roleName: "Cliente",
    clientUserId: "123",
    embeddedRecipientStartURL: redirurl,
    email: data.email,
    name: data.nome,
    recipientId: "1"
  });

    let Cliente2 = docusign.TemplateRole.constructFromObject({
    roleName: "Cliente2",
    clientUserId: "234",
    embeddedRecipientStartURL: redirurl2,
    email: data.email2,
    name: data.nome2,
    recipientId: "2"
  });
  
  envelopeDefinition.templateRoles = [Cliente,Cliente2];

  let dsApiClient = new docusign.ApiClient();
  dsApiClient.setBasePath("https://demo.docusign.net/restapi");
  dsApiClient.addDefaultHeader("Authorization", "Bearer " + token);
  docusign.Configuration.default.setDefaultApiClient(dsApiClient);

  let envelopesApi = new docusign.EnvelopesApi();
  let results = await envelopesApi.createEnvelope(accountid, {
    envelopeDefinition: envelopeDefinition
  });

  const envelopeId = results.envelopeId;
  console.log(envelopeId);

  var objeto = {};
  objeto.nome = data.nome;
  objeto.email = data.email;
  objeto.envid = envelopeId;
  objeto.cuid = "123";
  let texto = JSON.stringify(objeto);
  console.log(texto);

  var fileURL = "./public/data/" + base64id + ".json";
  fs.writeFileSync(fileURL, texto, function(err) {
    if (err) throw err;
  });

    var objeto2 = {};
  objeto2.nome = data.nome2;
  objeto2.email = data.email2;
  objeto2.envid = envelopeId;
  objeto2.cuid = "234";
  let texto2 = JSON.stringify(objeto2);
  console.log(texto2);

  var fileURL2 = "./public/data/" + base64id2 + ".json";
  fs.writeFileSync(fileURL2, texto2, function(err) {
    if (err) throw err;
  });
  
res.redirect('back');
//  res.end("Envelope Enviado");
}

async function teste(req, res) {

var crypto = require('crypto');

var mykey = crypto.createCipher('aes-128-cbc', 'tiago');
var mystr = mykey.update('texto', 'utf8', 'hex');
mystr += mykey.final('hex');
  console.log(mystr);
  
  /*  let codigo = Date.now().toString();
  let buff = new Buffer.from(codigo);
  let base64id = buff.toString("base64");

  var objeto = {};
  objeto.cor = "azul";
  objeto.modelo = "teste";
  let texto = JSON.stringify(objeto);
  console.log(texto);

  
  
  var fileURL = "./public/data/" + base64id + ".json";
  fs.writeFileSync(fileURL, texto, function(err) {
    if (err) throw err;
  });

  var arq = fs.readFileSync(fileURL);
  var obj = JSON.parse(arq);

  console.log(obj.cor);*/

  res.end("ok");
}


async function redir(req, res) {
  let pagina = req.query.redirecturl;
  res.redirect(pagina);
}


module.exports = { env, criaenv, teste, redir,criaenv2, criacontrato };
