struct ctx {
  void *opaque;
};

void some_action(struct ctx *, const char *);
void init(struct ctx *);

void default_ctx(struct ctx *ctx) {
  init(ctx);
  ctx->opaque = (void *)0xC0FFEE;
}

void correct_use1(const char *input) {
  struct ctx ctx;

  init(&ctx);
  some_action(&ctx, input);
}

void correct_use2(const char *input) {
  struct ctx ctx;

  default_ctx(&ctx);
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

void correct_or_incorrect_use(struct ctx *ctx, const char *input) {
  some_action(ctx, input);
}

void incorrect_caller(const char *input) {
  struct ctx ctx;
  correct_or_incorrect_use(&ctx, input);
}

void correct_caller(const char *input) {
  struct ctx ctx;
  default_ctx(&ctx);

  correct_or_incorrect_use(&ctx, input);
}