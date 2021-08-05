# TP Final con NodeJS
Proyecto Final del curso "Desarrollo BackEnd con Node JS" dictado por el Cluster Tecnológico Catamarca - CCT

## Instrucciones

### API endpoints

`GET /eventos`

Lista a partir de la Fecha Actual todos los Eventos y sus correspondientes Detalles ordenados por fecha, hora en descendente.

---

`GET /twitter`

Retona mensaje difudiendo el Titulo/Nombre del Evento con su Fecha de realización Link de la url de la imagen asociada para compartir en Twitter.
Parametros de Entrada: id:Número

---

`GET /eventos/{id}`

Lista todos los Detalles de un Evento id ingresado.
Parametros de Entrada: id:Número

---

`GET /eventosdestacados`

Lista a partir de la Fecha Actual los Eventos y sus Detalles Destacados.

---

`POST /usuario`

Crea Nuevo Usuario para la Autenticación en el Sistema.
Parametros de Entrada: 

{
    "nombre":"texto",
    "apellido":"texto",
    "usuario":"textoNumero",
    "clave":"textoNumero"
}

Retorna: Registro Generado de Usuario.
---

`POST /auth`

Autentica si el Usuario y Contraseña, son Válidos retornando un Token para Validar la sesión.

Parametros de Entrada:
Lote de Prueba.

{
    "usuario":"gvelasco",
    "clave":"123"
}

Retorna: Token,usuario

---

`POST /eventodetalles`

Crea Evento y cero o mas detalles. Para realizar esta acción es requerido un Token.

 { 
    "titulo":"textoNumero",
    "descripcion":"textoNumero",
    "destacado":false/true,
    "imagenUrl":"url", 
    "localidad":"texto",
    "detalles":[
        {
            "fecha":"dd/mm/aaaa",
            "hora":"hh:mm",
            "precio":Numero
        },
        {
            "fecha":"dd/mm/aaaa",
            "hora":"hh:mm",
            "precio":Numero
        }
    ]
}

Retorna:Registro Generado de Eventos y sus Detalles.
---

`GET /usuario/eventos/:pagina?`

Lista los eventos generados por el Usuario paginados de a 3 por página. Para realizar esta acción es requerido un Token.

---