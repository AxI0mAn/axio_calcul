/**
* файл src/lib/action/mathCore.js
* Чистые функции для вычислений.
* управляет логикой: когда очищать экран, а когда продолжать цепочку.
* "движок" парсинга строки (чтобы 2+2*2 считалось правильно)
*/

import { float_toFixed } from "./base.js";


/**
 * isValidMathExpression - Проверяет выражение на наличие только разрешенных математических символов и функций
 * @param {string} expression 
 * @returns {boolean}
 */
function isValidMathExpression(expression) {

  // 1. Очищаем строку от всех разрешенных ЧИСЕЛ, ОПЕРАТОРОВ и СКОБОК
  // (то, что не является словами функций)
  // eslint-disable-next-line no-useless-escape
  let testStr = expression.replace(/[0-9+\-*/\u221A\u207F:\s.()\[\]^√%|~#\u2229]/g, '');

  // 2. Теперь в testStr остались только буквы (названия функций).
  // Если строка пустая — значит, там были только цифры и знаки, это безопасно.
  if (testStr === '') return true;

  // 3. Если остались буквы, проверяем, являются ли они разрешенными СЛОВАМИ.
  // Мы ищем все последовательности букв и сверяем их со списком.
  const foundWords = expression.match(/[a-zA-Z]+/g) || [];
  const allowedWords = [
    'divs', 'log2', 'ln', 'log10', 'log', 'Math', 'pow',
    'sqrt', 'sin', 'cos', 'tan', 'PI', 'E', 'e', 'rand'
  ];

  // Если хотя бы одно найденное слово не входит в список разрешенных — это JS-инъекция
  return foundWords.every(word => allowedWords.includes(word));
}



/**
* Безопасно вычисляет строковое выражение с учетом приоритетов (* / перед + -)
* Использует Function constructor как более безопасную альтернативу eval() 
* для простых математических выражений. 

 * Вычисляет математическое выражение, переданное в виде строки.
 * Добавлена очистка от лишних знаков в конце (например, "=").
 * @param {string} cleanExpression - Строка вида "12 + 3" или "12 + 3 ="
 * @returns {number|string} - Результат или сообщение об ошибке
 */
export function evaluateExpression(cleanExpression) {

  if (!cleanExpression) return '0';
  if (!isValidMathExpression(cleanExpression)) {
    console.error("Security alert: Unauthorized words in expression");
    return 'ERROR';
  }
  try {
    let expr = cleanExpression;


    // Случайное число между двумя
    // Регулярка ищет: число X, символ #, число Y
    const randomRegExp = /([\d.]+)\s*#\s*([\d.]+)/g;

    expr = expr.replace(randomRegExp, (match, x, y) => {
      const min = parseFloat(x);
      const max = parseFloat(y);

      // Условие для x=0 и y=1: случайное дробное (12 знаков)
      if (min === 0 && max === 1) {
        return `(Math.random())`; // Округлим до 12 знаков позже через float_toFixed
      }

      // Для всех остальных случаев: случайное ЦЕЛОЕ в диапазоне [min, max]
      // Включая границы
      const low = Math.min(min, max);
      const high = Math.max(min, max);
      return `(Math.floor(Math.random() * (${high} - ${low} + 1)) + ${low})`;
    });
    // Случайное число между двумя


    // для Округление x до y знаков  x [~] y
    const roundRegExp = /([\d.]+)\s*~\s*([\d.]+)/g;

    expr = expr.replace(roundRegExp, (match, x, y) => {
      const precision = Math.pow(10, parseInt(y));
      // Математическое округление:
      return `(Math.round(${x} * ${precision}) / ${precision})`;
    });


    // Находим конструкцию: (число)√(число)
    const sqrtSym = String.fromCharCode(8730);
    // 1. Обработка сложного корня y√x (ⁿ√64:3)
    // Важно: проверяем наличие двоеточия, которое мы добавили в basic.js
    const complexSqrtRegExp = new RegExp(`${'\u207F'}${sqrtSym}([\\d.]+):([\\d.]+)`, 'g');
    if (expr.includes('\u207F')) {
      expr = expr.replace(complexSqrtRegExp, (match, x, y) => {
        return `(Math.pow(${x}, 1/${y}))`;
      });
    }
    // исправляем визуальный порядок для истории и логов
    // превращаем "sqrtY_base:8√3" в "3√8"
    expr = expr.replace(complexSqrtRegExp, (match, x, y) => {
      // Для JS вычислений: Math.pow(x, 1/y)
      return `(Math.pow(${x}, 1/${y}))`;
    });


    // 1. Подготовка символов π и ^
    const SYMBOLS = {
      SQRT: String.fromCharCode(8730), // Тот самый &Sqrt; (8730)
      PI: 'π',
      POW: '^'
    };

    // 2. ЗАМЕНЫ (Универсальный подход)
    // Используем конструктор RegExp, чтобы точно поймать символ по коду
    expr = expr
      .replace(new RegExp(SYMBOLS.SQRT, 'g'), 'Math.sqrt')
      .replace(new RegExp('\\' + SYMBOLS.POW, 'g'), '**') // Экранируем ^
      .replace(new RegExp(SYMBOLS.PI, 'g'), String(Math.PI))
      .replace(/\|([^|]+)\|/g, 'Math.abs($1)')
      // .replace(/sin/g, 'Math.sin')
      // .replace(/cos/g, 'Math.cos') 
      ;

    // 3. АВТОЗАКРЫТИЕ СКОБОК
    const openBkt = (expr.match(/\(/g) || []).length;
    const closeBkt = (expr.match(/\)/g) || []).length;
    if (openBkt > closeBkt) {
      expr += ')'.repeat(openBkt - closeBkt);
    }

    // логарифмы
    // Сначала обрабатываем специфичные (log2)
    // Ищем log(64:4) -> превращаем в (Math.log(64) / Math.log(4))
    const logYXRegExp = /log\(([\d.]+):([\d.]+)\)/g;

    expr = expr.replace(logYXRegExp, (match, x, y) => {
      return `(Math.log(${x}) / Math.log(${y}))`;
    });

    expr = expr.replace(/log2\(([\d.]+)\)/g, (match, x) => {
      return `Math.log2(${x})`;
    });

    expr = expr.replace(/log10\(([\d.]+)\)/g, (match, x) => {
      return `Math.log10(${x})`;
    });

    expr = expr.replace(/ln\(([\d.]+)\)/g, (match, x) => {
      return `Math.log(${x})`;
    })



    // * Общие делители для X и Y  function allDivisors()
    /*
   const divsRegExp = /divs:([\d.]+):([\d.]+)/g;

       if (expr.includes('divs:')) {
         const finalStr = expr.replace(divsRegExp, (match, x, y) => {
           const num1 = Math.abs(parseInt(x));
           const num2 = Math.abs(parseInt(y));
           const commonDivisors = [];
           const limit = Math.min(num1, num2);
   
           for (let i = 2; i <= limit; i++) {
             if (num1 % i === 0 && num2 % i === 0) {
               commonDivisors.push(i);
             }
           }
   
           // НОВЫЙ ФОРМАТ: "24 ∩ 48 : [2, 4...]"
           // Символ ∩ (\u2229) означает пересечение множеств делителей
           return `${num1} \u2229 ${num2} : [${commonDivisors.join(', ')}]`;
         });
   
         return finalStr; // ВАЖНО: выходим из функции здесь, не доходя до new Function!
       }
   */
    if (expr.includes('divs:')) {
      // Регулярное выражение ищет: 
      // 1. Начало divs:
      // 2. Группу (\d+), которая состоит ТОЛЬКО из цифр
      // 3. Разделитель : и вторую группу (\d+) ТОЛЬКО из цифр
      const divsRegExp = /^divs:(\d+):(\d+)$/;
      const match = expr.match(divsRegExp);

      // Если строка не соответствует строгому формату divs:ЧИСЛО:ЧИСЛО
      if (!match) {
        return "ERROR";
      }

      const num1 = parseInt(match[1]);
      const num2 = parseInt(match[2]);

      // Дальнейшая логика вычисления делителей...
      let commonDivisors = [];
      let limit = Math.min(num1, num2);
      for (let i = 2; i <= limit; i++) {
        if (num1 % i === 0 && num2 % i === 0) {
          commonDivisors.push(i);
        }
      }
      return `${num1} \u2229 ${num2} : [${commonDivisors.join(', ')}]`;
    }


    // 4. ВЫЧИСЛЕНИЕ
    const rawResult = new Function(`return (${expr})`)();

    // Проверкка 
    if (!Number.isFinite(rawResult)) return "ERROR";
    // ПРОВЕРКА НА NaN И INFINITY
    // Мы проверяем, является ли результат числом и не равен ли он NaN
    if (typeof rawResult === 'number' && isNaN(+rawResult)) {
      return 'ERROR';
    }

    // Также полезно ловить деление на ноль (Infinity)
    if (+rawResult === Infinity || rawResult === -Infinity) {
      return 'ERROR';
    }

    // Глобальная проверка: если результат NaN в любом виде
    // Number.isNaN поймает чистое значение NaN
    // String() поймает, если NaN вдруг стал строкой
    if (Number.isNaN(rawResult) || String(rawResult) === 'NaN' || rawResult === undefined) {
      return "ERROR";
    }

    // Есть Дополнительная проверка в src/lib/services/calculatorActions.svelte.js
    // const result = evaluateExpression(finalExpr);
    // if (result === "ERROR" || result === undefined || isNaN(+result) || String(result) === 'NaN')

    // Возвращаем результат через float_toFixed

    return float_toFixed(rawResult);

  } catch (e) {
    console.error("Math Error:", e);
    return "ERROR";
  }
}


/**
* Генерирует объект записи для истории 
* @param {string} expr - Выражение (например "2+2*2")
* @param {string} res - Результат (например "6")
* @returns {Object} - Объект с меткой времени и строкой
*/
export function createHistoryEntry(expr, res) {
  return {
    timestamp: Date.now(),
    entry: `${expr}=${res}`
  };
}
