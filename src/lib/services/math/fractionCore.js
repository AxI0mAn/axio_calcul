/* eslint-disable no-useless-escape */
/**
 * src/lib/services/math/fractionCore.js – точная арифметика дробей + парсер выражений 
 */

import { appStore } from '$lib/store/appStore.svelte.js';
import { MARKERS } from './fractionVisualParser';
import FractionJS from 'fraction.js';

// @ts-ignore 

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
      // FractionJS библиотека импортирована в начале файла
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
  console.log('🔍 [DEBUG] tokenizeFractionExpression получил:', expr);
  const tokens = [];
  let i = 0;
  const len = expr.length;

  while (i < len) {
    const ch = expr[i];
    if (ch === ' ') { i++; continue; }

    // Обработка маркеров сложных выражений (⥾ и ⥿) как обычных скобок
    if (ch === MARKERS.COMPLEX_NUM_START) {
      tokens.push({ type: 'operator', value: '(' });
      i++;
      continue;
    }
    if (ch === MARKERS.COMPLEX_END) {
      tokens.push({ type: 'operator', value: ')' });
      i++;
      continue;
    }

    // Натыкаемся на открывающую скобку 
    if (ch === '(') {
      if (tokens.length > 0 && tokens[tokens.length - 1].type === 'number') {
        // --- КЕЙС ШАГА 6 / СЛУЧАЙ 4: Проверяем на паттерн двойных скобок NUMBER + (( ---
        if (expr[i + 1] === '(') {
          let k = i + 2;
          let openBrackets = 2;
          let hasMainDiv = false;

          while (k < len) {
            if (expr[k] === '(') openBrackets++;
            if (expr[k] === ')') {
              openBrackets--;
              if (openBrackets === 0 && expr[k + 1] === '÷') {
                hasMainDiv = true;
                break;
              }
            }
            k++;
          }

          if (hasMainDiv) {
            tokens.push({ type: 'operator', value: '+' });
            console.log('[Ядро] Обнаружена составная дробь NUMBER + ((...)) ÷. Неявно подставлен "+"');
            tokens.push({ type: 'operator', value: '(' });
            i++;
            continue;
          }
        }

        // --- СЛУЧАИ 1, 2, 3: Анализ одиночной скобки ---
        let k = i + 1;
        let bracketContent = '';
        let openCount = 1;

        while (k < len) {
          if (expr[k] === '(') openCount++;
          if (expr[k] === ')') {
            openCount--;
            if (openCount === 0) break;
          }
          bracketContent += expr[k];
          k++;
        }

        const hasSingleDiv = (bracketContent.match(/÷/g) || []).length === 1;
        const hasOtherOps = /[\+\-\*\/]/.test(bracketContent);

        if (hasSingleDiv && !hasOtherOps) {
          tokens.push({ type: 'operator', value: '+' });
          console.log('[Ядро] Между целой частью и дробью неявно подставлен оператор "+"');
        } else {
          tokens.push({ type: 'operator', value: '*' });
          console.log('[Ядро] Перед скобкой неявно подставлен оператор "*" (умножение)');
        }
      }

      tokens.push({ type: 'operator', value: '(' });
      i++;
      continue;
    }

    // 1. Обрабатываем операторы и скобки
    if ('+*/()^√'.includes(ch) || ch === '÷') {
      tokens.push({ type: 'operator', value: ch });
      i++;
      continue;
    }

    // 2. Обработка минуса (бинарный vs унарный)
    if (ch === '-') {
      const isBinary = i > 0 && /[\d)⥏]/.test(expr[i - 1]);
      if (isBinary) {
        tokens.push({ type: 'operator', value: '-' });
        i++;
        continue;
      } else {
        // Унарный минус перед открывающей скобкой: превращаем в (-1 *)
        if (expr[i + 1] === '(') {
          tokens.push({ type: 'number', value: -1 });
          tokens.push({ type: 'operator', value: '*' });
          i++;
          continue;
        }
        // Унарный минус перед числом — захватываем число с минусом
        let numStart = i;
        let numEnd = i + 1;
        while (numEnd < len && /[\d.]/.test(expr[numEnd])) {
          numEnd++;
        }
        const numStr = expr.substring(numStart, numEnd);
        const numVal = parseFloat(numStr);
        if (!isNaN(numVal)) {
          tokens.push({ type: 'number', value: numVal });
          i = numEnd;
          continue;
        }
      }
    }

    // 3. Сбор чисел, простых дробей и смешанных дробей
    let j = i;
    if (expr[j] === '-') j++; // Пропускаем минус (обработан отдельно)

    while (j < len && (
      expr[j].match(/[\d.]/) ||
      expr[j] === MARKERS.WHOLE_START ||
      expr[j] === MARKERS.WHOLE_END
    )) {
      j++;
    }

    if (j > i) {
      const raw = expr.substring(i, j);
      if (raw === '-') {
        tokens.push({ type: 'operator', value: '-' });
        i = j;
        continue;
      }

      // === ОБРАБОТКА СМЕШАННОЙ ДРОБИ (⥑...⥏) ===
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

      // === ОБРАБОТКА ПРОСТОЙ ДРОБИ (число÷число) ===
      if (j < len && expr[j] === MARKERS.DIV) {
        let k = j + 1;
        let rightDigits = '';
        while (k < len && /[\d.]/.test(expr[k])) {
          rightDigits += expr[k];
          k++;
        }
        if (rightDigits.length > 0 && !rightDigits.endsWith('.')) {
          j = k;
          const rawFraction = expr.substring(i, j);
          const fractionMatch = rawFraction.match(/^(-?)(\d+\.?\d*)÷(\d+\.?\d*)$/);
          if (fractionMatch) {
            const numerator = parseFloat(fractionMatch[2]);
            const denominator = parseFloat(fractionMatch[3]);
            if (denominator !== 0) {
              const numFrac = Fraction.fromDecimal(numerator);
              const denFrac = Fraction.fromDecimal(denominator);
              const result = numFrac.div(denFrac);
              tokens.push({ type: 'fraction', value: result });
              i = j;
              continue;
            }
          }
        }
      }

      // === ОБЫЧНОЕ ЧИСЛО ===
      const numVal = parseFloat(raw);
      if (!isNaN(numVal)) {
        tokens.push({ type: 'number', value: numVal });
        i = j;
        continue;
      }

      i++;
      continue;
    }

    i++;
  }

  return tokens;
}

