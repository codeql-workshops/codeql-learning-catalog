module.exports = {
  //  Need to run as `node` for the `new URL` constructor to work. Will need to
  //  revisit once we start testing front end code.
  testEnvironment: 'node',
  transformIgnorePatterns: [],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/.github/',
    '<rootDir>/.next/'
  ],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', {presets: ['next/babel']}]
  }
}
