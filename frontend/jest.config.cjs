module.exports = {
  verbose: true,
  testEnvironment: 'jsdom',
  
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },

  transform: {
    '^.+\.[jt]sx?$': 'babel-jest'
  },
  
  transformIgnorePatterns: [
    "/node_modules/(?!(some-esm-package)/)" 
  ]
};
