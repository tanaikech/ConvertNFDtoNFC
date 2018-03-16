/**
 * Convert strings from NFD to NFC.<br>
 * @param {String} NFD
 * @return {String} NFC
 */
function ConvertNFDtoNFC(str) {
  var escaped = escape(str);
  var u = escaped.match(/%u[0-9A-F]{4}/g);
  if (u) {
    var voicedDots = ["%u3099", "%u309B", "%u309A", "%u309C"]; // 濁点, 濁点, 半濁点, 半濁点
    var pos = u.map(function(e, i) {return voicedDots.filter(function(f) {return e == f}).length > 0 ? [u[i-1], e] : ""}).filter(String);
    if (pos.length > 0) {
      var replaceValues = pos.map(function(e) {
        if (!e[0]) {
          return [e[1], ""];
        } else if (e[0] == "%u3046") {
          return [e.join(""), "%u3094"]; // ゔ
        } else if (e[0] == "%u30A6") {
          return [e.join(""), "%u30F4"]; // ヴ
        } else if (e[1] == "%u3099" || e[1] == "%u309B") { // 濁点
          return [e.join(""), "%u" + (parseInt(e[0].replace("%u", ""), 16) + 1).toString(16).toUpperCase()];
        } else if (e[1] == "%u309A" || e[1] == "%u309C") { // 半濁点
          return [e.join(""), "%u" + (parseInt(e[0].replace("%u", ""), 16) + 2).toString(16).toUpperCase()];
        }
      });
      replaceValues.forEach(function(e) {escaped = escaped.replace(e[0], e[1])});
      return unescape(escaped);
    } else {
      return str;
    }
  } else {
    return str;
  }
}
