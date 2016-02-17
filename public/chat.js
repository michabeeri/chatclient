/**
 * Created by Dan_Shappir on 7/19/15.
 */

var {Router, Route, Link} = ReactRouter;

var App = React.createClass({
    displayName: 'App',
    render: function () {
        return (
            <Router>
                <Route path="/" component={Login} />
                <Route path="/chat" component={Chat} />
            </Router>
        );
    }
});

var Login = React.createClass({
    getUsername(){
        return this.refs.input.value;
    },
    render () {
        return (
            <div>
                <input type="text" placeholder="username" ref="input"/>
                <Link to="/chat" username={this.getUsername()}>Login</Link>
            </div>
        );
    }
});

var Chat = React.createClass({
    getInitialState: function () {
        return {
            username: 'Dani', // this,props.username
            activeUser: 'Roi',
            connectedUsers: [],
            messages: []
        };
    },
    componentWillMount(){
        this.chatClient = new ChatClient('http://localhost:8080');
        this.chatClient.onConnect = () => {
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
        this.chatClient.send(message);
    },
    setActiveUser(userData){
        this.setState({activeUser: userData});
    },
    render: function () {
        return (
            <div>
                <Link to="/">Logout</Link>
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
                <div>{this.props.activeUser}</div>
                <ChatWindow messages={this.props.messages} />
                <ChatControls addMessage={this.props.addMessage}/>
            </div>
        );
    }
});

var ChatWindow = React.createClass({
    render: function () {
        return (
            <ul>
                {
                    _.map(this.props.messages, msg => <ChatMessage message={msg}/>)
                }
            </ul>
        );
    }
});

var ChatMessage = React.createClass({
    render: function () {
        var message = this.props.message;
        return (
            <li><strong>{message.from.name}:</strong>{message.message}</li>
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
                </ul>
            </div>
        );
    }
});

var User = React.createClass({
    render: function () {
        return (
            <li key={this.props.userData.id}>
                <button onClick={() => this.props.setActiveUser(this.props.userData)}>{this.props.userData.name}</button>
            </li>
        );
    }
});

ReactDOM.render(<App />, document.getElementById('root'));


//(function () {
//    'use strict';
//
//    const render = (msgs, chatClient, root) => ReactDOM.render(<Chat msgs={msgs} send={chatClient.send}/>, root);
//
//    const Chat = ({msgs, send}) =>
//        <div className='chat'>
//            <Output msgs={msgs}/>
//            <Input send={send}/>
//        </div>;
//    Chat.displayName = 'Chat';
//
//    const Output = ({msgs}) =>
//        <div className='output'>{
//            msgs.map(({from, msg}, i) => <OutputItem key={i} name={from.name} msg={msg}/>)
//        }</div>;
//    Output.displayName = 'Output';
//
//    const OutputItem = ({name, msg}) => <div><b>{name}:</b> {msg}</div>
//    OutputItem.displayName = 'OutputItem';
//
//    class Input extends React.Component {
//        _send() {
//            const textarea = this.refs.input;
//            const {value} = textarea;
//            textarea.value = '';
//            this.props.send(value);
//        }
//
//        render() {
//            return <div className='input'>
//                <textarea ref='input'/>
//                <button onClick={this._send.bind(this)}>Send</button>
//            </div>;
//        }
//    }
//    Input.displayName = 'Input';
//
//    const root = document.getElementById('root');
//    const msgs = [];
//    const chatClient = new ChatClient('http://localhost:8080');
//    chatClient.onConnect = () => {
//        chatClient.login('Dan');
//        render(msgs, chatClient, root);
//    };
//    chatClient.onMessage = (from, msg) => {
//        msgs.push({from, msg});
//        render(msgs, chatClient, root);
//    };
//}());
