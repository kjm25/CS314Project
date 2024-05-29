const { sum, mult } = require('./server');

test('test add', () => {
  expect(sum(1, 2)).toBe(3);
});

test('test mult', () => {
  expect(mult(1, 2)).toBe(2);
});