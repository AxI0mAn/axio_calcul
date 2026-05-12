// Функция для превращения строки "123" в "¹²³"
export function toSuperscript(numStr) {
  const superscripts = {
    '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
    '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹'
  };
  return numStr.split('').map(char => superscripts[char] || char).join('');
}
