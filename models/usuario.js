var mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
var Reserva = require('./reserva');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

const Token = require('../models/token');
const mailer = require('../mailer/mailer');

const saltRound = 10;

var Schema = mongoose.Schema;

const validateEmail = function(email) {
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
};

var usuarioSchema = new Schema({
    nombre: {
        type: String,
        trim: true,
        required: [true, 'El nombre es Obligatorio']
    },
    email: {
        type: String,
        trim: true,
        required: [true, 'El email es Obligatorio'],
        lowercase: true,
        unique: true,
        validate: [validateEmail, 'Por favor, ingrese un email valido'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/]
    },
    password: {
        type: String,
        required: [true, 'El password es Obligatorio']
    },
    passwordResetToken: String,
    passwordResetTokenExpires: Date,
    verificado: {
        type: Boolean,
        default: false
    }
});

usuarioSchema.plugin(uniqueValidator, { message: 'El {PATH} ya existe con otro usuario.'});

usuarioSchema.pre('save', function(next){
    if (this.isModified('password')){
        this.password = bcrypt.hashSync(this.password, saltRound);
    }
    next();

});

usuarioSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password, this.password);
}

usuarioSchema.methods.reservar = function(biciId, desde, hasta, cb) {
    var reserva = new Reserva({usuario: this._id, bicicleta: biciId, desde: desde, hasta: hasta});
    console.log(reserva);
    reserva.save(cb);
}

usuarioSchema.methods.enviar_email_bienvenida = function(cb) {
    const token = new Token({_userId: this.id, token: crypto.randomBytes(16).toString('hex')});
    const email_destination = this.email;
    token.save(function (err) {
        if (err) { return console.log(err.message); }

        var mailOptions = {
            from: 'no-replay@redes_bicicletas.com',
            to: email_destination,
            subject: 'verificacion de cuenta',
            text: 'hola estimado ciclista: \n\n' + 'Por favor, para vericar tu cuenta haga click en el siguiente enlace: \n' + 'http://localhost:5000' + '\/token/confirmation\/' + token.token + '\n'
        };
        mailer.sendMail(mailOptions, function (err) {
            if (err) console.log(err);

            console.log('Se ha enviado un email de bienvenida a: ' + email_destination + ':')
        });
    });
}

usuarioSchema.statics.findOneOrCreateByGoogle = function findOneOrCreate(condition, callback) {
    const self = this;
    console.log(condition);
    self.findOne({
        $or:[
            {'googleId': condition.id},{'email': condition.emails[0].value}
        ]}, (err, result) => {
            if (result) {
                callback(err, result)
            }else{
                console.log('----------- CONDITION -----------');
                console.log(condition);
                let values = {};
                values.googleId = condition.id;
                values.email = condition.emails[0].value;
                values.nombre = condition.displayName || 'SIN NOMBRE';
                values.verificado = true;
                values.password = condition.__json.etag;
                console.log('----------- VALUES -----------');
                console.log(values);
                self.create(values, (err, result) => {
                    if (err) { console.log(err);}
                    return callback(err, result)
                })
            }
    })
};
module.exports = mongoose.model('Usuario', usuarioSchema);