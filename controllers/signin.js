const { hash } = require('./Helper');
const { setSession } = require('./HelperSession');

const handleSignin = (db, hash) => (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json('incorrect form submission');
  }
  db.select('email', 'hash as hashpwd').from('login')
    .where('email', '=', email)
    .then(data => {
      const isValid = hash.compareSync(password, data[0].hashpwd);
      if (isValid) {
        return db.select('*').from('users')
          .where('email', '=', email)
          .then(() => {
            return setSession({ email, res });

          })
          .then(({ message }) => {
            res.json({ message });
          })
          .catch(error => next(error));

      } else {
        res.status(400).json('wrong credentials')
      }
    })
    .catch(err => res.status(400).json('wrong credentials'))
}

module.exports = {
  handleSignin: handleSignin
}