const Sequelize = require('sequelize');
const db = require('../config/db');

const DetallesEventos = db.define('detalleseventos', {
    id:{
        type:Sequelize.INTEGER(11),
        primaryKey:true,
        autoIncrement:true
    },
    fecha:{
        type:Sequelize.DATEONLY,
        allowNull:false,
        validate:{
            notEmpty:{
                msg: 'La Fecha no puede estar Vacia.'
            },
        }
    },
    hora:{
        type:Sequelize.TIME,
        allowNull:false,
        validate:{
            notEmpty:{
                msg: 'La Hora no puede estar Vacia.'
            },
        }    
    },
    precio:{
        type:Sequelize.DECIMAL(14,2),
        allowNull:false,
        validate:{
            notEmpty:{
                msg: 'El Precio no puede estar Vacio.'
            },
        }
    }
});

module.exports = DetallesEventos;