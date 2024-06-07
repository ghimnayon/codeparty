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
  
    try {
      // const text = '```json\n' +
      // '{"answer": "서울대학교를 중심으로 2일 동안 4명이 함께 할 수 있는 일정입니다! 젊음이 넘치는 대학로에서 연극도 보고, 맛집도 즐겨보세요. 서울대학교의 아름다운 캠퍼스도 거닐고, 근처 낙산공원에서 서울의 야경도 감상하는 것을 추천합니다. ", "schedule": [{"date": "06-05", "time": "11:00", "dest": "서울대학교", "content": "서울대학교 캠퍼스 탐방", "cost": "0만원", "duration": "120분"}, {"date": "06-05", "time": "13:00", "dest": "샤로수길", "content": "점심 식사, 샤로수길 맛집 탐방", "cost": "2만원", "duration": "60분"}, {"date": "06-05", "time": "15:00", "dest": "낙산공원", "content": "낙산공원 산책 및 서울 풍경 감상", "cost": "0만원", "duration": "90분"}, {"date": "06-05", "time": "17:00", "dest": "대학로 연극", "content": "대학로에서 연극 관람", "cost": "2만원", "duration": "120분"}, {"date": "06-05", "time": "19:00", "dest": "대학로", "content": "저녁 식사, 대학로 맛집 탐방", "cost": "2만원", "duration": "60분"}, {"date": "06-06", "time": "11:00", "dest": "서울대학교 미술관", "content": "서울대학교 미술관 관람", "cost": "0만원", "duration": "60분"}, {"date": "06-06", "time": "13:00", "dest": "샤로수길", "content": "점심 식사, 샤로수길 맛집 탐방", "cost": "2만원", "duration": "60 분"}]}\n' + '```'
      const resultJson = JSON.parse(result.parts[0].text.replace('```json', '').replace('```', '').replace('\\n', ''));
      // const resultJson = JSON.parse(text.replace('```json', '').replace('```', '').replace('\\n', ''));
      const answer = {role: "model", parts: [{text: resultJson["answer"]}]};
      // console.log(resultJson["schedule"]);
      if (resultJson["schedule"].length > 0) { setSchedule(resultJson["schedule"]);}
      setLoading(false);
      setMessages((messages) => [...messages, answer]);
    }
    catch (SyntaxError) {
      const answer = result;
      setLoading(false);
      setMessages((messages) => [...messages, answer]);
    }
    // 로딩 상태를 해제하고, 메시지 목록에 응답을 추가

    return;
  };

  function handleSearch (prompt) {
    handleReset();
    const message = {
        role: "user",
        parts: [{ text: prompt}]
    };

    handleSend(message);
  }

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
    <div className="w-full h-screen mx-auto flex flex-col bg-image-1">
      <div className="relative mt-2 flex justify-end mr-2">
        <Popover>
          <PopoverTrigger asChild>
          <Button style={{ height: '50px' }} className="flex items-center opacity-50 bg-gray-200 border p-1 rounded-full"
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
            <div className="mr-4">
              {session?(session.user.name):"로그인"}
            </div>
          </Button>

          </PopoverTrigger>
          {showUserMenu && (
            <PopoverContent align="end" className="w-60 bg-white p-2 shadow-lg">
              <Button className="w-full bg-gray-500 text-white p-2 rounded" onClick={() => signOut()}>
                    로그아웃
              </Button>
              <div className="mt-2">
                <UserMenu />
              </div>
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
        <h1 className="text-4xl font-bold mb-8 mt-4 text-white">여행 계획 세우기</h1>
        <div className="w-full flex justify-center">
          <SearchBar onSearch={handleSearch} className="w-3/5" />
        </div>
      </main>
      <div className="p-4 relative mt-1 flex justify-center">
      </div>
      <div className="flex w-4/5 justify-center text-2xl font-bold text-black ml-7 mt-8">
        <div className="text-white w-4/5">
          이런 일정은 어떠세요?
        </div>
        <div className="flex flex-row w-1/5">
          <DownloadButton text="엑셀 다운로드" filename="MySchedule.csv" />
        </div>
      </div>
      <div className="flex w-4/5 p-4 overflow-auto text-black mt-2 mx-auto">
        <div className="w-3/5 h-96 pr-4 overflow-auto">
          <Schedule />
        </div>
        <div className="w-2/5 h-96 flex flex-col p-2 overflow-auto">
          <Chat messages={messages} loading={loading} onSendMessage={handleSend} />
        </div>
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}