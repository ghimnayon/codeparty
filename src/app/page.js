"use client";

import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { Chat } from "@/components/chat/Chat";
import { Schedule } from "@/components/schedule/Schedule";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export default function Home() {
  const router = useRouter();
  const { data: session } = useSession();

  const [count, setCount] = useState(1);
  const [displayCount, setDisplayCount] = useState("인원");

  const increment = () => {
    setCount(count + 1);
  };

  const decrement = () => {
    setCount(count > 1 ? count - 1 : 1);
  };

  const applyCount = () => {
    setDisplayCount(`인원: ${count}명`);
  };

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const handleSend = async (message) => {
    const updatedMessages = [...messages, message];
    setMessages(updatedMessages);
    setLoading(true);

    setLoading(false);
    const result = { role: "model", parts: [{ text: "API 연동 전 임시 응답입니다." }] };
    setMessages((messages) => [...messages, result]);

    return;
  };

  return (
    <div className="w-full h-screen mx-auto flex flex-col bg-white">
      <div className="h-12 bg-blue-500 flex justify-between items-center">
        <div className="flex items-center">
          <img
            src="https://png.pngtree.com/png-clipart/20210610/ourlarge/pngtree-i-like-to-travel-png-image_3431196.jpg"
            alt="Banner Image"
            className="h-8 w-8 rounded-full"
          />
        </div>
        <span className="ml-2">CodeTravel</span>
        <div className="mr-2">
          {session ? (
            <button
              className="bg-blue-500 text-white p-1 rounded"
              onClick={() => signOut()}
            >
              로그아웃
            </button>
          ) : (
            <button
              className="bg-blue-500 text-white p-1 rounded"
              onClick={() => router.push("/login")}
            >
              로그인
            </button>
          )}
        </div>
      </div>
      <div className="bg-white text-2xl font-bold text-black ml-5 mt-5">
        검색 한 번으로 간단하게 일정 짜기
      </div>
      <div className="h-1/4 bg-white p-4">
        <input
          type="text"
          placeholder="어디로 떠나고 싶으세요?"
          className="w-1/5 p-2 mr-2 border rounded text-black"
        />
        <input
          type="date"
          className="w-1/8 p-2 mt-2 mr-2 border rounded text-black"
        />
        <input
          type="date"
          className="w-1/8 p-2 mt-2 mr-2 border rounded text-black"
        />
        <Popover>
          <PopoverTrigger asChild>
            <Button className="ml-2" variant="outline">
              {displayCount}
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="flex items-center justify-center">
              <Button
                onClick={decrement}
                className="bg-red-500 text-white p-2 rounded"
              >
                -
              </Button>
              <span className="mx-4 text-xl">{count}</span>
              <Button
                onClick={increment}
                className="bg-green-500 text-white p-2 rounded"
              >
                +
              </Button>
              <Button onClick={applyCount} className="ml-5">
                적용
              </Button>
            </div>
          </PopoverContent>
        </Popover>
        <Button className="bg-blue-500 text-white ml-2">검색하기</Button>
      </div>
      <div className="bg-white text-2xl font-bold text-black ml-7">
        이런 일정은 어떠세요?
      </div>
      <div className="flex w-8/10 h-3/4 bg-gray-200 p-4 overflow-hidden text-black mt-2 ml-5 mr-5">
        <div className="w-2/3 h-full pr-4 overflow-auto">
          <Schedule />
        </div>
        <div className="w-1/3 h-full flex flex-col bg-gray-300 p-2 overflow-hidden">
          <Chat messages={messages} loading={loading} onSendMessage={handleSend} />
        </div>
      </div>
    </div>
  );
}
