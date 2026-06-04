/**
 * src/lib/services/math/fractionVisualParser.js
 * fractionVisualParser.js — токенизатор, который различает простые дроби число÷число и смешанные целое⥑числитель÷знаменатель⥏, а также обрабатывает операторы.
 * Преобразует строку с математическими выражениями и спецсимволами в массив токенов
 * для рендеринга двухэтажных дробей и плоских выражений.
 */

import { fromSuperscript } from "$lib/utils/toSuperscript";

// Специальные символы (определены в ТЗ)
const MARKERS = {
  WHOLE_START: '\u2951', // ⥑
  WHOLE_END: '\u294F',   // ⥏
  COMPLEX_NUM_START: '\u297E', // ⥾
  COMPLEX_END: '\u297F',       // ⥿
  DIV: '÷'
};

/**
 * Проверяет, является ли строка числом (целым или десятичным)
 * @param {string} str
 * @returns {boolean}
 */
function isNumber(str) {
  return /^-?\d+(\.\d+)?$/.test(str);
}

/**
 * Разбирает смешанную дробь вида "целое⥑числитель÷знаменатель⥏"
 * @param {string} str
 * @returns {{ whole: string, num: string, den: string } | null}
 */
function parseMixedFraction(str) {
  const wholeStart = str.indexOf(MARKERS.WHOLE_START);
  const wholeEnd = str.indexOf(MARKERS.WHOLE_END);
  if (wholeStart === -1 || wholeEnd === -1) return null;

  const wholePart = str.substring(0, wholeStart);
  const inner = str.substring(wholeStart + 1, wholeEnd);
  const divIndex = inner.indexOf(MARKERS.DIV);
  if (divIndex === -1) return null;

  const numPart = inner.substring(0, divIndex);
  const denPart = inner.substring(divIndex + 1);

  return {
    whole: wholePart,
    num: numPart,
    den: denPart
  };
}

/**
 * Разбирает простую дробь "числитель÷знаменатель"
 * @param {string} str
 * @returns {{ num: string, den: string } | null}
 */
function parseSimpleFraction(str) {
  const divIndex = str.indexOf(MARKERS.DIV);
  if (divIndex === -1) return null;
  const numPart = str.substring(0, divIndex);
  const denPart = str.substring(divIndex + 1);
  // Не должно быть вложенных маркеров внутри
  if (numPart.includes(MARKERS.DIV) || denPart.includes(MARKERS.DIV)) return null;
  return { num: numPart, den: denPart };
}

/**
 * Удаляет технические маркеры из строки для плоского отображения
 * @param {string} str
 * @returns {string}
 */
export function stripMarkers(str) {
  return str
    .replace(new RegExp(`[${MARKERS.WHOLE_START}${MARKERS.WHOLE_END}${MARKERS.COMPLEX_NUM_START}${MARKERS.COMPLEX_END}]`, 'g'), '')
    .replace(/÷/g, '/');
}

/**
 * Основная функция: преобразует выражение в массив токенов для рендеринга.
 * Каждый токен: { type: 'text', value: string } или { type: 'fraction', whole?: string, num: string, den: string }
 * @param {string} expression
 * @returns {Array<{type: string, value?: string, whole?: string, num?: string, den?: string}>}
 */
