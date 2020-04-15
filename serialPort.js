const SerialPort = require("serialport");

(function () {
  document.getElementById('input-recorder').value = 1
  document.getElementById('btn-disconnect').style.display = "none";

  let elm = document.getElementById('input-port'),
    df = document.createDocumentFragment();
  for (let i = 1; i <= 256; i++) {
    let option = document.createElement('option');
    option.value = "COM" + i;
    option.appendChild(document.createTextNode(option.value));
    df.appendChild(option);
  }
  elm.appendChild(df);
}());

(function () {
  const btnConnect = document.getElementById('btn-connect')
  btnConnect.addEventListener('click', function (event) {
    let select = document.getElementById('input-port')
    let numRecorder = document.getElementById('input-recorder').value
    let selectedPort = select.options[select.selectedIndex].value;

    connectPort(selectedPort, numRecorder).then(() => {
      document.getElementById('btn-connect').style.display = "none";
      document.getElementById('btn-disconnect').style.display = "block";
    }, (err) => {
      print(err)
    })

  })
}());

(function () {
  const btnDisconnect = document.getElementById('btn-disconnect')
  btnDisconnect.addEventListener('click', function (event) {
    serialPort.close( err => {
      if (err) {
        print(err)
      } else {
        print(`Desconexão realizada`)
      }
    })
    document.getElementById('btn-disconnect').style.display = "none";
    document.getElementById('btn-connect').style.display = "block";
  })
}());

const print = (text) => {
  document.getElementById('communication-log').innerHTML += text + '<br>'
}

const findPort = async (portName) => {
  const ports = await SerialPort.list()
  for (const port of ports) {
    if (portName.toUpperCase() === port.path.toUpperCase()) {
      return port.path
    }
  }
  throw new Error('Porta não encontrada')
}

var serialPort

const connectPort = async (portName, numRecorder) => {
  return findPort(portName).then(port => {
    serialPort = new SerialPort(port, {
      baudRate: 9600
    }, (err) => {
      if (err) {
        return print(err.message);
      }
    })
    serialPort.on('open', () => {
      print('Conexão estabelecida com a porta ' + portName)
      serialPort.on('data', data => {
        print('Receiving -> ' + data.toString())
        print('Receiving -> ' + String.fromCharCode(...data))
      })
      // let messageEjectCard = 'B3h 45h 58h B3h 31h B3h';
      // let messageNewClient = 'B3h 43h 4Eh B3h 31h B3h 45h B3h 31h 30h 33h B3h B3h B3h B3h B3h B3h B3h B3h B3h';
      let numRecorderHex = Number(numRecorder.charCodeAt(0)).toString(16)
      let messageEjectCard = `B3h 45h 58h B3h ${numRecorderHex} B3h`;
      let messageNewClient = `B3h 43h 4Eh B3h ${numRecorderHex} B3h 45h B3h 31h 30h 33h B3h B3h B3h B3h B3h B3h B3h B3h B3h`;

      print('Sending -> ' + hexToAscii(...messageEjectCard.split(' ')))
      serialPort.write(Buffer.from(hexatoCharCode(...envelop(messageEjectCard).split(' '))))

      print('Sending -> ' + hexToAscii(...messageNewClient.split(' ')))
      serialPort.write(Buffer.from(hexatoCharCode(...envelop(messageNewClient).split(' '))))
    })
  }, () => {
    throw 'Não foi possível estabelecer conexão com a porta ' + portName
  })
}

const hexatoCharCode = (...hexas) => {
  return hexas.map(x => parseInt(x, 16));
}

const envelop = (message) => {
  let STX = '2h'; // Início da transmissão da mensagem
  let ETX = '3h'; // Fim da transmissão da mensagem
  let LRC = 'Dh'; // Verificação de redundância longitudinal

  return `${STX} ${message} ${ETX} ${LRC}`;
}

const hexToAscii = (...hexas) => {
  let str = '';
  hexas.map(hexx => {
    let hex = hexx.toString(); //force conversion
    for (let i = 0; i < hex.length; i += 2)
      str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  })

  return str;
}
