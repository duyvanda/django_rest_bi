import React, { useEffect, useRef } from 'react';

function Diaflow() {
  const dfMessengerRef = useRef(null);
  const currentUserId = "manager_001"; // <-- THAY THẾ BẰNG USERID THỰC TẾ CỦA BẠN

  useEffect(() => {
    // <<< XOÁ TOÀN BỘ ĐOẠN CODE DƯỚI ĐÂY >>>
    // const scriptId = 'df-messenger-script';
    // if (!document.getElementById(scriptId)) {
    //   const script = document.createElement('script');
    //   script.id = scriptId;
    //   script.src = "https://www.gstatic.com/dialogflow-console/fast/df-messenger/prod/v1/df-messenger.js";
    //   script.async = true;
    //   document.body.appendChild(script);
    //   script.onload = () => {
    //     if (dfMessengerRef.current) {
    //       dfMessengerRef.current.sessionParameters = JSON.stringify({ userid: currentUserId });
    //       console.log('Dialogflow Messenger script loaded and userId set:', currentUserId);
    //     }
    //   };
    //   script.onerror = (error) => {
    //     console.error('Failed to load Dialogflow Messenger script:', error);
    //   };
    // } else {
    //   if (dfMessengerRef.current) {
    //     dfMessengerRef.current.sessionParameters = JSON.stringify({ userid: currentUserId });
    //   }
    // }
    // <<< KẾT THÚC ĐOẠN CODE CẦN XOÁ >>>


    // Giữ lại phần này để thiết lập sessionParameters sau khi component df-messenger được render
    // (Script đã được tải tĩnh, nên dfMessengerRef.current sẽ có sẵn sớm hơn)
    if (dfMessengerRef.current) {
        dfMessengerRef.current.sessionParameters = JSON.stringify({ userid: currentUserId });
        // Log này sẽ chạy sau khi component đã được mount
        console.log('Dialogflow Messenger component mounted and userId set:', currentUserId);
    }

    return () => {
      // Cleanup nếu cần
    };
  }, [currentUserId]);

  return (
    <>
    <p>abc</p>
      {/* Phần tử df-messenger */}
      <df-messenger
        ref={dfMessengerRef}
        location="asia-southeast1"
        project-id="spatial-vision-343005"
        agent-id="58957f04-a8db-4dd6-9b74-5e55545de2ca"
        language-code="vi"
        max-query-length="-1"
        expand="true"> {/* Đảm bảo expand="true" có mặt */}
        <df-messenger-chat-bubble
            chat-title="Ticket_Assistant">
        </df-messenger-chat-bubble>
      </df-messenger>

      {/* Styles từ mã của bạn */}
      <style>{`
        df-messenger {
          z-index: 999;
          position: fixed;
          --df-messenger-font-color: #000;
          --df-messenger-font-family: 'Google Sans', Arial, sans-serif;
          --df-messenger-chat-background: #f3f6fc;
          --df-messenger-message-user-background: #d3e3fd;
          --df-messenger-message-bot-background: #fff;
          bottom: 16px;
          right: 16px;
        }
      `}</style>
    </>
  );
}

export default Diaflow;