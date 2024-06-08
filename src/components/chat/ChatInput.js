import { IconArrowUp } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";

export const ChatInput = ({ onSendMessage }) => {
  const [content, setContent] = useState("");
  const textareaRef = useRef(null);

  const handleChange = (e) => {
    setContent(e.target.value);
  };

  const handleSend = async () => {
    if (!content.trim()) {
      alert("메시지를 입력하세요.");
      return;
    }
    onSendMessage({ role: "user", parts: [{ text: content }] });
    setContent("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "inherit";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [content]);

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        className="min-h-[44px] rounded-full pl-4 pr-10 py-2 w-full focus:outline-none focus:ring-1 focus:ring-neutral-300 border-2 border-neutral-200 font-light"
        style={{ resize: "none" }}
        placeholder="메시지를 입력하세요"
        value={content}
        rows={1}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      <button onClick={handleSend} className="absolute right-2 bottom-3.5 p-1 bg-blue-500 text-white rounded-full hover:opacity-80">
        <IconArrowUp className="h-5 w-5" strokeWidth={3} />
      </button>
    </div>
  );
};
