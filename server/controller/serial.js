const express = require('express');
const router = express.Router();
const WebSocket = require("ws")
const {logger, readLastLog} = require('../services/logger');
const serialPort = require('../services/serialPort');

const ws = new WebSocket.Server({ port: 8081 })

router.post('/conectar', (req, res) => {
  let payload = req.body
  if (!payload.port || !payload.numRecorder) {
    let err = "Parametros faltando"
    return errorHandler(res, err, 400)
  }
  serialPort.connectPort(payload.port, payload.numRecorder, function(err) {
    errorHandler(res, err)
  }).then(log => {
      logger.info(log);
      res.send(log)
    }).catch(err => errorHandler(res, err))
});

router.post('/desconectar', (req, res) => {
  serialPort.disconnectPort()
    .then(log => {
      logger.info(log);
      res.send(log)
    })
    .catch(err => errorHandler(res, err))
});

router.post('/porta-aberta', (req, res) => {
  let retorno = serialPort.isOpen()

  res.send(retorno)
});

router.post('/ultimo-log', (req, res) => {
  readLastLog().then(lastLines => {
    res.send(lastLines)
  }).catch(err => errorHandler(res, err))

});

ws.on('connection', function (w) {
  router.post('/novo-cliente', (req, res) => {
    let payload = req.body
    let validade

    if (!payload.apartamentoId) {
      let err = "Parametros faltando"
      sendMessageAllClients(err)
      return errorHandler(res, err, 400)
    }

    if (!payload.validade) validade = ""
    else validade = payload.validade

    serialPort.newClient(payload.apartamentoId, validade).then(retorno => {
      for(let ret of retorno) {
        logger.info(ret);
        sendMessageAllClients(ret)
      }

      serialPort.onData(function(log) {
        logger.info(log);
        sendMessageAllClients(log)
      })
      
      res.send({status: 'success', message: "Gravação realizada com sucesso" })
      
    }).catch(err => {
      sendMessageAllClients(err)
      errorHandler(res, err, 502)
    })
    
  });

})

function sendMessageAllClients(message) {
  ws.clients.forEach(c => {
    c.send(message) 
  })
}

function errorHandler(res, err, status) {
  let message = ''
  if (err.message) message = err.message
  else message = err

  logger.error(message);
  if (status) {
    res.status(status).send({ status: 'error', message: message });
  } else {
    res.send({ status: 'error', message: message });
  }
}

module.exports = router;
