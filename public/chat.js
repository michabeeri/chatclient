var {Router, Route, Link} = ReactRouter;

var App = React.createClass({
    displayName: 'App',
    render: function () {
        return (
            <Router>
                <Route name="login" path="/" component={Login} />
                <Route name="chat" path="/chat/:username" component={Chat} />
            </Router>
        );
    }
});

var Login = React.createClass({
    mixins: [React.addons.LinkedStateMixin],
    getInitialState: function () {
        return {
            username: ''
        };
    },
    render () {
        return (
            <div>
                <input type="text" placeholder="username" valueLink={this.linkState("username")}/>
                <Link to={"/chat/" + this.state.username}>Login</Link>
            </div>
        );
    }
});

var Chat = React.createClass({
    mixins:[ReactRouter.History],
    getInitialState: function () {
        return {
            username: this.props.routeParams.username,
            activeUser: null,
            connectedUsers: [],
            messages: []
        };
    },
    componentDidMount(){
        this.chatClient = new ChatClient('http://localhost:8080');
        this.chatClient.onConnect = () => {
            console.log(this.state.username);
            this.chatClient.login(this.state.username);
        };
        this.chatClient.onUpdate = clients => {
            console.log(clients);
            this.setState({connectedUsers: clients});
        };
        this.chatClient.onMessage = (from, message, personal) => {
            console.log(from);
            console.log(message);
            console.log(personal);
            this.state.messages.push({from:from, message:message, personal:personal});
            this.setState({messages: this.state.messages});
        };
    },
    addMessage(message){
        this.chatClient.send(message, this.state.activeUser);
    },
    setActiveUser(userData){
        this.setState({activeUser: userData});
    },
    logout(){
        this.chatClient.logout();
        this.chatClient.onConnect = null;
        this.chatClient.onUpdate = null;
        this.chatClient.onMessage = null;
        this.history.push('/');
    },
    render: function () {
        return (
            <div>
                <button onClick={this.logout}>Logout</button>
                <ChatSection messages={this.state.messages} activeUser={this.state.activeUser} addMessage={this.addMessage}/>
                <ConnectedUsers users={this.state.connectedUsers} setActiveUser={this.setActiveUser}/>
            </div>
        );
    }
});

var ChatSection = React.createClass({
    render: function () {
        return (
            <div>
                <div>{this.props.activeUser ? this.props.activeUser.name : 'All'}</div>
                <ChatWindow messages={this.props.messages} activeUser={this.props.activeUser}/>
                <ChatControls addMessage={this.props.addMessage}/>
            </div>
        );
    }
});

var ChatWindow = React.createClass({
    render: function () {
        var messages = this.props.activeUser
            ? _.filter(this.props.messages, msg => {
                console.log(msg);
                console.log(this.props.activeUser);
                return msg.from.name === this.props.activeUser.name && msg.personal;
            })
            : this.props.messages;

        return (
            <ul>
                {
                    _.map(messages, msg => <ChatMessage message={msg}/>)
                }
            </ul>
        );
    }
});

var ChatMessage = React.createClass({
    render: function () {
        var message = this.props.message;
        return (
            <li style={{color: message.personal ? 'blue' : 'black'}}><strong>{message.from.name} :</strong>{message.message}</li>
        );
    }
})

var ChatControls = React.createClass({
    clickHandler(){
        this.props.addMessage(this.refs.input.value);
    },
    render: function () {
        return (
            <div>
                <input type="text" placeholder="Enter your message here." ref="input"/>
                <button onClick={this.clickHandler}>Send</button>
            </div>
        );
    }
});

var ConnectedUsers = React.createClass({
    render: function () {
        return (
            <div>
                Connected Users:
                <ul>
                    {
                        _.map(this.props.users, user => <User userData={user} setActiveUser={this.props.setActiveUser}/>)
                    }
                    <User userData={null} setActiveUser={this.props.setActiveUser}/>
                </ul>
            </div>
        );
    }
});

var User = React.createClass({
    render: function () {
        var userData = this.props.userData;
        return (
            <li key={userData ? userData.id : '0000000'}>
                <button onClick={() => this.props.setActiveUser(userData)}>{userData ? userData.name : 'All'}</button>
            </li>
        );
    }
});

ReactDOM.render(<App />, document.getElementById('root'));
