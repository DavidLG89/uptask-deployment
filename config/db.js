const { Sequelize } = require('sequelize');
//extraer valores de variables env
require('dotenv').config({path: 'variables.env'});

// Option 2: Passing parameters separately (other dialects)
const db = new Sequelize(
    process.env.BD_nombre,
    process.env.BD_USER,
    process.env.BD_PASS,
    {
    host: process.env.BD_HOST,
    dialect: 'mysql',
    port: process.env.BD_PUERTO,
    define:{
        timestamps: false
    }
  });

  module.exports = db;