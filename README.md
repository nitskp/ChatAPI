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
   `io.on("connection", (socket) => { console.log('User has connected) });`
2. On client side intialize it with socket instance.

```
<script src="/socket.io/socket.io.js"></script>
<script>
     let socket = io();
</script>
```

3. On the Server side, listen to the connection.
   `io.on("connection", (socket) => { console.log(‘User has connected’); } `
4. On the client-side listen to the message form. Prevent the default behaviour of submitting the form and sending the data to the server through a socket instance on the client-side by emitting the event name ‘chat message’. Add the message to message\_\_list using the addMessage function.
   `messageForm.addEventListener('submit', (e)=>{ e.preventDefault() try{ let message = messageInput.value socket.emit('chat message',message) messageInput.value = '' addMessage('You: '+ message,true) } catch(err){ console.log(err) } `
5. On the server-side listen to this event and broadcast it to all the other clients, along with the username. The username is obtained via JWT token which was passed by the login form in the URL. Also, update messages in the database.

`// emitting message and updating the database with the message
socket.on("chat message", async (msg) => {
console.log("Message:", msg);
const ans = await User.updateMany({userID:socket.data.userName}, {$push:{messages:{message:msg}}})
console.log(ans)
socket.broadcast.emit("chat message", socket.data.userName + " : " + msg);
});`

`// verifying the jwt token and extracting username from it. Also sending data
app.get("/", (req, res) => {
const token = req.query.jwt;
jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
if (err) {
return res.status(401).json({
message: "Token didn't match",
});
} else {
console.log("Decoded Data\n", "User : ", user);
`
