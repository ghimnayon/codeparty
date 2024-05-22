import { IconArrowUp } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";

export const ChatInput = ({ onSendMessage }) => {
  const [content, setContent] = useState();

  // 입력창의 속성을 참조하기 위한 ref
  const textareaRef = useRef(null);

  // 입력창의 내용이 변경될 때마다 실행되는 함수
  // 입력창의 내용이 변경되면 content 를 입력창의 값으로 변경한다
  const handleChange = (e) => {
    const value = e.target.value;
    setContent(value);
  };

  // 전송 버튼을 눌렀을 때 실행되는 함수
  const handleSend = async () => {
    if (!content) {
      alert("메시지를 입력하세요.");
      return;
    }

    // 입력창의 내용을 onSend 함수를 통해 전달한다
    // 입력창의 내용은 사용자의 메시지이므로 role 을 user 로 설정한다
    onSendMessage({ role: "user", parts: [{ text: content }] });
    // 전달 후 입력창의 내용을 초기화한다
    setContent("");
  };

  // 입력창에서 엔터키를 눌렀을 때 실행되는 함수
  // 엔터키를 누르면 전송 버튼을 누른 것과 동일한 효과를 낸다
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // 입력창의 내용이 변경될 때마다 실행되는 함수
  // 입력창의 내용에 따라 입력창의 높이를 변경한다
  useEffect(() => {
    if (textareaRef && textareaRef.current) {
      textareaRef.current.style.height = "inherit";
      textareaRef.current.style.height = `${textareaRef.current?.scrollHeight}px`;
    }
  }, [content]);

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        className="min-h-[44px] rounded-lg pl-4 pr-12 py-2 w-full focus:outline-none focus:ring-1 focus:ring-neutral-300 border-2 border-neutral-200"
        style={{ resize: "none" }}
        placeholder="메시지를 입력하세요"
        value={content}
        rows={1}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />

      <button onClick={() => handleSend()}>
        <IconArrowUp className="absolute right-2 bottom-3 h-8 w-8 hover:cursor-pointer rounded-full p-1 bg-blue-500 text-white hover:opacity-80" />
      </button>
    </div>
  );
};
