# Websockets Based Chat App

## Summary

A basic real-time chat app using websockets, jwt, mongoDB, express.

## Outline

## Steps

### 1. Create a simple CRUD REST API for the following:-

1. Create a User - This would be used when signing up a new user. Through this, a new user would be created and added to the database. Only need to make a front-end for this. Also, remember to store the password with hashing/encrypted.No JWT authorization is required.
2. Read User - All details of all the users or a particular user with the given userID would be displayed from the database. JWT auth required.
3. Update a user - Update a user according to the userID in the database. JWT auth required.
4. Delete a user - Delete a user from the database.JWT auth required.

### 2. Call for login/authentication API from a signup form on successful user insertion.

### 3. Create an API for authentication.

This API will return a JWT token if successfully authenticated. The JWT token can be used for authorization in both the chat server and the users server.

### 4. Open the link to the chat server and send jwtToken as a URL parameter

### 5. Creating a chat server implementing a real-time chat.

1. Create server to listen to WebSockets connection.
   ```
   io.on("connection", (socket) => { console.log('User has connected) });
   ```
2. On client side intialize it with socket instance.

```
<script src="/socket.io/socket.io.js"></script>
<script>
     let socket = io();
</script>
```

3. On the Server side, listen to the connection.

   ```
   io.on("connection", (socket) => { console.log(‘User has connected’); }
   ```

4. On the client-side listen to the message form. Prevent the default behaviour of submitting the form and sending the data to the server through a socket instance on the client-side by emitting the event name ‘chat message’. Add the message to message\_\_list using the addMessage function.
   ```
   messageForm.addEventListener('submit', (e)=>{ e.preventDefault() try{ let message = messageInput.value socket.emit('chat message',message) messageInput.value = '' addMessage('You: '+ message,true) } catch(err){ console.log(err) }
   ```
5. On the server-side listen to this event and broadcast it to all the other clients, along with the username. The username is obtained via JWT token which was passed by the login form in the URL. Also, update messages in the database.

```
// emitting message and updating the database with the message
socket.on("chat message", async (msg) => {
console.log("Message:", msg);
const ans = await User.updateMany({userID:socket.data.userName}, {$push:{messages:{message:msg}}})
console.log(ans)
socket.broadcast.emit("chat message", socket.data.userName + " : " + msg);
});
```

```
// verifying the jwt token and extracting username from it. Also sending data
app.get("/", (req, res) => {
const token = req.query.jwt;
jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
if (err) {
return res.status(401).json({
message: "Token didn't match",
});
} else {
console.log("Decoded Data\n", "User : ", user);
    userID = user.userID;
   }
 });
 res.sendFile(path.join(__dirname, "public", "chatPage", "index.html"));
});

```

```
// Sending JWT token as a parameter
window.open('http://localhost:7000/?jwt='+ans.jwtToken)

```

6. On the client-side listen to this event. Add the message to the message list.

```
// listening to the event ‘chat message’
socket.on("chat message", (msg) => {
       addMessage(msg);
     });
```

```
// addMessage function
const addMessage = (
       message,
       sentByUser = false,
       newConnectOrDisconnect = false
     ) => {
       let item = document.createElement("li");
       item.textContent = message;
       if (sentByUser) {
         item.classList.add("sent-by-user");
       } else if (newConnectOrDisconnect) {
         item.classList.add("user-connect-or-disconnect");
       }
       messageList.appendChild(item);
       window.scrollTo(0, document.body.scrollHeight);
     };
```

7. Similarly add events for user disconnecting and new user connecting

```
// On client side listening to user left event
socket.on("user left", (userName) => {
       addMessage(`${userName} has left the chat`, false, true);
     });
```

```

// On client side listening to new user event
socket.on("new user", (userName) => {
       addMessage(`${userName} has entered the chat`, false, true);
     });
```

```
//On server side listening to disconnect and emitting user left event
socket.on("disconnect", () => {
   let userName = socket.data.userName;
   console.log("A user has disconnected");
   io.emit("user left", userName);
 });
```

```
//On server side emitting new user event
socket.broadcast.emit("new user", userID);
```

8. Now start the app by starting all three servers and using it.

## Things Required

### To install on your machine

1. MongoDB
2. nodejs

### NPM packages/libraries to be installed

1. Express
2. Socket.io
3. JsonWebTokens
4. Bcrypt
5. Mongoose
6. dotenv

## References

### WebSockets, Socket.io and app

[Socket.io Docs](https://socket.io/docs/v4/)

[Real Time Chat App tutorial](https://socket.io/get-started/chat)

[Websockets: What it is and why to use it?](https://medium.com/@jamesbrown5292/what-i-learned-about-websockets-by-building-a-real-time-chat-application-using-socket-io-3d9e163e504)

[Websockets implementation docs](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)

[Using JWT in Websockets](https://stackoverflow.com/questions/64934740/websocket-connection-with-authorization-header)

### MongoDB and Mongoose

[MongoDB Crash Course](https://www.youtube.com/watch?v=ofme2o29ngU)

[MongoDB Commands Cheatsheet (from web dev simplified youtube channel)](https://drive.google.com/file/d/1ze77PXddzRRzPqNrx7Utn6ORcwInqGtP/view?usp=sharing)

[Mongoose Crash Course](https://www.youtube.com/watch?v=DZBGEVgL2eE)

### JWT

[About JWT](https://www.youtube.com/watch?v=7Q17ubqLfaM&ab_channel=WebDevSimplified)

[How to use JWT with node](https://www.youtube.com/watch?v=mbsmsi7l3r4&ab_channel=WebDevSimplified)

### Node and Express

[Node.js beginner tutorial](https://www.youtube.com/watch?v=TlB_eWDSMt4&ab_channel=ProgrammingwithMosh)

[Express Crash Course](https://youtu.be/L72fhGm1tfE)

## About App

### Front-end

#### Sign up Form

![Sign Up form](https://imgur.com/koJYNmM)

#### Log in Form

![Log in Form](https://imgur.com/VuLkl8U)

#### Chat App Page

![Chat app page example1](https://imgur.com/iDGNDbi)

![Chat app page example2](https://imgur.com/gHX6BhO)

### Basic Architecture or back-end of the app

There are three servers in the app. The servers and their functions are:-

1. Users Server - Adding a user account or SignUP functionality happens here. Other than that all crud related activities will happen on users servers. It is in the index.js file in the project.
2. Auth Server - A user can log in using the auth server. This server is responsible for authenticating the user, by matching the password and returning an object which contains a JWT token that is valid for 1 hr. Its code is inside the authServer.js file.
3. Chat Server - All chat related activities occur here. This server is used for real-time chat between users. The messages between users are stored in the database. Its code is in the chatServer.js file.

These three servers are connected to the common database UsersData. The database is based on the following Schema:

#### Users Schema

```
const messageSchema = new mongoose.Schema({
 sentTime: {
   type: Date,
   default: () => Date.now(),
 },
 message: String,
});

const userSchema = new mongoose.Schema({
 userID: String,
 name: String,
 password: String,
 email: String,
 phone: String,
 messages: [messageSchema],
});

```

#### User in the database

![User Database example](https://imgur.com/BgVD8JX)
