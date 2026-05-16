/**
 * src/lib/services/fractionActions.js
 * Сервис действий для страницы вычисления дробей
 */
import { appState } from '../store/appState.svelte.js';
import { addDigit, addOperator } from './mathActions.svelte.js';
import { Fraction } from './fractionCore.js';

/**
 * 1. Ввод цифр (0-9) на странице дробей
 */
export function enterFractionDigit(digit) {
  const data = appState.fractionData;

  if (data.focus !== 'main') {
    if (data.focus === 'num') data.errors.num = false;
    if (data.focus === 'den') data.errors.den = false;

    if (data.focus === 'whole') {
      data.whole = data.whole === '0' ? digit : data.whole + digit;
    } else if (data.focus === 'num') {
      data.num = data.num === '0' ? digit : data.num + digit;
    } else if (data.focus === 'den') {
      if (data.den === '' && digit === '0') return;
      data.den = data.den === '0' ? digit : data.den + digit;
    }
  } else {
    addDigit(digit);
  }
}

/**
 * 2. Обработка кнопки дробной черты [÷]
 */
export function handleFractionSlash() {
  const data = appState.fractionData;

  if (data.focus === 'main') {
    if (appState.display !== '0' && appState.display !== '') {
      data.num = appState.display;
      appState.display = '0';
      data.focus = 'den';
    } else {
      data.focus = 'num';
    }
  }
}

/**
 * 3. Кнопка Тождества [≡] (Сокращение и выделение целой части)
 */
export function executeIdentity() {
  const data = appState.fractionData;

  if (data.num === '' || data.den === '') {
    if (data.num === '') data.errors.num = true;
    if (data.den === '') data.errors.den = true;
    return;
  }

  const w = data.whole === '' ? 0 : parseInt(data.whole, 10);
  const n = parseInt(data.num, 10);
  const d = parseInt(data.den, 10);

  try {
    const fraction = new Fraction(n, d, w);
    const processed = fraction.simplify().extractWhole();

    data.whole = processed.whole === 0 ? '' : String(processed.whole);
    data.num = String(processed.num);
    data.den = String(processed.den);
    data.showWhole = processed.whole !== 0;
  } catch (error) {
    console.error("Identity error:", error);
  }
}

/**
 * 4. Кнопка превращения дроби из шаблона в десятичное число [:.]
 */
export function fractionToDecimal() {
  const data = appState.fractionData;

  if (data.num && data.den) {
    const w = data.whole === '' ? 0 : parseInt(data.whole, 10);
    const fraction = new Fraction(parseInt(data.num, 10), parseInt(data.den, 10), w);

    appState.display = String(fraction.toDecimal());
    appState.resetFraction();
    appState.isNewInput = true;
  }
}

/**
 * 5. Кнопка превращения десятичного числа в обыкновенную дробь [.:]
 */
export function decimalToFraction() {
  const data = appState.fractionData;
  const currentDisplay = Number(appState.display);

  if (appState.display !== '0' && appState.display !== '' && !isNaN(currentDisplay)) {
    const processed = Fraction.fromDecimal(currentDisplay);

    data.whole = processed.whole === 0 ? '' : String(processed.whole);
    data.num = String(processed.num);
    data.den = String(processed.den);
    data.showWhole = processed.whole !== 0;
    data.focus = 'num';
  }
}

/**
 * Обработка операторов (+, -, *, /) на странице дробей
 */
export function enterFractionOperator(op) {
  const data = appState.fractionData;

  if (data.focus !== 'main') {
    if (data.num === '' || data.den === '') {
      if (data.num === '') data.errors.num = true;
      if (data.den === '') data.errors.den = true;
      return;
    }

    let fractionStr = data.whole !== '' ? `${data.whole}(${data.num}÷${data.den})` : `${data.num}÷${data.den}`;

    if (appState.expression === '' || appState.expression === '0') {
      appState.expression = fractionStr + op;
    } else {
      appState.expression = appState.expression + fractionStr + op;
    }

    appState.resetFraction();
    appState.display = '0';
    appState.isNewInput = true;
  } else {
    // Поддерживаем базовую логику добавления знаков, переводя '/' в интерфейсный знак оператора
    addOperator(op === '/' ? '/' : op);
  }
}

