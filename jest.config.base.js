/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

module.exports = {
  verbose: true,
  preset: 'ts-jest',
  moduleFileExtensions: ["js", "ts"],
  moduleNameMapper: {
    "@/(.*)": "<rootDir>/src/$1"
  },
  transform: {
    "^.+\\.ts$": "ts-jest"
  },
};