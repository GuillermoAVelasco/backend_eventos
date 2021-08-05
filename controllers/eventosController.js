//Importamos las dependencias
const {Op} = require('sequelize');
const Usuarios = require('../models/Usuarios')
const Eventos = require('../models/Eventos');
const DetallesEventos = require('../models/DetallesEventos');
const loginController= require('../controllers/loginController');

/**
 * Listar todos los eventos ordenados por fecha
 */
exports.listarEventos = async (req, res) => {
    const hoy = new Date();
    const fdia = hoy.getDate(),
        fmes = hoy.getMonth(),
        fanio= hoy.getFullYear();
    let fechaHoy = String(fanio+"-"+fmes+"-"+fdia);
    fechaHoy = new Date(fechaHoy);

    try {
        const result = await Eventos.findAll({
            attributes: ["titulo", "descripcion","localidad", "destacado", "imagenUrl"],
            include: [
                {
                    attributes: ["fecha", "hora", "precio"],
                    model: DetallesEventos,
                    where: { fecha: {[Op.gte]:fechaHoy} },
                    as: "detallesevento",
                }, 
            ],
            order: [
                ["detallesevento", "fecha", "desc"],
                ["detallesevento", "hora", "desc"],
            ]
        });

        if (result.length !== 0) {
            return res.status(200).json(result);
        } else {
            return res.status(404).json({
                Error: "No existen eventos.",
            });
        }
    } catch (error) {
        return res.status(404).json(error);
    }
};

/**
 * Listar los detalles de un evento por id
 * Parametro Entrada: id
 */

 exports.ListarEvento = async (req, res) => {
    try {
        const { id } = req.params;
        
        const result = await Eventos.findAll({
            where: {
                id,
            },
            attributes: ["titulo", "descripcion", "localidad", "destacado", "imagenUrl"],
            include: [
                {
                    attributes: ["fecha", "hora", "precio"],
                    model: DetallesEventos,
                    as: "detallesevento",
                },
            ],
        });
        
        if (result.length !== 0) {
            return res.status(200).json(result);
        } else {
            return res.status(404).json({
                Error: "No se encontro el evento.",
            });
        }
    } catch (error) {
        return res.status(404).json(error);
    }
};

/**
 * Compartir por Twitter un Evento retorna mensaje formateado
 * Parametro Entrada: id
 */

exports.twitter = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Eventos.findAll({
            where: {
                id
            },
            attributes: ["titulo", "imagenUrl"],
            include: [
                {
                    attributes: ["fecha"],
                    model: DetallesEventos,
                    as: "detallesevento",
                },
            ],
        });        
        if (result.length !== 0) {
            const resultObject = result.map(ro =>{
                return Object.assign({},{
                    titulo: ro.titulo,
                    imagenUrl: ro.imagenUrl,
                    fecha: result[0].detallesevento.fecha
                });                
            });                        
            const respuesta = `Ire al ${resultObject[0].titulo} @ ${resultObject[0].fecha} ${resultObject[0].imagenUrl}`            
            return res.status(200).json(respuesta);
        } else {            
            return res.status(404).json({
                Error: "No se encontro el evento.",
            });
        }
    } catch (error) {
        return res.status(404).json(error);
    }    
};

/**
 * Listar Eventos Destacados
 * 
 */

exports.listarEventosDestacados = async (req, res) => {  
    const hoy = new Date();
        fdia = hoy.getDate();
        fmes = hoy.getMonth();
        fanio= hoy.getFullYear();
        fechaHoy = String(fanio+"-"+fmes+"-"+fdia);
        fechaHoy = new Date(fechaHoy);       
        
    try {        
        const result = await Eventos.findAll({
            where: {
                destacado: 1,
            },
            attributes: ["titulo", "descripcion", "imagenUrl"],
            include: [
                {
                    attributes: ["fecha", "hora", "precio"],
                    model: DetallesEventos,
                    where: { fecha: {[Op.gte]:fechaHoy} },
                    as: "detallesevento",
                },
            ],
            order: [
                ["detallesevento", "fecha", "desc"],
                ["detallesevento", "hora", "desc"],
            ],
        });        
        if (result.length !== 0) {
            return res.status(200).json(result);
        } else {
            return res.status(404).json({
                Error: "No existen eventos destacados.",
            });
        }
    } catch (error) {
        return res.status(404).json(error);
    }
};

