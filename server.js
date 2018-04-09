const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const knex = require('knex');

const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        password: 'postgres',
        database: 'smart-brain'
    }
});

// postgres.select('*').from('users').then(data => {
//     console.log(data)
// });

const app = express();

app.use(bodyParser.json());
app.use(cors());

// it's just an example for developing purpose,
// we are gonna use an actual db eventually!
const database = {
    users: [
        {
            id: '123',
            name: 'John',
            email: 'john@email.com',
            password: 'cookies',
            entries: 0,
            joined: new Date()
        },
        {
            id: '124',
            name: 'Sally',
            email: 'sally@email.com',
            password: 'bananas',
            entries: 0,
            joined: new Date()
        }
    ]
}

app.get('/', (req, res) => {
    res.send(database.users);
})

app.post('/signin', (req, res) => {
    if(req.body.email === database.users[0].email &&
            req.body.password === database.users[0].password) {
        res.json(database.users[0]);
    } else {
        res.status(400).json('error logging in');
    }
})

app.post('/register', (req, res) => {
    const {email, name, password} = req.body;
    database.users.push(
        db('users').insert({
            email: email,
            name: name,
            joined: new Date()
        }).then(console.log)
    );
    res.json(database.users[database.users.length - 1]);
})

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    database.users.forEach(user => {
        if(user.id === id) {
            return res.json(user);
        }
    });

    res.status(400).json('no such user');
})

app.put('/image', (req, res) => {
    const { id } = req.body;
    database.users.forEach(user => {
        if (user.id === id) {
            user.entries++;
            return res.json(user.entries);
        }
    });

    res.status(400).json('no such user');
})

app.listen(3000, () => {
    console.log('server is running on port 3000')
})