/**
 * Обработка кнопки [=] на странице дробей — точный парсер без потерь
 */
export function calculateFractionResult() {
  const data = appState.fractionData;

  // 1. Фиксируем ввод дроби, если шаблон открыт
  if (data.focus !== 'main') {
    if (data.num === '' || data.den === '') {
      if (data.num === '') data.errors.num = true;
      if (data.den === '') data.errors.den = true;
      return;
    }
    let fractionStr = data.whole !== '' ? `${data.whole}(${data.num}÷${data.den})` : `${data.num}÷${data.den}`;
    appState.expression += fractionStr;
    appState.resetFraction();
  } else if (appState.display !== '0' && appState.display !== '') {
    appState.expression += appState.display;
  }

  if (!appState.expression) return;

  try {
    const rawExpression = appState.expression;

    // Защита: деление на ноль по ТЗ проверяется строго при нажатии "="
    if (rawExpression.includes('÷0') || /\/0/.test(rawExpression)) {
      appState.display = 'ERROR';
      appState.expression = '';
      appState.isNewInput = true;
      return;
    }

    // Парсим строку на токены. Регулярка учитывает знак "/" изBtnBlockOpBaseFraction и знак "÷"
    const tokenRegex = /(\d+)\((\d+)÷(\d+)\)|(\d+)÷(\d+)|(\d+)|([-+*/÷])/g;
    /** @type {Array<string | Fraction>} */
    let tokens = [];
    let match;

    while ((match = tokenRegex.exec(rawExpression)) !== null) {
      if (match[1]) {
        const w = parseInt(match[1], 10);
        const n = parseInt(match[2], 10);
        const d = parseInt(match[3], 10);
        tokens.push(new Fraction((w * d) + n, d, 0));
      } else if (match[4]) {
        tokens.push(new Fraction(parseInt(match[4], 10), parseInt(match[5], 10), 0));
      } else if (match[6]) {
        tokens.push(new Fraction(parseInt(match[6], 10), 1, 0));
      } else if (match[7]) {
        tokens.push(match[7]);
      }
    }

    if (tokens.length === 0) return;

    // Первый проход: вычисляем умножение и деление (*, /, ÷)
    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i] === '*' || tokens[i] === '/' || tokens[i] === '÷') {
        const op = tokens[i];
        const prev = /** @type {Fraction} */ (tokens[i - 1]);
        const next = /** @type {Fraction} */ (tokens[i + 1]);
        let res;

        if (op === '*') {
          res = new Fraction(prev.num * next.num, prev.den * next.den, 0);
        } else {
          // По ТЗ автоматическое переворачивание второй дроби при делении
          if (next.num === 0) throw new Error("Division by zero");
          res = new Fraction(prev.num * next.den, prev.den * next.num, 0);
        }

        tokens.splice(i - 1, 3, res);
        i--;
      }
    }

    // Второй проход: сложение и вычитание (+, -)
    let finalFraction = /** @type {Fraction} */ (tokens[0]);
    for (let i = 1; i < tokens.length; i += 2) {
      const op = tokens[i];
      const next = /** @type {Fraction} */ (tokens[i + 1]);

      if (op === '+') {
        finalFraction = new Fraction(
          (finalFraction.num * next.den) + (next.num * finalFraction.den),
          finalFraction.den * next.den,
          0
        );
      } else if (op === '-') {
        finalFraction = new Fraction(
          (finalFraction.num * next.den) - (next.num * finalFraction.den),
          finalFraction.den * next.den,
          0
        );
      }
    }

    // Формируем чистый результат в формате строки без авто-выделения целой части (до нажатия ≡)
    const resultStr = `${finalFraction.num}÷${finalFraction.den}`;

    // Передаем структурированный объект в историю для твоей верстки псевдо-стеком
    appState.historySession.push({
      type: 'fraction',
      rawExpr: rawExpression,
      resultNum: finalFraction.num,
      resultDen: finalFraction.den,
      resultWhole: finalFraction.whole
    });

    appState.expression = String(resultStr);
    appState.display = '0';
    appState.isNewInput = true;

  } catch (error) {
    console.error("Fraction calculation core failure:", error);
    appState.display = 'ERROR';
    appState.expression = '';
  }
}