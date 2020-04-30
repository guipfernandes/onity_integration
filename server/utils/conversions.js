const hexToAscii = (...hexas) => {
  let str = '';
  hexas.map(hexx => {
    let hex = hexx.toString(); //force conversion
    for (let i = 0; i < hex.length; i += 3)
      str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  })

  return str;
}

const asciiToHex = (str) => {
  str = str.toString()
  var arr1 = [];
  for (var n = 0; n < str.length; n++) {
    var hex = Number(str.charCodeAt(n)).toString(16);
    arr1.push(hex.concat('h'));
  }
  return arr1.join(' ');
}

const hexatoCharCode = (...hexas) => {
  return hexas.map(x => parseInt(x, 16));
}

module.exports = {
  hexToAscii,
  asciiToHex,
  hexatoCharCode
}