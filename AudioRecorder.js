export default class AudioRecorder {
   

    constructor() {
    
        this.startButton = document.getElementById("startButton");
        this.stream = null;
        this.recorder = null;
        this.recordedChunks = [];

       // this.logElement = document.getElementById("logContainer");

       // Bind methods for start and stop recording to ensure the correct `this` context
       //this.startRecording = this.startRecording.bind(this);

       this.startRecording = this.startRecording.bind(this);
        this.stopRecording = this.stopRecording.bind(this);

        // Attach event listeners for start and stop recording
        this.startButton.addEventListener("mousedown", this.startRecording);  // Desktop
        this.startButton.addEventListener("mouseup", this.stopRecording);    // Desktop
        this.startButton.addEventListener("touchstart", this.startRecording); // Mobile
        this.startButton.addEventListener("touchend", this.stopRecording);   // Mobile
    }

    // Helper function to log messages
    log(msg) {
        console.log(msg)
    }

    // Wait function for delaying actions (like stopping the recording after a certain time)
    wait(delayInMS) {
        return new Promise((resolve) => setTimeout(resolve, delayInMS));
    }

    // Start recording function
    async startRecordingAudio(stream, lengthInMS) {
        this.recorder = new MediaRecorder(stream);
        this.recordedChunks = [];

        this.recorder.ondataavailable = (event) => this.recordedChunks.push(event.data);
       
       // this.log(`${recorder.state} for ${lengthInMS / 1000} seconds…`);

        // let stopped = new Promise((resolve, reject) => {
        //     recorder.onstop = resolve;
        //     recorder.onerror = (event) => reject(event);
        // });
        
        //this.recorder.onstop = this.handleStop.bind(this);
        this.recorder.start();
        this.log("Recording started...");

        
    }

    async start() {
        try {
            this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            await this.startRecordingAudio(this.stream);
           // const recordedChunks = await this.startRecording(stream, this.recordingTimeMS);

            //const audioBlob = new Blob(recordedChunks, { type: "audio/wav" });
            
            ///await this.uploadAudio(audioBlob);
            // Stop the media stream tracks after recording
            //this.stop(stream);

        } catch (error) {
            console.error("Error accessing the microphone:", error);
            this.log("Error: " + error);
        }
    }

    async uploadAudio(audioBlob) {
        try {
            const formData = new FormData();
            formData.append("file", audioBlob, "recorded_audio.wav");

            // Send the audio file to the server
            const response = await fetch("/upload-audio", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                console.log("Audio uploaded successfully!");
            } else {
                console.error("Error uploading audio:", response.statusText);
            }
        } catch (error) {
            console.error("Failed to upload audio:", error);
        }
    }

    handleStop() {
        this.stopStream();  // Stop the media stream tracks
        this.log("Recording has been stopped.");
        
        // Reset recorder and stream for next use
        //this.recorder = null;
       // this.stream = null;
    }

    stopStream() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.log("Media stream stopped.");
        }
    }

    // Stop the media stream
    // stop(stream) {
    //     stream.getTracks().forEach(track => {
    //         track.stop();
    //     });
    //     this.log("Recording stopped.");
    // }

    stop() {
        if (this.recorder && this.recorder.state === "recording") {
            // Stop the recorder
            this.recorder.stop();
            this.log("Recording stopped.");
            this.stopStream();
           
        }
    }

    // Stop the media stream
    stopStream() {
        if (this.stream) {
            // Iterate over each track of the stream and stop it
            this.stream.getTracks().forEach((track) => {
                track.stop(); // Properly stop the track to release the microphone
            });
            this.log("Media stream tracks stopped.");
        }
    }


    startRecording() {
        console.log("Start button clicked");
        this.start(); // Start recording process
    }

    // Method to handle the stop recording button click
    stopRecording() {
        // Implement stop logic if needed
        this.stop()
    }
}






