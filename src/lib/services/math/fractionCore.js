/**
 * fractionCore.js – точная арифметика дробей + парсер выражений
 * Исправлено: вычитание, знак минуса, деление на ноль, короткие дроби через simplify.
 * 
 * Вычислить корень из дроби. Сценарий ввода:
  Пользователь нажимает кнопку √.
  На экране появляется символ корня и открывается скобка: √(.
  Пользователь вводит дробь или число, например: 4, затем ÷, затем 9. На экране: √(4÷9. 
  Пользователь нажимает закрывающую скобку ). На экране: √(4÷9). 
    При нажатии на = парсер Shunting-yard корректно заберет токен √, вызовет left.sqrt() из нашего
    класса Fraction, переведет результат обратно в дробь и UI отобразит чистый результат 2÷3 под
    крышкой истории. 

    *
 */

import { appStore } from '$lib/store/appStore.svelte.js';
// @ts-ignore
// import FractionJs from 'fraction.js';

// ----- Вспомогательные функции -----
function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b !== 0) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

function lcm(a, b) {
  if (a === 0 || b === 0) return 0;
  return Math.abs(a * b) / gcd(a, b);
}

const MARKERS = {
  WHOLE_START: '\u2951',
  WHOLE_END: '\u294F',
  DIV: '÷'
};

// ----- Класс Fraction -----
export class Fraction {
  constructor(numerator, denominator, whole = 0) {
    if (denominator === 0) throw new Error('Division by zero');
    let num = numerator;
    let den = denominator;
    if (den < 0) {
      num = -num;
      den = -den;
    }
    const totalNum = whole * den + num;
    this.num = totalNum;
    this.den = den;
    this.simplify();
  }

  simplify() {
    if (this.num === 0) {
      this.den = 1;
      return;
    }
    const d = gcd(this.num, this.den);
    this.num /= d;
    this.den /= d;
    if (this.den < 0) {
      this.num = -this.num;
      this.den = -this.den;
    }
  }

  add(other) {
    const d = lcm(this.den, other.den);
    const n = this.num * (d / this.den) + other.num * (d / other.den);
    return new Fraction(n, d);
  }

  sub(other) {
    const d = lcm(this.den, other.den);
    const n = this.num * (d / this.den) - other.num * (d / other.den);
    return new Fraction(n, d);
  }

  mul(other) {
    return new Fraction(this.num * other.num, this.den * other.den);
  }

  div(other) {
    if (other.num === 0) throw new Error('Division by zero');
    return new Fraction(this.num * other.den, this.den * other.num);
  }

  pow(other) {
    // Вычисляем вещественное значение текущей дроби и дроби-степени
    const base = this.num / this.den;
    const exponent = other.num / other.den;
    const resultAsDecimal = Math.pow(base, exponent);

    return Fraction.fromDecimal(resultAsDecimal);
  }

  sqrt() {
    const value = this.num / this.den;
    if (value < 0) throw new Error('Square root of negative number');

    // Шаг 1. Пытаемся извлечь корни отдельно для числителя и знаменателя
    const numSqrt = Math.sqrt(this.num);
    const denSqrt = Math.sqrt(this.den);

    // Шаг 2. Проверяем, являются ли оба корня целыми числами
    if (Number.isInteger(numSqrt) && Number.isInteger(denSqrt)) {
      // Возвращаем идеальную точную дробь без округлений
      return new Fraction(numSqrt, denSqrt);
    }

    // Шаг 3. Если корни иррациональные (например, корень из 2/3),
    // используем алгоритм fraction.js для поиска наилучшего приближения дроби
    try {
      const resultAsDecimal = Math.sqrt(value);
      // Вместо жесткого округления до 6 знаков, отдаем число в fraction.js,
      // которая умеет распознавать периодические дроби через цепные дроби
      const FractionJS = require('fraction.js'); // Убедись, что библиотека доступна
      const approx = new FractionJS(resultAsDecimal);
      return new Fraction(Number(approx.n), Number(approx.d));
      // eslint-disable-next-line no-unused-vars
    } catch (e) {
      // Запасной аскетичный вариант, если fraction.js не подтянулась прямо в класс
      const factor = Math.pow(10, 9); // Увеличиваем точность до 9 знаков для запаса
      const num = Math.round(Math.sqrt(value) * factor);
      return new Fraction(num, factor);
    }
  }

