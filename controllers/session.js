const { v4: uuid_v4 } = require('uuid');
const { hash } = require('./Helper');

const SEPARATOR = '|';

// Session Class
class Session {
    constructor({ email }) {
        this.email = email;
        this.id = uuid_v4();
    }

    toString() {
        const { email, id } = this;
        return Session.sessionString({ email, id });
    }

    static parse(sessionString) {
        const sessionData = sessionString.split(SEPARATOR);
        return {
            email: sessionData[0],
            id: sessionData[1],
            sessionHash: sessionData[2],

        }
    }
    static verify(sessionString) {
        const { email, id, sessionHash } = Session.parse(sessionString);
        const accountData = Session.accountData({ email, id });
        return hash(accountData) == sessionHash;

    }

    //function to concat the combination of email and uuid
    static accountData({ email, id }) {
        return `${email}${SEPARATOR}${id}`
    }
    static sessionString({ email, id }) {
        const accountData = Session.accountData({ email, id });
        return `${accountData}${SEPARATOR}${hash(accountData)}`;
    }

}
const foo = new Session({ email: 'zzzz@tttt.com' });
const fooString = foo.toString();



module.exports = Session;