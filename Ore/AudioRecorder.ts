class AudioRecorder {
    private preview: any
    private recording: any
    private startButton: any
    private stopButton: any
    private downloadButton: any
    private logElement: any
    private recordingTimeMS: number
   // private startRecording: any
    private stopRecording: any

    constructor() {
        this.preview = document.getElementById("preview");
        this.recording = document.getElementById("recording");
        this.startButton = document.getElementById("startButton");
        this.stopButton = document.getElementById("stopButton");
        this.downloadButton = document.getElementById("downloadButton");
        this.logElement = document.getElementById("log");
        this.recordingTimeMS = 5000;

        // Bind methods
        this.startRecording = this.startRecording.bind(this);
        this.stopRecording = this.stopRecording.bind(this);
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
    async startRecording(stream, lengthInMS) {
        let recorder = new MediaRecorder(stream);
        let data: any[] = [];

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
            const audioUrl = URL.createObjectURL(audioBlob);
            this.preview.src = audioUrl;

            // Enable download button
            this.downloadButton.disabled = false;
            this.downloadButton.href = audioUrl;
            this.downloadButton.download = "recorded_audio.wav";

            // Stop the media stream tracks after recording
            this.stop(stream);

        } catch (error) {
            console.error("Error accessing the microphone:", error);
            this.log("Error: " + error);
        }
    }

    // Stop the media stream
    stop(stream) {
        stream.getTracks().forEach(track => {
            track.stop();
        });
        this.log("Recording stopped.");
    }
}



