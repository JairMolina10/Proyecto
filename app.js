const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");

const app = express();

// Configuración para manejar datos enviados por POST
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname + '/css'));

// Plantillas
app.set('view engine', 'ejs');

// Conexión a la base de datos
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'BanZorro58',
    database: 'node_crud',
    port: 3306
});

// Comprobar la conexión
db.connect(err => {
    if (err) {
        console.log("Error al conectar a la base de datos: " + err);
    } else {
        console.log("La base de datos funciona y está conectada");
    }
});

// Iniciar servidor
const port = 3308;
app.listen(port, () => {
    console.log(`El servidor está en http://localhost:${port}`);
});

// Listar usuarios
app.get('/', (req, res) => {
    const query = 'SELECT id, nombres, apellidos, numero_cuenta, edad, genero, carrera, telefono FROM users';
    db.query(query, (err, results) => {
        if (err) {
            console.error(`Error en DB: ${err}`);
            res.send('Error en la conexión a la base de datos');
        } else {
            res.render('index', { users: results });
        }
    });
});

// Mostrar formulario para agregar usuario
app.get('/add', (req, res) => {
    res.render('add');
});

app.post('/add', (req, res) => {
    const { nombres, apellidos, numero_cuenta, edad, genero, carrera, telefono } = req.body;
    const query = 'INSERT INTO users (nombres, apellidos, numero_cuenta, edad, genero, carrera, telefono) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(query, [nombres, apellidos, numero_cuenta, edad, genero, carrera, telefono], (err) => {
        if (err) {
            console.error("Error al agregar usuario:", err);
            res.send("Error al agregar usuario");
        } else {
            res.redirect('/');
        }
    });
});

// Editar usuario - Renderizar formulario
app.get('/edit/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT id, nombres, apellidos, numero_cuenta, edad, genero, carrera, telefono FROM users WHERE id = ?';
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error("Error en la consulta:", err);
            res.send('Error al obtener el usuario');
        } else {
            res.render('edit', { user: results[0] });
        }
    });
});

app.post('/edit/:id', (req, res) => {
    const { id } = req.params;
    const { nombres, apellidos, numero_cuenta, edad, genero, carrera, telefono } = req.body;
    const query = 'UPDATE users SET nombres = ?, apellidos = ?, numero_cuenta = ?, edad = ?, genero = ?, carrera = ?, telefono = ? WHERE id = ?';
    db.query(query, [nombres, apellidos, numero_cuenta, edad, genero, carrera, telefono, id], (err) => {
        if (err) {
            console.error("Error al editar usuario:", err);
            res.send("Error al editar usuario");
        } else {
            res.redirect('/');
        }
    });
});

// Eliminar usuario
app.get('/delete/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM users WHERE id = ?';
    db.query(query, [id], (err) => {
        if (err) {
            console.error("Error al eliminar usuario:", err);
            res.send("Error al eliminar usuario");
        } else {
            res.redirect('/');
        }
    });
});

