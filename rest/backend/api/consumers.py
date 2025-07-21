# api/consumers.py
import json
import base64
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async

@sync_to_async
def process_speech_to_text(audio_data_chunks):
    """
    Chuyển đổi các chunk audio thành văn bản.
    Bạn cần nối các chunk audio lại và gửi đến API STT (ví dụ: Google Cloud Speech-to-Text, Whisper).
    Trả về văn bản đã nhận dạng.
    """
    print(f"Processing {len(audio_data_chunks)} audio chunks for STT...")
    # ----------------------------------------------------
    return "Đây là văn bản được nhận dạng từ giọng nói của bạn."

@sync_to_async
def get_llm_response(user_text, conversation_history):
    """
    Tạo phản hồi từ mô hình ngôn ngữ lớn (LLM).
    Bạn cần tích hợp API LLM của mình (ví dụ: Gemini API, OpenAI GPT).
    Sử dụng conversation_history để duy trì ngữ cảnh.
    """
    print(f"LLM processing text: '{user_text}' with history: {conversation_history}")
    # --- THAY THẾ BẰNG LOGIC GỌI API LLM THỰC TẾ CỦA BẠN ---
    # llm_client = GeminiClient(api_key="YOUR_GEMINI_API_KEY")
    # full_history = [{"role": msg["role"], "parts": [{"text": msg["text"]}]} for msg in conversation_history]
    # full_history.append({"role": "user", "parts": [{"text": user_text}]})
    # response = llm_client.generate_content(full_history)
    # ai_text_response = response.text
    # ----------------------------------------------------
    if "chào" in user_text.lower():
        return "Chào bạn, tôi có thể giúp gì cho bạn hôm nay?"
    elif "thời tiết" in user_text.lower():
        return "Tôi không có thông tin thời tiết trực tiếp, nhưng tôi có thể tìm kiếm cho bạn nếu bạn cho tôi biết địa điểm."
    return f"Bạn vừa nói: '{user_text}'. Tôi là một trợ lý AI. Tôi có thể giúp bạn về nhiều chủ đề. Bạn muốn nói về điều gì tiếp theo?"

@sync_to_async
def get_text_to_speech_audio(text):
    """
    Chuyển đổi văn bản thành dữ liệu âm thanh Base64.
    Hàm này sẽ mô phỏng việc gọi API TTS và trả về một chuỗi Base64.
    """
    print(f"Generating TTS audio for text: '{text}' (returning placeholder Base64)")
    # --- THAY THẾ BẰNG LOGIC GỌI API TTS THỰC TẾ CỦA BẠN NẾU BẠN MUỐN TÍCH HỢP SAU NÀY ---
    # Ví dụ:
    # tts_client = GoogleTTSClient(api_key="YOUR_TTS_API_KEY")
    # audio_content = tts_client.synthesize_speech(text) # Đây sẽ là bytes
    # audio_base64 = base64.b64encode(audio_content).decode('utf-8')
    # return audio_base64
    # ---------------------------------------------------------------------------------
    # Chuỗi Base64 placeholder rất ngắn (ví dụ: cho một file MP3 rỗng hoặc rất nhỏ)
    # Đây là để đảm bảo frontend nhận được một chuỗi Base64 hợp lệ,
    # nhưng không phải là dữ liệu audio dummy lớn.
    return "SUQzBAAAAAAA"


class ChatConsumer(AsyncWebsocketConsumer):
    audio_chunks = []
    conversation_history = []

    async def connect(self):
        await self.accept()
        print("WebSocket connected")
        self.audio_chunks = []
        self.conversation_history = []

    async def disconnect(self, close_code):
        print(f"WebSocket disconnected with code: {close_code}")
        self.audio_chunks = []
        self.conversation_history = []

    async def receive(self, text_data=None, bytes_data=None):
        if bytes_data:
            self.audio_chunks.append(bytes_data)
        elif text_data:
            message = json.loads(text_data)
            msg_type = message.get('type')

            if msg_type == 'user_finished_speaking':
                print("Frontend signaled: user finished speaking. Processing audio...")
                if self.audio_chunks:
                    user_text = await process_speech_to_text(self.audio_chunks)
                    self.audio_chunks = []

                    self.conversation_history.append({"role": "user", "text": user_text})

                    ai_text_response = await get_llm_response(user_text, self.conversation_history)

                    self.conversation_history.append({"role": "ai", "text": ai_text_response})

                    ai_audio_base64 = await get_text_to_speech_audio(ai_text_response)

                    await self.send(text_data=json.dumps({
                        'type': 'ai_response',
                        'user_text': user_text,
                        'ai_text_response': ai_text_response,
                        'ai_audio_base64': ai_audio_base64
                    }))
                else:
                    print("No audio chunks received before user_finished_speaking signal.")
                    await self.send(text_data=json.dumps({
                        'type': 'error',
                        'message': 'Không nhận được dữ liệu giọng nói từ bạn.'
                    }))
            elif msg_type == 'call_ended':
                print("Frontend signaled: call ended. Closing WebSocket.")
                await self.close()
            else:
                print(f"Unknown message type received: {msg_type}")
                await self.send(text_data=json.dumps({
                    'type': 'error',
                    'message': 'Loại tin nhắn không xác định.'
                }))
        else:
            print("Received empty message.")
            await self.send(text_data=json.dumps({
                'type': 'error',
                'message': 'Tin nhắn rỗng.'
            }))
