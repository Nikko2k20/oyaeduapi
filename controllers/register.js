const { hashcrypt } = require('./Helper');
const Session = require('./session');

const handleRegister = (req, res, db, hash) => {
  const { email, name, password } = req.body;
  if (!email || !name || !password) {
    return res.status(400).json('incorrect form submission');
  }
  const hashcrypt = hash.hashSync(password);
  const api_token = hash.hashSync(Math.random(60));
  db.transaction(trx => {
    trx.insert({
      hash: hashcrypt,
      email: email,
      api_token: api_token
    })
      .into('login')
      .returning('id')
      .then(userid => {
        return trx('users')
          .returning('*')
          .insert({
            email: email,
            name: name,
            joined_date: new Date(),
            user_id: userid[0],
            api_token: api_token,
            sessionid: ''
          })
          .then(() => {
            res.json({ message: 'success' });
            //return setSession({ email, res });
          })
      })
      //.then(trx.commit)
      .then(({ message }) => { })
      .catch(trx.rollback)
  })
    .catch(err => res.status(400).json('unable to register'))
}

module.exports = {
  handleRegister: handleRegister
};
