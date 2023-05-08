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

    void incorrectUse() {
        SomeApi api = new SomeApi();

        api.someAction();
    }
}