const express = require('express')
const mysql = require('mysql')
const app = express()
const port = process.env.PORT || 3000;
const nodemailer = require('nodemailer')

app.set('view engine', 'ejs');
app.use(express.static(__dirname + 'public'));
app.use(express.json())
app.use(express.urlencoded({
    extended: false
}));

app.get('/', (req, res) => res.render('pages/home'))
app.get('/shop', (req, res) => res.render('pages/shop'))
app.get('/lookBook', (req, res) => res.render('pages/lookBook'))
app.get('/edition2', (req, res) => res.render('pages/edition2'))
app.get('/bestSellers', (req, res) => res.render('pages/bestSellers'))


app.get('/aboutus', (req, res) => res.render('pages/aboutUs'))

// conexion
const connection = mysql.createConnection({
    host: 'freedb.tech',
    user: 'freedbtech_lauraj',
    password: 'laura07',
    database: 'freedbtech_TrabajoFinalLauraDB'
})

//check connect
connection.connect(error => {
    if (error) throw error;
    console.log('Databaserunning ');
})

app.get('/clientes', (req, res) => {
    const sql = 'SELECT * FROM Usuarios';

    connection.query(sql, (error, results) => {
        if (error) {
            throw error;
        }
        res.render('pages/clientes', {
            'results': results
        })
    })
});

app.get('/contactus', (req, res) => res.render('pages/contactUs'))

app.post('/contactus', (req, res) => {
    const sql = `SELECT * FROM Usuarios WHERE correo = '${req.body.correo}'`;
    const sql2 = 'INSERT INTO Usuarios SET ?';

    const {nombre, correo, phone, message} = req.body;

    contentHTML = `
        <h1>Su informacion se ha enviado correctamente</h1>
        <ul>
            <li>Username: ${nombre}</li>
            <li>Email: ${correo} </li>
            <li>Phone: ${phone} </li>
        </ul>
        <p>${message}</p>
    `
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'laurajavierfinal@gmail.com',
            pass: 'Amberinteriors'
        }
    })
    const info = {
        from: 'laurajavierfinal@gmail.com',
        to:'laura27german@gmail.com',
        subject: 'Formulario de contacto',
        html: contentHTML
    }

    connection.query(sql, (error, results) => {
        if (error) {
            throw error;
        }
        if (!results.lenght > 0) {
            const usuariosObj = {
                nombre: req.body.nombre,
                correo: req.body.correo,
                phone: req.body.phone
            }

            connection.query(sql2, usuariosObj, error => {
                if (error) {
                    throw error;
                }
            })
            console.log('guardado')
           
        } 
         //enviar correo
         transporter.sendMail(info, error => {
            if (error) {
                throw error
            } else { 
                console.log('email enviado') 
            }
        })
    })
    res.render('pages/home')
})
app.listen(port, () => console.log('server running'))