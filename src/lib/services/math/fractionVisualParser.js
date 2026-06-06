/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-escape */
/**
 * src/lib/services/math/fractionVisualParser.js
 * fractionVisualParser.js — токенизатор, который различает простые дроби число÷число и смешанные целое⥑числитель÷знаменатель⥏, а также обрабатывает операторы.
 * Преобразует строку с математическими выражениями и спецсимволами в массив токенов для рендеринга двухэтажных дробей и плоских выражений.
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
 * Проверяет, является ли строка числом (целым, десятичным или незавершенным с точкой на конце)
 * @param {string} str
 * @returns {boolean}
 */
function isNumber(str) {
  // Добавлена поддержка незавершенного ввода вида "1."
  return /^-?\d+\.?\d*$/.test(str);
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
 * console.log(parseExpressionToTokens("3(1÷2)")
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

    // 2. Числа, простые дроби и смешанные дроби с динамическим окном (Случай 1)
    if (ch.match(/\d/) || (ch === '-' && (i === 0 || '+*/=([√÷'.includes(expression[i - 1])))) {
      let j = i;
      while (j < len && (
        expression[j].match(/[\d.]/) ||
        expression[j] === MARKERS.DIV ||
        (expression[j] === '-' && j === i)
      )) {
        j++;
      }

      // === LOOKAHEAD ОКНО ДЛЯ СЛУЧАЯ 1 (Незакрытые скобки) ===
      // Если сразу за числом идёт открывающая скобка '('
      if (j < len && expression[j] === '(') {

        // ПРОВЕРКА НА ДВОЙНУЮ СКОБКУ СЛУЧАЯ 4: NUMBER + ((
        if (j + 1 < len && expression[j + 1] === '(') {
          let k = j + 2;
          let numeratorBuf = '';
          let denominatorBuf = '';
          let stage = 'numerator'; // Переключатель: собираем числитель или знаменатель
          let openBrackets = 2;

          // Сканируем строку вперед для сбора блоков числителя и знаменателя
          while (k < len) {
            const char = expression[k];

            if (char === '(') openBrackets++;
            if (char === ')') openBrackets--;

            // Если мы собираем числитель и наткнулись на главный разделитель '÷'
            // при условии, что внутренние скобки числителя сбалансированы/закрылись
            if (stage === 'numerator' && char === '÷' && expression.substring(k - 2, k) === '))') {
              stage = 'denominator';
              k++;
              continue;
            }

            if (stage === 'numerator') {
              numeratorBuf += char;
            } else {
              denominatorBuf += char;
            }

            k++;
          }

          // Срезаем внешние скобки числителя и знаменателя
          let cleanNum = numeratorBuf.replace(/^\(+/, '').replace(/\)+$/, '').trim();

          // Очищаем знаменатель от скобок, которые пользователь только начинает вводить
          let cleanDen = denominatorBuf.replace(/^\(+/, '').replace(/\)+$/, '').trim();
          const wholePart = expression.substring(i, j);

          // Если мы действительно перешли на стадию знаменателя, генерируем токен составной дроби
          if (stage === 'denominator') {
            // === КОРРЕКЦИЯ ДЛЯ МГНОВЕННОГО ОТОБРАЖЕНИЯ ЧЕРТЫ ===
            // Если знаменатель пустой или состоит только из скобок (например, "(( ")
            // принудительно ставим маркер '?', чтобы Svelte отрисовал двухэтажную структуру
            if (!cleanDen || cleanDen.length === 0) {
              cleanDen = '?';
            }
            tokens.push({
              type: 'fraction',
              whole: wholePart,
              num: cleanNum || '?',
              // ВАЖНО: Если знаменатель пустой или в процессе ввода, 
              // гарантируем, что он не превратится в пустую строку, ломающую верстку
              den: cleanDen // === '' ? '?' : cleanDen
            });

            i = k; // Гарантированно сдвигаем указатель за пределы всей конструкции
            continue;
          } else {
            // === КЕЙС ШАГА 6 (Случай 7: Двойные скобки без знаменателя) ===
            // Пушим число перед скобками как самостоятельный множитель
            tokens.push({ type: 'text', value: wholePart });

            // Внедряем токен скрытого умножения
            tokens.push({ type: 'text', value: '*' });

            // Сдвигаем указатель i на позицию первой открывающей скобки '(',
            // чтобы стандартный конвейер разобрал структуру (( числитель )) как обычные плоские скобки
            i = j;
            continue;
          }
        }
        // === КОНЕЦ ПРОВЕРКИ НА ДВОЙНУЮ СКОБКУ ===

        // === ЗАЩИТА ШАГА 5 (Случай 6: Пустые скобки или мгновенный обрыв) ===
        if (j + 1 >= len || (expression[j + 1] === ')' && (j + 2 >= len || !expression.includes('÷')))) {
          // Если строка закончилась на '3(' или пользователь ввёл '3()' без знака дроби внутри
          const baseNum = expression.substring(i, j);
          tokens.push({ type: 'text', value: baseNum });
          tokens.push({ type: 'text', value: expression[j] }); // Добавляем саму скобку '('

          if (expression[j + 1] === ')') {
            tokens.push({ type: 'text', value: ')' });
            i = j + 2;
          } else {
            i = j + 1;
          }
          continue;
        }
        // === КОНЕЦ ЗАЩИТЫ ШАГА 5 ===

        // Ниже код для одиночной скобки из Шага 1 и 3:

        let k = j + 1;
        let bracketContent = '';
        let openCount = 1;

        // Захватываем содержимое скобок до физической ')' или до конца строки (виртуальное окно)
        while (k < len) {
          if (expression[k] === '(') openCount++;
          if (expression[k] === ')') {
            openCount--;
            if (openCount === 0) { k++; break; } // Включая закрывающую скобку
          }
          bracketContent += expression[k];
          k++;
        }

        // Проверяем условия Случая 1: внутри ОДИН знак '÷' и нет других операторов/знаков
        // Исключаем классический слэш '/', пробелы и бинарные операторы
        const hasSingleDiv = (bracketContent.match(/÷/g) || []).length === 1;
        const hasOtherOps = /[\+\-\*\/]/.test(bracketContent);

        if (hasSingleDiv && !hasOtherOps) {
          // === КЕЙС ШАГА 1 ===
          const parts = bracketContent.split('÷');
          const cleanNum = parts[0].replace(/[\(\)]/g, '').trim();
          const cleanDen = parts[1].replace(/[\(\)]/g, '').trim();
          const wholePart = expression.substring(i, j);

          tokens.push({
            type: 'fraction',
            whole: wholePart,
            num: cleanNum,
            den: cleanDen || '?'
          });

          i = k;
          continue;
        }
        else if (hasOtherOps || (bracketContent.match(/÷/g) || []).length > 1) {
          // === КЕЙС ШАГА 3 (Случай 3: Сложное выражение в скобках) ===
          // Сначала пушим само число (целую часть, которая стала множителем)
          const multiplier = expression.substring(i, j);
          tokens.push({ type: 'text', value: multiplier });

          // Принудительно подставляем скрытое умножение между числом и скобкой
          tokens.push({ type: 'text', value: '*' });

          // Сдвигаем указатель i на начало скобки '(', чтобы стандартный цикл 
          // посимвольно разобрал всё содержимое скобок как обычный плоский текст
          i = j;
          continue;
        }
      }
      // === КОНЕЦ LOOKAHEAD ОКНА ===

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

        // === LOOKAHEAD ДЛЯ СЛУЧАЯ 2 (Скрытое умножение перед скобкой) ===
        // Если обработанное число — это не просто унарный минус, и сразу за ним в строке идёт '('
        if (candidate !== '-' && j < len && expression[j] === '(') {
          let k = j + 1;
          let bracketContent = '';
          let openCount = 1;

          // Сканируем содержимое скобок для проверки контекста
          while (k < len) {
            if (expression[k] === '(') openCount++;
            if (expression[k] === ')') {
              openCount--;
              if (openCount === 0) break;
            }
            bracketContent += expression[k];
            k++;
          }

          // Если внутри скобок НЕТ знака '÷', то это чистое умножение (Случай 2)
          if (!bracketContent.includes('÷')) {
            tokens.push({ type: 'text', value: '*' });
          }
        }
        // === КОНЕЦ LOOKAHEAD ДЛЯ СЛУЧАЯ 2 ===

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

  // Склеиваем соседние текстовые токены, но ОСТАВЛЯЕМ операторы и скобки изолированными
  const merged = [];
  for (let k = 0; k < tokens.length; k++) {
    const current = tokens[k];

    // Проверяем, является ли текущий или предыдущий токен служебным символом, который НЕЛЬЗЯ склеивать с цифрами
    const isIsolatedChar = (val) => /[\+\-\*\/÷\(\)\^=√]/.test(val);

    if (
      current.type === 'text' &&
      merged.length &&
      merged[merged.length - 1].type === 'text' &&
      !isIsolatedChar(current.value) &&
      !isIsolatedChar(merged[merged.length - 1].value)
    ) {
      merged[merged.length - 1] = { ...merged[merged.length - 1], value: merged[merged.length - 1].value + current.value };
    } else {
      merged.push({ ...current }); // Клонируем токен для безопасности реактивности
    }
  }
  return merged;
}

// Экспортируем алиас для совместимости с DisFraction (ожидает parseExpressionToHtml)
export const parseExpressionToHtml = parseExpressionToTokens;