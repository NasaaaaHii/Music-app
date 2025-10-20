module.exports = function (api) {
    api.cache(true);
    return {
        presets: ['babel-preset-expo'], // ✅ giúp Babel hiểu JSX & TypeScript
        plugins: [
            'react-native-worklets/plugin', // giữ nguyên plugin bạn có
            require.resolve('expo-router/babel'), // ✅ cần cho Expo Router
            '@babel/plugin-proposal-export-namespace-from', // giữ nguyên
        ],
    };
};
