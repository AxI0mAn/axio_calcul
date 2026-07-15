// src/lib/components/testFraction/testMatrix.js
// testMatrix.js простой массив всех тест-кейсов

export const testMatrix = [
  { id: 1, input: "1÷2", expected: "1÷2" },
  { id: 2, input: "5÷2", expected: "2⥑1÷2⥏" },
  { id: 3, input: "-7÷3", expected: "-2⥑1÷3⥏" },
  { id: 4, input: "(3÷(1-1))", expected: "ERROR" },
  { id: 5, input: "(53÷51)÷(2÷17)", expected: "8⥑5÷6⥏" },
  { id: 6, input: "5(1÷2+1÷2)+3", expected: "8" },
  { id: 7, input: "5*(1÷2+1÷2)*3", expected: "15" },
  { id: 8, input: "5(1÷2-1÷2)÷4", expected: "0÷1" },
  { id: 9, input: "5÷8+0.5", expected: "1⥑1÷8⥏" },
  { id: 10, input: "0.5+0.75", expected: "1⥑1÷4⥏" },
  { id: 11, input: "3÷4+0.5+1÷8", expected: "1⥑3÷8⥏" },

  // ===== СМЕШАННЫЕ ДРОБИ (КЛЮЧЕВЫЕ ТЕСТЫ) =====
  { id: 12, input: "9(7÷23)", expected: "9⥑7÷23⥏" },
  { id: 13, input: "1(5÷(8-3))", expected: "2" },
  { id: 14, input: "-7(15÷(9-2))", expected: "-4⥑6÷7⥏" },
  { id: 15, input: "4((4-3)÷3)", expected: "4⥑1÷3⥏" },

  // ===== УМНОЖЕНИЕ ДРОБЕЙ =====
  { id: 16, input: "12((15-4)+(12÷4))", expected: "168" },
  { id: 17, input: "5((1÷2+1÷2)÷(1+2))+2(12÷33)", expected: "6⥑4÷11⥏" },
  { id: 18, input: "2(1÷3)+3(1÷2)", expected: "5⥑5÷6⥏" },

  // ===== СЛОЖНЫЕ ВЫРАЖЕНИЯ =====
  { id: 19, input: "2((3+4)÷5)+6", expected: "8⥑2÷5⥏" },
  { id: 20, input: "(1÷6+2(1÷3))÷(8÷3)", expected: "15÷16" },
  { id: 21, input: "((1÷6)+2(1÷3))÷(8÷3)", expected: "15÷16" },
  { id: 22, input: "((1÷6)+2(1÷3))÷8÷3", expected: "1÷12" },

  // ===== ЛЕВОАССОЦИАТИВНОЕ ДЕЛЕНИЕ =====
  { id: 23, input: "1÷2÷3÷4", expected: "1÷24" },
  { id: 24, input: "2÷3÷4÷5", expected: "1÷30" },

  // ===== СЛОЖНЫЕ ДРОБИ =====
  { id: 25, input: "(1÷2+1÷3)÷(1÷4+1÷5)", expected: "3⥑1÷3⥏" },
  { id: 26, input: "2÷(3÷4)", expected: "2⥑2÷3⥏" },
  { id: 27, input: "3(1÷2)÷(4÷5)", expected: "3⥑17÷20⥏" },

  // ===== НЕЯВНЫЕ ОПЕРАТОРЫ =====
  { id: 28, input: "3(4÷5)", expected: "3⥑4÷5⥏" },
  { id: 29, input: "(1÷2)(3÷4)", expected: "3÷8" },
  { id: 30, input: "2(3÷4)(5÷6)", expected: "1⥑1÷4⥏" },


  { id: 32, input: "4((4-3)÷3)", expected: "4⥑1÷3⥏" },
  { id: 32, input: "4(4-3)÷3", expected: "4⥑1÷3⥏" },
  { id: 33, input: "2(((1+2)÷3)÷4)", expected: "2⥑1÷4⥏" },

  // ===== СЛОЖЕНИЕ ДРОБЕЙ =====
  { id: 34, input: "1÷2+5÷8", expected: "1⥑1÷8⥏" },
  { id: 35, input: "1÷4+3÷8", expected: "5÷8" },
  { id: 36, input: "1÷2-5", expected: "-4⥑1÷2⥏" },
  { id: 37, input: "5(1÷2+1÷2)+3", expected: "8" },

  { id: 38, input: "5+((1÷2+1÷2)÷(3-2))", expected: "6" },
  { id: 39, input: "5+(1÷2+1÷2)÷(3-2-1)", expected: "ERROR" },
  { id: 40, input: "1(1÷4)+3(1÷2)", expected: "4⥑3÷4⥏" },
  { id: 41, input: "5÷8+0.5", expected: "1⥑1÷8⥏" },
  { id: 42, input: "0.5+0.75", expected: "1⥑1÷4⥏" },
  { id: 43, input: "3÷4+0.5+1÷8", expected: "1⥑3÷8⥏" },

  // ===== ВЫЧИТАНИЕ ДРОБЕЙ =====
  { id: 44, input: "1÷2-5÷8", expected: "-1÷8" },
  { id: 45, input: "3÷8-1÷4", expected: "1÷8" },
  { id: 46, input: "5÷16-5÷(12-8)", expected: "-15÷16" },
  { id: 47, input: "4÷5-18", expected: "-17⥑1÷5⥏" },
  { id: 48, input: "4-3÷5", expected: "3⥑2÷5⥏" },

  { id: 49, input: "4(3÷4)-1(1÷4)", expected: "3⥑1÷2⥏" },
  { id: 50, input: "5÷8-0.5", expected: "1÷8" },
  { id: 51, input: "0.75-0.5", expected: "1÷4" },
  { id: 52, input: "3÷4-0.5-1÷8", expected: "1÷8" },

  // ===== УМНОЖЕНИЕ ДРОБЕЙ =====
  { id: 53, input: "1÷2*5÷8", expected: "5÷16" },
  { id: 54, input: "-1÷4*1÷4", expected: "-1÷16" },
  { id: 55, input: "(1÷2)(1÷4)", expected: "1÷8" },
  { id: 56, input: "8*(1÷4)", expected: "2" },
  { id: 57, input: "8(1÷4)", expected: "8⥑1÷4⥏" },

  { id: 58, input: "3(1÷2+1÷2-3÷2)", expected: "-1⥑1÷2⥏" },
  { id: 59, input: "3*(1÷(2-2))", expected: "ERROR" },
  { id: 60, input: "(1÷4)*3(1÷2)", expected: "7÷8" },
  { id: 61, input: "3(1÷4)*4(2÷5)", expected: "14⥑3÷10⥏" },

  { id: 62, input: "2*(2÷5+(1÷4-1÷8))", expected: "1⥑1÷20⥏" },
  { id: 63, input: "2(12÷17+1÷3)", expected: "2⥑4÷51⥏" },
  { id: 64, input: "0.5*0.75", expected: "3÷8" },
  { id: 65, input: "1÷16*0.5", expected: "1÷32" },

  // ===== ДЕЛЕНИЕ ДРОБЕЙ =====
  { id: 66, input: "1/2", expected: "1÷2" },
  { id: 67, input: "1÷2/5÷8", expected: "4÷5" },
  { id: 68, input: "1÷4/1÷4", expected: "1" },
  { id: 69, input: "(1/2+1÷4)/2", expected: "3÷8" },

  { id: 70, input: "5((1÷2+1÷2)/(1+2))", expected: "1⥑2÷3⥏" },
  { id: 71, input: "5((1÷2+1÷2)÷(1+3))", expected: "5⥑1÷4⥏" },
  { id: 72, input: "5*((1/2+1/2)/(1+2))", expected: "1⥑2÷3⥏" },
  { id: 73, input: "5(1/2+1/2)/(1+2)", expected: "1⥑2÷3⥏" },

  { id: 74, input: "1/2/1/4", expected: "1÷8" },
  { id: 75, input: "1÷2/1÷4", expected: "2" },
  { id: 76, input: "(1÷2)/(3÷4)", expected: "2÷3" },
  { id: 77, input: "3(1/2)", expected: "3⥑1÷2⥏" },
  { id: 78, input: "3(1÷2)", expected: "3⥑1÷2⥏" },

  { id: 79, input: "3(1÷3)/4(2÷5)", expected: "25÷33" },
  { id: 80, input: "0.5/0.25", expected: "2" },
  { id: 81, input: "0.5/0.75", expected: "2÷3" },
  { id: 82, input: "1÷16/0.5", expected: "1÷8" },
  { id: 83, input: "-3.5/4", expected: "-7÷8" },

  // ===== СЛОЖНЫЕ ВЫРАЖЕНИЯ =====
  { id: 84, input: "(1+5+8)/4", expected: "3⥑1÷2⥏" },
  { id: 85, input: "(1+5+8)/(3+8-4)", expected: "2" },
  { id: 86, input: "2((2÷5)/(1÷2+1÷4))", expected: "1⥑1÷15⥏" },
  { id: 87, input: "2((2÷5)÷(1÷2+1÷4))", expected: "2⥑8÷15⥏" },
  { id: 88, input: "((1÷6)+2(1÷3))/(8÷3)", expected: "15÷16" },
  { id: 89, input: "7(1÷3)/(1÷2)", expected: "14⥑2÷3⥏" },

  { id: 90, input: "2((15+1)÷14)", expected: "3⥑1÷7⥏" },
  { id: 91, input: "2(15+1)÷14", expected: "2⥑2÷7⥏" },
  { id: 92, input: "2((15+1)+14)", expected: "60" },
  { id: 93, input: "-3(1÷2)÷4", expected: "-7÷8" },

  { id: 94, input: "2*(12÷17+1÷3)÷(8+3)", expected: "106÷561" },
  { id: 95, input: "2(12÷17+1÷3)÷(8+3)", expected: "106÷561" },
  { id: 96, input: "2((12÷17+1÷3)÷(8+3))", expected: "2⥑53÷561⥏" },
  { id: 97, input: "2(3÷(3-19))", expected: "1⥑13÷16⥏" },
  { id: 98, input: "5((1÷2+1÷2)÷(1+2))", expected: "5⥑1÷3⥏" },
  { id: 99, input: "5(1÷2+1÷2)÷(1+2)", expected: "1⥑2÷3⥏" },

  { id: 100, input: "(8-12)((5-3)÷(3+5))", expected: "-1" },
  { id: 101, input: "2((2÷5)/(1÷2+1÷4))", expected: "1⥑1÷15⥏" },
  { id: 102, input: "2((2÷5)÷(1÷2+1÷4))", expected: "2⥑8÷15⥏" },
  { id: 102, input: "(12÷17+1÷3)*2", expected: "2⥑4÷51⥏" },

  { id: 103, input: "4(2÷3-1÷6)", expected: "2" },
  { id: 104, input: "5(2÷3*3÷4)", expected: "2⥑1÷2⥏" },
  { id: 105, input: "(2÷3)*4(1÷2)", expected: "3" },
  { id: 106, input: "2*3(4÷5)÷7", expected: "1⥑3÷35⥏" },
  { id: 107, input: "3*4(1÷2)", expected: "13⥑1÷2⥏" },
  { id: 108, input: "5(1÷2-1÷2)+4", expected: "4" },

  { id: 109, input: "(5(1÷2-1÷2)÷4)+(3÷4)", expected: "3÷4" },

  { id: 110, input: "3(1/2)", expected: "3⥑1÷2⥏" },
  { id: 111, input: "3+(1/2)", expected: "3⥑1÷2⥏" },
  { id: 112, input: "3*(1/2)", expected: "1⥑1÷2⥏" },
  { id: 113, input: "3(1÷2)", expected: "3⥑1÷2⥏" },
  { id: 114, input: "3+(1÷2)", expected: "3⥑1÷2⥏" },
  { id: 115, input: "3*(1÷2)", expected: "1⥑1÷2⥏" },
];