"use client";

import { useEffect, useRef, useState } from "react";
import { Chat } from "@/components/chat/Chat";
import { Schedule } from "@/components/schedule/Schedule";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"


export default function Home() {

  //여행 인원 설정
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
    // message 를 받아 메시지 목록에 추가
    // message 형태 = { role: "user", parts: [{ text: string }] }
    // ChatInput.js 26번째 줄 참고
    const updatedMessages = [...messages, message];
    // console.log(updatedMessages);
    setMessages(updatedMessages);
    setLoading(true); // 메시지 전송 중임을 표시

    // /api/chat 에 메시지 목록을 전송하고 응답을 받음
    setLoading(false);
    const result = { role: "model", parts: [{text: "API 연동 전 임시 응답입니다."}]};
    setMessages((messages) => [...messages, result]);

    return;
  }
  /*
    const response = await fetch("/api/chatgpt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: updatedMessages
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

    // console.log(result);

    // 로딩 상태를 해제하고, 메시지 목록에 응답을 추가
    setLoading(false);
    setMessages((messages) => [...messages, result]);
  };
  */
  return (
    <div className="w-full h-screen mx-auto flex flex-col bg-white">
      <div className="h-12 bg-blue-500 flex justify-between items-center">
        <div className="flex items-center">
            {/* Banner Placeholder */}
            <img src="https://storage.googleapis.com/static.fastcampus.co.kr/prod/uploads/202307/080059-490/red-s-3-web.png" alt="Banner Image" className="h-8 w-8 rounded-full"/>
        </div>
        {/* Username Placeholder */}
        <span className="ml-2">김진중</span>
        {/* Login/Logout Icon Placeholder */}
        <span className="mr-2">🔒</span>
      </div>
      <div className= "bg-white text-2xl font-bold text-black ml-5 mt-5 ">검색 한 번으로 간단하게 일정 짜기
      </div>
      {/* Search Part */}
      <div className="h-1/4 bg-white p-4">
          {/* Search Window Placeholder */}
          <input type="text" placeholder="어디로 떠나고 싶으세요?" className="w-1/5 p-2 mr-2 border rounded text-black"/>
          {/* Date Picker Placeholder */}
          <input type="date" className="w-1/8 p-2 mt-2 mr-2 border rounded text-black"/>
          <input type="date" className="w-1/8 p-2 mt-2 mr-2 border rounded text-black"/>
          {/* Dropdown List Placeholder */}
          {/* <select className="w-1/8 p-2 mt-2 border rounded text-black">
              <option value="option1">1</option>
              <option value="option2">2</option>
          </select> */}
          <Popover>
           <PopoverTrigger asChild>
           <Button className="ml-2" variant="outline">{displayCount}</Button>
           </PopoverTrigger>
           <PopoverContent>
            <div className="flex items-center justify-center">
              <Button onClick={decrement} className="bg-red-500 text-white p-2 rounded">-</Button>
              <span className="mx-4 text-xl">{count}</span>
              <Button onClick={increment} className="bg-green-500 text-white p-2 rounded">+</Button>
              <Button onClick={applyCount} className="ml-5">적용</Button>
            </div>
          </PopoverContent>
          </Popover>
          <Button className="bg-blue-500 text-white ml-2">검색하기</Button>
      </div>
      <div className="bg-white text-2xl font-bold text-black ml-7">이런 일정은 어떠세요?
      </div>
      <div className="flex w-8/10 h-3/4 bg-gray-200 p-4 overflow-hidden text-black mt-2 ml-5 mr-5">
        {/* Schedule Placeholder */}
        <div className="w-2/3 h-full pr-4 overflow-auto">
          <Schedule />
        </div>

        {/* Chat Placeholder */}
        <div className="w-1/3 h-full flex flex-col bg-gray-300 p-2 overflow-hidden">
          {/*
            메인 채팅 컴포넌트
            messages: 메시지 목록
            loading: 메시지 전송 중인지 여부
            onSendMessage: 메시지 전송 함수
          */}
          <Chat
            messages={messages}
            loading={loading}
            onSendMessage={handleSend}
          />
          {/* 메시지 목록의 끝으로 스크롤하기 위해 참조하는 엘리먼트 */}
          {/*  <div ref={messagesEndRef} /> */}
        </div>
      </div>
    </div>
  );
}
