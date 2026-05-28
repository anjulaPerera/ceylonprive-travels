/** @type {import('jest').Config} */
const config = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  rootDir: "src",
  testMatch: [
    "<rootDir>/__tests__/**/*.test.tsx",
    "<rootDir>/__tests__/**/*.test.ts",
  ],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.(jpg|jpeg|png|gif|webp|svg)$": "<rootDir>/__mocks__/fileMock.js",
  },
  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        tsconfig: { jsx: "react-jsx" },
      },
    ],
  },
  clearMocks: true,
  moduleDirectories: ["node_modules", "<rootDir>"],
};

module.exports = config;