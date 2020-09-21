const pool = require('../../databasePool')

class AccountTable {

    static updateSessionId(sessionId, email) {

        return new Promise((resolve, reject){

            pool.query(

                'UPDATE login SET "sessionid" = $1 WHERE "email"= $2 ',
                [sessionId, email],
                (error, response) => {
                    if (error) return reject(error);
                    resolve();

                }
            )
        });

    }
}

module.exports = AccountTable;