# BHE Software Engineer Coding Exercise

## The Sieve of Eratosthenes

Prime numbers have many modern day applications and a long history in
mathematics. Utilizing your own resources, research the sieve of Eratosthenes,
an algorithm for generating prime numbers. Based on your research, implement
an API that allows the caller to retrieve the Nth prime number.
Some stub code and a test suite have been provided as a convenience. However,
you are encouraged to deviate from Eratosthenes's algorithm, modify the
existing functions/methods, or anything else that might showcase your ability;
provided the following requirements are satisfied.

You must author your work in Go, JavaScript/TypeScript, Python, or C# - all
other language submissions will be rejected. Stub code has been provided, so
please choose from one of the provided language stubs that is most
relevant to your skill set and the position you are applying for.

### Requirements

- Click on the "Use this template" button to create a new GitHub repository, in which you may implement your solution
- The library package provides an API for retrieving the Nth prime number using 0-based indexing where the 0th prime number is 2
- Interviewers must be able to execute a suite of tests
  - Go: `go test ./...`
    - Use `go test ./... -fuzz=.` to enable fuzz tests (random, potentially invalid inputs)
  - C#: `dotnet test Sieve.Tests`
  - Javascript: `npm run test`
  - Python: `python -m unittest test_sieve.py`
- Your solution is committed to your project's `main` branch, no uncommitted changes or untracked files please
- Submit the link to your public repo for review

### Considerations

You may add more tests or restructure existing tests, but you may NOT change or remove
the existing test outcomes; eg- f(0)=2, f(19)=71, f(99)=541, ..., f(10000000)=179424691

During the technical interview, your submission will be discussed, and you will be evaluated in the following areas:

- Technical ability
- Communication skills
- Work habits and complementary skills


## Implementation Notes

This current implementation uses significant memory for finding 100,000,000th+ prime
  - ~1.2GB max memory size for 100,000,000th prime (on my Mac)
  - ~2.5GB max memory size for finding the 200,000,000th prime (on my Mac)

This implementation could be improved/tweaked in several ways:
- Using an odd-only bitset rather than a byte array
  - This would cut our maximum memory usage to around 1/8 of what it is now.
  - I chose not to do this for readability – dealing with bits in JavaScript is messy, so given the exercise expectations, I felt this to be an unnecessary tradeoff.
- Using a segmented sieve for large numbers
  - This approach also reduces memory pressure, as your maximum memory load is based on segment size, not n.
  - This also leads to a much more complicated, less readable function.
  - This is probably preferred for n > 10,000,000
    - For n <= 10,000,000, the memory and speed difference is probably negligible enough to prefer the simpler approach
- Wheel factorization
  - skips more candidates than the odd-only check does, but also adds complexity
- Using a more performant language than TypeScript/JavaScript
  - Something like Golang or Rust would likely be much faster/more memory-efficient
    - I chose TypeScript for this exercise since I am applying for the Sr. UI Software Engineer role.