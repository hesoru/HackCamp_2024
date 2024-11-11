export default class AudioRecorder {
   
    // private startButton: any
    // private stopButton: any
    // private logElement: any
    // private recordingTimeMS: number
   // private startRecording: any
    // private stopRecording: any
    // private startRecording: any
    

    constructor() {
    
        this.startButton = document.getElementById("startButton");
        this.stopButton = document.getElementById("stopButton");
        this.recordingTimeMS = 5000;

       // Bind methods for start and stop recording to ensure the correct `this` context
       this.startRecording = this.startRecording.bind(this);
       this.stopRecording = this.stopRecording.bind(this);

       // Attach event listeners for start and stop buttons
       this.startButton.addEventListener("click", this.startRecording);
       this.stopButton.addEventListener("click", this.stopRecording);
    }

    // Helper function to log messages
    log(msg) {
        this.logElement.innerText += `${msg}\n`;
    }

    // Wait function for delaying actions (like stopping the recording after a certain time)
    wait(delayInMS) {
        return new Promise((resolve) => setTimeout(resolve, delayInMS));
    }

    // Start recording function
    async startRecordingAudio(stream, lengthInMS) {
        let recorder = new MediaRecorder(stream);
        let data = [];

        recorder.ondataavailable = (event) => data.push(event.data);
        recorder.start();
        this.log(`${recorder.state} for ${lengthInMS / 1000} seconds…`);

        let stopped = new Promise((resolve, reject) => {
            recorder.onstop = resolve;
            recorder.onerror = (event) => reject(event);
        });

        // Stop recording after the specified duration (lengthInMS)
        let recorded = this.wait(lengthInMS).then(() => {
            if (recorder.state === "recording") {
                recorder.stop();
            }
        });

        await Promise.all([stopped, recorded]);
        return data;
    }

    async start() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            const recordedChunks = await this.startRecording(stream, this.recordingTimeMS);

            const audioBlob = new Blob(recordedChunks, { type: "audio/wav" });
            // const audioUrl = URL.createObjectURL(audioBlob);
            await this.uploadAudio(audioBlob);
            // Stop the media stream tracks after recording
            this.stop(stream);

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

    // Stop the media stream
    stop(stream) {
        stream.getTracks().forEach(track => {
            track.stop();
        });
        this.log("Recording stopped.");
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






