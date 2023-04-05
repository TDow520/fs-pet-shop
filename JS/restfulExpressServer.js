import dotenv from "dotenv";
import pg from "pg";
const { Client } = pg;
import express from "express";
import basicAuth from "express-basic-auth";

dotenv.config();

const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

let users = process.env.USERNAME.split(', ')
let pass = process.env.PASSWORD.split(', ')
let userPass = {}

for (let i = 0; i < users.length; i++){
    // console.log(users[i])
    // console.log(pass[i]);
    userPass[users[i]] = pass[i]
}
console.log(userPass)
app.use(basicAuth({
    users: userPass,
    challenge: true,
    realm: 'Required',
}));

// app.use(express.static("client"))

// client.connect()
// console.log(client)

app.get("/pets", async function (req, res1) {
    let client = new Client(process.env.DATABASE_URL);
    client.connect();
    const { rows } = await client.query("SELECT * FROM pet");
    res1.json(rows);
    client.end();
});

app.get("/pets/:petIndex", async function (req, res1, next) {
    let client = new Client(process.env.DATABASE_URL);
    client.connect();
    let index = Number(req.params.petIndex);
    const { rows } = await client.query(`SELECT * FROM pet WHERE id = ${index}`);
    if (rows.length === 0) {
        next({
        status: 404,
        error: "Not Found",
        });
    } else {
        console.log(rows);
        res1.json(rows);
    }
    client.end();
    });


    app.get("/boom", (req, res, next) => {
    next({
        status: 500,
        error: "Internal Server Error",
    });
});

app.post("/pets", async function (req, resp, next) {
    const text =
        "INSERT INTO pet (name, age, kind) VALUES($1, $2, $3) RETURNING *";
    let age = Number(req.body.age);
    let name = req.body.name;
    let kind = req.body.kind;
    const values = [name, age, kind];
    if (!age || !name || !kind || !Number.isFinite(age)) {
        next({
        status: 400,
        error: "Bad Request",
        });
    } else {
        let client = new Client(process.env.DATABASE_URL);
        await client.connect();
        client.query(text, values, (err, res) => {
        console.log(err ? err.stack : res.rows);
        resp.json(res.rows);
        client.end();
        });
    }
});

app.patch("/pets/:petIndex", function (req, resp, next) {
    let client = new Client(process.env.DATABASE_URL);
    client.connect();
    let index = Number(req.params.petIndex);
    let age = Number(req.body.age);
    let name = req.body.name;
    let kind = req.body.kind;
    if (!name && !kind && !age) {
        next({
        status: 400,
        error: "Bad Request",
        });
    }
    let updateText;
    let values;
    if (name) {
        updateText = "UPDATE pet SET name = $2 WHERE id=$1 RETURNING *";
        values = [index, name];
    }
    if (age) {
        updateText = "UPDATE pet SET age = $2 WHERE id=$1 RETURNING *";
        values = [index, age];
    }
    if (kind) {
        updateText = "UPDATE pet SET kind = $2 WHERE id=$1 RETURNING *";
        values = [index, kind];
    }

    client.query(updateText, values, (err, res) => {
        console.log(err ? err.stack : res.rows);
        resp.json(res.rows);
        client.end();
    });
});

app.delete("/pets/:petIndex", function (req, resp, next) {
    let client = new Client(process.env.DATABASE_URL);
    client.connect();
    let index = Number(req.params.petIndex);
    let text = "DELETE FROM pet WHERE id = $1 RETURNING *";
    let values = [index];
    client.query(text, values, (err, res) => {
        console.log(err ? err.stack : res.rows);
        resp.json(res.rows);
        client.end();
    });
});

app.put("/pets/:petIndex", function (req, resp, next) {
    let client = new Client(process.env.DATABASE_URL);
    client.connect();
    const text =
        "UPDATE pet SET name = $1, age = $2, kind = $3 WHERE id = $4 RETURNING *";
    let age = Number(req.body.age);
    let name = req.body.name;
    let kind = req.body.kind;
    let index = Number(req.params.petIndex);
    const values = [name, age, kind, index];

    client.query(text, values, (err, res) => {
        console.log(err ? err.stack : res.rows);
        resp.json(res.rows);
        client.end();
    });
    if (!age || !name || !kind || !Number.isFinite(age)) {
        next({
        status: 400,
        error: "Bad Request",
        });
    }
});

app.use((req, res, next) => {
    next({
        status: 404,
        error: "Not Found",
    });
});

app.use((err, req, res, next) => {
    es.status(err.status).send(err.error);
});

app.listen(port, () => {
    console.log(`The server is runing on port: ${port}`);
});
