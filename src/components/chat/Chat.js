// 입력창, 로딩 3점 표시, 채팅 말풍선 컴포넌트 가져오기
import { ChatInput } from "./ChatInput";
import { ChatLoader } from "./ChatLoader";
import { ChatBubble } from "./ChatBubble";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export const Chat = ({ messages, loading, onSendMessage, onRef }) => {
  return (
    <>
      <div className="h-[calc(100%-3rem)] overflow-auto scrollbar-custom ">
        {/* messages 의 내용을 ChatBubble 컴포넌트를 통해 출력 */}
        {messages.map((message, index) => (
          <div key={index} className="my-1 sm:my-1.5">
            <ChatBubble message={message} />
          </div>
        ))}
      

        {/* loading 이 true 면 ChatLoader 를 표시 */}
        {loading && (
          <div className="my-1 sm:my-1.5">
            <ChatLoader />
          </div>
        )}
        <div ref={onRef} />
      </div>
      <div className="h-3rem w-full">
        {/* 채팅 입력창을 표시, 전송 액션을 실행하는 onSend 함수를 넘겨준다 */}
        <ChatInput onSendMessage={onSendMessage} />
      </div>
    </>
  );
};
