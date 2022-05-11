# FinalBossSK8  SKATE PARK 
Objetivo: Desarrollar la plataforma web en la que los participantes se podrán registrar y revisar el estado de su solicitud.
● Crear una API REST con el Framework Express.
● Servir contenido dinámico con express-handlebars.
● Ofrecer la funcionalidad Upload File con express-fileupload.
● Implementar seguridad y restricción de recursos o contenido con JWT.


#Para correrlo:
#en pg poner datos: los mismos de configuracion que estan consulta.js (ver archivo) user, password            

#en su query tool pegar y correr: CREATE DATABASE skatepark; CREATE TABLE skaters (id SERIAL, email VARCHAR(50) NOT NULL, nombre VARCHAR(25) NOT NULL, password VARCHAR(25) NOT NULL, anos_experiencia INT NOT NULL, especialidad VARCHAR(50) NOT NULL, foto VARCHAR(255) NOT NULL, estado BOOLEAN NOT NULL);

#hacer npm install
#node index.js
#cuando lo indique la terminal ir a browser a localhost:3000
