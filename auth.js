const auth = require('basic-auth');
const compare = require('tsscmp');


function check(name, pass) {
  let valid = true;
  valid = compare(name, 'admin') && valid;
  valid = compare(pass, 'meowmix') && valid;
  return valid
}


const basicAuth = (request, response, next) => {
  const credentials = auth(request);
  if (credentials && check(credentials.name, credentials.pass)) {
    return next()
  }
  response.set('WWW-Authenticate', 'Basic realm="petshop"');
  return response.status(401).send('invalid credentials')

};

module.exports = basicAuth;

