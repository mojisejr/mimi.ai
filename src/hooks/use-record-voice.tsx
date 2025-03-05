"use client";
import { useState, useRef, useEffect } from "react";

const useRecordVoice = () => {
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [recording, setRecording] = useState<boolean>(false);

  const chunks = useRef<Blob[]>([]);

  const initialMediaRecorder = (stream: MediaStream) => {
    const mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.onstart = () => {
      chunks.current = [];
    };

    mediaRecorder.ondataavailable = (ev) => {
      chunks.current.push(ev.data); // Storing data chunks
    };

    mediaRecorder.onstop = () => {
      // Creating a blob from accumulated audio chunks with WAV format
      const audioBlob = new Blob(chunks.current, { type: "audio/wav" });
      console.log(audioBlob, "audioBlob");

      // You can do something with the audioBlob, like sending it to a server or processing it further
    };

    setMediaRecorder(mediaRecorder);
  };

  const startRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.start();
      setRecording(true);
    }
  };

  // Function to stop the recording
  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setRecording(false);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(initialMediaRecorder);
    }
  }, []);

  return { recording, startRecording, stopRecording };
};

export default useRecordVoice;
