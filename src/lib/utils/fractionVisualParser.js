/**
 * src/lib/utils/fractionVisualParser.js
 */

export function parseExpressionToHtml(exprStr) {
  if (!exprStr) return [];

  const rawTokens = exprStr.replace(/\s+/g, ' ').trim().split(' ');
  const processedTokens = [];

  for (let token of rawTokens) {
    if (!token) continue;

    // 1. Сложная дробь с двойными скобками: целое⥑⥾числитель⥿÷⥾знаменатель⥿⥏
    if (token.includes('\u297E') && token.includes('\u297F')) {
      let whole = '';
      if (token.includes('\u2951')) {
        whole = token.split('\u2951')[0];
      }

      const parts = token.split('÷');
      if (parts.length === 2) {
        let numContent = parts[0].replace(/[\u2951\u294F\u297E\u297F]/g, '');
        let denContent = parts[1].replace(/[\u2951\u294F\u297E\u297F]/g, '');

        processedTokens.push({
          type: 'fraction', // Используем 'fraction', чтобы твоя вёрстка понимала блок
          whole: whole,
          num: numContent,
          den: denContent
        });
        continue;
      }
    }

    // 2. Стандартная маркерная дробь: 1⥑1÷4⥏
    if (token.includes('\u2951')) {
      const openIdx = token.indexOf('\u2951');
      const closeIdx = token.indexOf('\u294F');
      if (closeIdx !== -1) {
        const whole = token.substring(0, openIdx);
        const fractionBody = token.substring(openIdx + 1, closeIdx);
        const subParts = fractionBody.split('÷');
        if (subParts.length === 2) {
          processedTokens.push({
            type: 'fraction',
            whole: whole,
            num: subParts[0],
            den: subParts[1]
          });
          continue;
        }
      }
    }

    // 3. Обычная базовая дробь: 15÷5
    if (token.includes('÷')) {
      const parts = token.split('÷');
      if (parts.length === 2) {
        processedTokens.push({
          type: 'fraction',
          whole: '',
          num: parts[0],
          den: parts[1]
        });
        continue;
      }
    }

    // 4. Обычный текст / операторы
    processedTokens.push({
      type: 'text',
      value: token
    });
  }

  return processedTokens;
}