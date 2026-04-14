/**
* файл src/lib/action/mathCore.js
* Чистые функции для вычислений.
* управляет логикой: когда очищать экран, а когда продолжать цепочку.
* "движок" парсинга строки (чтобы 2+2*2 считалось правильно)
*/


/**
 * isValidMathExpression - Проверяет выражение на наличие только разрешенных математических символов и функций
 * @param {string} expression 
 * @returns {boolean}
 */
function isValidMathExpression(expression) {
  // 1. Разрешенные символы: цифры, точки, операторы, скобки, пробелы
  // 2. Разрешенные функции: sin, cos, tan, log, ln, sqrt, PI, E
  // Регулярное выражение:
  // [0-9+*/\s.()^] — цифры и базовые знаки
  // |sin|cos|tan|log|ln|sqrt|PI|E — ключевые слова (добавим по мере надобности)

  const allowedPattern = /^[0-9+*/\s.()^|sin|cos|tan|log|ln|sqrt|PI|E-]*$/;

  return allowedPattern.test(expression);
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
  if (!isValidMathExpression(cleanExpression)) {
    console.error("Security alert: Invalid characters in expression");
    return "ERROR";
  }

  try {
    // 1. ИСПРАВЛЕНИЕ ДВОЙНОГО МИНУСА ЧЕРЕЗ СКОБКИ:
    // Ищем "--" и захватываем все цифры (и точку), которые идут следом.
    // $1 — это то самое число, которое мы нашли.
    let normalizedExpr = cleanExpression.replace(/--([0-9.]+)/g, '-(-$1)');

    // Для функций типа sin/cos нам нужно будет обращаться к Math.sin
    // Но чтобы Function их видел, их нужно либо прописать как Math.sin в строке,
    // либо передать контекст. Самый простой способ — модифицировать строку:
    /* 
    ВАЖНО ПОНИМАТЬ!
    Если вы добавите функции sin, cos и т.д., убедитесь, 
    что при вычислении через new Function вы действительно заменяете их 
    на Math.sin, иначе код упадет с ошибкой sin is not defined.  
    */
    const safeExpr = normalizedExpr
      .replace(/sin/g, 'Math.sin')
      .replace(/cos/g, 'Math.cos')
      .replace(/log/g, 'Math.log10')
      .replace(/ln/g, 'Math.log')
      .replace(/PI/g, 'Math.PI');

    return new Function(`return (${safeExpr})`)();
  } catch (e) {
    // Теперь мы будем знать, что именно пошло не так
    console.error("Math Error:", e);
    return "ERROR";
  }
}





/**
* Проверяет, является ли последний символ строки оператором
*/
export function isLastCharOperator(str) {
  return /[-+*/]$/.test(str);
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
