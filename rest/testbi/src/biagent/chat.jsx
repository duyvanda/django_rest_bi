// src/App.js
import React, { useState, useRef, useEffect } from 'react';

const WS_URL = 'wss://birest-6ey4kecoka-as.a.run.app/ws/voice_echo1/';
// const AUDIO_TYPE = 'audio/webm;codecs=opus';
const SILENCE_DELAY = 2000; // 1 second
const SILENCE_THRESHOLD = 0.01; // Adjust sensitivity

const base64toBlob = (base64, mimeType) => {
  const byteCharacters = atob(base64); // Giải mã Base64 thành chuỗi nhị phân
  const byteArrays = [];
  for (let i = 0; i < byteCharacters.length; i++) {
    byteArrays.push(byteCharacters.charCodeAt(i)); // Chuyển ký tự thành mã ASCII
  }
  const byteArray = new Uint8Array(byteArrays); // Tạo Uint8Array từ mã ASCII
  return new Blob([byteArray], { type: mimeType }); // Tạo Blob từ Uint8Array
};

function App() {
  const [micLevel, setMicLevel] = useState(0);
  const [waveformData, setWaveformData] = useState([]);
  const [isSilent, setIsSilent] = useState(false);
  const [messages, setMessages] = useState(["Hi 21 !!!!"]);
  const [isCalling, setIsCalling] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [status, setStatus] = useState('idle');
  const [first_blob, set_first_blob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioMimeTypeRef = useRef('');
  const socketRef = useRef(null);
  const audioChunksRef = useRef([]);
  const silenceTimerRef = useRef(null);
  const audioContextRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const sourceNodeRef = useRef(null);
  const analyserRef = useRef(null);
  const animationRef = useRef(null);

  const startCall = async () => {
    if (isCalling) return;
    setIsCalling(true);
    setStatus('listening');

    // Initialize WebSocket connection
    socketRef.current = new WebSocket(WS_URL);
    socketRef.current.binaryType = 'arraybuffer'; // Set binary type for receiving audio data

    // Handle WebSocket open event
    socketRef.current.onopen = () => {
      setMessages(prev => [...prev, '🔌 WebSocket connected']);
    };

    // Handle WebSocket close event
    socketRef.current.onclose = (event) => {
      setMessages(prev => [...prev, `🔌 WebSocket disconnected (${event.code})`]);
      setIsCalling(false); // Reset call state
      setStatus('idle');   // Update UI status
    };

    try {
      const audioUrl = URL.createObjectURL(first_blob); // Tạo URL Object cho Blob
      const audio = new Audio(audioUrl);
      audio.play().catch(e => { // Bắt lỗi nếu play() thất bại
      console.error("Lỗi khi phát lời chào:", e);
      });

      audio.onended = async () => {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      setMessages(prev => [...prev, 'Voice: Microphone access granted.']);
      };

    }
    catch (e) {
      setMessages(prev => [...prev, `Lỗi khi gọi greet: ${e.message || e}`]);
    }



    // Initialize or resume AudioContext
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    /* Without audioContextRef, none of the following can work: createMediaStreamSource() — turning mic input into an audio node; createAnalyser() — used to detect mic levels; decodeAudioData() — used to decode binary audio blobs from the backend; createBufferSource() — used to play back audio. */
    /* 📌 2. audioContext must be user-initiated. Many browsers (especially Safari and Chrome on mobile) require AudioContext to be created or resumed inside a user gesture like a click or touch, to avoid autoplay abuse. That’s why it’s initialized inside startCall() (a button click handler). */
    /* 📌 3. Reuse: We store it in a useRef. We keep it in audioContextRef.current instead of useState() to: reuse it across functions without triggering re-renders; access it in detectSilenceLoop(), onmessage, and onstop handlers. */
    }
    if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
    }

    // Create audio source node from microphone stream
    const source = audioContextRef.current.createMediaStreamSource(mediaStreamRef.current);
    sourceNodeRef.current = source;

    // Set up analyser node for silence detection
    const analyser = audioContextRef.current.createAnalyser();
    analyser.fftSize = 2048;
    analyserRef.current = analyser;
    source.connect(analyser);

    // Start silence detection loop
    detectSilenceLoop();

    // 📼 Detect best supported audio MIME type
      const supportedTypes = [
        'audio/webm;codecs=opus',
        'audio/mp4;codecs=mp4a.40.2',
        'audio/mp4'
      ];
      const AUDIO_TYPE = supportedTypes.find(type => MediaRecorder.isTypeSupported(type)) || '';
      audioMimeTypeRef.current = AUDIO_TYPE;
      setMessages(prev => [...prev, `🎙️ Recording as: ${AUDIO_TYPE || 'default browser format'}`]);


    // Initialize MediaRecorder if not already set
    if (!mediaRecorderRef.current) {
      const options = AUDIO_TYPE ? { mimeType: AUDIO_TYPE } : undefined;
      const recorder = new MediaRecorder(mediaStreamRef.current, options);
      mediaRecorderRef.current = recorder;
      setMessages(prev => [...prev, 'Voice: Microphone access granted.']);

      // Collect audio data chunks
      recorder.ondataavailable = e => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      // Send audio blob over WebSocket when recording stops
      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: AUDIO_TYPE || 'audio/webm;codecs=opus' });
        audioChunksRef.current = [];
        if (socketRef.current?.readyState === WebSocket.OPEN) {
          // socketRef.current.send(audioBlob);
          const audioUrl = URL.createObjectURL(audioBlob);
          setMessages(prev => [...prev, `🛰️ Sent audio blob (${audioBlob.size} bytes)`, <audio key={Date.now()} controls src={audioUrl} />]);

          try {
            // Gửi FormData đến API chat của Django
            const formData = new FormData(); // Tạo FormData để gửi file
            formData.append('audio', audioBlob, 'user_audio'); // Khóa là 'audio'
            const response = await fetch('https://bi.meraplion.com/local/chat/', { 
              method: 'POST',
              body: formData, // FormData tự động đặt Content-Type là multipart/form-data
            });

            const data = await response.json(); // Nhận phản hồi JSON từ backend
            const base64 = data.ai_audio_base64;

            // Giải mã base64 và phát lại
            const binary = atob(base64);
            const bytes = new Uint8Array(binary.length);
            for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
            }

            const audioBuffer = await audioContextRef.current.decodeAudioData(bytes.buffer);
            const source = audioContextRef.current.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(audioContextRef.current.destination);
            
            setIsPlaying(true);
            setStatus('playing');

            try {
              source.start();
              const audioBlob = base64toBlob(data.ai_audio_base64, 'audio/mp3');
              const audioUrl = URL.createObjectURL(audioBlob);
              setMessages(prev => [
              ...prev,
              '🔊 Echo from server:',
              <audio key={Date.now()} controls src={audioUrl} />,
            ]);
            } catch (e) {
              setMessages(prev => [...prev, `Lỗi khi gọi start(): ${e.message || e}`]);
            }

            
            source.onerror = (e) => {
              console.error("Lỗi khi phát lời chào (onerror):", e);
              setMessages(prev => [...prev, `Lỗi khi gọi play() onerror: ${e.message || e}`]);
            };

            source.onended = () => {
              setIsPlaying(false);
              setStatus('listening');

              clearTimeout(silenceTimerRef.current);
              setTimeout(() => {
                if (mediaRecorderRef.current?.state !== 'recording') {
                  audioChunksRef.current = [];
                  mediaRecorderRef.current.start();
                  setMessages(prev => [...prev, `speak again`]);

                }
                cancelAnimationFrame(animationRef.current);
                detectSilenceLoop();
              }, 100);
            };

          } catch (e) {
            console.error('❌ Echo playback failed', e);
            setMessages(prev => [...prev, `❌ Echo playback failed: ${e.message}`]);
          }

        }
      };
    }

    // Start recording
    mediaRecorderRef.current.start();
    setMessages(prev => [...prev, 'Voice: Recording... Speak now.']);
  };

