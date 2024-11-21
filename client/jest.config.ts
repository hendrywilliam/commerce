import type { Config } from "jest";

const config: Config = {
  clearMocks: true,
  coverageProvider: "v8",
  roots: ["<rootDir>/tests/unit"],
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.(t|j)sx?$": "@swc/jest",
    "^.+\\.(t|j)s?$": "ts-jest",
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};

export default config;
