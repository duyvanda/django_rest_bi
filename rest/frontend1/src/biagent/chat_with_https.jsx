import React, { useState, useEffect, useRef } from 'react';
import { Container, Button, Form, Spinner, Alert, Card, InputGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import './test.css'; // Import CSS tùy chỉnh của bạn
import { BsFillMicFill, BsFillPlayFill } from 'react-icons/bs'; // Import icon microphone (Cần cài: npm install react-bootstrap-icons)

// Utility function to convert base64 string to Blob
// Được sử dụng để chuyển đổi audio Base64 từ backend thành Blob để trình duyệt phát
const base64toBlob = (base64, mimeType) => {
  const byteCharacters = atob(base64); // Giải mã Base64 thành chuỗi nhị phân
  const byteArrays = [];
  for (let i = 0; i < byteCharacters.length; i++) {
    byteArrays.push(byteCharacters.charCodeAt(i)); // Chuyển ký tự thành mã ASCII
  }
  const byteArray = new Uint8Array(byteArrays); // Tạo Uint8Array từ mã ASCII
  return new Blob([byteArray], { type: mimeType }); // Tạo Blob từ Uint8Array
};

function Chat() {
  // State để quản lý trạng thái tải (loading) của ứng dụng
  const [loading, setLoading] = useState(false);
  // State để lưu trữ thông báo lỗi
  const [error, setError] = useState(null);
  // State để lưu trữ lịch sử cuộc trò chuyện
  // Mỗi tin nhắn là một object {role: 'user'/'ai', text: '...', audioUrl: '...', showListenAgainButton: boolean}
  const [conversation, setConversation] = useState([]);
  // State để kiểm tra xem micro có đang ghi âm không
  const [isRecording, setIsRecording] = useState(false);

  // UPDATE HERE: State để quản lý spinner cho nút "Nghe lại" của AI audio
  const [loadingAudio, setLoadingAudio] = useState(false);

  // Ref để truy cập MediaRecorder instance (API ghi âm của trình duyệt)
  const mediaRecorderRef = useRef(null);
  // Ref để lưu trữ các đoạn audio đã ghi được
  const audioChunksRef = useRef([]);
  // Ref để ngăn không cho nhiều âm thanh phát cùng lúc
  const audioPlayingRef = useRef(null);

  // Ref để cuộn tự động đến cuối khung chat
  const chatContainerRef = useRef(null); 

    // Effect để tự động cuộn đến cuối khi load vào page
  useEffect(() => {
    document.getElementById("start").focus();
  }, []);

  // Effect để tự động cuộn đến cuối khung chat khi có tin nhắn mới
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight + 200;
    //   chatContainerRef.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversation]); // Chạy lại mỗi khi 'conversation' thay đổi

  // Effect để dọn dẹp các Object URL khi component unmount hoặc conversation thay đổi
  // Giúp giải phóng bộ nhớ
  useEffect(() => {
    return () => {
      conversation.forEach(msg => {
        if (msg.audioUrl) {
          URL.revokeObjectURL(msg.audioUrl); // Giải phóng Object URL
        }
      });
    };
  }, [conversation]); // Chạy mỗi khi 'conversation' thay đổi (hoặc component unmount)

  // Hàm để phát một đoạn âm thanh

const playAudio = async (url) => {
  if (!url) return;
  if (audioPlayingRef.current) return;

  audioPlayingRef.current = true;
  return new Promise((resolve, reject) => {
    try {
      const audio = new Audio(url);
      audio.onended = () => {
        audioPlayingRef.current = false;
        resolve();
      };
      audio.onerror = (e) => {
        console.error("Lỗi khi phát lời chào (onerror):", e); // Đổi log cho rõ ràng
        setError(`Lỗi khi phát lời (onerror): ${e.message || e}`); // Vẫn giữ thông báo này nếu lỗi từ onerror
        audioPlayingRef.current = false;
        reject(e);
      };
      audio.play().catch(e => {
        console.error("Lỗi khi gọi play():", e);
        setError(`Lỗi khi gọi play(): ${e.message || e}`); // Đã sửa
        audioPlayingRef.current = false;
        reject(e);
      });
    } catch (e) {
      console.error("Lỗi khi tạo Audio object:", e);
      setError(`Lỗi khi phát âm thanh: ${e.message || e}`); // Có thể sửa cả ở đây nữa
      audioPlayingRef.current = false;
      reject(e);
    }
  });
};

  // UPDATE HERE: Hàm xử lý khi click nút "Nghe lại"
  const handleListenAgain = async (audioUrl) => {
    setError(null); // Xóa thông báo lỗi chung
    setLoadingAudio(true); // Bật spinner cho nút Nghe lại
    try {
      await playAudio(audioUrl);
      console.log("Phát âm thanh AI thành công!");
    } catch (err) {
      console.error("Không thể phát lại âm thanh:", err);
      setError(`Lỗi khi phát lại: ${err.message || err}`); // Hiển thị lỗi cụ thể cho người dùng
    } finally {
      setLoadingAudio(false); // Tắt spinner cho nút Nghe lại
    }
  };

  // --- Bắt đầu chat (Phát lời chào và chuẩn bị ghi âm) ---
  const handleStartChat = async () => {
    setLoading(true); // Bắt đầu loading
    setError(null);    // Xóa lỗi cũ
    setConversation([]); // Xóa cuộc trò chuyện trước đó

    try {
      // 1. Gọi backend để lấy lời chào
      const response = await fetch('https://bi.meraplion.com/local/greet/', { method: 'GET' });

      if (!response.ok) {
        throw new Error(`Lỗi HTTP: ${response.status} - ${await response.text()}`);
      }

      const audioBlob = await response.blob(); // Nhận audio dưới dạng Blob
      const audioUrl = URL.createObjectURL(audioBlob); // Tạo URL Object cho Blob
      
      // UPDATE HERE: Tạo tin nhắn lời chào ban đầu, mặc định không hiển thị nút Nghe lại
      const greetingMessage = {
        role: 'ai',
        text: "Chào bạn, hãy nói về chủ đề của bạn.",
        audioUrl: audioUrl,
        showListenAgainButton: false
      };
      setConversation([greetingMessage]); // Thêm lời chào vào cuộc trò chuyện

      // 2. Phát lời chào, sau đó tự động bắt đầu ghi âm
      const audio = new Audio(audioUrl);
      audio.onended = () => {
        startRecording(); // Bắt đầu ghi âm khi lời chào kết thúc
      };
      audio.onerror = (e) => {
        console.error("Lỗi khi phát lời chào:", e);
        setError("Lỗi khi phát lời chào.");
        setLoading(false); // Dừng loading nếu có lỗi phát
      };
      audio.play().catch(e => { // Bắt lỗi nếu play() thất bại
        console.error("Lỗi khi phát lời chào:", e);
        setError("Lỗi khi phát lời chào.");
        setLoading(false);
      });
      
    } catch (err) {
      console.error("Lỗi khi bắt đầu chat:", err);
      setError(err.message || "Không thể bắt đầu chat.");
      setLoading(false); // Dừng loading nếu có lỗi
    }
  };

  // --- Bắt đầu ghi âm giọng nói người dùng ---
  const startRecording = async () => {
    setError(null); // Xóa lỗi cũ
    audioChunksRef.current = []; // Xóa các đoạn audio đã ghi trước đó
    // Dừng loading từ lời chào, giờ là trạng thái ghi âm

    try {
      // Yêu cầu quyền truy cập microphone
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Tạo MediaRecorder để ghi âm. Định dạng WebM Opus thường được khuyến nghị cho Google STT.
      // mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' });
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        // Thu thập các đoạn dữ liệu audio khi chúng có sẵn
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        // Khi ghi âm dừng, tạo một Blob từ các đoạn audio
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm;codecs=opus' });
        sendAudioToBackend(audioBlob); // Gửi Blob này lên backend
      };

      mediaRecorderRef.current.start(); // Bắt đầu ghi âm
      setLoading(false);
      setIsRecording(true); // Cập nhật trạng thái ghi âm
      console.log("Bắt đầu ghi âm...");
    } catch (err) {
      console.error("Lỗi khi truy cập microphone:", err);
      setError("Không thể truy cập microphone. Vui lòng cấp quyền.");
      setLoading(false); // Dừng loading nếu có lỗi
    }
  };

  // --- Dừng ghi âm giọng nói người dùng ---
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop(); // Dừng ghi âm
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop()); 
      setIsRecording(false); // Cập nhật trạng thái ghi âm
      setLoading(true);
      console.log("Dừng ghi âm, đang gửi audio...");
    }
  };

  // --- Gửi audio người dùng lên backend và nhận phản hồi AI ---
  const sendAudioToBackend = async (audioBlob) => {
    const formData = new FormData(); // Tạo FormData để gửi file
    formData.append('audio', audioBlob, 'user_audio.webm'); // Khóa là 'audio'
    try {
      // Gửi FormData đến API chat của Django
      const response = await fetch('https://bi.meraplion.com/local/chat/', { 
        method: 'POST',
        body: formData, // FormData tự động đặt Content-Type là multipart/form-data
      });

      if (!response.ok) {
        // Nếu phản hồi không OK (ví dụ: 4xx, 5xx), đọc lỗi từ body
        const errorData = await response.json();
        throw new Error(`Lỗi HTTP: ${response.status} - ${errorData.error || response.statusText}`);
      }

      const data = await response.json(); // Nhận phản hồi JSON từ backend
      
      // Thêm tin nhắn của người dùng vào cuộc trò chuyện
      const newUserMessage = { role: 'user', text: data.user_text || "Không nhận dạng được giọng nói.", audioUrl: null };
      setConversation(prev => [...prev, newUserMessage]);

      // Xử lý audio phản hồi của AI (nếu có)
      let aiAudioObjUrl = null;
      if (data.ai_audio_base64) {
        const audioBlob = base64toBlob(data.ai_audio_base64, 'audio/mp3');
        aiAudioObjUrl = URL.createObjectURL(audioBlob);
      }

      // UPDATE HERE: Tạo đối tượng tin nhắn AI với showListenAgainButton: false mặc định
      let aiMessageWithButton = { 
        role: 'ai', 
        text: data.ai_text_response || "Xin lỗi, tôi không thể phản hồi lúc này.", 
        audioUrl: aiAudioObjUrl,
        showListenAgainButton: false // Mặc định ẩn nút "Nghe lại"
      };
      // Thêm tin nhắn AI vào cuộc trò chuyện
      setConversation(prev => [...prev, aiMessageWithButton]);

      if (aiAudioObjUrl) {
         playAudio(aiAudioObjUrl);
      }

      // if (aiAudioObjUrl) {
      //   try {
      //     await playAudio(aiAudioObjUrl);
      //     console.log("Audio AI tự động phát thành công.");
      //   } catch (e) {
      //     console.error("Audio AI tự động phát thất bại, hiển thị nút Nghe lại:", e);
      //     setConversation(prev => prev.map(msg =>
      //       msg === aiMessageWithButton ? { ...msg, showListenAgainButton: true } : msg
      //     ));
      //     setError(null);
      //   }
      // }

    } catch (err) {
      console.error("Lỗi khi gửi audio hoặc nhận phản hồi:", err);
      setError(err.message || 'Đã xảy ra lỗi khi xử lý yêu cầu.');
    } finally {
      setLoading(false); // Dừng loading
    }
  };

    return (
    <Container className="chat-app-container" fluid>
      <Card className="chat-card">
        <Card.Header className="chat-header">
          <h3 className="card-title mb-0">Chat với AI bằng Giọng nói</h3>
        </Card.Header>
        <Card.Body className="chat-body" ref={chatContainerRef}>
          {conversation.length === 0 && !loading && !error && !isRecording ? (
            <p className="text-center text-secondary">Nhấn "Trò chuyện" để bắt đầu!</p>
          ) : (
            conversation.map((msg, index) => (
              <div key={index} className={`message-bubble ${msg.role}`}>
                <div className="message-content">
                  {msg.text}
                  {msg.audioUrl && (
                    <audio controls src={msg.audioUrl} className="audio-player mt-1">
                      Trình duyệt của bạn không hỗ trợ audio.
                    </audio>
                  )}

                  {/* {msg.audioUrl && msg.role === 'ai' && msg.showListenAgainButton && (
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      className="mt-2 listen-again-button"
                      onClick={() => handleListenAgain(msg.audioUrl)}
                      disabled={loadingAudio}
                    >
                      {loadingAudio ? (
                        <Spinner animation="border" size="sm" />
                      ) : (
                        <BsFillPlayFill size={20} className="me-1" />
                      )}
                      Nghe lại
                    </Button>
                  )} */}

                </div>
              </div>
            ))
          )}
          
          {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
        </Card.Body>
        <Card.Footer className="chat-footer">
          <InputGroup>
            {!isRecording && !loading && conversation.length === 0 && (
              <Button variant="primary" onClick={handleStartChat} disabled={loading} className="w-100">
                Trò chuyện
              </Button>
            )}
            
            {!isRecording && !loading && conversation.length > 0 && (
              <> {/* React Fragment để nhóm nhiều elements */}
                <Button 
                  variant="success" 
                  onClick={startRecording} 
                  disabled={loading} 
                  className="flex-fill fw-bold" // flex-fill để chiếm không gian đều
                >
                    <BsFillMicFill size={20} className="me-2" /> Ghi âm 
                </Button>
                <Button 
                  variant="outline-success" // Dùng variant khác để phân biệt
                  onClick={handleStartChat} // Vẫn gọi handleStartChat để reset cuộc trò chuyện
                  disabled={loading} 
                  className="flex-fill fw-bold me-2" // flex-fill để chiếm không gian đều, me-2 tạo margin
                >
                  TALK mới
                </Button>
              </>
            )}

            {isRecording && (
              <Button variant="danger" onClick={stopRecording} disabled={loading} className="w-100">
                <Spinner animation="grow" size="sm" /> Đang ghi âm... Dừng lại!
              </Button>
            )}
            
            {loading && (
              <Button variant="danger" onClick={stopRecording} disabled={loading} className="w-100">
                <Spinner animation="grow" size="sm" /> Đang xử lý âm thanh!
              </Button>
            )}
          </InputGroup>
        </Card.Footer>
        <p className='ml-3' id="start">Gemini 2.5 Pro v5</p>
      </Card>
      
    </Container>
  );
}

export default Chat;

    // const playAudio = async (url) => {
    //   if (!url) return;
    //   if (audioPlayingRef.current) return;

    //   audioPlayingRef.current = true;
    //   try {
    //     const audio = new Audio(url);
    //     audio.onended = () => {
    //     startRecording();
    //   };
    //   audio.onerror = (e) => {
    //     console.error("Lỗi khi phát lời chào:", e);
    //     setError("Lỗi khi phát lời chào.");
    //   };
    //   audio.play().catch(e => {
    //     console.error("Lỗi khi phát lời chào:", e);
    //     setError("Lỗi khi phát lời chào.");
    //   });

    //   } catch (e) {
    //     console.error("Lỗi khi phát âm thanh:", e);
    //     setError("Lỗi khi phát âm thanh.");
    //   } finally {
    //     audioPlayingRef.current = false;
    //   }
    // };