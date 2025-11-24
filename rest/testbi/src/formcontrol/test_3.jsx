import React, { useState, useEffect, useRef } from 'react';
import { Container, Card, Button, Spinner, Row, Col } from 'react-bootstrap'; // Import React Bootstrap components

// Main App component
const App = () => {
    // State variables for managing the application's flow and data
    const [messages, setMessages] = useState([]); // Stores conversation messages
    const [isRecording, setIsRecording] = useState(false); // Flag for recording state
    const [isProcessing, setIsProcessing] = useState(false); // Flag for API processing state
    const [isSpeaking, setIsSpeaking] = useState(false); // Flag for AI speaking state
    const [leaveDetails, setLeaveDetails] = useState({ // Object to store parsed leave information
        employees: [],
        leaveFrom: '',
        numberOfDays: '',
        reason: ''
    });
    const [currentConversationStep, setCurrentConversationStep] = useState('initial'); // Controls conversation flow
    const [lastSpokenText, setLastSpokenText] = useState(''); // Stores the last spoken AI message

    // Refs for MediaRecorder and SpeechRecognition instances
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const recognitionRef = useRef(null);
    const utteranceRef = useRef(null); // Ref for SpeechSynthesisUtterance

    // Effect for handling browser's SpeechSynthesis and cleaning up
    useEffect(() => {
        const handleSpeakEnd = () => setIsSpeaking(false);

        if (utteranceRef.current) {
            utteranceRef.current.onend = handleSpeakEnd;
            utteranceRef.current.onerror = (event) => {
                console.error('SpeechSynthesisUtterance.onerror', event);
                setIsSpeaking(false);
            };
        }

        return () => {
            // Clean up when component unmounts
            if (utteranceRef.current) {
                utteranceRef.current.onend = null;
                utteranceRef.current.onerror = null;
            }
            if (speechSynthesis.speaking) {
                speechSynthesis.cancel();
            }
        };
    }, []);

    // Function to add a message to the chat display
    const addMessage = (sender, text) => {
        setMessages((prevMessages) => [...prevMessages, { sender, text }]);
    };

    // Function to convert WebM to WAV (provided by the user, with minor adjustments)
    const convertWebMToWav = async (webmBlob) => {
        try {
            // Add a check for empty blob
            if (webmBlob.size === 0) {
                throw new Error("Recorded audio is empty or corrupt.");
            }
            const arrayBuffer = await webmBlob.arrayBuffer();
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
            return encodeWAV(audioBuffer);
        } catch (error) {
            console.error("Error converting WebM to WAV:", error);
            throw new Error("Failed to convert WebM to WAV. " + error.message); // Re-throw with more context
        }
    };

    // Function to encode WAV file (provided by the user)
    const encodeWAV = (audioBuffer) => {
        const numOfChannels = audioBuffer.numberOfChannels;
        const sampleRate = audioBuffer.sampleRate;
        const length = audioBuffer.length * numOfChannels * 2 + 44;
        const buffer = new ArrayBuffer(length);
        const view = new DataView(buffer);

        writeString(view, 0, "RIFF");
        view.setUint32(4, 36 + audioBuffer.length * numOfChannels * 2, true);
        writeString(view, 8, "WAVE");
        view.setUint32(12, 0x666D7420, true); // "fmt " ASCII as hex
        view.setUint32(16, 16, true);
        view.setUint16(20, 1, true); // Audio format 1 = PCM
        view.setUint16(22, numOfChannels, true);
        view.setUint32(24, sampleRate, true);
        view.setUint32(28, sampleRate * numOfChannels * 2, true); // Byte rate
        view.setUint16(32, numOfChannels * 2, true); // Block align
        view.setUint16(34, 16, true); // Bits per sample
        view.setUint32(36, 0x64617461, true); // "data" ASCII as hex
        view.setUint32(40, audioBuffer.length * numOfChannels * 2, true);

        const interleaved = interleave(audioBuffer);
        const data = new DataView(buffer, 44);
        for (let i = 0, offset = 0; i < interleaved.length; i++, offset += 2) {
            data.setInt16(offset, interleaved[i] * 0x7FFF, true); // Convert float to 16-bit signed int
        }

        return new Blob([buffer], { type: "audio/wav" });
    };

    // Function to interleave audio channels (provided by the user)
    const interleave = (audioBuffer) => {
        const numOfChannels = audioBuffer.numberOfChannels;
        const length = audioBuffer.length * numOfChannels;
        const interleaved = new Float32Array(length);
        for (let channel = 0; channel < numOfChannels; channel++) {
            const channelData = audioBuffer.getChannelData(channel);
            for (let i = 0; i < channelData.length; i++) {
                interleaved[i * numOfChannels + channel] = channelData[i];
            }
        }
        return interleaved;
    };

    // Helper to write string to DataView (provided by the user)
    const writeString = (view, offset, string) => {
        for (let i = 0; i < string.length; i++) {
            view.setUint8(offset + i, string.charCodeAt(i));
        }
    };

    // Function to synthesize speech using Web Speech API
    const synthesizeSpeech = async (text) => {
        if (!('speechSynthesis' in window)) {
            addMessage('AI', "Your browser does not support speech synthesis.");
            return;
        }
        setIsSpeaking(true);
        const utterance = new SpeechSynthesisUtterance(text);
        utteranceRef.current = utterance; // Store utterance in ref
        utterance.lang = 'en-US'; // Set language
        utterance.onend = () => {
            setIsSpeaking(false);
            if (currentConversationStep === 'clarifying' && !isProcessing && !isRecording) {
                startRecording();
            }
        };
        utterance.onerror = (event) => {
            console.error('SpeechSynthesisUtterance.onerror', event);
            setIsSpeaking(false);
        };
        speechSynthesis.speak(utterance);
        setLastSpokenText(text); // Store the last spoken text
    };

    // Function to start audio recording and speech recognition
    const startRecording = async () => {
        if (isRecording || isProcessing || isSpeaking) return;

        if (currentConversationStep === 'initial') {
            setMessages([]);
            setLeaveDetails({
                employees: [],
                leaveFrom: '',
                numberOfDays: '',
                reason: ''
            });
        }
        
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'audio/webm; codecs=opus' });
            audioChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorderRef.current.onstop = async () => {
                setIsRecording(false);
                setIsProcessing(true);
                addMessage('AI', 'Processing your request...');
                const webmBlob = new Blob(audioChunksRef.current, { type: 'audio/webm; codecs=opus' });
                stream.getTracks().forEach(track => track.stop()); // Stop microphone access immediately after stop
                await processAudioBlob(webmBlob); // Process the recorded audio
            };

            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (!SpeechRecognition) {
                addMessage('AI', "Your browser does not support Web Speech Recognition. Please use Chrome or Edge.");
                setIsRecording(false);
                return;
            }
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onresult = (event) => {
                const transcript = Array.from(event.results)
                    .map(result => result[0])
                    .map(result => result.transcript)
                    .join('');
                console.log('Speech Recognition Result:', transcript);
                addMessage('You', transcript);
                if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
                    mediaRecorderRef.current.stop();
                }
                if (recognitionRef.current) {
                    recognitionRef.current.stop();
                }
            };

            recognitionRef.current.onend = () => {
                console.log('Speech recognition ended.');
                if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
                    mediaRecorderRef.current.stop();
                }
            };

            recognitionRef.current.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                addMessage('AI', `Speech recognition error: ${event.error}. Please ensure microphone is active and try again.`);
                setIsRecording(false);
                setIsProcessing(false);
                stream.getTracks().forEach(track => track.stop());
                if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
                    mediaRecorderRef.current.stop();
                }
                setCurrentConversationStep('finished'); 
            };

            mediaRecorderRef.current.start();
            recognitionRef.current.start();
            setIsRecording(true);
            if (currentConversationStep === 'initial') {
                addMessage('AI', 'How can I assist you to propose a sick leave for your team?');
                synthesizeSpeech('How can I assist you to propose a sick leave for your team?');
            }


        } catch (error) {
            console.error('Error accessing microphone:', error);
            addMessage('AI', 'Failed to access microphone. Please ensure permissions are granted.');
            setIsRecording(false);
            setIsProcessing(false);
            setCurrentConversationStep('finished');
        }
    };

    // Processes the recorded audio blob by converting it to WAV and sending to Google STT
    const processAudioBlob = async (webmBlob) => {
        try {
            const wavBlob = await convertWebMToWav(webmBlob);
            const arrayBuffer = await wavBlob.arrayBuffer();
            const base64Audio = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

            const payload = {
                contents: [
                    {
                        role: "user",
                        parts: [
                            { text: "Transcribe the following audio:" },
                            {
                                inlineData: {
                                    mimeType: "audio/wav",
                                    data: base64Audio
                                }
                            }
                        ]
                    }
                ],
                generationConfig: {}
            };

            const apiKey = "";
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Google STT API error:", errorData);
                throw new Error(`STT API error: ${response.status} - ${errorData.error.message}`);
            }

            const result = await response.json();
            let transcription = '';
            if (result.candidates && result.candidates.length > 0 &&
                result.candidates[0].content && result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0) {
                transcription = result.candidates[0].content.parts[0].text;
            } else {
                addMessage('AI', "I couldn't understand that. Please try speaking clearer.");
                setIsProcessing(false);
                synthesizeSpeech("I couldn't understand that. Please try speaking clearer.");
                setCurrentConversationStep('finished'); 
                return;
            }

            addMessage('AI', `I heard: "${transcription}"`);
            await handleTranscription(transcription);

        } catch (error) {
            console.error('Error during audio processing or STT:', error);
            addMessage('AI', `An error occurred during audio processing: ${error.message}. Please click "Propose Sick Leave" to try again.`);
            setIsProcessing(false);
            setIsRecording(false);
            synthesizeSpeech(`An error occurred during audio processing: ${error.message}. Please click "Propose Sick Leave" to try again.`);
            setCurrentConversationStep('finished');
        }
    };

    // Handles the transcribed text by sending it to Gemini for NLP and entity extraction
    const handleTranscription = async (text) => {
        const prompt = `The user is proposing a sick leave. Extract the following information from the text:
        - Employee Names (can be multiple, comma-separated if needed)
        - Leave Start Date (parse any common date format or relative terms like "tomorrow", "next Monday")
        - Number of Days (numeric value, e.g., "one day", "3 days", "a week")
        - Reason for Leave (free text)

        Respond with a JSON object containing these fields. If a piece of information is not explicitly mentioned, return an empty string or empty array for that field.

        Example 1: "I want to propose a sick leave for John Doe, starting tomorrow for 2 days because he has a fever."
        Output: { "employees": ["John Doe"], "leaveFrom": "tomorrow", "numberOfDays": "2", "reason": "fever" }

        Example 2: "For Jane Smith, sick leave for next Monday for 5 days due to flu."
        Output: { "employees": ["Jane Smith"], "leaveFrom": "next Monday", "numberOfDays": "5", "reason": "flu" }

        Example 3: "Employee Alice and Bob, sick from July 1st for 3 days."
        Output: { "employees": ["Alice", "Bob"], "leaveFrom": "July 1st", "numberOfDays": "3", "reason": "" }

        User input: "${text}"`;

        const chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
        const payload = {
            contents: chatHistory,
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: "OBJECT",
                    properties: {
                        employees: { type: "ARRAY", items: { type: "STRING" } },
                        leaveFrom: { type: "STRING" },
                        numberOfDays: { type: "STRING" },
                        reason: { type: "STRING" }
                    },
                    propertyOrdering: ["employees", "leaveFrom", "numberOfDays", "reason"]
                }
            }
        };

        const apiKey = "";
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Gemini NLP API error:", errorData);
                throw new Error(`NLP API error: ${response.status} - ${errorData.error.message}`);
            }

            const result = await response.json();
            let parsedJson;
            if (result.candidates && result.candidates.length > 0 &&
                result.candidates[0].content && result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0) {
                const json = result.candidates[0].content.parts[0].text;
                parsedJson = JSON.parse(json);
            } else {
                addMessage('AI', "I couldn't extract the details. Please try rephrasing.");
                setIsProcessing(false);
                synthesizeSpeech("I couldn't extract the details. Please try rephrasing.");
                setCurrentConversationStep('finished'); 
                return;
            }

            setLeaveDetails(prev => ({
                employees: (parsedJson.employees && parsedJson.employees.length > 0) ? parsedJson.employees : prev.employees,
                leaveFrom: parsedJson.leaveFrom || prev.leaveFrom,
                numberOfDays: parsedJson.numberOfDays || prev.numberOfDays,
                reason: parsedJson.reason || prev.reason
            }));

            await askForMissingInfo({
                employees: (parsedJson.employees && parsedJson.employees.length > 0) ? parsedJson.employees : leaveDetails.employees,
                leaveFrom: parsedJson.leaveFrom || leaveDetails.leaveFrom,
                numberOfDays: parsedJson.numberOfDays || leaveDetails.numberOfDays,
                reason: parsedJson.reason || leaveDetails.reason
            });

        } catch (error) {
            console.error('Error during NLP processing:', error);
            addMessage('AI', `An error occurred during detail extraction: ${error.message}. Please click "Propose Sick Leave" to try again.`);
            setIsProcessing(false);
            setIsRecording(false);
            synthesizeSpeech(`An error occurred during detail extraction: ${error.message}. Please click "Propose Sick Leave" to try again.`);
            setCurrentConversationStep('finished');
        }
    };

    // Function to ask for missing information
    const askForMissingInfo = async (currentParsedDetails) => {
        const { employees, leaveFrom, numberOfDays, reason } = currentParsedDetails;
        let missingFields = [];

        if (!employees || employees.length === 0) missingFields.push('employee names');
        if (!leaveFrom) missingFields.push('leave start date');
        if (!numberOfDays) missingFields.push('number of days');
        if (!reason) missingFields.push('reason for leave');

        setIsProcessing(false); // Done with processing this turn

        if (missingFields.length > 0) {
            const missingText = missingFields.join(', ');
            const question = `I still need the ${missingText}. Can you please provide them?`;
            addMessage('AI', question);
            synthesizeSpeech(question);
            setCurrentConversationStep('clarifying');
        } else {
            const confirmationMessage = `Got it! Leave for ${employees.join(', ')} starting ${leaveFrom} for ${numberOfDays} days, due to ${reason}. Is that correct?`;
            addMessage('AI', confirmationMessage);
            synthesizeSpeech(confirmationMessage);
            setCurrentConversationStep('finished');
            console.log("All details collected:", { employees, leaveFrom, numberOfDays, reason });
        }
    };

    // Main button click handler
    const handleProposeClick = () => {
        setMessages([]);
        setLeaveDetails({ employees: [], leaveFrom: '', numberOfDays: '', reason: '' });
        setCurrentConversationStep('initial');
        startRecording();
    };

    // UI for displaying messages and controls
    return (
        <Container fluid className="d-flex flex-column align-items-center justify-content-center text-light min-vh-100 p-4">
            {/* Bootstrap CSS CDN Link */}
            <link
                rel="stylesheet"
                href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
                xintegrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
                crossOrigin="anonymous"
            />
            {/* Custom style for the overall background to match ChatGPT's dark theme */}
            <style type="text/css">{`
                body {
                    background-color: #202123; /* Very dark background for the entire page */
                }
                .min-vh-100 {
                    min-height: 100vh;
                }
                .rounded-bottom-right-0 {
                    border-bottom-right-radius: 0 !important;
                }
                .rounded-bottom-left-0 {
                    border-bottom-left-radius: 0 !important;
                }
                /* Custom scrollbar for message area */
                div[style*="overflow-y: auto"]::-webkit-scrollbar {
                    width: 8px;
                }
                div[style*="overflow-y: auto"]::-webkit-scrollbar-track {
                    background: #343541; /* Track color matching message area */
                    border-radius: 10px;
                }
                div[style*="overflow-y: auto"]::-webkit-scrollbar-thumb {
                    background: #64c3c3; /* Thumb color matching accent */
                    border-radius: 10px;
                }
                div[style*="overflow-y: auto"]::-webkit-scrollbar-thumb:hover {
                    background: #80d0d0; /* Lighter accent on hover */
                }
                /* Ensure text is visible on light AI message bubbles */
                .message-ai-text {
                    color: #343541 !important; /* Dark text for light bubbles */
                }
            `}</style>

            {/* Custom dark background for the card, similar to ChatGPT's main area */}
            <Card className="text-light p-4 rounded-3 shadow-lg w-100" style={{ maxWidth: '600px', backgroundColor: '#343541' }}>
                <Card.Body>
                    <h1 className="text-center mb-4" style={{ color: '#10a37f' }}>Sick Leave AI Assistant</h1> {/* Accent color for title */}

                    {/* Message Container - a bit lighter than the card background */}
                    <div className="d-flex flex-column mb-4 p-3 rounded-2" style={{ height: '250px', overflowY: 'auto', backgroundColor: '#202123', color: '#ececf1' }}>
                        {messages.length === 0 ? (
                            <div className="text-center text-muted fst-italic">
                                Click "Propose Sick Leave" to start.
                            </div>
                        ) : (
                            messages.map((msg, index) => (
                                <Row key={index} className={`mb-2 ${msg.sender === 'You' ? 'justify-content-end' : 'justify-content-start'}`}>
                                    <Col xs={10} md={8}>
                                        <div
                                            className={`p-3 rounded ${
                                                msg.sender === 'You'
                                                    ? 'bg-primary text-light rounded-bottom-right-0' // User message - primary color for Bootstrap
                                                    : 'bg-light message-ai-text rounded-bottom-left-0' // AI message - light background, custom text color
                                            }`}
                                            style={{
                                                backgroundColor: msg.sender === 'You' ? '#444654' : '#f7f7f8', // Specific ChatGPT message colors
                                                color: msg.sender === 'You' ? '#ececf1' : '#343541' // Specific text colors for contrast
                                            }}
                                        >
                                            <strong>{msg.sender}:</strong> {msg.text}
                                        </div>
                                    </Col>
                                </Row>
                            ))
                        )}
                    </div>

                    <div className="mt-4 d-flex flex-column align-items-center">
                        <Button
                            onClick={handleProposeClick}
                            disabled={isRecording || isProcessing || isSpeaking}
                            // Using a custom variant or inline style for button color to match ChatGPT's green/teal
                            style={{ backgroundColor: '#10a37f', borderColor: '#10a37f', color: 'white' }}
                            className="w-100 py-3 font-weight-bold rounded-3 shadow-sm"
                        >
                            {isRecording ? (
                                <>
                                    <Spinner animation="grow" size="sm" className="me-2" style={{ color: 'white' }} />
                                    Listening...
                                </>
                            ) : isProcessing ? (
                                <>
                                    <Spinner animation="border" size="sm" className="me-2" style={{ color: 'white' }} />
                                    Processing...
                                </>
                            ) : isSpeaking ? (
                                <>
                                    <span className="me-2" role="img" aria-label="speaking">🗣️</span>
                                    Speaking...
                                </>
                            ) : 'Propose Sick Leave'}
                        </Button>
                        {(isRecording || isProcessing || isSpeaking) && (
                            <p className="text-muted mt-2 small">
                                {isRecording && "Speak now. I'll automatically detect when you're done."}
                                {isProcessing && "Analyzing your input..."}
                                {isSpeaking && `AI says: "${lastSpokenText}"`}
                            </p>
                        )}
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default App;