  toMixed() {
    if (this.num === 0) return { whole: 0, num: 0, den: 1 };
    const absNum = Math.abs(this.num);
    const whole = Math.floor(absNum / this.den);
    const rem = absNum % this.den;
    const sign = this.num < 0 && whole === 0 ? -1 : (this.num < 0 ? -1 : 1);
    return {
      whole: whole * sign,
      num: rem,
      den: this.den
    };
  }

  toMixedString() {
    const m = this.toMixed();
    if (m.whole === 0) return `${this.num}÷${this.den}`;
    if (m.num === 0) return `${m.whole}`;
    return `${m.whole}⥑${m.num}÷${m.den}⥏`;
  }

  toDecimal() {
    const value = this.num / this.den;
    const toFix = appStore?.toFix ?? 6;
    return parseFloat(value.toFixed(toFix));
  }

  static fromDecimal(decimal) {
    if (isNaN(decimal) || !isFinite(decimal)) throw new Error('Invalid decimal');
    const toFix = appStore?.toFix ?? 6;
    const factor = Math.pow(10, toFix);
    const num = Math.round(decimal * factor);
    const fraction = new Fraction(num, factor);
    return fraction; // уже сокращён благодаря simplify в конструкторе
  }
}

// ----- Приведение к дроби (число -> Fraction) -----
function toFraction(value) {
  if (value instanceof Fraction) return value;
  if (typeof value === 'number') {
    if (Number.isInteger(value)) return new Fraction(value, 1);
    return Fraction.fromDecimal(value);
  }
  throw new Error('Cannot convert');
}

// ----- Токенизация (поддержка отрицательных чисел и дробей) -----
function tokenizeFractionExpression(expr) {
  const tokens = [];
  let i = 0;
  const len = expr.length;

  while (i < len) {
    const ch = expr[i];
    if (ch === ' ') { i++; continue; }

    // 1. Сначала обрабатываем операторы, которые не могут быть частью чисел
    if ('+*/()^√'.includes(ch)) {
      tokens.push({ type: 'operator', value: ch });
      i++;
      continue;
    }

    // 2. Обработка минуса (ключевой момент)
    if (ch === '-') {
      const isBinary = i > 0 && /[\d)⥏]/.test(expr[i - 1]);
      if (isBinary) {
        tokens.push({ type: 'operator', value: '-' });
        i++;
        continue;
      } else {
        // Унарный минус перед открывающей скобкой превращаем в оператор унарного умножения или обрабатываем отдельно.
        // Для Shunting-yard проще всего запушить число -1 и оператор '*' в стек, если далее идет скобка:
        if (expr[i + 1] === '(') {
          tokens.push({ type: 'number', value: -1 });
          tokens.push({ type: 'operator', value: '*' });
          i++;
          continue;
        }
      }
    }

    // 3. Сбор числа или дроби (включая возможный унарный минус)
    // Начинаем с текущей позиции – это может быть цифра или унарный минус
    let j = i;
    // Если текущий символ минус (унарный), включаем его в токен
    if (expr[j] === '-') j++;
    // Захватываем цифры, точку, ÷, маркеры целой части
    while (j < len && (
      expr[j].match(/[\d.]/) ||
      expr[j] === MARKERS.DIV ||
      expr[j] === MARKERS.WHOLE_START ||
      expr[j] === MARKERS.WHOLE_END
    )) {
      j++;
    }
    // Если удалось захватить хотя бы один символ
    if (j > i) {
      const raw = expr.substring(i, j);
      // Пропускаем одиночный минус (ошибка)
      if (raw === '-') {
        i++;
        continue;
      }

      // Смешанная дробь
      const mixedMatch = raw.match(/^(-?)(\d+)⥑(\d+)÷(\d+)⥏$/);
      if (mixedMatch) {
        const sign = mixedMatch[1] === '-' ? -1 : 1;
        const whole = parseInt(mixedMatch[2], 10);
        const num = parseInt(mixedMatch[3], 10);
        const den = parseInt(mixedMatch[4], 10);
        const totalNum = sign * (whole * den + num);
        tokens.push({ type: 'fraction', value: new Fraction(totalNum, den) });
        i = j;
        continue;
      }

      // Простая дробь
      const simpleMatch = raw.match(/^(-?)(\d+)÷(\d+)$/);
      if (simpleMatch) {
        const sign = simpleMatch[1] === '-' ? -1 : 1;
        const num = parseInt(simpleMatch[2], 10);
        const den = parseInt(simpleMatch[3], 10);
        tokens.push({ type: 'fraction', value: new Fraction(sign * num, den) });
        i = j;
        continue;
      }

      // Обычное число (целое или десятичное)
      const numVal = parseFloat(raw);
      if (!isNaN(numVal)) {
        tokens.push({ type: 'number', value: numVal });
        i = j;
        continue;
      }
    }

    // Если ничего не подошло – переходим к следующему символу
    i++;
  }
  return tokens;
}

