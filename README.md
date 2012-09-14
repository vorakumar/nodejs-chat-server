A chat server created using nodejs.

The main purpose here is to learn nodejs.

The key point of the app is to demo how easy it is hang on to client connections without blocking other parts of the app
using nodejs. The chat server hangs on to the poll request from the client and doesn't respond back until a message
is received from any other client.

To run the server (assuming you already have npm installed),

Go to home directory of the project, and run

1) npm install (this will install the dependencies)

2) node chat-server.js


To run client, just open index.html from the file system.