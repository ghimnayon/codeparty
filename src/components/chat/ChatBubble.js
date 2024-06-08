export const ChatBubble = ({ message }) => {
  return (
    <div
      className={`flex flex-col ${
        /* message.role 이 model 인 경우 좌측 정렬, 그 외에는 우측 정렬 */
        message.role === "model" ? "items-start" : "items-end"
      }`}
    >
      <div
        className={`flex items-center font-Pretendard ${
          message.role === "model"
            ? "bg-neutral-100 text-neutral-900 font-light"
            : "bg-blue-500 text-white font-light"
        } rounded-2xl px-4 py-3 max-w-[80%] whitespace-pre-wrap`}
        style={{ overflowWrap: "anywhere" }}
      >
        {message.parts[0].text}
      </div>
    </div>
  );
};
