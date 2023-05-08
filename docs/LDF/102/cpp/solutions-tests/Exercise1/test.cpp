int add(int i, int j) { return i + j; }

unsigned int absolute(int i) {
  if (i < 0) {
    return -i;
  }
  return i;
}

unsigned int fib1(unsigned int n) {
  if (n == 0) {
    return 0;
  }
  if (n == 1) {
    return 1;
  }
  return fib1(n - 1) + fib1(n - 2);
}

unsigned int fib2(unsigned int n) {
  if (n == 0) {
    return 0;
  }
  if (n == 1) {
    return 1;
  }
  int a = 0;
  int b = 1;
  for (int i = 2; i <= n; i++) {
    int c = a + b;
    a = b;
    b = c;
  }
  return b;
}