function applyOperator(op, a, b = null) {
  if (op === '√') {
    const left = toFraction(a);
    return left.sqrt();
  }

  const left = toFraction(a);
  const right = toFraction(b);

  // Отдельная ветка для оператора '/' – десятичное деление
  if (op === '/') {
    return left.div(right); // внутри уже есть проверка на 0
  }
  /* if (op === '/') {
     const leftNum = left.toDecimal();
     const rightNum = right.toDecimal();
     if (rightNum === 0) throw new Error('Division by zero');
     const result = leftNum / rightNum;
     return Fraction.fromDecimal(result);
   }
 */
  // Для всех остальных бинарных операторов (включая '÷') – дробная арифметика
  switch (op) {
    case '+': return left.add(right);
    case '-': return left.sub(right);
    case '*': return left.mul(right);
    case '÷': return left.div(right);
    case '^': return left.pow(right);
    default: throw new Error(`Unknown operator ${op}`);
  }
}


export function evaluateFractionExpression(expression) {
  // ===== ВРЕМЕННАЯ ОТЛАДКА =====
  // console.log('=== evaluateFractionExpression ===');
  // console.log('Input expression:', expression);

  let tokens = tokenizeFractionExpression(expression);
  // === -📝=TODO=📝- ===
  console.log('🔍 [DEBUG] Токены до RPN:', tokens);

  // ===  Виртуальное автозакрытие скобок ===
  let bracketBalance = 0;
  for (const tok of tokens) {
    if (tok.value === '(') bracketBalance++;
    if (tok.value === ')') bracketBalance--;
  }

  // Если открытых скобок больше, чем закрытых, искусственно добавляем недостающие в конец
  if (bracketBalance > 0) {
    console.log(`[Ядро] Обнаружен дисбаланс скобок: +${bracketBalance}. Применяем автозакрытие.`);
    for (let b = 0; b < bracketBalance; b++) {
      tokens.push({ type: 'operator', value: ')' });
    }
  }

  const output = [];
  const ops = [];

  // Функция определения приоритета операторов
  const getPrecedence = (op) => {
    if (op === '+' || op === '-') return 1;
    if (op === '*' || op === '/' || op === '÷') return 2;
    if (op === '^' || op === '√') return 3;
    return 0;
  };

  for (const tok of tokens) {
    // 1. Если токен — число или готовый объект Fraction, сразу отправляем в output
    if (tok.type === 'number' || tok.type === 'fraction') {
      // Превращаем обычные числа в объекты Fraction для стандартизации вычислений
      output.push(tok.value instanceof Fraction ? tok.value : new Fraction(tok.value, 1));
    }
    // 2. Если токен — открывающая скобка, просто кладем в стек операторов
    else if (tok.value === '(') {
      ops.push('(');
    }
    // 3. Если токен — закрывающая скобка
    else if (tok.value === ')') {
      while (ops.length && ops[ops.length - 1] !== '(') {
        output.push(ops.pop());
      }
      if (ops.length && ops[ops.length - 1] === '(') {
        ops.pop(); // Удаляем саму открывающую скобку
      }
    }
    // 4. Если токен — оператор (+, -, *, /, ÷, ^, √)
    else if (tok.type === 'operator') {
      const o1 = tok.value;

      // Унарный корень (префиксный) просто кладем в стек
      if (o1 === '√') {
        ops.push(o1);
      } else {
        // Для бинарных операторов выталкиваем операторы с БОЛЬШИМ или РАВНЫМ приоритетом
        while (
          ops.length &&
          ops[ops.length - 1] !== '(' &&
          getPrecedence(ops[ops.length - 1]) >= getPrecedence(o1)
        ) {
          output.push(ops.pop());
        }
        ops.push(o1);
      }
    }
  }

  // Выталкиваем оставшиеся операторы
  while (ops.length) {
    output.push(ops.pop());
  }
  // === -📝=TODO=📝- ===
  // ===== ВРЕМЕННАЯ ОТЛАДКА =====
  console.log('Final Output Stack (RPN):', output);



  // --- ВЫЧИСЛЕНИЕ СТЕКА ---
  const stack = [];

  for (const item of output) {
    if (item instanceof Fraction) {
      stack.push(item);
    } else if (item === '√') {
      // Унарный оператор корня
      const a = stack.pop();
      if (a === undefined) throw new Error('Invalid expression for sqrt');
      // Вызываем наш точный метод sqrt(), который мы настроили ранее
      stack.push(a.sqrt());
    } else {
      // Бинарные операторы (+, -, *, /, ÷, ^)
      const b = stack.pop(); // Правый операнд
      const a = stack.pop(); // Левый операнд
      if (a === undefined || b === undefined) throw new Error('Invalid expression structure');


      let result;
      switch (item) {
        case '+': result = applyOperator('+', a, b); break;
        case '-': result = applyOperator('-', a, b); break;
        case '*': result = applyOperator('*', a, b); break;
        case '/': result = applyOperator('/', a, b); break;   // десятичное деление
        case '÷': result = applyOperator('÷', a, b); break;   // дробное деление
        case '^': {
          // b.den === 1 означает, что степень целая (например, 8÷1, а не дробная)
          if (b.den === 1) {
            const power = b.num;
            if (power >= 0) {
              // Изолированно возводим числитель и знаменатель в степень без плавающей запятой
              const newNum = Math.pow(a.num, power);
              const newDen = Math.pow(a.den, power);
              result = new Fraction(newNum, newDen);
            } else {
              // Отрицательная степень — переворачиваем дробь
              const positivePower = Math.abs(power);
              const newNum = Math.pow(a.den, positivePower);
              const newDen = Math.pow(a.num, positivePower);
              result = new Fraction(newNum, newDen);
            }
          } else {
            // Если степень дробная, откатываемся к стандартному методу библиотеки
            result = a.pow(b);
          }
          break;
        }

        default: throw new Error(`Unknown operator: ${item}`);
      }
      stack.push(result);
    }
  }

  if (stack.length !== 1) throw new Error('Invalid expression: stack mismatch');
  return stack[0];
}


