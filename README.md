ConvertNFDtoNFC
=====

# Overview
This is a script for converting strings from NFD (Normalization Form Decomposition) to NFC (Normalization Form Composition) using Google Apps Script.

# Description
Here, I would like to introduce a script for [the unicode normalization](https://en.wikipedia.org/wiki/Unicode_equivalence#Normal_forms) using Google Apps Script. There are the characters with ``゙`` which is the voiced dot and the characters with ``゚`` which is the semi-voiced dot in Japanese language. When these are used for some applications, there are 2 kinds of usages for the character. For example, when for ``は`` (``\u306f``) HA with the voiced dot, there are ``ば`` and ``ば``. These unicodes are ``\u3070`` and ``\u306f\u3099``. Namely, there are the case which displayed 1 character as 2 characters. In most cases, the characters like ``\u3070`` are used. This called NFC (Normalization Form Composition). But we sometimes meet the characters like ``\u306f\u3099``. This called NFD (Normalization Form Decomposition). When the document including such characters which are displayed as 2 characters is converted to PDF file, each character is separated like ``は  ゙``. So users often want to convert the characters constructed by 2 characters to the single characters. Recently, [String.prototype.normalize](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize) was added at ES2015. But ES2015 cannot be used at Google Apps Script yet. And although I had looked for the scripts like this for GAS, unfortunately, I couldn't find. So I created this script.

# Usage

1. Please copy and paste the following script to your script editor.
1. Run ``myFunction()``.

In this sample script, ``がぎぐげござじずぜぞだぢづでどばびぶべぼゞヾぱぴぷぺぽゔ`` is converted to ``がぎぐげござじずぜぞだぢづでどばびぶべぼゞヾぱぴぷぺぽゔ``.

~~~javascript
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

function myFunction() {
  var str = "がぎぐげござじずぜぞだぢづでどばびぶべぼゞヾぱぴぷぺぽゔ";
  var res = ConvertNFDtoNFC(str); // がぎぐげござじずぜぞだぢづでどばびぶべぼゞヾぱぴぷぺぽゔ
  Logger.log(res)
}
~~~

# IMPORTANT
- This script cannot be used for strings including the non-existent Japanese characters like ``あ゙あ゚``.
- When ``\u3099``, ``\u309a``, ``\u309b`` and ``\u309c`` are existing as a single character, those are removed.
- This script uses no scopes.

# Principle
- Characters of NDF includes ``\u3099``, ``\u309a``, ``\u309b`` and ``\u309c``.
- For characters without the voiced dot and semi-voiced dot, when ``1`` is added the unicode of the character, the character becomes the character with the voiced dot. When ``2`` is added the unicode of it, the character becomes the character with the semi-voiced dot.
    - The exceptions are ``ゔ`` (``\u3094``) and ``ヴ`` (``\u30F4``).

I created this script using above principle. If this is useful for you, I'm glad.

<a name="Licence"></a>
# Licence
[MIT](LICENCE)

<a name="Author"></a>
# Author
[Tanaike](https://tanaikech.github.io/about/)

If you have any questions and commissions for me, feel free to tell me.

<a name="Update_History"></a>
# Update History
* v1.0.0 (March 16, 2018)

    Initial release.


[TOP](#TOP)
