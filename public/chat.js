define(['react', 'react-router', 'lodash', 'chatClient'],
    function(React, ReactRouter, _, ChatClient) {

    var Chat = React.createClass({
        mixins: [ReactRouter.History],
        getInitialState: function () {
            return {
                user: null,
                activeUser: null,
                connectedUsers: [],
                messages: []
            };
        },
        componentDidMount(){
            this.chatClient = new ChatClient('http://localhost:8080');//new ChatClient('http://chatroom-59271.onmodulus.net');
            this.chatClient.onConnect = id => {
                var user = {id: id, name: this.props.routeParams.username};
                console.log("onConnect, username: ", user);
                this.chatClient.login(user.name);
                this.setState({user: user});
            };
            this.chatClient.onUpdate = clients => {
                console.log("onUpdate: ", clients);
                var users = _.filter(clients, user => user.id !== this.state.user.id);
                this.setState({connectedUsers: users});
            };
            this.chatClient.onMessage = (from, message, personal) => {
                console.log(from);
                console.log(message);
                console.log(personal);
                this.state.messages.push({
                    id: _.uniqueId(),
                    from: from,
                    message: message,
                    to: personal ? this.state.user : null
                });
                this.setState({messages: this.state.messages});
            };
        },
        addMessage(message){
            this.chatClient.send(message, this.state.activeUser);
            this.state.messages.push({
                id: _.uniqueId(),
                from: this.state.user,
                message: message,
                to: this.state.activeUser
            });
            this.setState({messages: this.state.messages});
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
                    <button className="logout" onClick={this.logout}>Logout</button>
                    <div className="chat-app">
                        <ChatSection messages={this.state.messages} activeUser={this.state.activeUser}
                                     user={this.state.user} addMessage={this.addMessage}/>
                        <ConnectedUsers users={this.state.connectedUsers} activeUser={this.state.activeUser}
                                        setActiveUser={this.setActiveUser} user={this.state.user} />
                    </div>
                </div>
            );
        }
    });

    var ChatSection = React.createClass({
        render: function () {
            return (
                <div className="chat-section">
                    <div>Chat With: {this.props.activeUser ? this.props.activeUser.name : 'All'}</div>
                    <ChatWindow messages={this.props.messages} activeUser={this.props.activeUser} user={this.props.user}/>
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
                return (msg.from.name === this.props.activeUser.name && msg.to) ||
                    (msg.from.name === this.props.user.name && msg.to && msg.to.name === this.props.activeUser.name);
            })
                : this.props.messages;

            return (
                <ul>
                    {
                        _.map(messages, msg => <ChatMessage key={msg.id} message={msg}/>)
                    }
                </ul>
            );
        }
    });

    var ChatMessage = React.createClass({
        render: function () {
            var message = this.props.message;
            return (
                <li><strong>{message.from.name} :</strong>{message.message}</li>
            );
        }
    })

    var ChatControls = React.createClass({
        clickHandler(){
            this.props.addMessage(this.refs.input.value);
            this.refs.input.value = '';
        },
        onKeypress(event) {
            if (event.keyCode === 13) {
                this.clickHandler();
            }
        },
        render: function () {
            return (
                <div className="chat-controls">
                    <input type="text" placeholder="Enter your message here." ref="input" onKeyDown={this.onKeypress}/>
                    <button onClick={this.clickHandler}>Send</button>
                </div>
            );
        }
    });

    var ConnectedUsers = React.createClass({
        render: function () {
            var users = this.props.users;
            return (
                <div className="connected-users-section">
                    <div className="title">Users:</div>
                    <div className="connected-users">
                        <ul>
                            <User userData={null} selected={!this.props.activeUser}
                                  setActiveUser={this.props.setActiveUser}/>
                            {
                                _.map(users,
                                    user => <User key={user.id} userData={user} selected={user === this.props.activeUser}
                                                  setActiveUser={this.props.setActiveUser}/>)
                            }
                        </ul>
                    </div>
                </div>
            );
        }
    });

    var User = React.createClass({
        render: function () {
            var userData = this.props.userData;
            return (
                <li className={this.props.selected ? "selected" : ""} key={userData ? userData.id : '0000000'}
                    onClick={() => this.props.setActiveUser(userData)}>
                    {userData ? userData.name : 'All'}
                </li>
            );
        }
    });

    return Chat;
});
