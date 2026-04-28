import { Sieve } from "./sieve";

describe("Sieve", () => {
  // We can do this because the Sieve class is a singleton, and there are no side effects
  let sieve: Sieve;
  beforeAll(() => {
    sieve = new Sieve();
  });

  test("should throw an error if n is less than 0", () => {
    expect(() => sieve.NthPrime(-1)).toThrow("n must not be negative");
  });

  test("should throw an error if n is greater than 100,000,000", () => {
    expect(() => sieve.NthPrime(100_000_001)).toThrow("Only the first 100,000,000 primes are supported");
  });

  test("should work for small values of n", () => {
    expect(sieve.NthPrime(0)).toBe(2);
    expect(sieve.NthPrime(1)).toBe(3);
    expect(sieve.NthPrime(2)).toBe(5);
    expect(sieve.NthPrime(3)).toBe(7);
    expect(sieve.NthPrime(4)).toBe(11);
    expect(sieve.NthPrime(5)).toBe(13);
    expect(sieve.NthPrime(6)).toBe(17);
    expect(sieve.NthPrime(7)).toBe(19);
    expect(sieve.NthPrime(8)).toBe(23);
    expect(sieve.NthPrime(9)).toBe(29);
  });

  test("19th prime should be 71", () => {
    expect(sieve.NthPrime(19)).toBe(71);
  });

  test("99th prime should be 541", () => {
    expect(sieve.NthPrime(99)).toBe(541);
  });

  test("500th prime should be 3_581", () => {
    expect(sieve.NthPrime(500)).toBe(3_581);
  });

  test("986th prime should be 7_793", () => {
    expect(sieve.NthPrime(986)).toBe(7_793);
  });

  test("2000th prime should be 17_393", () => {
    expect(sieve.NthPrime(2_000)).toBe(17_393);
  });

  test("1000000th prime should be 15_485_867", () => {
    expect(sieve.NthPrime(1_000_000)).toBe(15_485_867);
  });

  test("10000000th prime should be 179_424_691", () => {
    expect(sieve.NthPrime(10_000_000)).toBe(179_424_691);
  });

  test("100000000th prime should be 2_038_074_751", () => {
    expect(sieve.NthPrime(100_000_000)).toBe(2_038_074_751);
  });
});
