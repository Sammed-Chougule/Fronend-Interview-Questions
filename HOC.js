const arr = [1, 2, 3, 4];

const area = (radius) => Math.PI * radius * radius;

const circumference = (radius) => 2 * Math.PI * radius;

const diameter = (radius) => 2 * radius;

const calculate = (arr, fn) => {
  const output = [];
  for (let i = 0; i < arr.length; i++) {
    output.push(fn(arr[i]));
  }
  return output;
};

console.log(calculate(arr, area));
console.log(calculate(arr, circumference));
console.log(calculate(arr, diameter));

//polyfills of map

Array.prototype.pollyfillsmap = (fn) => {
  const output = [];
  for (let i = 0; i < arr.length; i++) {
    output.push(fn(arr[i]));
  }
  return output;
};

console.log(arr.pollyfillsmap(area));
console.log(arr.pollyfillsmap(circumference));
console.log(arr.pollyfillsmap(diameter));
