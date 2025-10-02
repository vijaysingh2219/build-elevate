/** @type {import('jest').Config} */
module.exports = {
  roots: ["<rootDir>"],
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        transpilation: true,
      },
    ],
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  modulePathIgnorePatterns: [
    "<rootDir>/test/__fixtures__",
    "<rootDir>/node_modules",
    "<rootDir>/dist",
  ],
  moduleNameMapper: {
    "^@workspace/utils/helpers$":
      "<rootDir>/../../packages/utils/src/helpers/index.ts",
    "^@workspace/utils$": "<rootDir>/../../packages/utils/src/index.ts",
  },
  preset: "ts-jest",
  testEnvironment: "node",
};
