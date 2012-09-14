A chat server created using nodejs.

The main purpose here is to learn nodejs. The key point of the app is to demo how nodejs makes it easy to persist
client connections without blocking other parts of the app.

The chat server accepts poll request (for new message) from the client(s) and holds on to the requests. When a new message
is received from any other clients then the message is fed back to all the client requests already waiting for new message.

To run the server (assuming you already have npm installed),

Go to home directory of the project, and run

1) npm install (this will install the dependencies)

2) node chat-server.js


To run client, just open index.html from the file system. And then type in a name to start chatting.



