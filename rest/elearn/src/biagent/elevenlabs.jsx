import React, { useEffect, useState } from 'react';

// Main Elevenlabs component
const Elevenlabs = () => {
  // State to store customer ID and name from URL
  const [customerId, setCustomerId] = useState('');
  const [customerName, setCustomerName] = useState('');
  // State to hold the dynamic variables JSON string
  const [dynamicVariables, setDynamicVariables] = useState('{}');
  // New state to track if the ElevenLabs widget script has loaded and is ready
  const [widgetReady, setWidgetReady] = useState(false);

  // Replace with your actual ElevenLabs Agent ID
  const ELEVENLABS_AGENT_ID = "agent_01jzhtn9zkfhcsz96xpshfjp5w"; // Example ID, please change this!

  useEffect(() => {
    // This effect runs once when the component mounts

    // Get the current URL's query string
    const urlParams = new URLSearchParams(window.location.search);

    // Extract 'custid' and 'name' parameters
    const id = urlParams.get('custid');
    const name = urlParams.get('name');

    // Update state with the extracted values
    if (id) {
      setCustomerId(id);
    }
    if (name) {
      setCustomerName(name);
    }

    // Construct the dynamic-variables JSON string
    // Ensure the keys match what your ElevenLabs agent expects
    const dynamicData = {};
    if (id) {
      dynamicData.custid = id;
    }
    if (name) {
      dynamicData.name = name; // Using 'customerName' as a key for clarity
    }
    setDynamicVariables(JSON.stringify(dynamicData));

    // Dynamically load the ElevenLabs widget embed script
    const scriptId = 'elevenlabs-convai-widget-script';
    let script = document.getElementById(scriptId);

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = "https://unpkg.com/@elevenlabs/convai-widget-embed";
      script.async = true;
      script.type = "text/javascript";
      document.body.appendChild(script);

      // Add an event listener to know when the script has loaded
      script.onload = () => {
        // The custom element should now be registered
        setWidgetReady(true);
        console.log("ElevenLabs widget script loaded and ready.");
      };
      script.onerror = (error) => {
        console.error("Failed to load ElevenLabs widget script:", error);
      };
    } else {
      // If the script is already in the DOM (e.g., hot reload),
      // assume it's ready or will be ready shortly.
      // You might want to add a more robust check here if needed.
      setWidgetReady(true);
      console.log("ElevenLabs widget script already present.");
    }

    // Log the extracted values and dynamic variables for debugging
    // Temporarily comment out these lines to rule out any unexpected rendering issues
    // console.log("Extracted Customer ID:", id);
    // console.log("Extracted Customer Name:", name);
    // console.log("Dynamic Variables JSON:", JSON.parse(JSON.stringify(dynamicData)));

  }, []); // Empty dependency array means this effect runs only once on mount

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 font-sans">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          ElevenLabs Convai Widget
        </h1>
        <p className="text-gray-600 mb-6">
          This page demonstrates embedding the Convai widget with dynamic customer data from the URL.
        </p>

        {/* Display the extracted customer information */}
        <div className="bg-blue-100 border border-blue-300 text-blue-800 p-3 rounded-lg mb-6">
          <p className="font-semibold">Customer Information from URL:</p>
          <p>ID: <span className="font-mono text-blue-900">{customerId || 'N/A'}</span></p>
          <p>Name: <span className="font-mono text-blue-900">{customerName || 'N/A'}</span></p>
        </div>

        <p className="text-gray-700 mb-4">
          The Convai widget below will receive this information.
        </p>

        {/* Conditionally render the ElevenLabs Convai Widget only when the script is ready */}
        <div className="fixed top-0 left-1/2 transform -translate-x-1/2 p-4 z-50">
        {widgetReady ? (
          <elevenlabs-convai 
            agent-id={ELEVENLABS_AGENT_ID}
            dynamic-variables={dynamicVariables}
            variant="expanded"
          ></elevenlabs-convai>
        ) : (
          <div className="text-gray-500">Loading ElevenLabs widget...</div>
        )}
        </div>

        <p className="text-sm text-gray-500 mt-6">
          Please ensure your ElevenLabs agent's "First message" is configured to use name and custid placeholders.
        </p>
      </div>
    </div>
  );
};

export default Elevenlabs;
