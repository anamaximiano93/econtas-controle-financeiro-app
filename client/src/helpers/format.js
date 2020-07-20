const numberFormat = Intl.NumberFormat("pt-BR");

function formatNumber(numberToBeFormatted) {
  return numberFormat.format(numberToBeFormatted);
}

function formatPercentage(numberToBeFormatted) {
  if (numberToBeFormatted) {
    return numberToBeFormatted.toFixed(2).replace(".", ",") + "%";
  }
}
function formatReais(value) {
  var valor = value;
  var valorFormatado = valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
  return valorFormatado;
}

function removerAcentos(newStringComAcento) {
  var string = newStringComAcento;
  var mapaAcentosHex = {
    a: /[\xE0-\xE6]/g,
    A: /[\xC0-\xC6]/g,
    e: /[\xE8-\xEB]/g,
    E: /[\xC8-\xCB]/g,
    i: /[\xEC-\xEF]/g,
    I: /[\xCC-\xCF]/g,
    o: /[\xF2-\xF6]/g,
    O: /[\xD2-\xD6]/g,
    u: /[\xF9-\xFC]/g,
    U: /[\xD9-\xDC]/g,
    c: /\xE7/g,
    C: /\xC7/g,
    n: /\xF1/g,
    N: /\xD1/g,
  };

  for (var letra in mapaAcentosHex) {
    var expressaoRegular = mapaAcentosHex[letra];
    string = string.replace(expressaoRegular, letra);
  }

  return string;
}
export { formatNumber, formatPercentage, formatReais, removerAcentos };
