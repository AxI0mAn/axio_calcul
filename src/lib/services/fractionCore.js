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
export const lcm = (a, b) => (Math.abs(a * b) / gcd(a, b));

// 3. Класс управления дробью
export class Fraction {
  constructor(num, den = 1, whole = 0) {
    this.num = Number(num);
    this.den = Number(den);
    this.whole = Number(whole);

    if (this.den === 0) throw new Error("ERROR: Division by zero");
  }

  // Сокращение дроби
  simplify() {
    const common = gcd(this.num, this.den);
    return new Fraction(this.num / common, this.den / common, this.whole);
  }

  // Выделение целой части
  extractWhole() {
    let newWhole = this.whole + Math.floor(this.num / this.den);
    let newNum = this.num % this.den;
    return new Fraction(newNum, this.den, newWhole);
  }

  // Преобразование в десятичную
  toDecimal() {
    return this.whole + (this.num / this.den);
  }

  // Статический метод: Десятичное в дробь
  static fromDecimal(decimal, precision = 1000000) {
    const whole = Math.floor(decimal);
    const fractionPart = decimal - whole;
    const num = Math.round(fractionPart * precision);
    const den = precision;
    return new Fraction(num, den, whole).simplify();
  }
}

/**
 * Функция подготовки шагов сложения для Истории
 */
export function getSumSteps(f1, f2) {
  const commonDen = lcm(f1.den, f2.den);
  const m1 = commonDen / f1.den; // множитель 1
  const m2 = commonDen / f2.den; // множитель 2

  return {
    step1: `${f1.num * m1}÷${commonDen}`,
    step2: `${f2.num * m2}÷${commonDen}`,
    resultNum: (f1.num * m1) + (f2.num * m2),
    commonDen
  };
}