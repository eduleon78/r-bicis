const nodemailer = require('nodemailer');

const mailConfig = ({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'lysanne.cummerata@ethereal.email',
        pass: 'Bu2Qczmvbfcm4ajSBK'
    }
});

module.exports = nodemailer.createTransport(mailConfig);