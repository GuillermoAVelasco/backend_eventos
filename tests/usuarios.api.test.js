const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const db = require('../config/db');
const Usuarios = require('../models/Usuarios');
const Eventos = require('../models/Eventos');

let headers;
let eventoId;

describe('Crear Usuarios', () => {  
    test('Crear Usuario xxx', async () => {   
        await Usuarios.destroy({
            where: {}  
          });  
        const nuevoUsuario = {
            nombre: 'xxx',
            apellido: 'xxx',
            usuario: 'xxx',
            clave: 'xxx'
        };
        const res = await api.post('/usuario').send(nuevoUsuario);
        expect(res.statusCode).toEqual(201)
        expect(res.body).toHaveProperty('nuevoUsuario');
    });       
    
    test('Crear Usuario con  datos repetidos: nombre y apellido', async () => {     
        const nuevoUsuario = {
            nombre: 'xxx',
            apellido: 'xxx',
            usuario: 'xxxbis',
            clave: 'xxxbis'
        };
        const res = await api.post('/usuario').send(nuevoUsuario);
        expect(res.statusCode).toEqual(404);
        expect(res.body).toEqual({Error:'El Nombre y Apellido del Nuevo Usuario ya se encuentra registrado'});
    });  

    test('crear un usuario con un nombre de usuario repetido', async () => {     
        const nuevoUsuario = {
            nombre: 'xxxbis',
            apellido: 'xxxbis',
            usuario: 'xxx',
            clave: 'xxxbis'
        };
        const res = await api.post('/usuario').send(nuevoUsuario);
        expect(res.statusCode).toEqual(404);
        expect(res.body).toEqual({Error:'El Nombre de Usuario ya se encuentra registrado '});
    });

    test('crear un usuario sin enviar nombre', async () => {     
        const nuevoUsuario = {            
            apellido: 'xxxbis',
            usuario: 'xxxbis',
            clave: 'xxxbis',            
        };
        const res = await api.post('/usuario').send(nuevoUsuario);
        expect(res.statusCode).toEqual(404)
        expect(res.body).toEqual({Error:'Los campos Nombre, Apellido , Usuario y Password son requeridos'})
    });        

    test('crear un usuario sin enviar apellido', async () => {     
        const nuevoUsuario = {
            nombre: 'xxxbis',            
            usuario: 'xxxbis',
            clave: 'xxxbis'            
        };
        const res = await api.post('/usuario').send(nuevoUsuario);
        expect(res.statusCode).toEqual(404)
        expect(res.body).toEqual({Error:'Los campos Nombre, Apellido , Usuario y Password son requeridos'})
    });        

    test('crear un usuario sin enviar usuario', async () => {     
        const nuevoUsuario = {
            nombre: 'xxxbis',
            apellido: 'xxxbis',
            clave: 'xxxbis'            
        };
        const res = await api.post('/usuario').send(nuevoUsuario);
        expect(res.statusCode).toEqual(404)
        expect(res.body).toEqual({Error:'Los campos Nombre, Apellido , Usuario y Password son requeridos'})
    });        

    test('crear un usuario sin enviar clave', async () => {     
        const nuevoUsuario = {
            nombre: 'xxx',
            apellido: 'xxx',
            usuario: 'xxx'            
        };
        const res = await api.post('/usuario').send(nuevoUsuario);
        expect(res.statusCode).toEqual(404)
        expect(res.body).toEqual({Error:'Los campos Nombre, Apellido , Usuario y Password son requeridos'})
    });        
});

