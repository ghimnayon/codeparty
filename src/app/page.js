"use client";

import { useRouter } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useEffect, useRef, useCallback } from "react";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import AdvancedSearch from "@/components/advancedSearch/AdvancedSearch";

import { Schedule, schedule_temp2 } from "@/components/schedule/Schedule";
import { DownloadButton } from "@/components/schedule/scheduleDownload";

import { Chat } from "@/components/chat/Chat";

import { useSchedule } from "@/components/schedule/ScheduleContext";

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

  const applyCount = () => {
    setDisplayCount(`인원: ${count}명`);
  };

  const toggleAdvancedSearch = () => {
    setAdvancedSearch(!advancedSearch);
  };

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const togglePopover = useCallback(() => {
    setIsPopoverOpen(prevState => !prevState);
  }, []);


const closePopover = useCallback(() => {
  setIsPopoverOpen(false);
}, []);

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

    // Popover 상태 변화에 따른 사이드 이펙트
useEffect(() => {
  if (!isPopoverOpen) {
    setIsPopoverOpen(false);
  }
}, [isPopoverOpen]);

  return (
    <div className="w-full h-screen mx-auto flex flex-col bg-white">
      <div className="bg-white relative mt-2 flex justify-end mr-2">
        <Popover>
          <PopoverTrigger asChild>
          <Button style={{ width: '85px', height: '50px' }} className="flex items-center bg-gray-200 border p-1 rounded-full"
          onClick = {() => {
            if (session) {
              toggleUserMenu();
            } else {
              signIn("kakao");
            }
          }}>
            
            <div className="flex flex-col justify-center items-center mr-1 ml-3">
              <div style={{ width: '15px', height: '1.5px', backgroundColor: 'gray', marginBottom: '3px' }}></div>
              <div style={{ width: '15px', height: '1.5px', backgroundColor: 'gray', marginBottom: '3px' }}></div>
              <div style={{ width: '15px', height: '1.5px', backgroundColor: 'gray' }}></div>
            </div>
            <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center">
               <img src="/profileicon.png" alt="User Icon" style={{ width: '100%', height: '100%' }} />
            </div>
          </Button>

          </PopoverTrigger>
          {isPopoverOpen && (
            <PopoverContent align="end" className="w-48 bg-white p-2 shadow-lg">
              {!session ? (
                <Button className="w-full bg-gray-500 text-white p-2 rounded" onClick={() => router.push("/login")}>
                  로그인
                </Button>
              ) : (
                <>
                  <Button className="w-full bg-gray-500 text-white p-2 rounded mb-2" onClick={toggleUserMenu}>
                    {session.user.name}
                  </Button>
                  <Button className="w-full bg-gray-500 text-white p-2 rounded" onClick={() => signOut()}>
                    로그아웃
                  </Button>
                  {showUserMenu && (
                    <div className="mt-2">
                      <UserMenu />
                    </div>
                  )}
                </>
              )}
            </PopoverContent>
          )}
        </Popover>
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
        <Popover>
          <PopoverTrigger asChild>
            <Button className="bg-gray-500 text-white ml-2" onClick={() => setIsPopoverOpen(true)}>고급 검색</Button>
          </PopoverTrigger>
          {isPopoverOpen && (
            <PopoverContent align="center" style={{ width: '380px', padding: '20px', maxHeight: '420px', overflowY: 'auto' }}>
              <AdvancedSearch setAdvancedSearchOptions={setAdvancedSearchOptions} onClose={closePopover} />
            </PopoverContent>
          )}
        </Popover>
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
