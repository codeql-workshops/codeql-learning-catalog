struct ctx {
  void *opaque;
};

void some_action(struct ctx *, const char *);
void init(struct ctx *);

void correct_use(const char *input) {
  struct ctx ctx;

  init(&ctx);
  some_action(&ctx, input);
}

void incorrect_use1(const char *input) {
  struct ctx ctx;

  some_action(&ctx, input);
}

void incorrect_use2(const char *input) {
  struct ctx ctx;

  if (input) {
    init(&ctx);
  }

  some_action(&ctx, input);
}