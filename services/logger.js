const { createLogger, transports, format } = require('winston');
const moment = require('moment-timezone');

const time = moment.utc().tz('America/Sao_Paulo').format('YYYY-MM-DD HH:mm:ss');

// Definindo o formato do log
const customFormat = format.printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

// Criando um logger
const logger = createLogger({
  format: format.combine(
    
     // Define o formato do timestamp
    format.timestamp({ format: time }),
    customFormat
  ),
  transports: [

     // Exibe os logs no console
    new transports.Console(),

    // Salva os logs de erro em um arquivo
    new transports.File({ filename: 'logs/error.log', level: 'error' }),

     // Salva todos os logs em um arquivo
    new transports.File({ filename: 'logs/combined.log' })
  ]
});

module.exports = logger;