const detectSilenceLoop = () => {
    const analyser = analyserRef.current;
    const bufferLength = analyser.fftSize;
    const dataArray = new Uint8Array(bufferLength);
    let silenceArmed = false;

    const detect = () => {
      analyser.getByteTimeDomainData(dataArray);

      let sum = 0;
      const waveformPoints = [];
      for (let i = 0; i < bufferLength; i += 32) {
        const normalized = (dataArray[i] - 128) / 128;
        sum += normalized * normalized;
        waveformPoints.push(normalized);
      }
      const rms = Math.sqrt(sum / bufferLength);
      setMicLevel(rms);
      setWaveformData(waveformPoints);

      if (rms >= SILENCE_THRESHOLD) {
        // User is speak
        setIsSilent(false); // ✅ Update here
        silenceArmed = true;
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
          silenceTimerRef.current = null;
        }
      } else if (rms < SILENCE_THRESHOLD && silenceArmed) {
        // User has gone silent after speaking
        setIsSilent(true); // ✅ And update here
        if (!silenceTimerRef.current) {
          silenceTimerRef.current = setTimeout(() => {
            stopRecordingAndSend();
            silenceTimerRef.current = null;
            silenceArmed = false;
          }, SILENCE_DELAY);
        }
      }

      // Start the animation loop
      animationRef.current = requestAnimationFrame(detect);
    };

    detect();
  };

  const stopRecordingAndSend = () => {
    if (!mediaRecorderRef.current || mediaRecorderRef.current.state !== 'recording') return;

    setStatus('sending');
    mediaRecorderRef.current.stop();
  };

    const cleanupResources = () => {
    // 1. Cancel animation frame
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    // 2. Clear silence timer
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
    }

    // 3. Stop MediaRecorder
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch (err) {
        console.warn('Failed to stop recorder:', err);
      }
    }

    // 4. Stop microphone tracks
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }

    // 5. Disconnect audio context
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
    }

    // 6. Close WebSocket
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.close(1000, 'Call ended or component unmounted');
    }

    // 7. Reset all refs
    sourceNodeRef.current = null;
    analyserRef.current = null;
    mediaRecorderRef.current = null;
    audioContextRef.current = null;
    socketRef.current = null;

    // 8. Reset UI state
    setIsCalling(false);
    setIsPlaying(false);
    setStatus('idle');
    setMessages(prev => [...prev, '📴 Call ended']);
  };

    const endCall = () => {
      cleanupResources();
    // window.location.href = 'https://example.com/thank-you';
    };

  const get_first_greet = async () => {

    const response = await fetch('https://bi.meraplion.com/local/greet/', { method: 'GET' });
    const audioBlob = await response.blob(); // Nhận audio dưới dạng Blob
    set_first_blob(audioBlob)

  }

  useEffect( () => {
    get_first_greet();
    return () => {
      cleanupResources();
    };
  }, []);

  const getStatusText = () => {
    switch (status) {
      case 'idle': return 'Click "Call Agent" to start.';
      case 'listening': return '🎙️ Listening...';
      case 'sending': return '⏳ Sending your voice...';
      case 'playing': return '🔊 Playing echoed voice...';
      default: return '';
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100 text-gray-900">
      <h1 className="text-3xl font-bold mb-6">Voice Echo Agent</h1>
      <button
        onClick={startCall}
        disabled={isCalling}
        className={`px-6 py-3 rounded-lg text-lg font-medium shadow-md transition ${
          isCalling ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        {isCalling ? 'Calling…' : 'Call Agent'}
      </button>
      <button onClick={endCall}>End Call</button>

      <p className="mt-6 text-xl font-semibold text-gray-700">{getStatusText()}</p>

      <div className="w-full max-w-md h-4 bg-gray-300 rounded overflow-hidden mt-4">
        <p>Mic level</p>
        <div
          className="h-full bg-green-500 transition-all duration-50"
          style={{ width: `${Math.min(micLevel * 3000, 100)}%` }}
        />
      </div>

      <div className="mt-2">
        {status === 'listening' && (
          <p className={`text-sm font-semibold ${isSilent ? 'text-red-500 animate-pulse' : 'text-green-600'}`}>
            {isSilent ? '🤫 Silence detected...' : '🎤 You are speaking...'}
          </p>
        )}
      </div>

      <div className="w-full max-w-md mt-4">
        <svg width="100%" height="40">
          <polyline
            fill="none"
            stroke="blue"
            strokeWidth="2"
            points={waveformData.map((v, i) => `${i * 3},${20 - v * 20}`).join(' ')}
          />
        </svg>
      </div>

      <div style={{ border: '1px solid #e0e0e0', padding: '15px', minHeight: '200px', backgroundColor: '#f9f9f9', overflowY: 'auto', maxHeight: '400px', borderRadius: '8px' }}>
        <h2 style={{ fontSize: '1.5em', color: '#333', marginBottom: '10px' }}>Console Messages:</h2>
        {messages.map((msg, index) => (
          <div key={index} style={{ margin: '5px 0', fontSize: '0.9em', color: '#555' }}>
            {typeof msg === 'string' ? <p>{msg}</p> : msg}
          </div>
        ))}
      </div>

    </div>
  );
}

export default App;
