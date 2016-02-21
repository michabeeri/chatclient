requirejs.config({
    baseUrl: 'dist',
    paths: {
        react: "../node_modules/react/dist/react",
        'react-dom': "../../node_modules/react-dom/dist/react-dom",
        'react-router': "https://cdnjs.cloudflare.com/ajax/libs/react-router/2.0.0/ReactRouter",
        'socket-io': "../socket.io/socket.io",
        lodash: 'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.3.0/lodash',
        jquery: "//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min"
    },
    shim: {
        lodash: {exports: '_'},
        jquery: {exports: '$'}
    }
});

requirejs(['react', 'react-dom', 'react-router', 'chat', 'login'],
    function(React, ReactDOM, ReactRouter, Chat, Login) {

    var {Router, Route} = ReactRouter;

    var App = React.createClass({
        displayName: 'App',
        render: function () {
            return (
                <Router>
                    <Route name="login" path="/" component={Login}/>
                    <Route name="chat" path="/chat/:username" component={Chat}/>
                </Router>
            );
        }
    });

    ReactDOM.render(<App />, document.getElementById('root'));
});
