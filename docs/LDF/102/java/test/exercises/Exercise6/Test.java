class SomeApi {
    void initialize() {

    }

    void someAction() {

    }
}

class Test {
    void correctUse() {
        SomeApi api = new SomeApi();

        api.initialize();
        api.someAction();
    }

    void incorrectUse1() {
        SomeApi api = new SomeApi();

        api.someAction();
    }

    void incorrectUse2() {
        SomeApi api = new SomeApi();

        if (false) {
            api.initialize();
        }
        api.someAction();

    }
}