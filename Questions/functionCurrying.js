let sum = function (a) {
  return function (b) {
    if (b) return sum(a + b); //it will check if another argument is present if yes then it will recusively call
    return a; // if not present it will return the sum
  };
};

sum(1)(2)(3)(4)();
