/** @type {import("jest").Config} */
const config = {
    verbose: true,
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    moduleNameMapper: {
        '\\.(css|less|scss|sss|styl)$':
            '<rootDir>/node_modules/jest-css-modules',
    },
    transform: {
        '\\.[jt]sx?$': 'babel-jest',
    },
    collectCoverage: true,
    collectCoverageFrom: ['src/**/*'],
    clearMocks: true,
    globals: {
        window: {},
        jest: true,
    },
    roots: ['tests'],
}

module.exports = config
