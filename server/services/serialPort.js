const SerialPort = require("serialport");
const logger = require('./logger');
const { hexToAscii, asciiToHex, hexatoCharCode } = require('../utils/conversions');

var serialPort
var recorder

const findPort = async (portName) => {
  const ports = await SerialPort.list()
  for (const port of ports) {
    if (portName.toUpperCase() === port.path.toUpperCase()) {
      return port.path
    }
  }
  throw new Error('Porta não encontrada')
}

const connectPort = async (portName, numRecorder, callback) => {
  return findPort(portName).then(port => {
    recorder = numRecorder.toString()
    serialPort = new SerialPort(port, {
      baudRate: 9600
    }, (err) => {
      if (err) {
        return callback(err.message);
      }
    })
    return new Promise((resolve, reject) => {
      serialPort.on('open', () => {
        resolve('Conexão estabelecida com a porta ' + portName)
      })
    })
    
  }, () => {
    throw new Error('Não foi possível estabelecer conexão com a porta ' + portName)
  })
}

const disconnectPort = () => {
  return new Promise((resolve, reject) => {
    if (!isOpen()) reject('Porta não conectada')
    return serialPort.close(err => {
      if (err) {
        reject(err)
      } else {
        serialPort = null
        resolve(`Desconexão realizada`)
      }
    })
  })
}

const isOpen = () => {
  if (!serialPort) return false
  
  return serialPort.isOpen ? {port: serialPort.path, status: true} : false
}

const onData = (callback) => {
  if (!isOpen()) return callback('Porta não conectada')
  return serialPort.on('data', data => {
    callback('Receiving -> ' + data.toString())
  })
}

const newClient = (apartament, validity) => {
  return new Promise((resolve, reject) => {
    if (!isOpen()) reject('Porta não conectada')

    let messageEjectCard = `B3h 45h 58h B3h ${asciiToHex(recorder)} B3h`; // ³EX³{recorder}³
    let messageNewClient = `B3h 43h 4Eh B3h ${asciiToHex(recorder)} B3h 45h B3h ${asciiToHex(apartament)} B3h B3h B3h B3h B3h B3h B3h ${asciiToHex(validity)} B3h B3h`; // ³CN³{recorder}³E³{apartment}³³³³³³³{validity}³³
    
    let sendedMessageEjectCard = write(messageEjectCard)
    let sendedMessageNewClient = write(messageNewClient)

    return resolve([sendedMessageEjectCard, sendedMessageNewClient])
  })
  
}

const write = (message) => {
  if (!isOpen()) return 'Porta não conectada'
  let buffer = Buffer.from(hexatoCharCode(...envelop(message).split(' ')))
  serialPort.write(buffer)
  return 'Sending -> ' + hexToAscii(...message.split(' '))
}

const envelop = (message) => {
  let STX = '2h'; // Início da transmissão da mensagem
  let ETX = '3h'; // Fim da transmissão da mensagem
  let LRC = 'Dh'; // Verificação de redundância longitudinal

  return `${STX} ${message} ${ETX} ${LRC}`;
}

module.exports = {
  connectPort,
  disconnectPort,
  onData,
  isOpen,
  newClient
}