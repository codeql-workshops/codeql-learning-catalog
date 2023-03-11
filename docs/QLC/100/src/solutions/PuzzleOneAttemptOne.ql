from int a, int b, int c, int d, int e
where
  a = [0 .. 4] and
  b = [0 .. 4] and
  c = [0 .. 4] and
  d = [0 .. 4] and
  e = [0 .. 4] and
  c < b and
  c > d and
  e < a and
  e > b
select a, b, c, d, e
