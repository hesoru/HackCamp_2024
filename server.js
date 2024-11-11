const express = require("express"); // Import Express
//import express from "express";
//  import cors from 'cors'
const cors = require('cors')
// import axios from "axios"; // Import CORS middleware
const app = express(); // Initialize the Express app
const port = 3000; // Define the port where the server will listen
//import fs from 'fs'
//import 'dotenv/config'
require('dotenv').config();
const fs = require('fs');


const responses = {
    400: 'Bad Request! Please refer docs for correct input fields.',
    401: 'Unauthorized. Please generate a new access token.',
    404: 'The conversation and/or it\'s metadata you asked could not be found, please check the input provided',
    429: 'Maximum number of concurrent jobs reached. Please wait for some requests to complete.',
    500: 'Something went wrong! Please contact support@symbl.ai'
}

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

// const authOptions = {
//     method: 'post',
//     url: 'https://api.symbl.ai/oauth2/token:generate',
//     data: {
//         type: 'application',
//         appId: process.env.APP_ID,
//         appSecret: process.env.APP_SECRET
//     },
//     headers: {
//         'Content-Type': 'application/json'
//     }
// };
// //const webhookUrl = WEBHOOK_URL;


// const params = {
//     'name': "NAME",
//     'languageCode': "en-US",
//     'confidenceThreshold': 0.5,
//     'detectPhrases':true,
//     'enableSpeakerDiarization':true,
//     'diarizationSpeakerCount': 1
// }

// axios(authOptions)
//     .then(response => {
//         console.log('Authentication token:', JSON.stringify(response.data, null, 2));
//         return  JSON.stringify(response.data, null, 2)
//     }).then (token => {

//     const audioFileStream = fs.createReadStream('/upload-audio/recorded_audio.wav');

//     const audioOption = {
//         url: 'https://api.symbl.ai/v1/process/audio',
//         headers: {
//             'Authorization': `Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlFVUTRNemhDUVVWQk1rTkJNemszUTBNMlFVVTRRekkyUmpWQ056VTJRelUxUTBVeE5EZzFNUSJ9.eyJodHRwczovL3BsYXRmb3JtLnN5bWJsLmFpL3VzZXJJZCI6IjU1MDQ5NzI1NzUzNDI1OTIiLCJpc3MiOiJodHRwczovL2RpcmVjdC1wbGF0Zm9ybS5hdXRoMC5jb20vIiwic3ViIjoiRzd2RjIyczQzWm5BVG91QkNwVTlCcWtRSlFEdDg0S1NAY2xpZW50cyIsImF1ZCI6Imh0dHBzOi8vcGxhdGZvcm0ucmFtbWVyLmFpIiwiaWF0IjoxNzMxMjgxMTU4LCJleHAiOjE3MzEzNjc1NTgsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyIsImF6cCI6Ikc3dkYyMnM0M1puQVRvdUJDcFU5QnFrUUpRRHQ4NEtTIn0.XuX27mRLNm6_ChtWxxd0iy66d8Pnvq5VBMh5IwrOwwFtSWJDYYaA4_bDsaOs6UBUq0hIK6uMN2Ud4bhypT6rJpQ3YtXfV2QAQ7aN1PnLtWQMnqYImkrUB3HDi_Hx1R9GBrJK6heYA7SMvI-K-FRcxqJteca0_jYbPbCFiGnA249cAwy0rAV5ByAVyd4lqZjXeS792nkgxIQmofYsunX6ATjpx-TGh3pHo422gGw0lQTui83dn_vp0BbDyPXOGpFB3VnDP55NTMjXG1ArR6nPkDHAtwmfgfHXV7ymLSJ0qNxl6SoUIlvl0d2TzHy6GHml2GmB9Ek0-c32XLGECtSN7g`,
//             'Content-Type': 'audio/wav'
//         },
//         qs: params,
//         json: true,
//     };


//     audioFileStream.pipe(request.post(audioOption, (err, response, body) => {
//         const statusCode = response.statusCode;
//         if (err || Object.keys(this.responses).indexOf(statusCode.toString()) !== -1) {
//             throw new Error(this.responses[statusCode]);
//         }
//         console.log('Status code: ', statusCode);
//         console.log('Body', response.body);
//         return body;
//     }));
// })
//     .catch(error => {
//         console.error('Error fetching token:', error.message);
//     });


