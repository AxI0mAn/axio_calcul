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
    // '-' обрабатывается как число, только если он не является оператором вычитания!
    if (ch.match(/\d/) || (ch === '-' && (i === 0 || '+*/=([√÷'.includes(expression[i - 1])))) {

      let j = i;
      // Внутри цикла то же самое: не даем зажевать минус, если он идет после цифры
      while (j < len && (
        expression[j].match(/[\d.]/) ||
        expression[j] === MARKERS.DIV ||
        (expression[j] === '-' && j === i) // Минус разрешен только на самой первой позиции токена
      )) {
        j++;
      }
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

      if (isNumber(candidate)) {
        tokens.push({ type: 'text', value: candidate });
        i = j;
        continue;
      }
    }

    // 3. ОБРАБОТКА СТЕПЕНИ (Изолированная и безопасная)
    if (ch === '^') {
      let j = i + 1;
      let exponentBuf = '';

      // Собираем всё, что идет за знаком ^
      while (j < len && (
        /[\d.()÷]/.test(expression[j]) ||
        '⁰¹²³⁴⁵⁶⁷⁸⁹⁻˙'.includes(expression[j])
      )) {
        exponentBuf += expression[j];
        j++;
      }

      if (exponentBuf.length > 0) {
        // Если цифры степени есть — создаем токен superscript без птички ^
        tokens.push({
          type: 'superscript',
          value: fromSuperscript(exponentBuf)
        });
      } else {
        // Если после ^ пусто (только что нажали xʸ) — рендерим ^ как обычный текст
        tokens.push({
          type: 'text',
          value: '^'
        });
      }

      i = j; // Жесткий гарантированный сдвиг указателя цикла
      continue;
    }

    // 4. Обычные операторы и скобки
    if ('+-*/=()√'.includes(ch)) {
      tokens.push({ type: 'text', value: ch });
      i++;
      continue;
    }

    // 5. Предохранитель для пропуска неизвестных символов/пробелов
    i++;
  }

  // Склеиваем соседние текстовые токены БЕЗ мутации объектов для реактивности Svelte 5
  const merged = [];
  for (let k = 0; k < tokens.length; k++) {
    const current = tokens[k];
    if (current.type === 'text' && merged.length && merged[merged.length - 1].type === 'text') {
      merged[merged.length - 1].value += current.value;
    } else {
      merged.push(current); // Передаем ссылку напрямую, без деструктуризации {...}
    }
  }
  return merged;
}

// Экспортируем алиас для совместимости с DisFraction (ожидает parseExpressionToHtml)
export const parseExpressionToHtml = parseExpressionToTokens;