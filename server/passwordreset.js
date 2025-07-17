// Save this as hash.js and run: node hash.js
const bcrypt = require('bcrypt');
const password = 'Fitzroy123';
bcrypt.hash(password, 10, (err, hash) => {
  if (err) throw err;
  console.log(hash);
});