import AudioRecorder from './AudioRecorder.js'; // Ensure you're importing the compiled JavaScript file, not the TypeScript one.

// import AudioRecorder from "AudioRecorder.js";

function handlePostSubmission(event) {
    event.preventDefault(); // Prevent the form from refreshing

    // Get the post input value
    let postInputValue = document.getElementById("postInput").value;

    // Log the Post to the console
    addPostToBackend(postInputValue);
  
    // Clear the input field after submission
    document.getElementById("postInput").value = "";
}

function addPostToBackend(post) {
  fetch("https://hackcamp-2024.onrender.com/posts", {
    method: "POST",
    headers: {
      "Content-Type" : "application/json"
    },
    body: JSON.stringify({ post })
  })
  .then((response) => response.json())
  .then((newPost) => {
    addPostToList(newPost);
  })
  .catch((error) => console.error("Error adding post", error));
}

function addPostToList(post) {
  let postList = document.getElementById("postList");
  let newPost = document.createElement("li");

  newPost.textContent = post.post;

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";

  deleteButton.addEventListener("click", function() {
    deletePostFromBackend(post.id, newPost);
  });

  newPost.appendChild(deleteButton);
  postList.appendChild(newPost);
}

function deletePostFromBackend(postID, postElement) {
  fetch(`https://hackcamp-2024.onrender.com/posts/${postID}`, {
    method: "DELETE"
  })
  .then(() => {
    postElement.remove();
  })
  .catch((error) => console.error("Error deleting post", error));
}

const recorder = new AudioRecorder();
// Attach the event listener to the form
document
  .getElementById("postForm")
  .addEventListener("submit", handlePostSubmission);

// document
//   .getElementById("startButton")
//   .addEventListener("click", () => {
//     console.log('start is clicked')
//     recorder.startRecording()});

// document
//   .getElementById("stopButton")
//   .addEventListener("click", () => recorder.stopRecording());

 
window.addEventListener("DOMContentLoaded", fetchPosts);

function fetchPosts() {
    fetch("https://hackcamp-2024.onrender.com/posts") // Send a GET request to the server
    .then((response) => response.json()) // Convert the response to JSON
    .then((posts) => {
        const postList = document.getElementById("postList");
        postList.innerHTML = ""; // Clear the existing list
        posts.forEach((post) => {
            const newPost = document.createElement("li");
            newPost.textContent = post.post; // Add Post to the list

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.addEventListener("click", function() {
              deletePostFromBackend(post.id, newPost);
            });
          
            newPost.appendChild(deleteButton);
            postList.appendChild(newPost);
          
        });
    })
    .catch((error) => console.error("Error fetching posts:",
    error));
}
