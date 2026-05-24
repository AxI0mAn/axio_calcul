/**
 * src/lib/utils/fractionVisualParser.js
 * Парсер строк выражений дробей в структурированный HTML/Токены для Svelte
 */

export function parseExpressionToHtml(exprStr) {
  if (!exprStr) return [];

  // Разделяем строку по пробелам на логические блоки (числа и операторы)
  const parts = exprStr.trim().split(/\s+/);
  const resultTokens = [];

  for (let part of parts) {
    // 1. Проверяем, является ли токен базовым оператором или знаком равенства
    if (part === '+' || part === '-' || part === '*' || part === '/' || part === '=') {
      resultTokens.push({ type: 'text', value: ` ${part} ` });
      continue;
    }

    // 2. Проверяем наличие маркеров смешанного числа \u2951 и \u294F
    if (part.includes('\u2951')) {
      const openIdx = part.indexOf('\u2951');
      const closeIdx = part.indexOf('\u294F');

      if (closeIdx !== -1) {
        const whole = part.substring(0, openIdx);
        const fractionBody = part.substring(openIdx + 1, closeIdx);
        const subParts = fractionBody.split('÷');

        if (subParts.length === 2) {
          resultTokens.push({
            type: 'fraction',
            whole: whole,
            num: subParts[0],
            den: subParts[1]
          });
          continue;
        }
      }
    }

    // 3. Проверяем, является ли токен простой дробью без целой части
    if (part.includes('÷')) {
      const subParts = part.split('÷');
      if (subParts.length === 2) {
        resultTokens.push({
          type: 'fraction',
          whole: '',
          num: subParts[0],
          den: subParts[1]
        });
        continue;
      }
    }

    // 4. Обычный текст / целое число / скобка
    resultTokens.push({ type: 'text', value: part });
  }

  return resultTokens;
}