/***************** AUTENTICADO ******************/

/**
 * Crear Evento y Detalles
 * Requerimiento: Autenticacion de Usuario Token
 * Datos Post Entrada Evento: titulo, descripcion,destacado,imagenUrl,localidad
 *                    Detalle: fecha,hora,precio
 */

exports.crearEvento = async (req, res) => {
    const { titulo, descripcion, destacado, imagenUrl, localidad} = req.body;    
    try {
        const token = loginController.getToken(req) || null;
        const decifraToken = loginController.decodificaToken(token);
    
        if(!loginController.validaToken(token)){
            return res.status(401).json({ Error: "Token incorrecto." });
        }

        const usuario = await Usuarios.findOne({
            where: {
                id: decifraToken.id
            }
        });

        const result=await Eventos.findOne({
            where:{
                [Op.and]:[{titulo},{imagenUrl}]
            }});

        if(result) {
            return res.status(404).json({ Error: "Ya se encuentra ingresado un Evento con el mismo Titulo,ImagenUrl" });
        }         

        const nuevoEvento = {
            titulo,
            descripcion,
            destacado,
            imagenUrl,
            localidad,
            usuarioId: usuario.id
        }
        const eventoCreado = await Eventos.create(nuevoEvento);
        if (eventoCreado != null) {
            const eventoId = eventoCreado.id;
            
            detalle=[]
            req.body.detalles.forEach(async (det)=> {
                const {fecha,hora,precio}=det;
                const nuevaFecha={ fecha,hora,precio,eventoId }
                await DetallesEventos.create(nuevaFecha).then(detalle.push(nuevaFecha));
            });

            if(detalle != null) {
                const result = { ...eventoCreado.dataValues,detalle: {detalle} } 
                return res.status(200).send(result);
            } else {
                return res.status(404).json({ Error: "No se pudo realizar la operacion" });
            }
            
        } else {
            return res.status(404).json({ Error: "No se pudo realizar la operacion" });
        }
    } catch (error) {
        return res.status(404).json(error);
    }
};


/**
 * Listar Eventos Paginados creados por Usuario
 * Requerimiento: Autenticacion de Usuario Token
 * Datos GET: pagina (numero) 
 */

exports.listarEventosUsuario = async (req, res) => {
    try { 
        const token = loginController.getToken(req) || null;
        const decifraToken = loginController.decodificaToken(token);
        
        if(!loginController.validaToken(token)){
            return res.status(401).json({ Error: "Token incorrecto." });
        }

        let pagina = req.params.pagina;
        const registros = 3;
        if(pagina===undefined){
            pagina = 0;
        } else {
            pagina = Number(pagina);
            if (isNaN(pagina)){
                return res.status(404).json({
                    Error: "Se detecto un problema..",
                });
            } else {
                pagina = (pagina -1) * registros
            }
        } 

        const result = await Eventos.findAll({
            where: {
                usuarioId: decifraToken.id,
            },
            attributes: ["titulo", "descripcion", "imagenUrl"],
            include: [
                {
                    attributes: ["fecha", "hora", "precio"],
                    model: DetallesEventos,
                    as: "detallesevento",
                },
            ],
            order: [
                ["detallesevento", "fecha", "desc"],
                ["detallesevento", "hora", "desc"],
            ],
            limit: 3,
            offset: pagina
        });
        
        if (result.length !== 0) {
            return res.status(200).json(result);
        } else {
            return res.status(404).json({
                Error: "No existen eventos registrados.",
            });
        }
    } catch (error) {        
        return res.status(404).json(error);
    }
};