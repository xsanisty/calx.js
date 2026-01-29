module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/test'],
  testMatch: ['**/*.test.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/Calx/Parser/Jison/**',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@chevrotain/utils$': '<rootDir>/node_modules/@chevrotain/utils/lib/src/api.js',
    '^@chevrotain/gast$': '<rootDir>/node_modules/@chevrotain/gast/lib/src/api.js',
    '^@chevrotain/regexp-to-ast$': '<rootDir>/node_modules/@chevrotain/regexp-to-ast/lib/src/api.js',
    '^@chevrotain/types$': '<rootDir>/node_modules/@chevrotain/types/lib/src/api.js',
    '^@chevrotain/cst-dts-gen$': '<rootDir>/node_modules/@chevrotain/cst-dts-gen/lib/src/api.js'
  },
  modulePaths: ['<rootDir>/node_modules'],
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': ['ts-jest', {
      tsconfig: 'tsconfig.test.json',
      useESM: false
    }]
  },
  transformIgnorePatterns: [
    'node_modules/(?!(chevrotain|lodash-es|@chevrotain)/)'
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json']
};
