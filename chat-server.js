var restify = require('restify');

var sessions = {};
var callbacks = [];
var messages = [];

var createSession = function(user) {

    for(i = 0; i < sessions.length; i++) {
        if(sessions[i].user === user) {
            return null;
        }
    }

    var session = {
        user: user,
        id: Math.floor(Math.random()*99999999999).toString(),
        timestamp: new Date(),

        touch: function() {
            session.timestamp = new Date();
        },

        destroy: function() {
            delete sessions[session.id];
        }
    };

    sessions[session.id] = session;
    return session;
};

var newMessage = function(session, text) {
     var message = {
         text: text,
         timestamp: new Date(),
         sender: session.user,

         sentAfter: function(time) {
             return message.timestamp > time;
         }
     };

    messages.push(message);

    while(callbacks.length > 0) {
        var callback = callbacks.shift();
        if(callback.user !== message.sender) {
            callback.call([buildMessage(message)]);
        } else {
            callback.call([]);
        }
    }
};


var buildMessage = function (message) {
    return {sender:message.sender, text:message.text, timestamp: message.timestamp};
};

var sendMessage = function(session, lastReceivedMessageTime, callback) {
    var messagesToSend = [];
    if(messages.length != 0) {
        for(i=0; i<messages.length; i++) {
            var message = messages[i];
            if(message.sender !== session.user && message.sentAfter(lastReceivedMessageTime)) {
                messagesToSend.push(buildMessage(message));
            }
        }
    }

    if(messagesToSend.length !=0) {
        callback(messagesToSend);
    } else {
        callbacks.push({user: session.user, call: callback});
    }
};

var getSession = function(request) {
    return sessions[request.params.sessionId];
};

var newMessageHandler = function(request, response, next) {
    var session = getSession(request);
    var message = request.params.msg;
    response.send({success:true});
    newMessage(session, message);
    next();
};

var messageFeeder = function(request, response) {
    var session = getSession(request);

    var callback = function(messages) {
        response.send(messages);
    };

    sendMessage(session, request.params.since, callback);
};


var newUser = function(request, response, next) {
    var session = createSession(request.params.name);
    response.send({sessionId: session.id, params: request.params});
    next();
};

var server = restify.createServer({name: 'chat server'});
server.use(restify.bodyParser());

server.get('/join/:name', newUser);
server.post('/send/:sessionId', newMessageHandler);
server.get('/recv/:sessionId', messageFeeder);




server.listen(8080, function() {
   console.log('%s chat server listening at %s', server.name, server.url);
});