const Session = require('./session');
const { hash } = require('./Helper');

const setSession = ({ email, res }) => {
    return new Promise((resolve, reject) => {

        const session = new Session({ email });
        const sessionString = session.toString;

        AccountTable.updateSessionId({
            sessionId: session.id,
            emai: hash(email)
        })
            .then(() => {

                res.cookie('sessionString', sessionString, {
                    expire: Date.now() + 3600000,
                    httpOnly: true,
                    secure: true

                });
                resolve({ message: 'session created' });

            })
            .catch(error => reject(error));




    });
}

module.exports = { setSession };

