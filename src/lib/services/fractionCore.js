/**
 * src/lib/services/math/fractionCore.js
 * Математическое ядро для работы с обыкновенными дробями (Только вычисления)
 */

// 1. Наибольший общий делитель (для сокращения)
export const gcd = (a, b) => {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    a %= b;
    [a, b] = [b, a];
  }
  return a;
};

// 2. Наименьшее общее кратное (для приведения к общему знаменателю)
export const lcm = (a, b) => {
  if (a === 0 || b === 0) return 0;
  return Math.abs(a * b) / gcd(a, b);
};

// 3. Класс управления дробью
export class Fraction {
  constructor(num, den = 1, whole = 0) {
    this.num = Number(num);
    this.den = Number(den);
    this.whole = Number(whole);

    if (this.den === 0) throw new Error("ERROR: Division by zero");
  }

  // Сокращение дроби с сохранением знака у числителя
  simplify() {
    if (this.num === 0) {
      return new Fraction(0, 1, this.whole);
    }
    const common = gcd(this.num, this.den);
    let newNum = this.num / common;
    let newDen = this.den / common;

    if (newDen < 0) {
      newNum = -newNum;
      newDen = -newDen;
    }
    return new Fraction(newNum, newDen, this.whole);
  }

  // Выделение целой части для перевода в смешанное число
  extractWhole() {
    let currentNum = this.whole * this.den + this.num;
    let newWhole = Math.trunc(currentNum / this.den);
    let newNum = currentNum % this.den;

    // Знак храним в целой части, числитель оставляем положительным
    if (newWhole !== 0) {
      newNum = Math.abs(newNum);
    }
    return new Fraction(newNum, this.den, newWhole);
  }

  // Преобразование в десятичную дробь
  toDecimal() {
    return this.whole + (this.num / this.den);
  }

  // Статический метод: Создание объекта Fraction из десятичного числа
  static fromDecimal(decimal, precision = 1000000) {
    const whole = Math.trunc(decimal);
    const fractionPart = Math.abs(decimal - whole);
    const num = Math.round(fractionPart * precision);
    const den = precision;
    return new Fraction(num, den, whole).simplify();
  }
}

/**
 * Функция подготовки шагов сложения/вычитания для Истории
 */
export function getSumSteps(f1, f2, isSubtraction = false) {
  const commonDen = lcm(f1.den, f2.den);
  const m1 = commonDen / f1.den;
  const m2 = commonDen / f2.den;

  const n1 = (f1.whole * f1.den + f1.num) * m1;
  const n2 = (f2.whole * f2.den + f2.num) * m2;
  const resultNum = isSubtraction ? n1 - n2 : n1 + n2;

  return {
    step1: `${n1}÷${commonDen}`,
    step2: `${n2}÷${commonDen}`,
    resultNum,
    commonDen
  };
}