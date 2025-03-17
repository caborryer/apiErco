# ⚡ APIERCO - API de Gestión Energética ⚡

Bienvenido a APIERCO, una API diseñada para el cálculo, análisis y facturación energética. Este sistema permite manejar datos complejos y grandes volúmenes de información utilizando **Node.js** y **PostgreSQL**.

---

## 🚀 ¿Cómo Correr el Proyecto?

Sigue estos simples pasos para configurar y ejecutar la API:

### **1. Verifica tu versión de Node.js**
Asegúrate de tener instalada **Node.js 20** en tu sistema antes de continuar. Puedes verificar tu versión actual con este comando:

```bash
node -v``


### **2. Instala las dependencias del proyecto corriendo el comando `npm install`
2. Crea una conexión en tu base de datos PostgreSQL y proporciona los datos necesarios en el archivo src/database/connection.js. Por ejemplo:

```const pool = new Pool({
    user: '<tu_usuario>',
    host: '<host>',
    database: '<nombre_base_datos>',
    password: '<tu_contraseña>',
    port: 5432,
});
`
3. Ejecuta el comando `npm run create-tables`, este comando se encargara de crear las tablas en la base de datos segun el esquema propuesto.
4. Ejecuta el comando `npm run load-csv-data` que se encargara de cargar los datos iniciales desde los archivos CSV en las tablas correspondientes (en el orden correcto): 

Esto cargará automáticamente los datos de los siguientes archivos:

services.csv
tariffs.csv
records.csv
consumption.csv
injection.csv
xm_data_hourly_per_agent.csv

5. Ejecuta el proyecto corriendo el comando `npm run dev`. El servidor estará funcionando en: http://localhost:3000 🚀

## 🧪 Prueba las Rutas de la API con cURL

¡Prueba los cálculos y análisis energéticos de la API con los siguientes comandos cURL!

1. Calcular Factura (POST /api/calculate-invoice)

`curl --location 'http://localhost:3000/api/calculate-invoice' \
--header 'Content-Type: application/json' \
--data '{
    "month": 9
}'`

2. Estadísticas del Cliente (GET /api/client-statistics/{client_id})

`curl --location 'http://localhost:3000/api/client-statistics/{client_id}'`

3. Carga del Sistema por Hora (GET /api/system-load)

`curl --location 'http://localhost:3000/api/system-load'`

4. Energía Activa por Mes (GET /ea/{month})

`curl --location 'http://localhost:3000/api/ea/{month}'`


## 📖 Documentación de la API

Accede a la documentación interactiva de la API, generada con Swagger, desde tu navegador:

👉 http://localhost:3000/api-docs

Ahí podrás explorar cada endpoint, probarlo directamente y visualizar los datos esperados.

## 📂 Estructura del Proyecto

El proyecto está organizado para favorecer la modularidad y facilidad de mantenimiento. Aquí tienes una vista general de la estructura:

src/
|-- data/                      // Archivos CSV para cargar datos iniciales
|-- utils/                   // Scripts para operaciones como creación de tablas
|   |-- createTables.js        // Script para crear tablas en PostgreSQL
|   |-- loadCsvData.js         // Script para cargar datos desde archivos CSV
|-- controllers/               // Controladores para manejar la lógica de las rutas
|   |-- aditionalInfoController.js   // Controlador para calculo independiente por concepto
|   |-- invoiceController.js   // Controlador para facturación
|   |-- statisticsController.js// Controlador para estadísticas de clientes
|   |-- systemLoadController.js// Controlador para la carga horaria del sistema
|-- services/                  // Lógica de negocio reutilizable
|   |-- invoiceService.js      // Cálculos de facturación
|   |-- statisticsService.js   // Lógica para estadísticas de consumo/inyección
|   |-- systemLoadService.js   // Obtención de carga por hora del sistema


📋 Recursos Adicionales
Base de Datos:
Asegúrate de tener PostgreSQL configurado y funcionando en tu máquina. Puedes descargarlo desde `https://www.postgresql.org/`.

Node.js:
Si no tienes Node.js instalado, puedes descargarlo desde 'https://nodejs.org/es'