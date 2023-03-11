# Local GitHub Actions written in JavaScript

For better cachability and testability, we created an folder to contain all local Actions written in JavaScript.

We don't currently utilize the `action.yml` file to define an actual action because Node 16 is not yet supported as runner (see [actions/runner#772](https://github.com/actions/runner/issues/772)). We directly run the scripts instead.

The actions follow the following convention:

1. Each script is wrapped in an async function which is directly executed when `GITHUB_ACTIONS` is set

   ```js
   import core from '@actions/core'
   import {Octokit} from 'octokit'

   if (process.env.GITHUB_ACTIONS && process.env.NODE_ENV !== 'test') {
     const octokit = new Octokit({
       auth: process.env.GITHUB_TOKEN
     })
     run(process.env, core, octokit)
   }

   /**
    * @param {NodeJS.ProcessEnv} env
    * @param {core} core
    * @param {Octokit} octokit
    */
   async function run(env, core, octokit) {
     // ...
   }
   ```

2. That makes it possible to import the `run` function in tests, see the [`test/` folder](test) for examples
3. `npm test` runs all the tests. We run it on GitHub Actions as well whenever any file in `.github/actions/js` is updated, both in the `main` branch as well as in pull requests, using `.github/workflows/tpm-automation-ci.yml` workflow.

To run the tests locally, you need to [install Node 16](https://nodejs.org/en/) or higher. Then

```
cd .github/actions/js
npm install
npm test
```

If you have any questions, ping @gr2m (`@gregor` in Slack)
