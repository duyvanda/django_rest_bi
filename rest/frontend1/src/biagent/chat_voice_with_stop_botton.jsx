// frontend/src/App.js
import React, { useState, useEffect, useRef, useCallback } from 'react';

// Define constant for your Cloud Run WebSocket URL for voice
const CLOUD_RUN_VOICE_WS_URL = 'wss://birest-6ey4kecoka-as.a.run.app/ws/voice_echo/';

// --- Recording Configuration ---
const AUDIO_MIME_TYPE = 'audio/webm; codecs=opus'; 

function App() {
  const [isCallActive, setIsCallActive] = useState(false); // Overall call session active (WebSocket open)
  const [isRecording, setIsRecording] = useState(false); // Is MediaRecorder actively recording
  const [messages, setMessages] = useState([]);

  const voiceWs = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioContextRef = useRef(null);
  const mediaStreamRef = useRef(null); // To hold the microphone stream
  const audioChunksRef = useRef([]); // To buffer audio chunks for a segment

  // Initialize AudioContext once when component mounts
  useEffect(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }

    // Cleanup AudioContext on unmount
    return () => {
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
      // Ensure everything is stopped if component unmounts
      stopAllMedia();
      closeWebSocket();
    };
  }, []);

  // --- Helper Functions for Media and WebSocket Cleanup ---
  const stopAllMedia = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop(); // This will trigger onstop
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      console.log('Voice: Microphone track stopped.');
    }
    setIsRecording(false);
  };

  const closeWebSocket = () => {
    if (voiceWs.current && voiceWs.current.readyState === WebSocket.OPEN) {
      voiceWs.current.close();
      console.log('Voice: Explicitly closing WebSocket.');
    }
  };

  // --- Microphone Stream Management (Moved Up) ---
  const startMicrophoneAndRecording = async () => {
    setMessages(prev => [...prev, 'Voice: Requesting microphone access...']);
    // Ensure audio context is resumed on user gesture
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
        closeWebSocket(); // Close WS if format not supported
        return;
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      console.log('Voice: Microphone access granted.');
      setMessages(prev => [...prev, 'Voice: Microphone access granted.']);

      // Setup MediaRecorder once microphone stream is available
      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: AUDIO_MIME_TYPE });

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        console.log('Voice: MediaRecorder stopped. Combining and sending audio.');
        if (audioChunksRef.current.length > 0) {
          const audioBlob = new Blob(audioChunksRef.current, { type: AUDIO_MIME_TYPE });
          if (voiceWs.current && voiceWs.current.readyState === WebSocket.OPEN) {
            voiceWs.current.send(audioBlob); // Send the complete audio Blob
            setMessages(prev => [...prev, `Voice: Sent ${audioBlob.size} bytes for echo.`]);
          } else {
            console.warn('Voice: WebSocket not open, could not send audio blob.');
            setMessages(prev => [...prev, 'Voice: Error: WebSocket not open to send audio.']);
          }
          audioChunksRef.current = []; // Clear chunks after sending for the next segment
        } else {
          console.log('Voice: No audio recorded in this segment to send.');
          setMessages(prev => [...prev, 'Voice: No audio recorded in segment.']);
        }
        setIsRecording(false); // Recording has stopped after segment
        setMessages(prev => [...prev, 'Voice: Ready for next segment.']);
      };

      // Start recording immediately after mic is ready
      mediaRecorderRef.current.start(); // Start recording for this segment
      setIsRecording(true); // Set recording state true here
      setMessages(prev => [...prev, 'Voice: Recording... Speak now.']);

    } catch (err) {
      console.error('Voice: Error accessing microphone:', err);
      setMessages(prev => [...prev, `Voice: Microphone access denied: ${err.message}`]);
      setIsCallActive(false); // Call cannot be active without mic
      closeWebSocket(); // Close WS if mic access fails
    }
  };

    // --- Button Actions ---
  const startCallSession = () => {
    if (isCallActive) return; // Prevent multiple calls

    connectVoiceWebSocket(); // Connect WS, which will then trigger mic and recording
  };

  // --- WebSocket Connection Management (Moved Up) ---
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
      setIsCallActive(true); // Call is active once WS is open
      // Now that WS is open, proceed to get microphone and start recording
      startMicrophoneAndRecording(); // Directly start mic and recording
    };

    voiceWs.current.onmessage = async (event) => {
      if (event.data instanceof ArrayBuffer) {
        console.log(`Voice: Received ${event.data.byteLength} bytes of audio.`);
        try {
          const audioBuffer = await audioContextRef.current.decodeAudioData(event.data);
          const source = audioContextRef.current.createBufferSource();
          source.buffer = audioBuffer;
          source.connect(audioContextRef.current.destination);
          source.start(0);
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
      console.log('Voice: WebSocket connection closed');
      setMessages(prev => [...prev, 'Voice: WebSocket Disconnected.']);
      setIsCallActive(false); // Call is no longer active if WS closes
      stopAllMedia(); // Ensure media is stopped if WS unexpectedly closes
      // Reconnect logic (optional for this turn-based flow, but good for robustness)
      // if (isCallActive) { // Only try to reconnect if it was an unexpected close during an active call
      //   setMessages(prev => [...prev, 'Voice: Connection lost, attempting reconnect...']);
      //   setTimeout(connectVoiceWebSocket, 3000);
      // }
    };

    voiceWs.current.onerror = (error) => {
      console.error('Voice: WebSocket error:', error);
      setMessages(prev => [...prev, `Voice: WebSocket Error: ${error.message}`]);
      setIsCallActive(false);
      stopAllMedia();
    };
  }, []); // No dependencies here, as connectVoiceWebSocket is called explicitly




  const startRecordingSegment = () => {
    if (!isCallActive) {
      setMessages(prev => [...prev, 'Voice: Call not active. Click "Call Agent" first.']);
      return;
    }
    if (isRecording) {
      setMessages(prev => [...prev, 'Voice: Already recording.']);
      return;
    }
    // Re-initialize MediaRecorder if it's inactive but stream is still active
    if (!mediaRecorderRef.current || mediaRecorderRef.current.state === 'inactive') {
      if (mediaStreamRef.current) {
         mediaRecorderRef.current = new MediaRecorder(mediaStreamRef.current, { mimeType: AUDIO_MIME_TYPE });
         mediaRecorderRef.current.ondataavailable = (event) => {
            if (event.data.size > 0) {
              audioChunksRef.current.push(event.data);
            }
         };
         mediaRecorderRef.current.onstop = () => {
            console.log('Voice: MediaRecorder stopped. Combining and sending audio.');
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
      } else {
          setMessages(prev => [...prev, 'Voice: Microphone stream not active. Restarting call.']);
          startCallSession(); // Re-initiate full call if stream is gone
          return;
      }
    }

    audioChunksRef.current = []; // Clear chunks for new segment
    mediaRecorderRef.current.start(); // Start recording for this segment
    setIsRecording(true);
    setMessages(prev => [...prev, 'Voice: Recording... Speak now.']);
  };

  const stopRecordingSegment = () => {
    if (isRecording && mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop(); // This will trigger onstop and send the audio
      setMessages(prev => [...prev, 'Voice: Stopping recording segment.']);
    } else {
      setMessages(prev => [...prev, 'Voice: Not currently recording.']);
    }
  };

  const endCallSession = () => {
    stopAllMedia(); // Stop microphone and recorder
    closeWebSocket(); // Close WebSocket connection
    setMessages(prev => [...prev, 'Voice: Call ended.']);
    setIsCallActive(false);
  };

  // --- UI Render ---
  return (
    <div style={{ padding: '20px', fontFamily: 'Inter, sans-serif', display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '800px', margin: '20px auto', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', backgroundColor: '#fff' }}>
      {/* Voice Echo Section */}
      <div style={{ padding: '15px', border: '1px solid #e0e0e0', borderRadius: '8px', backgroundColor: '#fefefe' }}>
        <h1 style={{ fontSize: '1.8em', color: '#333', marginBottom: '15px' }}>Voice Echo App</h1>
        <p style={{ fontSize: '0.9em', color: '#666', marginBottom: '15px' }}>
          Click "Call Agent" to start the session. Click "Record" to speak. Click "Stop Recording" to echo. Click "End Call" to finish.
        </p>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', flexWrap: 'wrap' }}>
          {!isCallActive ? (
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
