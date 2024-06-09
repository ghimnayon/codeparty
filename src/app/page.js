"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState, useEffect, useRef, useCallback } from "react";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import AdvancedSearch from "@/components/advancedSearch/AdvancedSearch";

import { Schedule } from "@/components/schedule/Schedule";
import { DownloadButton } from "@/components/schedule/scheduleDownload";

import { Chat } from "@/components/chat/Chat";

import { useSchedule } from "@/components/schedule/ScheduleContext";

import Head from 'next/head';
import SearchBar from '@/components/SearchBar';

import UserPopover from '@/components/UserPopover';

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();

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
      const responseText = result.parts[0].text;
      const scheduleIndex = responseText.indexOf('{"schedule"');
      const lastBracketIndex = responseText.lastIndexOf('}');
      const scheduleText = responseText.substring(scheduleIndex, lastBracketIndex + 1);
      const answerText = responseText.substring(0, scheduleIndex).replace("```json", "");

      const answer = { role: "model", parts: [{ text: answerText }] };
      const scheduleJson = JSON.parse(scheduleText);

      if (scheduleJson["schedule"].length > 0) {
        setSchedule(scheduleJson["schedule"]);
      }

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

  function handleSearch(prompt) {
    handleReset();
    const message = {
      role: "user",
      parts: [{ text: prompt }]
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
    <div className="w-full h-screen mx-auto flex flex-col bg-white">
      <UserPopover
        session={session}
        toggleUserMenu={toggleUserMenu}
        showUserMenu={showUserMenu}
      />
      <Head>
        <title>Travel Search</title>
        <meta name="description" content="Search for your next travel destination" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col items-center w-full">
        <h1 className="p-4 mb-8 mt-4 text-5xl font-titan text-blue-500 !important">
          CodeTravel
        </h1>
        <div className="w-full flex justify-center">
          <SearchBar onSearch={handleSearch} className="w-3/5" />
        </div>
      </main>
      <div className="p-4 relative mt-1 flex justify-center">
      </div>
      <div className="flex w-3/4 p-4 justify-center text-2xl overflow-auto scrollbar-custom text-black mt-2 mx-auto">
        <div className="text-black w-4/5 text-2xl font-titan text-blue-500">
          Schedule
        </div>
        <div className="flex justify-end flex-row w-1/4">
          <DownloadButton filename="MySchedule.csv" />
        </div>
      </div>
      <div className="flex w-4/5 p-4 overflow-auto scrollbar-custom text-black mt-2 mx-auto">
        <div className="w-3/5 h-96 pr-4 overflow-auto scrollbar-custom">
          <Schedule />
        </div>
        <div className="w-2/5 h-96 flex flex-col p-2 overflow-auto scrollbar-custom">
          <Chat messages={messages} loading={loading} onSendMessage={handleSend} />
        </div>
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
