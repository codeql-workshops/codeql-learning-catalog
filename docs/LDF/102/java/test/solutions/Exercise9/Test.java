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

    void correctCaller() {
        SomeApi api = SomeApiBuilder.createApi();
        correctAndIncorrectUse(api);
    }

    void incorrectCaller() {
        SomeApi api = new SomeApi();
        correctAndIncorrectUse(api);
    }

    void correctAndIncorrectUse(SomeApi api) {
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