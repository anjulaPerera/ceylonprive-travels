export default {
  preset: "ts-jest/presets/default-esm",

  testEnvironment: "node",

  extensionsToTreatAsEsm: [".ts"],

  moduleFileExtensions: ["ts", "js", "json"],

  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        useESM: true,
        tsconfig: {
          target: "ES2022",
          module: "NodeNext",
          moduleResolution: "NodeNext",
          esModuleInterop: true,
          isolatedModules: true,
        },
      },
    ],
  },

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },

  testMatch: ["**/__tests__/**/*.test.ts"],
};