function precedence(op) {
  if (op === '+' || op === '-') return 1;
  if (op === '*' || op === '/') return 2;
  if (op === '^' || op === '√') return 3; // Высший приоритет
  return 0;
}

function applyOperator(op, a, b = null) {
  const left = toFraction(a);

  // Если унарный корень, b будет отсутствовать
  if (op === '√') {
    return left.sqrt();
  }

  const right = toFraction(b);
  switch (op) {
    case '+': return left.add(right);
    case '-': return left.sub(right);
    case '*': return left.mul(right);
    case '/': return left.div(right);
    case '^': return left.pow(right);
    default: throw new Error(`Unknown operator ${op}`);
  }
}

// ----- Главный парсер (Shunting-yard) -----
export function evaluateFractionExpression(expression) {
  // Трассировка для отладки в консоли браузера
  console.log('=== evaluateFractionExpression ===');
  console.log('Input expression:', expression);

  const tokens = tokenizeFractionExpression(expression);
  const output = [];
  const ops = [];

  for (const tok of tokens) {
    if (tok.type === 'number' || tok.type === 'fraction') {
      output.push(tok.value);
    } else if (tok.type === 'operator') {
      const o1 = tok.value;

      if (o1 === '√') {
        ops.push(o1);
      } else {
        while (
          ops.length &&
          ops[ops.length - 1] !== '(' &&
          ops[ops.length - 1] !== '√' &&
          precedence(ops[ops.length - 1]) >= precedence(o1)
        ) {
          output.push(ops.pop());
        }
        ops.push(o1);
      }
    } else if (tok.value === '(') {
      ops.push('(');
    } else if (tok.value === ')') {
      // Выталкиваем все операторы до открывающей скобки
      while (ops.length && ops[ops.length - 1] !== '(') {
        output.push(ops.pop());
      }

      if (ops.length && ops[ops.length - 1] === '(') {
        ops.pop(); // Нашли и удалили открывающую скобку
      }

      // Если перед скобкой стоял корень — выталкиваем его в output К контенту скобки
      if (ops.length && ops[ops.length - 1] === '√') {
        output.push(ops.pop());
      }
    }
  }

  // Выталкиваем всё, что осталось в стеке операторов
  while (ops.length) {
    const topOp = ops.pop();
    if (topOp !== '(' && topOp !== ')') { // Игнорируем случайные сиротские скобки
      output.push(topOp);
    }
  }

  console.log('Final Output Stack (RPN):', output);

  // Вычисление стека
  const stack = [];
  for (const item of output) {
    if (item instanceof Fraction || typeof item === 'number') {
      stack.push(item);
    } else if (item === '√') {
      const a = stack.pop();
      if (a === undefined) throw new Error('Invalid expression for sqrt');
      const result = applyOperator(item, a);
      stack.push(result);
    } else {
      // Бинарные операторы (+, -, *, /, ^)
      const b = stack.pop();
      const a = stack.pop();
      if (a === undefined || b === undefined) throw new Error('Invalid expression structure');
      const result = applyOperator(item, a, b);
      stack.push(result);
    }
  }

  if (stack.length !== 1) throw new Error('Invalid expression: stack mismatch');

  let result = stack[0];
  if (!(result instanceof Fraction)) result = toFraction(result);
  return result;
}