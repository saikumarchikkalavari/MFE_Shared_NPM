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
    '^ag-grid-community/styles/.*$': 'identity-obj-proxy',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    'ag-grid-community/styles/.*\\.css$': 'identity-obj-proxy',
    '^react$': '<rootDir>/node_modules/react',
    '^react-dom$': '<rootDir>/node_modules/react-dom',
    '^@company/shared/(.*)$': '<rootDir>/../shared/dist/$1',
    '^@company/shared$': '<rootDir>/../shared/dist',
    '^shared/components/(.*)$': '<rootDir>/../shared/src/components/$1',
    '^shared/(.*)$': '<rootDir>/../shared/src/$1',
    '^products/(.*)$': '<rootDir>/__mocks__/remoteMock.ts',
    '^orders/(.*)$': '<rootDir>/__mocks__/remoteMock.ts',
    '^customers/(.*)$': '<rootDir>/__mocks__/remoteMock.ts',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.ts',
    '!src/**/*.stories.tsx',
  ],
  coverageReporters: ['text', 'lcov', 'cobertura', 'html'],
  coverageDirectory: 'coverage',
  reporters: [
    'default',
    ['jest-junit', {
      outputDirectory: 'coverage',
      outputName: 'junit.xml',
      classNameTemplate: '{classname}',
      titleTemplate: '{title}',
      ancestorSeparator: ' › ',
      usePathForSuiteName: true,
    }],
  ],
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
};
