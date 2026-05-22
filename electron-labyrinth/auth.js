const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const db = require('./database');

const SECRET = 'maze_secret_key';

function register(username, password, callback) {

    const hashedPassword =
        bcrypt.hashSync(password, 10);

    db.run(

        `
        INSERT INTO users
        (
            username,
            password
        )
        VALUES (?, ?)
        `,

        [
            username,
            hashedPassword
        ],

        function(err) {

            if(err) {

                callback(err);

            } else {

                const token = jwt.sign(

                    {
                        id: this.lastID,
                        username
                    },

                    SECRET
                );

                callback(null, token);
            }
        }
    );
}

function login(username, password, callback) {

    db.get(

        `
        SELECT *
        FROM users
        WHERE username = ?
        `,

        [username],

        (err, user) => {

            if(err || !user) {

                callback(
                    'Utilisateur introuvable'
                );

                return;
            }

            const valid =
                bcrypt.compareSync(
                    password,
                    user.password
                );

            if(!valid) {

                callback(
                    'Mot de passe incorrect'
                );

                return;
            }

            const token = jwt.sign(

                {
                    id: user.id,
                    username: user.username
                },

                SECRET
            );

            callback(

                null,

                token,

                {
                    id: user.id,
                    username: user.username,
                    role: user.role
                }
            );
        }
    );
}

module.exports = {

    register,

    login
};