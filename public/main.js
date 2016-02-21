requirejs.config({
    baseUrl: 'dist',
    paths: {
        react: "../node_modules/react/dist/react",
        'react-with-addons': "https://fb.me/react-with-addons-0.14.7",
        'react-dom': "../../node_modules/react-dom/dist/react-dom",
        'react-router': "https://cdnjs.cloudflare.com/ajax/libs/react-router/2.0.0/ReactRouter",
        lodash: 'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.3.0/lodash',
        jquery: "//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min"
    },
    shim: {
        lodash: {exports: '_'},
        jquery: {exports: '$'}
    }
});

requirejs(["chat"], function() {
});
