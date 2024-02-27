class SomeApi {
    void initialize() {

    }

    void someAction() {

    }
}

class SomeApiBuilder {
    static SomeApi createApi() {
        SomeApi api = new SomeApi();

        api.initialize();
        return api;
    }
}

class Test {
    void correctUse1() {
        SomeApi api = new SomeApi();

        api.initialize();
        api.someAction();
    }

    void correctUse2() {
        SomeApi api = SomeApiBuilder.createApi();

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