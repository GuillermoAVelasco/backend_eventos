const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuarios = require('../models/Usuarios');

//valida token
exports.validaToken=async(token)=>{
    const decifraToken = jwt.verify(token, process.env.SECRET) || null;
    
    if(!token || !decifraToken.id){
        return false;
    }
    
    return true;
};

// Obtener el token del encabezado
exports.getToken = req => {
    const authorization = req.get('Authorization');
    if(authorization && authorization.toLowerCase().startsWith('bearer ')){
        return authorization.substring(7);
    }
    return null;
}

/**
 * tokenUsuario
 * Datos Post Entrada: usuario,clave retorna Token
 */

exports.tokenUsuario = async(req,res) => {
    try{
        const { usuario, clave } = req.body;

        if(!usuario || !clave) return res.status(404).json({ Error: 'Los campos Usuario y Password es requerido'});

        const result = await Usuarios.findOne({
            where: {
                usuario
            }            
        });        
        if(result.length !== 0){
            const claveCorrecta = await bcrypt.compare(clave, result.clave);
            if(!(result && claveCorrecta)){
                return res.status(401).json({ Error: 'Usuario o Password incorrectos' });
            } else {
                const usuarioToken = {
                    usuario,
                    id: result.id
                }                
                const token = jwt.sign(usuarioToken, process.env.SECRET);                                  
                return res.status(200).json({
                    token, usuario
                });
            }       
        } else {            
            return res.status(404).json({ Error: 'No existe el usuario' });        
        }
    }
    catch(error){        
        return res.status(404).json(error);
    }
}

exports.decodificaToken=(token)=> jwt.verify(token, process.env.SECRET) || null;