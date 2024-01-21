import type { Config } from 'jest'

const config: Config = {
  clearMocks: true,
  rootDir: '.',
  moduleFileExtensions: ['js', 'json', 'ts'],
  testEnvironment: 'node',
  coverageProvider: 'v8',
  testRegex: '.e2e-spec.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  setupFilesAfterEnv: ['./jest-setup.ts'],
}

export default config
