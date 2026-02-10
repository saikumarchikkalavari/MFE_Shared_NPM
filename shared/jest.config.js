module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts?(x)', '**/?(*.)+(spec|test).ts?(x)'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: {
        jsx: 'react',
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
      },
    }],
  },
  moduleNameMapper: {
    // AG Grid CSS imports - use mock file
    'ag-grid-community/styles/ag-grid.css': '<rootDir>/__mocks__/styleMock.js',
    'ag-grid-community/styles/ag-theme-quartz.css': '<rootDir>/__mocks__/styleMock.js',
    // Generic CSS/style imports
    '\\.(css|less|scss|sass)$': '<rootDir>/__mocks__/styleMock.js',
    '^react$': '<rootDir>/node_modules/react',
    '^react-dom$': '<rootDir>/node_modules/react-dom',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.ts',
    '!src/lib.ts',
    '!src/bootstrap.tsx',
  ],
  coverageReporters: ['text', 'lcov', 'cobertura', 'html'],
  coverageDirectory: 'coverage',
  reporters: ['default'],
  coverageThreshold: {
    global: {
      branches: 5,
      functions: 5,
      lines: 5,
      statements: 5,
    },
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  globals: {
    'ts-jest': {
      isolatedModules: true,
    },
  },
  testTimeout: 10000,
  bail: false,
  verbose: true,
};
