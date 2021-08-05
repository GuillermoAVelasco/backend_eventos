const Sequelize = require('sequelize');
const db = require('../config/db');
const Usuarios = require('./Usuarios');
const DetallesEventos = require('./DetallesEventos');

const Eventos = db.define('eventos', {
    id:{
        type:Sequelize.INTEGER(11),
        primaryKey:true,
        autoIncrement:true
    },
    titulo:{
        type:Sequelize.STRING(80),
        allowNull:false, 
        validate: {                        
            notEmpty:{
                msg: 'El Titulo no puede estar Vacio.'
            },
            isAlphanumeric: {
                msg: 'El Titulo solo puede contener letras y numeros.'
            },
        }
    },    
    descripcion:{
        type:Sequelize.TEXT,
        allowNull:false,
        validate:{
            notEmpty:{
                msg: 'La Descripcion no puede estar Vacia.'
            },
        }
    },   
    destacado:{
        type:Sequelize.BOOLEAN,
        defaultValue:false,
        allowNull:false,        
    },
    imagenUrl:{
        type:Sequelize.STRING(100),
        allowNull:false,
        validate: {                        
            is: {
                isUrl: true,
            },
        }          
    },
    localidad:{
        type:Sequelize.STRING(40),
        allowNull:false,
        validate:{
            notEmpty:{
                msg: 'La Localidad no puede estar Vacia.'
            },
        }
    },
});

//Crea las relaciones 
DetallesEventos.belongsTo(Eventos);
Eventos.hasOne(DetallesEventos);
Eventos.belongsTo(Usuarios);
Usuarios.hasMany(Eventos);

module.exports = Eventos;