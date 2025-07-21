// frontend/src/App.js
import React, { useState, useEffect, useRef, useCallback } from 'react';

// Define constant for your Cloud Run WebSocket URL for voice
const CLOUD_RUN_VOICE_WS_URL = 'wss://birest-6ey4kecoka-as.a.run.app/ws/voice_echo/';

// --- Recording Configuration ---
const AUDIO_MIME_TYPE = 'audio/webm; codecs=opus';

// --- Silence Detection Configuration ---
const SILENCE_THRESHOLD = 50; // Reverted threshold for better detection (0-255)
const SILENCE_DURATION_MS = 5000; // 5 seconds of silence for turn-taking

function App() {

  const [isCallActive, setIsCallActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState([]);
  console.log("App component rendered. isCallActive:", isCallActive, "isRecording:", isRecording);
  const voiceWs = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioContextRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Refs for silence detection and audio graph nodes
  const analyserRef = useRef(null);
  const animationRef = useRef(null); // For requestAnimationFrame ID
  const silenceStartTimeRef = useRef(null); // To track when silence started
  const sourceNodeRef = useRef(null); // To hold the MediaStreamSourceNode for analyser connection

  // Ref to track if the component has mounted (to prevent Strict Mode double-render cleanup issues)
  const didMountRef = useRef(false);

  // Define closeWebSocket early as it's called by other functions
  const closeWebSocket = useCallback(() => {
    console.log("Voice: closeWebSocket called.");
    if (voiceWs.current && voiceWs.current.readyState === WebSocket.OPEN) {
      voiceWs.current.close();
      console.log('Voice: Explicitly closing WebSocket.');
    }
  }, []);

  // Define stopAllMedia early as it's called by other functions
  const stopAllMedia = useCallback(() => {
    console.log("Voice: stopAllMedia called.");
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      console.log('Voice: MediaRecorder explicitly stopped by stopAllMedia.');
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      console.log('Voice: Microphone track stopped.');
    }
    setIsRecording(false);
  }, []); // No external dependencies here

  // Define stopSilenceDetection first as it's a dependency for stopRecordingSegment and useEffect cleanup
  const stopSilenceDetection = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
      silenceStartTimeRef.current = null; // Reset silence timer
      setMessages(prev => [...prev, 'Voice: Silence detection stopped.']);
    }
  }, []); // No external dependencies for this function itself

  // Define stopRecordingSegment next as it's a dependency for startSilenceDetection
  const stopRecordingSegment = useCallback(() => {
    console.log("stopRecordingSegment called.");
    console.log("MediaRecorder state before stop:", mediaRecorderRef.current?.state);

    // Directly check the MediaRecorder's state
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setMessages(prev => [...prev, 'Voice: Stopping recording segment.']);
      // stopSilenceDetection will be called by mediaRecorder.onstop
    } else {
      setMessages(prev => [...prev, 'Voice: Not currently recording or already stopped.']);
      // If it's not recording, ensure silence detection is also stopped
      stopSilenceDetection();
    }
  }, [stopSilenceDetection, setMessages]); // Added setMessages to dependencies

  // Define startSilenceDetection next as it's called by startMicrophoneAndRecording and startRecordingSegment
  const startSilenceDetection = useCallback(() => {
    if (!analyserRef.current) {
      console.warn("AnalyserNode not initialized for silence detection.");
      return;
    }

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);

    const checkSilence = () => {
      // Ensure analyser is still connected and audio context is running
      if (!analyserRef.current || audioContextRef.current.state !== 'running') {
        console.warn("Analyser or AudioContext not ready for silence check. Stopping detection.");
        stopSilenceDetection();
        return;
      }

      analyserRef.current.getByteTimeDomainData(dataArray); // Get waveform data

      // Calculate RMS (Root Mean Square) to get average volume
      let sumSquares = 0;
      for (const amplitude of dataArray) {
        const normalizedAmplitude = (amplitude - 128) / 128; // Normalize to -1 to 1
        sumSquares += normalizedAmplitude * normalizedAmplitude;
      }
      const rms = Math.sqrt(sumSquares / dataArray.length) * 255; // Scale to 0-255 for easier comparison

      console.log("Voice: RMS:", rms.toFixed(2), "Silence Start Time:", silenceStartTimeRef.current ? new Date(silenceStartTimeRef.current).toLocaleTimeString() : "null"); // Detailed RMS logging

      if (rms < SILENCE_THRESHOLD) {
        if (silenceStartTimeRef.current === null) {
          silenceStartTimeRef.current = Date.now();
          console.log("Silence started at:", new Date(silenceStartTimeRef.current).toLocaleTimeString());
        } else if (Date.now() - silenceStartTimeRef.current > SILENCE_DURATION_MS) {
          console.log(`Silence detected for ${SILENCE_DURATION_MS / 1000} seconds. Stopping recording.`);
          setMessages(prev => [...prev, `Voice: Silence detected. Stopping recording.`]);
          stopRecordingSegment(); // Automatically stop recording
          return; // Exit to prevent further checks after stopping
        }
      } else {
        // Sound detected, reset silence timer
        if (silenceStartTimeRef.current !== null) {
          console.log("Sound detected, resetting silence timer.");
        }
        silenceStartTimeRef.current = null;
        console.log("Sound detected"); // Added console log for sound detection
      }

      animationRef.current = requestAnimationFrame(checkSilence);
    };

    // Start the animation loop
    animationRef.current = requestAnimationFrame(checkSilence);
    setMessages(prev => [...prev, 'Voice: Silence detection started.']);
  }, [stopRecordingSegment, stopSilenceDetection, setMessages]); // stopRecordingSegment and stopSilenceDetection are stable

  // Define startMicrophoneAndRecording next as it's called by connectVoiceWebSocket and startRecordingSegment
  const startMicrophoneAndRecording = useCallback(async () => {
    setMessages(prev => [...prev, 'Voice: Requesting microphone access...']);
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      try {
        await audioContextRef.current.resume();
        console.log("AudioContext resumed.");
      } catch (e) {
        console.error("Error resuming AudioContext:", e);
      }
    }

    try {
      if (!MediaRecorder.isTypeSupported(AUDIO_MIME_TYPE)) {
        const errorMessage = `Audio recording format '${AUDIO_MIME_TYPE}' not supported by this browser.`;
        console.error(errorMessage);
        setMessages(prev => [...prev, `Voice: ${errorMessage}`]);
        setIsCallActive(false);
        closeWebSocket();
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      console.log('Voice: Microphone access granted.');
      setMessages(prev => [...prev, 'Voice: Microphone access granted.']);

      // Setup MediaRecorder
      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: AUDIO_MIME_TYPE });

      // Setup AudioContext for silence detection (create and connect only once per stream)
      if (!sourceNodeRef.current) { // Only create source node once per media stream
        sourceNodeRef.current = audioContextRef.current.createMediaStreamSource(stream);
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 2048; // A common size for FFT
        sourceNodeRef.current.connect(analyserRef.current);
        console.log("Voice: AudioContext source and analyser connected.");
      }


      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        console.log('Voice: MediaRecorder stopped. Combining and sending audio.');
        // No explicit disconnect/reconnect of analyser here. It remains connected to the stream.
        stopSilenceDetection(); // Ensure silence detection is stopped when recorder stops

        if (audioChunksRef.current.length > 0) {
          const audioBlob = new Blob(audioChunksRef.current, { type: AUDIO_MIME_TYPE });
          if (voiceWs.current && voiceWs.current.readyState === WebSocket.OPEN) {
            voiceWs.current.send(audioBlob);
            setMessages(prev => [...prev, `Voice: Sent ${audioBlob.size} bytes for echo.`]);
          } else {
            console.warn('Voice: WebSocket not open, could not send audio blob.');
            setMessages(prev => [...prev, 'Voice: Error: WebSocket not open to send audio.']);
          }
          audioChunksRef.current = [];
        } else {
          console.log('Voice: No audio recorded in this segment to send.');
          setMessages(prev => [...prev, 'Voice: No audio recorded in segment.']);
        }
        setIsRecording(false);
        setMessages(prev => [...prev, 'Voice: Ready for next segment.']);
      };

      // Start recording
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setMessages(prev => [...prev, 'Voice: Recording... Speak now.']);
      // Start silence detection. The analyser is already connected.
      startSilenceDetection(); // Start monitoring for silence
      silenceStartTimeRef.current = null; // Reset silence timer when recording starts

    } catch (err) {
      console.error('Voice: Error accessing microphone:', err);
      setMessages(prev => [...prev, `Voice: Microphone access denied: ${err.message}`]);
      setIsCallActive(false);
      closeWebSocket();
    }
  }, [closeWebSocket, setMessages, setIsCallActive, setIsRecording, stopSilenceDetection, startSilenceDetection]);

  // Define startRecordingSegment before connectVoiceWebSocket as it's called there
  const startRecordingSegment = useCallback(() => {
    console.log("startRecordingSegment called.");
    console.log("Current isCallActive:", isCallActive);
    console.log("WebSocket readyState:", voiceWs.current?.readyState);

    // Check if the WebSocket is open instead of isCallActive
    if (voiceWs.current?.readyState !== WebSocket.OPEN) {
      setMessages(prev => [...prev, 'Voice: Call not active (WebSocket not open). Click "Call Agent" first.']);
      return;
    }

    if (!mediaRecorderRef.current) {
      setMessages(prev => [...prev, 'Voice: MediaRecorder not initialized. Attempting to re-initialize.']);
      // If mediaRecorder is not initialized but call is active, try to re-initialize
      startMicrophoneAndRecording();
      return;
    }

    const state = mediaRecorderRef.current.state;
    console.log("MediaRecorder state:", state);

    if (state === 'recording') {
      setMessages(prev => [...prev, 'Voice: Already recording.']);
      return;
    }

    if (state === 'inactive' || state === 'stopped') {
      try {
        audioChunksRef.current = [];
        mediaRecorderRef.current.start();
        setIsRecording(true);
        setMessages(prev => [...prev, 'Voice: Recording... Speak now.']);
        // The analyser is already connected from startMicrophoneAndRecording.
        startSilenceDetection(); // Start monitoring for silence
        silenceStartTimeRef.current = null; // Reset silence timer when recording starts
      } catch (e) {
        console.error('Voice: Failed to start MediaRecorder:', e);
        setMessages(prev => [...prev, 'Voice: Failed to start recording.']);
      }
    } else {
      setMessages(prev => [...prev, `Voice: Unexpected recorder state: ${state}`]);
    }
  }, [isCallActive, startMicrophoneAndRecording, startSilenceDetection, setMessages, setIsRecording]);

  const connectVoiceWebSocket = useCallback(() => {
    if (voiceWs.current && (voiceWs.current.readyState === WebSocket.OPEN || voiceWs.current.readyState === WebSocket.CONNECTING)) {
      console.log('Voice WebSocket already open or connecting. No new connection needed.');
      return;
    }

    voiceWs.current = new WebSocket(CLOUD_RUN_VOICE_WS_URL);
    voiceWs.current.binaryType = 'arraybuffer';

    voiceWs.current.onopen = () => {
      console.log('Voice WebSocket connection opened');
      setMessages(prev => [...prev, 'Voice: Connected to WebSocket!']);
      setIsCallActive(true);
      startMicrophoneAndRecording();
    };

    voiceWs.current.onmessage = async (event) => {
      if (event.data instanceof ArrayBuffer) {
        console.log(`Voice: Received ${event.data.byteLength} bytes of audio.`);
        try {
          // Ensure AudioContext is not closed before decoding
          if (audioContextRef.current.state === 'closed') {
            console.error("AudioContext is closed, cannot decode audio.");
            setMessages(prev => [...prev, 'Voice: Playback Error: AudioContext is closed.']);
            return;
          }
          const audioBuffer = await audioContextRef.current.decodeAudioData(event.data);
          const source = audioContextRef.current.createBufferSource();
          source.buffer = audioBuffer;
          source.connect(audioContextRef.current.destination);
          source.start(0);

          console.log("Voice: isCallActive before onended:", isCallActive);

          // Add this to restart recording after playback
          source.onended = () => {
            console.log("Playback ended, attempting to restart recording.");
            console.log("Voice: isCallActive inside onended before startRecordingSegment:", isCallActive);
            startRecordingSegment();
          };

          console.log('Voice: Playing received audio.');
        } catch (e) {
          console.error('Voice: Error decoding or playing audio:', e);
          setMessages(prev => [...prev, `Voice: Playback Error: ${e.name}: ${e.message}. See console for details.`]);
        }
      } else if (typeof event.data === 'string') {
        try {
          const jsonData = JSON.parse(event.data);
          if (jsonData.type === 'error') {
            setMessages(prev => [...prev, `Voice Server Error: ${jsonData.message}`]);
          } else {
            console.log('Voice: Received unexpected JSON data:', jsonData);
          }
        } catch (e) {
          console.log('Voice: Received unexpected non-JSON text data:', event.data);
        }
      }
    };

    voiceWs.current.onclose = () => {
      console.log('Voice: WebSocket connection closed at: ' + new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3 }));
      setMessages(prev => [...prev, 'Voice: WebSocket Disconnected.']);
      setIsCallActive(false);
      stopAllMedia();
      stopSilenceDetection(); // Ensure silence detection is stopped on WS close
    };

    voiceWs.current.onerror = (error) => {
      console.error('Voice: WebSocket error:', error);
      setMessages(prev => [...prev, `Voice: WebSocket Error: ${error.message}`]);
      setIsCallActive(false);
      stopAllMedia();
      stopSilenceDetection(); // Ensure silence detection is stopped on WS error
    };
  }, [startMicrophoneAndRecording, stopAllMedia, stopSilenceDetection, startRecordingSegment, isCallActive, setMessages, setIsCallActive]);


  const endCallSession = useCallback(() => {
    console.log("endCallSession called!");
    stopAllMedia();
    closeWebSocket();
    stopSilenceDetection(); // Ensure silence detection is stopped
    setMessages(prev => [...prev, 'Voice: Call ended.']);
    setIsCallActive(false);
  }, [stopAllMedia, closeWebSocket, stopSilenceDetection, setMessages, setIsCallActive]);

  useEffect(() => {
    // Mark component as mounted after initial render
    didMountRef.current = true;

    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }

    return () => {
      // Only run cleanup if the component was truly mounted and is now unmounting for good
      if (didMountRef.current) {
        console.log("Voice: useEffect cleanup running. Calling endCallSession.");
        endCallSession(); // Centralize cleanup
      }
      // Reset ref to false when component unmounts
      didMountRef.current = false;
    };
  }, [endCallSession]); // Added endCallSession to dependencies for useEffect cleanup

  // Moved startCallSession here to be defined before it's used in JSX
  const startCallSession = useCallback(() => {
    if (isCallActive) return; // Prevent multiple calls
    connectVoiceWebSocket(); // Connect WS, which will then trigger mic and recording
  }, [isCallActive, connectVoiceWebSocket]);

  // --- UI Render ---
  return (
    <div style={{ padding: '20px', fontFamily: 'Inter, sans-serif', display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '800px', margin: '20px auto', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', backgroundColor: '#fff' }}>
      {/* Voice Echo Section */}
      <div style={{ padding: '15px', border: '1px solid #e0e0e0', borderRadius: '8px', backgroundColor: '#fefefe' }}>
        <h1 style={{ fontSize: '1.8em', color: '#333', marginBottom: '15px' }}>Voice Echo App</h1>
        <p style={{ fontSize: '0.9em', color: '#666', marginBottom: '15px' }}>
          Click "Call Agent" to start the session. Click "Record" to speak. Click "Stop Recording" to echo. Click "End Call" to finish.
          Recording will also stop automatically after 5 seconds of silence.
        </p>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', flexWrap: 'wrap' }}>
          {!isCallActive ? ( // Use state directly for UI rendering
            <button
              onClick={startCallSession}
              style={{ padding: '10px 20px', borderRadius: '5px', border: 'none', backgroundColor: '#008CBA', color: 'white', cursor: 'pointer', fontSize: '1em', transition: 'background-color 0.3s ease' }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#007bb5'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#008CBA'}
            >
              Call Agent
            </button>
          ) : (
            <>
              {!isRecording ? (
                <button
                  onClick={startRecordingSegment}
                  style={{ padding: '10px 20px', borderRadius: '5px', border: 'none', backgroundColor: '#4CAF50', color: 'white', cursor: 'pointer', fontSize: '1em', transition: 'background-color 0.3s ease' }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#45a049'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4CAF50'}
                >
                  Record
                </button>
              ) : (
                <button
                  onClick={stopRecordingSegment}
                  style={{ padding: '10px 20px', borderRadius: '5px', border: 'none', backgroundColor: '#FFC107', color: 'white', cursor: 'pointer', fontSize: '1em', transition: 'background-color 0.3s ease' }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#ffb300'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#FFC107'}
                >
                  Stop Recording
                </button>
              )}
              <button
                onClick={endCallSession}
                style={{ padding: '10px 20px', borderRadius: '5px', border: 'none', backgroundColor: '#f44336', color: 'white', cursor: 'pointer', fontSize: '1em', transition: 'background-color 0.3s ease' }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#da190b'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f44336'}
              >
                End Call
              </button>
            </>
          )}
          {isCallActive && !isRecording && <span style={{ padding: '10px', color: '#008CBA' }}>Call Active. Ready to record.</span>}
          {isRecording && <span style={{ padding: '10px', color: '#008CBA' }}>Recording...</span>}
        </div>
      </div>

      {/* Messages Display */}
      <div style={{ border: '1px solid #e0e0e0', padding: '15px', minHeight: '200px', backgroundColor: '#f9f9f9', overflowY: 'auto', maxHeight: '400px', borderRadius: '8px' }}>
        <h2 style={{ fontSize: '1.5em', color: '#333', marginBottom: '10px' }}>Console Messages:</h2>
        {messages.map((msg, index) => (
          <p key={index} style={{ margin: '5px 0', fontSize: '0.9em', color: '#555' }}>{msg}</p>
        ))}
      </div>
    </div>
  );
}

export default App;
