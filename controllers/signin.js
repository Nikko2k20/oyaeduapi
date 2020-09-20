const { hash } = require('./Helper');
const Session = require('./session');

const handleSignin = (db, hash) => (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json('i  ncorrect form submission');
  }
  db.select('email', 'hash as hashpwd').from('login')
    .where('email', '=', email)
    .then(data => {
      const isValid = hash.compareSync(password, data[0].hashpwd);
      if (isValid) {
        return db.select('*').from('users')
          .where('email', '=', email)
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
          .catch(err => res.status(400).json('unable to get user'))
      } else {
        res.status(400).json('wrong credentials')
      }
    })
    .catch(err => res.status(400).json('wrong credentials'))
}

module.exports = {
  handleSignin: handleSignin
}