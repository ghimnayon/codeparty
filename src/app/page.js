"use client";

import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import AdvancedSearch from "@/components/advancedSearch/AdvancedSearch";

import { Schedule, schedule_temp, schedule_temp2 } from "@/components/schedule/Schedule";
import { DownloadButton } from "@/components/schedule/scheduleDownload";

import { Chat } from "@/components/chat/Chat";

import { useSchedule, updateSchedule } from "@/components/schedule/ScheduleContext";

import Head from 'next/head';
import SearchBar from '@/components/SearchBar';

import { UserMenu } from "@/app/login/user_menu";

export default function Home() {
  const router = useRouter();
  const { data: session } = useSession();

  const [count, setCount] = useState(1);
  const [displayCount, setDisplayCount] = useState("인원");
  const [advancedSearch, setAdvancedSearch] = useState(false);
  const [advancedSearchOptions, setAdvancedSearchOptions] = useState({});
  const [showUserMenu, setShowUserMenu] = useState(false);

  const { schedule, setSchedule } = useSchedule();

  const increment = () => {
    setCount(count + 1);
  };

  const decrement = () => {
    setCount(count > 1 ? count - 1 : 1);
  };

  const applyCount = () => {
    setDisplayCount(`인원: ${count}명`);
  };

  const toggleAdvancedSearch = () => {
    setAdvancedSearch(!advancedSearch);
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  // 메시지 목록을 끝으로 스크롤
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async (message) => {
    const updatedMessages = [...messages, message];
    setMessages(updatedMessages);
    setLoading(true);
    const response = await fetch("/api/gemini", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // 메시지 목록의 첫번째를 제외하고 전송
        // Gemini AI는 첫번째 메시지를 항상 user로 보내야 함
        messages: updatedMessages.slice(1),
      }),
    });

    if (!response.ok) {
      setLoading(false);
      throw new Error(response.statusText);
    }

    // 응답을 JSON 형태로 변환
    // 비동기 API 를 사용하여 응답을 받기 때문에 await 사용
    const result = await response.json();

    if (!result) {
      return;
    }

    // 로딩 상태를 해제하고, 메시지 목록에 응답을 추가
    setLoading(false);
    setMessages((messages) => [...messages, result]);

    setLoading(false);
    setMessages((messages) => [...messages, result]);
    setSchedule(schedule_temp2);

    return;
  };

  const handleReset = () => {
    setMessages([
      {
        role: "model",
        parts: [{ text: "안녕하세요? 여행전문가 트래블코드입니다. 어떤 여행을 원하세요?" }],
      },
    ]);
  };

  // 메시지 목록이 업데이트 될 때마다 맨 아래로 스크롤
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 컴포넌트가 처음 렌더링 될 때 메시지 목록을 초기화
  useEffect(() => {
    handleReset();
  }, []);

  return (
    <div className="w-full h-screen mx-auto flex flex-col bg-white">
      <div className="bg-white relative mt-2 flex justify-end mr-2 items-center">
        {session && (
          <>
            <button
              className="bg-gray-500 text-white p-1 rounded mr-2"
              onClick={toggleUserMenu}
            >
              {session.user.name}
            </button>
            {showUserMenu && (
              <div className="absolute top-full right-0 w-1/3 bg-white shadow-lg p-4 z-10">
                <UserMenu />
              </div>
            )}
          </>
        )}
        {session ? (
          <button
            className="bg-gray-500 text-white p-1 rounded"
            onClick={() => signOut()}
          >
            로그아웃
          </button>
        ) : (
          <button
            className="bg-gray-500 text-white p-1 rounded"
            onClick={() => router.push("/login")}
          >
            로그인
          </button>
        )}
      </div>
      <Head>
        <title>Travel Search</title>
        <meta name="description" content="Search for your next travel destination" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col items-center w-full">
        <h1 className="text-4xl font-bold mb-8 mt-4">여행 계획 세우기</h1>
        <div className="w-full flex justify-center">
          <SearchBar className="w-3/5" />
        </div>
      </main>
      <div className="bg-white p-4 relative mt-1 flex justify-center">
        <Button onClick={toggleAdvancedSearch} className="bg-gray-500 text-white ml-2">고급 검색</Button>
        {advancedSearch && (
          <div className="absolute top-full left-0 w-full bg-white shadow-lg p-4 z-10">
            <AdvancedSearch setAdvancedSearchOptions={setAdvancedSearchOptions} />
          </div>
        )}
      </div>
      <div className="bg-white text-2xl font-bold text-black ml-7 mt-8">
        이런 일정은 어떠세요?
        <DownloadButton text="저장" filename="MySchedule.csv" />
      </div>
      <div className="flex w-4/5 bg-gray-200 p-4 overflow-hidden text-black mt-2 mx-auto">
        <div className="w-3/5 h-96 pr-4 overflow-auto">
          <Schedule />
        </div>
        <div className="w-2/5 h-96 flex flex-col bg-gray-300 p-2 overflow-hidden">
          <Chat messages={messages} loading={loading} onSendMessage={handleSend} />
        </div>
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
