const sum = require('./sum');

test('number', () => {
  expect(1).toBe(1);
});

test('toBeEqueal', () => {
  const data = {};
  data.a = 'a';
  expect(data).toEqual({ a: 'a' });
});

test('not to be zero', () => {
  // for (let a = 0; a < 10; a++) {
  //   expect(a).not.toBe(-1);
  // }
  const n = null;
  const b = true;
  const un = undefined;
  expect(n).toBeNull();
  expect(n).toBeDefined();
  expect(un).toBeUndefined();
  expect(b).toBeTruthy();
  expect(b).not.toBeFalsy();
});

test('number test', () => {
  const n = 10;
  // 大于
  expect(n).toBeGreaterThan(5);
  expect(n).toBeGreaterThanOrEqual(10);
  expect(n).toBeLessThan(20);
  expect(n).toBeLessThanOrEqual(10);
  const value = 0.1 + 0.2;
  expect(value).toBeCloseTo(0.3);
});

test('string', () => {
  const str = 'hello world';
  expect(str).toMatch(/hello/);
});
