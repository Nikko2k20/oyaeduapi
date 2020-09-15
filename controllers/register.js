const handleRegister = (req, res, db, bcrypt) => {
  const { email, name, password } = req.body;
  if (!email || !name || !password) {
    return res.status(400).json('incorrect form submission');
  }
  const hash = bcrypt.hashSync(password);
  const api_token = bcrypt.hashSync(Math.random(60));
  db.transaction(trx => {
    trx.insert({
      hash: hash,
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
          .then(user => {
            res.json(user[0]);
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
