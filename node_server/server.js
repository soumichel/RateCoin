const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const port = 3000;

// Configurar o middleware para o body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configurar o diretório para os templates
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Armazenar o dataset em memória (pode ser substituído por uma base de dados)
let dataset = [];

// Endpoint para receber o dataset via POST
app.post('/dados', (req, res) => {
    dataset = req.body;
    return res.status(200).json({ message: 'Dados recebidos com sucesso.' });
});

// Endpoint para visualizar o dataset via GET
app.get('/dados', (req, res) => {
    res.status(200).json(dataset);
});

// Endpoint para exibir gráficos
app.get('/', (req, res) => {
    res.render('index', { data: dataset });
});

// Endpoint para exibir o formulário de notificação
app.get('/notify', (req, res) => {
    res.render('notify');
});

// Endpoint para receber e processar notificações
app.post('/notify', async (req, res) => {
    const { email, eventDate } = req.body;

    // Validar os dados recebidos
    if (!email || !eventDate) {
        return res.render('result', { 
            message: 'E-mail e data são necessários.',
            success: false
        });
    }

    // Encontrar a taxa de câmbio na data especificada
    const eventDateISO = new Date(eventDate).toISOString().split('T')[0];
    const dataItem = dataset.find(item => item.Data.split('T')[0] === eventDateISO);

    if (!dataItem) {
        return res.render('result', { 
            message: 'Dados não encontrados para a data especificada.',
            success: false
        });
    }

    const exchangeRate = dataItem['Taxa de câmbio - R$ / US$'];

    // Configurar o transportador do Nodemailer (está configurado para funcionar com o Gmail)
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER, 
            pass: process.env.PASSWORD, 
        }
    });

    // Configurar o conteúdo do e-mail
    const mailOptions = {
        from: process.env.EMAIL_USER,  // E-mail que enviará a mensagem
        to: email,  // E-mail do destinatário
        subject: 'Notificação de Taxa de Câmbio',
        text: `A taxa de câmbio do dólar em ${eventDateISO} foi de R$ ${exchangeRate.toFixed(2)}.`
    };

    try {
        await transporter.sendMail(mailOptions);
        return res.render('result', { 
            message: 'Notificação enviada com sucesso!',
            success: true
        });
    } catch (error) {
        return res.render('result', { 
            message: 'Erro ao enviar notificação.',
            success: false
        });
    }
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor ouvindo na porta ${port}`);
});
