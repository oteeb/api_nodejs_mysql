const express = require('express')
const mysql = require('mysql');

const app = express();
app.use(express.json());

// MySQL Connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'mysql_nodejs',
    //port: '8889'
})

connection.connect((err) => {
    if (err) {
        console.log(' ไม่สามารถเชื่อมต่อฐานข้อมูลได้ = ', err)
        return;
    }
    console.log('เชื่อมต่อฐานข้อมูลได้สำเร็จ');
})

// CREATE Routes
app.post("/create", async (req, res) => {
    const { email, name, password } = req.body;

    try {
        connection.query(
            "INSERT INTO users(email, fullname, password) VALUES(?, ?, ?)",
            [email, name, password],
            (err, results, fields) => {
                if (err) {
                    console.log("ไม่สามารถเพิ่มข้อมูลได้", err);
                    return res.status(400).send();
                }
                return res.status(201).json({ message: "เพิ่มข้อมูลได้สำเร็จ"});
            }
        )
    } catch(err) {
        console.log(err);
        return res.status(500).send();
    }
})

// READ
app.get("/read", async (req, res) => {
    try {
        connection.query("SELECT * FROM users", (err, results, fields) => {
            if (err) {
                console.log(err);
                return res.status(400).send();
            }
            res.status(200).json(results)
        })
    } catch(err) {
        console.log(err);
        return res.status(500).send();
    }
})

// READ single users from db
app.get("/read/single/:email", async (req, res) => {
    const email = req.params.email;

    try {
        connection.query("SELECT * FROM users WHERE email = ?", [email], (err, results, fields) => {
            if (err) {
                console.log(err);
                return res.status(400).send();
            }
            res.status(200).json(results)
        })
    } catch(err) {
        console.log(err);
        return res.status(500).send();
    }
})

// UPDATE data
app.patch("/update/:id", async (req, res) => {
    const newid = req.params.id;
    const newPassword = req.body.newPassword;

    try {

        connection.query("SELECT * FROM users WHERE id = ?", [newid], (err, results, fields) => {
            if (err) {
                console.log(err);
                return res.status(400).send();
            }
            if(results.length > 0){
                if(newPassword === ''){
                    return res.status(200).json({ message: "ไม่มีข้อมูลที่จะ updated"});
                }else{
                    connection.query("UPDATE users SET password = ? WHERE id = ?", [newPassword, newid], (err, results, fields) => {
                        if (err) {
                            console.log(err);
                            return res.status(400).send();
                        }
                        res.status(200).json({ message: "updated ข้อมูลสำเร็จ"});
                    })
                }
            }else{
                return res.json({message: 'ไม่มี ID นี้!!'});
            }
        })
    } catch(err) {
        console.log(err);
        return res.status(500).send();
    }
})

// DELETE
app.delete("/delete/:id", async (req, res) => {
    const id = req.params.id;

    try {
        connection.query("DELETE FROM users WHERE id = ?", [id], (err, results, fields) => {
            if (err) {
                console.log(err);
                return res.status(400).send();
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({ message: "ไม่มีข้อมูลที่จะลบ"});
            }
            return res.status(200).json({ message: "ลบข้อมูลสำเร็จ"});
        })
    } catch(err) {
        console.log(err);
        return res.status(500).send();
    }
})


app.listen(3000, () => console.log('Server is running on port 3000'));