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
            api_token: api_token
          })
          .then(() => {
            const session = new Session({ email });
            const sessionString = session.toString;
            res.cookie('sessionString', sessionString, {
              expire: Date.now() + 3600000,
              httpOnly: true,
              secure: true
            });
            res.json({ message: 'success' });
          })
      })
      .then(trx.commit)
      .catch(trx.rollback)
  })
    .catch(err => res.status(400).json('unable to register'))
}

module.exports = {
  handleRegister: handleRegister
};
