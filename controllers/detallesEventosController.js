const DetallesEventos = require('../models/DetallesEventos');

/**
 * Crear Detalle
 */

 exports.crearDetalleEvento = async(req,res,next) => {
    const { fecha, hora, precio, id_evento } = req.body;
    try{                        
        const result = await DetallesEventos.create({
            fecha,
            hora,
            precio,            
            id_evento
        }); 
        if(result != null){
            return res.status(200).json(result.dataValues);
        } else {
            return res.status(404).json({                
                Error: 'No se pudo realizar la operacion'
            });        
        }
    }
    catch(error){
        return res.status(404).json(error);
    }
}

/**
 * Listar Detalles
 */
exports.listarDetallesEventos = async(req,res,next) => {
    try{
        
        const result = await DetallesEventos.findAll({});
        if(result.length !== 0){             
            return res.status(200).json(result);
        } else {            
            return res.status(404).json({                
                Error: 'No existen detalles eventos registrados'
            });        
        }
    }
    catch(error){        
        return res.status(404).json(error);
    }
}