export function parseExpressionToTokens(expression) {
  if (!expression || expression.trim() === '') return [];

  const tokens = [];
  let i = 0;
  const len = expression.length;

  while (i < len) {
    const ch = expression[i];

    // 1. Смешанная дробь: целое⥑числитель÷знаменатель⥏
    if (ch === MARKERS.WHOLE_START) {
      const endIdx = expression.indexOf(MARKERS.WHOLE_END, i);
      if (endIdx !== -1) {
        let startWhole = i - 1;
        // eslint-disable-next-line no-useless-escape
        while (startWhole >= 0 && expression[startWhole].match(/[\d\-]/)) {
          startWhole--;
        }
        startWhole++;
        const fullMixed = expression.substring(startWhole, endIdx + 1);
        const parsed = parseMixedFraction(fullMixed);
        if (parsed) {
          tokens.push({
            type: 'fraction',
            whole: parsed.whole,
            num: parsed.num,
            den: parsed.den
          });
          i = endIdx + 1;
          continue;
        }
      }
    }

    // 2. Числа и простые дроби (без целой части)
    if (ch.match(/\d/) || ch === '-') {
      if (ch === '-' && i > 0 && /[\d)⥏]/.test(expression[i - 1])) {
        tokens.push({ type: 'text', value: '-' });
        i++;
        continue;
      }

      let j = i;
      while (j < len && (expression[j].match(/[\d\-.]/) || expression[j] === MARKERS.DIV)) {
        j++;
      }

      // Если сразу за числом идет запуск смешанной дроби ⥑
      if (j < len && expression[j] === MARKERS.WHOLE_START) {
        const endIdx = expression.indexOf(MARKERS.WHOLE_END, j);
        if (endIdx !== -1) {
          const fullMixed = expression.substring(i, endIdx + 1);
          const parsed = parseMixedFraction(fullMixed);
          if (parsed) {
            tokens.push({
              type: 'fraction',
              whole: parsed.whole,
              num: parsed.num,
              den: parsed.den
            });
            i = endIdx + 1;
            continue;
          }
        }
      }

      const candidate = expression.substring(i, j);

      // Простая дробь вида "числитель÷знаменатель"
      if (candidate.includes(MARKERS.DIV) &&
        !candidate.includes(MARKERS.WHOLE_START) &&
        !candidate.includes(MARKERS.COMPLEX_NUM_START)) {
        const parsed = parseSimpleFraction(candidate);
        if (parsed) {
          tokens.push({
            type: 'fraction',
            whole: undefined,
            num: parsed.num,
            den: parsed.den
          });
          i = j;
          continue;
        }
      }

      // Обычное число
      if (isNumber(candidate)) {
        tokens.push({ type: 'text', value: candidate });
        i = j;
        continue;
      }
    }

    // 3. Условие проверки операторов, степеней и скобок:

    if (ch === '^') {
      let j = i + 1;
      let exponentBuf = '';

      // Собираем всё, что идет за знаком ^
      while (j < expression.length && (
        /[\d.]/.test(expression[j]) ||
        '⁰¹²³⁴⁵⁶⁷⁸⁹⁻˙'.includes(expression[j])
      )) {
        exponentBuf += expression[j];
        j++;
      }

      // Если цифры степени найдены — создаем токен superscript
      if (exponentBuf.length > 0) {
        const cleanExponent = fromSuperscript(exponentBuf);
        tokens.push({
          type: 'superscript',
          value: cleanExponent
        });
      } else {
        // ЕСЛИ СТЕПЕНЬ ПУСТАЯ (пользователь только что нажал кнопку ^)
        // Рендерим пустой невидимый символ или знак-подсказку, 
        // но главное — не даем парсеру упасть или зациклиться.
        tokens.push({
          type: 'superscript',
          value: ''
        });
      }

      // Гарантированный сдвиг указателя: 
      // если цифр не было, j равен i + 1, то есть мы просто перешагнем '^'
      i = j;
      continue;
    }

    // Обработка остальных операторов (без '^')
    if ('+-*/=()√'.includes(ch)) {
      tokens.push({ type: 'text', value: ch });
      i++;
      continue;
    }
  }

  // Склеиваем соседние текстовые токены
  const merged = [];
  for (let k = 0; k < tokens.length; k++) {
    if (tokens[k].type === 'text' && merged.length && merged[merged.length - 1].type === 'text') {
      // @ts-ignore
      merged[merged.length - 1].value += tokens[k].value;
    } else {
      merged.push({ ...tokens[k] });
    }
  }
  return merged;
}

// Экспортируем алиас для совместимости с DisFraction (ожидает parseExpressionToHtml)
export const parseExpressionToHtml = parseExpressionToTokens;