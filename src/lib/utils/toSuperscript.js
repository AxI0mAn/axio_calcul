// src/lib/utils/toSuperscript.js

// Функция toSuperscript(numStr) для превращения строки "123" в "¹²³"
export function toSuperscript(numStr) {
  const superscripts = {
    '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
    '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹'
  };
  return numStr.split('').map(char => superscripts[char] || char).join('');
}

// Обратная функция для очистки математического выражения перед расчетом
export function fromSuperscript(superStr) {
  const map = {
    '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4',
    '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9',
    '⁻': '-', '˙': '.'
  };
  return superStr.split('').map(ch => map[ch] || ch).join('');
}