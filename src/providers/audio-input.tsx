import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}

type AudioInputType = {
  isRecording: boolean;
  recordingComplete: boolean;
  sentences: string | null;
  transcribe: string | null;
  startRecording: () => void;
  stopRecording: () => void;
  toggleRecording: () => void;
};

type Props = {
  children: ReactNode;
};

const defaultAudioInputContext: AudioInputType = {
  isRecording: false,
  recordingComplete: false,
  sentences: null,
  transcribe: null,
  startRecording: () => {},
  stopRecording: () => {},
  toggleRecording: () => {},
};

const AudioInputContext = createContext(defaultAudioInputContext);

export const AudioInputProvider = ({ children }: Props) => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingComplete, setRecordingComplete] = useState<boolean>(false);
  const [transcribe, setTranscribe] = useState<string>("");
  const [sentences, setSentences] = useState<string>("");

  const recognitionRef = useRef<any>(null);

  const startRecording = () => {
    setIsRecording(true);
    recognitionRef.current = new window.webkitSpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = "th-Th";
    recognitionRef.current.onresult = (event: any) => {
      const { transcript } = event.results[event.results.length - 1][0];
      setTranscribe(transcript);
    };

    recognitionRef.current.start();
  };

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        setRecordingComplete(true);
      }
    };
  }, []);

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      startRecording();
    } else {
      stopRecording();
      setSentences((prev) => prev.concat(transcribe));
    }
  };

  return (
    <AudioInputContext.Provider
      value={{
        isRecording,
        recordingComplete,
        startRecording,
        stopRecording,
        toggleRecording,
        sentences,
        transcribe,
      }}
    >
      {children}
    </AudioInputContext.Provider>
  );
};

export const useAudioInput = () => {
  return useContext(AudioInputContext);
};
