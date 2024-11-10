const express = require("express"); // Import Express
const cors = require("cors"); // Import CORS middleware
const app = express(); // Initialize the Express app
const port = 3000; // Define the port where the server will listen

// Use CORS to allow requests from the frontend
app.use(cors());
// Use express.json() to parse incoming JSON requests
app.use(express.json());

let posts = []; // In-memory array to store posts
let postId = 0;

// GET route to send the list of posts to the frontend
app.get("/posts", (request, response) => {
    response.json(posts); // Send the posts array as a JSON response
});

// Start the server and listen for requests on port 3000
app.listen(port, () => {
    console.log(`Server running on <http://localhost>:${port}`);
});

app.post("/posts", (request, response) => {
    const newPost = {
        id: postId++,
        post: request.body.post
    };
    posts.push(newPost);
    response.json(newPost);
});

app.delete("/posts/:id", (request, response) => {
    const postId = parseInt(request.params.id); // convert id to integer
    posts = posts.filter((post) => post.id !== postId); // filter out task
    response.sendStatus(200); // OK status
});

// node server.js
// go to browser and open localhost:3000/tasks