describe('login de usuarios', () => {  
    test('permitir login a un usuario correcto', async () => {           
        const nuevoUsuario = {            
            usuario: 'xxx',
            clave: 'xxx'
        };
        const res = await api.post('/auth').send(nuevoUsuario);
        headers = {
            'Authorization': `bearer ${res.body.token}`
        };
        console.log(headers)
        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveProperty('token')
    });       

    test('no permitir login a un usuario o clave incorrecta', async () => {           
        const nuevoUsuario = {            
            usuario: 'xxx',
            clave: 'toor'
        };
        const res = await api.post('/auth').send(nuevoUsuario);
        expect(res.statusCode).toEqual(401)
        expect(res.body).toEqual({ Error: 'Usuario o Password incorrectos' })
    });     

    test('No existen eventos.', async () => {
        await Eventos.destroy({
            where: {}  
          });  
        const res = await api.get('/eventos')
        expect(res.statusCode).toEqual(404)
        expect(res.body).toEqual({"Error": "No existen eventos."})
    });
        
    test('un usuario logueado puede agregar el evento 1', async () => {
        const nuevoEvento = {
          "titulo":"primer",
          "descripcion":"este es mi primer",
          "destacado":true,
          "imagenUrl":"www.lalal.com", 
          "localidad":"san juan",
          "detalles":[
              {
                  "fecha":"2021-08-08",
                  "hora":"21:00",
                  "precio":3500
              },
              {
                  "fecha":"2021-09-08",
                  "hora":"21:00",
                  "precio":2000
              }
          ]
        };
  
        const result = await api
          .post('/eventodetalles')
          .set(headers)
          .send(nuevoEvento)
          .expect(200)
          .expect('Content-Type', /application\/json/);
        eventoId = result.body.id
        
    });

    test('un usuario logueado puede agregar el evento 2', async () => {
        const nuevoEvento = {
          "titulo":"segundo",
          "descripcion":"este es mi segundo",
          "destacado":false,
          "imagenUrl":"www.lalal.com", 
          "localidad":"san juan",
          "detalles":[
              {
                  "fecha":"2022-08-08",
                  "hora":"21:00",
                  "precio":3000
              },
              {
                  "fecha":"2022-09-08",
                  "hora":"21:00",
                  "precio":3000
              }
          ]
        };
  
        await api
          .post('/eventodetalles')
          .set(headers)
          .send(nuevoEvento)
          .expect(200)
          .expect('Content-Type', /application\/json/);
    });

    test('un usuario logueado puede agregar el evento 3', async () => {
        const nuevoEvento = {
          "titulo":"tercero",
          "descripcion":"este es mi tercero",
          "destacado":false,
          "imagenUrl":"www.lalal.com", 
          "localidad":"san juan",
          "detalles":[
              {
                  "fecha":"2020-08-08",
                  "hora":"21:00",
                  "precio":3000
              },
              {
                  "fecha":"2020-09-08",
                  "hora":"21:00",
                  "precio":3000
              }
          ]
        };
  
        await api
          .post('/eventodetalles')
          .set(headers)
          .send(nuevoEvento)
          .expect(200)
          .expect('Content-Type', /application\/json/);  
        
    });

    test('un usuario logueado puede agregar el evento ', async () => {
        const nuevoEvento = {
          "titulo":"cuarto",
          "descripcion":"este es mi cuarto",
          "destacado":false,
          "imagenUrl":"www.lalal.com", 
          "localidad":"san juan",
          "detalles":[
              {
                  "fecha":"2023-08-08",
                  "hora":"21:00",
                  "precio":3000
              },
              {
                  "fecha":"2023-09-08",
                  "hora":"21:00",
                  "precio":3000
              }
          ]
        };
  
        await api
          .post('/eventodetalles')
          .set(headers)
          .send(nuevoEvento)
          .expect(200)
          .expect('Content-Type', /application\/json/);  
        
    });

    test('un usuario logueado lista sus eventos paginados', async () => {
        const res = await api.get('/usuario/eventos').set(headers)
        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveLength(3);
    });

    test('listado de eventos destacados', async () => {
        const res = await api.get('/eventosdestacados')
        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveLength(2);
    });

    test('obtener los detalles de un evento 1', async () => {
        console.log(eventoId)   
        const res = await api.get(`/eventos/${eventoId}`)
        expect(res.statusCode).toEqual(200);
        const contents = res.body.map(r => r.titulo);
		expect(contents).toContain('primer');
    });

    test('compartir enlace en twitter', async () => {    
        console.log(eventoId)     
        const id = eventoId + "";
        const res = await api.get(`/twitter/${eventoId}`)
        expect(res.statusCode).toEqual(200);        
		expect(res.body).toEqual('Ire al primer @ 2021-08-08 www.lalal.com')
    });

    test('listado de eventos ordenados por fecha', async () => {
        const res = await api.get('/eventos')
        expect(res.statusCode).toEqual(200)
        const contents = res.body.map(r => r.titulo);
		expect(contents).toContain('cuarto');
        
    });
});

afterAll(() => {
    db.close();
});