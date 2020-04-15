// process.env.DEBUG = '*'
const { app, BrowserWindow } = require('electron')

app.on('ready', () => {
  const mainWindow = new BrowserWindow({
    width: 400,
    height: 600,
    resizable: false,
    center: true,
    icon: __dirname + '/assets/logo.png',
    backgroundColor: `#000`,
    webPreferences: {
      nodeIntegration: true
    }
  })

  mainWindow.removeMenu()
  mainWindow.loadFile('index.html')

  // mainWindow.webContents.on('did-finish-load', () => {
    // let code = `
    // (function () {
    //   let elm = document.getElementById('inputPorta'),
    //   df = document.createDocumentFragment();
    //   for (let i = 1; i <= 256; i++) {
    //     let option = document.createElement('option');
    //     option.value = "COM" + i;
    //     option.appendChild(document.createTextNode(option.value));
    //     df.appendChild(option);
    //   }
    //   elm.appendChild(df);
    // }());`;
    // mainWindow.webContents.executeJavaScript(code);
    // mainWindow.webContents.executeJavaScript(
    //   `document.getElementById('btn-connect').addEventListener(
    //   'click', ()=> {
    //     document.getElementById('btn-connect').innerHTML = "Conectado"
    //   });`);

  // });
})




// const SerialPort = require('serialport');

// async function findOnity() {
//   if (process.argv[2]) {
//     return process.argv[2]
//   }
//   const ports = await SerialPort.list()
//   for (const port of ports) {
//     console.log(`Porta: ${port.path} - Fabricante: ${port.manufacturer} - SerialNumber: ${port.serialNumber} - pnpId: ${port.pnpId} - LocationId: ${port.locationId} - ProductId: ${port.productId} - VendorId: ${port.vendorId} \n`)
//     if (/com1/i.test(port.path)) {
//       return port.path
//     }
//   }
//   throw new Error('No Onity equipament found')
// }

// findOnity().then(
//   portName => {
//     const port = new SerialPort(portName, {
//       baudRate: 9600
//     })
//     port.on('open', () => {
//       let strBuffer = ""
//       console.log('opened', portName)
//       port.on('data', data => {
//         console.log('>', data.toString())
//         console.log('>', String.fromCharCode(...data))
//         // strBuffer += data
//         // if (strBuffer.endsWith('\r') || strBuffer.endsWith('\n')) console.log('>', strBuffer.toString())
//       })
//       let messageEjectCard = 'B3h 45h 58h B3h 31h B3h';
//       let messageNewClient = 'B3h 43h 4Eh B3h 31h B3h 45h B3h 31h 30h 33h B3h B3h B3h B3h B3h B3h B3h B3h B3h';

//       // port.write(Buffer.from('2h B3h 45h 58h B3h 31h B3h 3h Dh'.split(' ').map(x => parseInt(x, 16))));
//       // port.write(Buffer.from(`2h ${message} 3h Dh`.split(' ').map(x => parseInt(x, 16))));


//       console.log('Sending -> ', String.fromCharCode(...hexatoCharCode(...messageEjectCard.split(' '))))
//       port.write(Buffer.from(hexatoCharCode(...envelop(messageEjectCard).split(' '))))

//       console.log('Sending -> ', String.fromCharCode(...hexatoCharCode(...messageNewClient.split(' '))))
//       port.write(Buffer.from(hexatoCharCode(...envelop(messageNewClient).split(' '))))


//       // const data = Buffer.from('2h B3h 43h 4Eh B3h 31h B3h 45h B3h 31h 30h 33h B3h B3h B3h B3h B3h B3h B3h B3h B3h 3h Dh'.split(' ').map(x => parseInt(x, 16)));
//       // console.log(String.fromCharCode(...data))
//     })
//   },
//   () => {
//     console.log('No Onity')
//   }
// )

// const envelop = (message) => {
//   let STX = '2h'; // Início da transmissão da mensagem
//   let ETX = '3h'; // Fim da transmissão da mensagem
//   let LRC = 'Dh'; // Verificação de redundância longitudinal

//   return `${STX} ${message} ${ETX} ${LRC}`;
// }

// const hexatoCharCode = (...hexas) => {
//   return hexas.map(x => parseInt(x, 16));
// }



process.on('unhandledRejection', r => console.log(r, r.stack))