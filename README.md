# meli_challenge_front

El proyecto de frontend fue desarrollado utilizando React.

Este proyecto se integra con el backend desarrollado en Golang.

-------------------------------------------------- 
--                      Configuracion           --
--------------------------------------------------

Para ajustar correctamente la variable de entorno "REACT_APP_EVENTS_URL_API" y hacer que apunte a la API correspondiente, sigue los siguientes pasos:

      - Ubica el archivo de configuración de variables de entorno, este archivo se llama ".env".

      - Abre el archivo y busca la línea donde se define la variable "REACT_APP_EVENTS_URL_API".

      - Reemplaza el valor actual de la variable con la URL de la API a la que deseas apuntar. 
  
			Por ejemplo, "http://localhost:8000", la línea quedaría así:
  
      - REACT_APP_EVENTS_URL_API=http://localhost:8000
  

-------------------------------------------------- 
--              ejecutar proyecto               --
--------------------------------------------------
Para ejecutar el proyecto de manera local, usa el siguiente comando:

  npm start



-------------------------------------------------- 
--                      Nota                    --
--------------------------------------------------
      - Para asegurarte de tener todas las dependencias necesarias, puedes utilizar el comando npm install.
			Esto descargará automáticamente todas las dependencias especificadas en el archivo package.json.