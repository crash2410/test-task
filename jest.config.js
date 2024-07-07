export default {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    moduleNameMapper: {
        '\\.(css|less)$': 'identity-obj-proxy',
        '^@/(.*)$': '<rootDir>/src/$1',
        '^react-toastify$': '<rootDir>/node_modules/react-toastify'
    },
    setupFilesAfterEnv: ["@testing-library/jest-dom"],
};
