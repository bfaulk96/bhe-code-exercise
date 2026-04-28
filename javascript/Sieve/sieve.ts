export class Sieve {
  /**
   * For the Sieve of Eratosthenes, the upper bound can be estimated as p(n) ​< n(log(n) + log(log(n)))
   * This bound does not work for small values of n, so I am using a simple, safe overestimate for n < 5
   * @param n - The nth prime to return.
   * @returns the upper bound for finding the nth prime, or 11 if n < 5.
   */
  protected getUpperBound(n: number): number {
    if (n < 5) return 11;
    const k = n + 1;
    return Math.ceil(k * (Math.log(k) + Math.log(Math.log(k))));
  }

  /**
   * Get an array of all primes up to and including n.
   * @param n - The nth prime to return.
   * @param maxToCheck - The number to get the primes up to and including.
   * @returns the nth prime up to the maxToCheck, or -1 if the nth prime is not found within the maxToCheck.
   */
  protected getNthPrimeUpToMax(n: number, maxToCheck: number): number {
    if (n === 0) return 2; // 1st prime is 2. This is a special edge-case, and it's important we handle it early so we can eliminate even numbers later.

    // We can reduce memory usage by storing only the odd numbers in the sieve.
    const size = Math.floor(maxToCheck / 2) + 1;
    // Convert a number to the sieve index – since we're dealing with odd numbers, we can subtract 1 and divide by 2 to get the stable, integer index.
    const toIndex = (num: number) => (num - 1) / 2;

    // Using a Uint8Array to store the sieve since it's a very small memory footprint. Prime = 0, Composite (or not prime) = 1.
    const compositeFlags = new Uint8Array(size);
    // Since 0 and 1 are edge cases that are not primes, we can set them to 1 to skip them in the sieve
    compositeFlags[0] = 1; // 1 is not prime

    // Define our limit so we don't have to recalculate it every loop iteration
    const limit = Math.sqrt(maxToCheck);
    // Iterate through the sieve and mark the multiples of each prime as not prime.
    // We only need to check *odd numbers*, since even numbers are composite.
    // Any composite number will have at least one factor less than or equal to its square root, so we only need to check up to the square root.
    for (let i = 3; i <= limit; i += 2) {
      // if the number is prime, mark all of its multiples as not prime (if composite, we've already marked its multiples as composite as well)
      if (compositeFlags[toIndex(i)] === 0) {
        // Define the step so we don't have to recalculate it every loop iteration.
        // Since we're only checking odd numbers, we can multiply by 2 to get the next multiple.
        const step = 2 * i;
        // Start at the square of the prime, since all smaller multiples would have already been marked as composite.
        for (let j = i * i; j <= maxToCheck; j += step) {
          compositeFlags[toIndex(j)] = 1;
        }
      }
    }

    // Iterate through the *odd numbers* in the sieve and count the number of primes up to the maxToCheck.
    // Once we reach the nth prime, return it.
    // Starts at the index of prime 3, which is 1 (since we've already checked index 0 as a special edge-case).
    let primeIndex = 1;
    for (let i = 3; i <= maxToCheck; i += 2) {
      if (compositeFlags[toIndex(i)] === 0) {
        if (primeIndex === n) return i;
        primeIndex++;
      }
    }

    return -1;
  }

  NthPrime(n: number): number {
    if (!Number.isSafeInteger(n)) throw new Error("n must be a safe integer");
    if (n < 0) throw new Error("n must not be negative");
    if (n > 200_000_000) {
      throw new Error("Only the first 200,000,000 primes are supported. Use SegmentedSieve for larger values.");
    }
    const maxCheck = this.getUpperBound(n);
    return this.getNthPrimeUpToMax(n, maxCheck);
  }
}
