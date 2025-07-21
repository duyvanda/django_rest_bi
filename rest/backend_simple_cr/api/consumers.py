# app/api/consumers.py
import json
from channels.generic.websocket import WebsocketConsumer, AsyncWebsocketConsumer # Import AsyncWebsocketConsumer
from channels.exceptions import StopConsumer

# --- Existing EchoConsumer (for text echo) ---
class EchoConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()
        print("Text WebSocket Connected!")

    def disconnect(self, close_code):
        print(f"Text WebSocket Disconnected: {close_code}")

    def receive(self, text_data):
        try:
            text_data_json = json.loads(text_data)
            message_type = text_data_json.get('type')

            if message_type == 'ping':
                print(f"Text Echo Consumer: Received ping (no pong sent).")
                return
            else:
                message = text_data_json.get('message', 'No message provided')
                print(f"Text Echo Consumer: Received message: {message}")
                self.send(text_data=json.dumps({
                    'message': f"Echo from server: {message}"
                }))
        except json.JSONDecodeError:
            print(f"Text Echo Consumer: Received non-JSON data: {text_data}")
            self.send(text_data=json.dumps({
                'type': 'error',
                'message': 'Invalid message format received by text echo server.'
            }))

# --- NEW EchoVoiceConsumer (MODIFIED to AsyncWebsocketConsumer) ---
class EchoVoiceConsumer(AsyncWebsocketConsumer): # Changed to AsyncWebsocketConsumer
    async def connect(self): # Must be async
        await self.accept() # Must await
        print("Voice WebSocket Connected!")

    async def disconnect(self, close_code): # Must be async
        print(f"Voice WebSocket Disconnected: {close_code}")

    async def receive(self, bytes_data): # Must be async
        # This consumer is designed to receive binary data (audio)
        # We simply echo the received bytes back to the client
        print(f"Voice WebSocket: Received {len(bytes_data)} bytes of audio, echoing back.")
        await self.send(bytes_data=bytes_data) # Must await
        # After sending, the consumer remains active because it's an async consumer
        # and it's implicitly waiting for the next message or disconnect.

    # This is for debugging, if you accidentally send text to the voice consumer
    async def receive_text(self, text_data): # Must be async
        print(f"Voice WebSocket: Received unexpected text data: {text_data}")
        await self.send(text_data=json.dumps({ # Must await
            "type": "error",
            "message": "This voice consumer expects binary audio data, received text."
        }))