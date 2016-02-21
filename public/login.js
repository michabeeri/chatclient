define(['react', 'react-router'],
    function(React, ReactRouter) {

    var Login = React.createClass({
        mixins: [ReactRouter.History],
        goToChat(){
            this.history.push("/chat/" + this.refs.input.value);
        },
        render () {
            return (
                <div>
                    <input type="text" placeholder="username" ref="input"/>
                    <a onClick={this.goToChat}>Login</a>
                </div>
            );
        }
    });

    return Login;
});
