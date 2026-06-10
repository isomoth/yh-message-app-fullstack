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
  
  // Optional: Only needed if you have specific ESM packages to ignore
  transformIgnorePatterns: [
    "/node_modules/(?!(some-esm-package)/)" 
  ]
};
