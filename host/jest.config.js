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
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^shared/(.*)$': '<rootDir>/__mocks__/sharedMock.ts',
    '^remote/(.*)$': '<rootDir>/__mocks__/remoteMock.ts',
    '^carts/(.*)$': '<rootDir>/__mocks__/remoteMock.ts',
    '^users/(.*)$': '<rootDir>/__mocks__/remoteMock.ts',
    '^reports/(.*)$': '<rootDir>/__mocks__/remoteMock.ts',
    '^integrations/(.*)$': '<rootDir>/__mocks__/remoteMock.ts',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.ts',
    '!src/**/*.stories.tsx',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  globals: {
    'ts-jest': {
      isolatedModules: true,
    },
  },
};
