export class Sieve {
  /**
   * A simple overestimate for the upper bound of the sieve. Should not be used for large values of n.
   * @param n - The index of the prime number to find.
   * @returns An overestimate of the upper bound of the sieve.
   */
  private simpleUpperBound(n: number): number {
    return 2 + n * n;
  }

  /**
   * A logarithmic overestimate for the upper bound of the sieve. Works for values of n > 5.
   * @param n - The index of the prime number to find.
   * @returns An overestimate of the upper bound of the sieve.
   */
  private logarithmicUpperBound(n: number): number {
    const k = n + 1;
    return Math.ceil(k * (Math.log(k) + Math.log(Math.log(k))));
  }

  /**
   * Get an array of all primes up to and including n.
   * @param n - The nth prime to return.
   * @param maxToCheck - The number to get the primes up to and including.
   * @returns the nth prime up to the maxToCheck, or -1 if the nth prime is not found within the maxToCheck.
   */
  private getNthPrimeUpToMax(n: number, maxToCheck: number): number {
    if (n === 0) return 2; // 1st prime is 2. This is a special edge-case, and it's important we handle it early so we can eliminate even numbers later.

    // Using a Uint8Array to store the sieve since it's a very small memory footprint. Prime = 0, Composite (or not prime) = 1.
    const compositeFlags = new Uint8Array(maxToCheck + 1);
    // Since 0 and 1 are edge cases that are not primes, we can set them to 1 to skip them in the sieve
    compositeFlags[0] = 1;
    compositeFlags[1] = 1;

    // Define our limit so we don't have to recalculate it every loop iteration
    const limit = Math.sqrt(maxToCheck);
    // Iterate through the sieve and mark the multiples of each prime as not prime.
    // We only need to check *odd numbers*, since even numbers are composite.
    // Any composite number will have at least one factor less than or equal to its square root, so we only need to check up to the square root.
    for (let i = 3; i <= limit; i += 2) {
      // if the number is prime, mark all of its multiples as not prime (if composite, we've already marked its multiples as composite as well)
      if (compositeFlags[i] === 0) {
        // Start at the square of the prime, since all smaller multiples would have already been marked as composite.
        for (let j = i * i; j <= maxToCheck; j += i) {
          compositeFlags[j] = 1;
        }
      }
    }

    // Iterate through the *odd numbers* in the sieve and count the number of primes up to the maxToCheck.
    // Once we reach the nth prime, return it.
    let count = 0;
    for (let i = 3; i <= maxToCheck; i += 2) {
      if (compositeFlags[i] === 0) count++;
      if (count === n) return i;
    }

    return -1;
  }

  NthPrime(n: number): number {
    if (!Number.isSafeInteger(n)) throw new Error("n must be a safe integer");
    if (n < 0) throw new Error("n must be greater than 0");
    if (n > 100_000_000) throw new Error("Only the first 100,000,000 primes are supported");
    // For the Sieve of Eratosthenes, the upper bound can be estimated as p(n) ​< n(log(n) + log(log(n)))
    //   Unfortunately, this bound does not work for small values of n, so I am using a simpler overestimate for n < 5
    const maxCheck = n < 5 ? this.simpleUpperBound(n) : this.logarithmicUpperBound(n);
    return this.getNthPrimeUpToMax(n, maxCheck);
  }
}
