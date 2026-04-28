import { Sieve } from "./sieve";

export class SegmentedSieve extends Sieve {
  /**
   * Generate base primes up to and including the limit.
   * @param limit - The limit to generate primes up to and including.
   * @returns an array of all primes up to and including the limit.
   */
  private getPrimesUpTo(limit: number): number[] {
    // cover base cases
    if (limit < 2) return [];
    if (limit === 2) return [2];

    const composite = new Uint8Array(limit + 1);
    const primes: number[] = [];

    // Only need to iterate through odd numbers, since even numbers are composite
    for (let i = 3; i <= limit; i += 2) {
      if (composite[i] === 0) {
        primes.push(i);

        if (i * i <= limit) {
          // j can increment by 2i, since we're only iterating through odd numbers
          for (let j = i * i; j <= limit; j += i * 2) {
            composite[j] = 1;
          }
        }
      }
    }

    return primes;
  }

  /**
   * Get an array of all primes up to and including n.
   * @param n - The nth prime to return.
   * @param maxToCheck - The number to get the primes up to and including.
   * @returns the nth prime up to the maxToCheck, or -1 if the nth prime is not found within the maxToCheck.
   */
  protected getNthPrimeUpToMax(n: number, maxToCheck: number): number {
    if (n === 0) return 2; // 1st prime is 2. This is a special edge-case, and it's important we handle it early so we can eliminate even numbers later.

    // Get all primes up to the square root of the maxToCheck
    const sqrtLimit = Math.floor(Math.sqrt(maxToCheck));
    const basePrimes = this.getPrimesUpTo(sqrtLimit);

    // Theoretically can be adjusted to trade off memory for speed, though in practice this kind of seemed like the best of both
    const segmentOddCount = 8_000_000;
    // Even though we only check odd numbers, our range goes *UP* to double our odd count, since it covers the actual number line
    const segmentRange = segmentOddCount * 2;
    const segment = new Uint8Array(segmentOddCount);

    let primeIndex = 1; // 3 is the 1st index in 0-based prime indexing
    let baseIndex = 0;

    // active is an array of the active primes in the current segment
    const active: {
      p: number; // The prime number itself
      step: number; // 2 * p, because we only mark odd multiples
      // The next multiple to mark as composite
      // We use this `next` value to avoid recalculating the multiple every time
      next: number;
    }[] = [];

    // segment only ever holds odd numbers, so we can start at 3 and increment by segmentRange
    for (let low = 3; low <= maxToCheck; low += segmentRange) {
      // The high limit is the smaller of the segment range or the maxToCheck
      const high = Math.min(low + segmentRange - 2, maxToCheck);
      // The length of the segment is the number of odd numbers in the segment (range is low -> high)
      // We divide by 2 because we're only marking odd numbers, and add 1 because we want to include the low number
      const segmentLength = Math.floor((high - low) / 2) + 1;

      // Instead of recreating the segment array every time, we can just reuse it and fill it with 0s
      segment.fill(0, 0, segmentLength);

      // We only want to iterate through base primes within the current segment –
      // if `baseIndex` >= basePrimes.length, then there are no more base primes to iterate through
      // if (basePrimes[baseIndex])^2 > high, then there are no more base primes that could be in the current segment
      while (baseIndex < basePrimes.length && basePrimes[baseIndex] * basePrimes[baseIndex] <= high) {
        const p = basePrimes[baseIndex++];

        if (p !== 2) {
          active.push({
            p,
            step: 2 * p, // 2 * p, because we only mark odd multiples
            next: p * p, // The next is always p^2, since every smaller multiple of p will have already been marked as composite
          });
        }
      }

      // Iterate through all active primes, marking their multiples as composite
      for (let k = 0; k < active.length; k++) {
        const sp = active[k]; // grab the active prime
        let multiple = sp.next;

        // Mark all multiples of the active prime as composite
        for (; multiple <= high; multiple += sp.step) {
          segment[(multiple - low) / 2] = 1; // Map the real number back into the current segment
        }

        sp.next = multiple; // update the next multiple to mark as composite
      }

      // Count the primes in the segment, and map them back to actual numbers
      for (let i = 0; i < segmentLength; i++) {
        if (segment[i] === 0) {
          // if we've found the nth prime, convert the segment index to the actual number and return it
          if (primeIndex === n) return low + 2 * i;
          primeIndex++;
        }
      }
    }

    return -1;
  }

  NthPrime(n: number): number {
    if (!Number.isSafeInteger(n)) throw new Error("n must be a safe integer");
    if (n < 0) throw new Error("n must not be negative");
    if (n > 600_000_000) throw new Error("Only the first 600,000,000 primes are supported");
    const maxCheck = this.getUpperBound(n);
    return this.getNthPrimeUpToMax(n, maxCheck);
  }
}
