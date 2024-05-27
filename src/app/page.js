"use client";

import { useEffect, useRef, useState } from "react";
import { Chat } from "@/chat/Chat";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

function createTableHeaders(scheduleData) {
  if (scheduleData.schedule){
    const headerList = Object.keys(scheduleData.schedule[0]);
    const headerTable = headerList.map((header, index) => (
      <th key={index}>{header}</th>
    ));
    return headerTable;
  }
  else return "";
}

function createDayRows(day) {
  const headerList = Object.keys(day);
  return headerList.map((header, index) => 
    <td key={index} className="border px-4 py-2 text-black">{day[header]}</td>
  );
}

function createTableRows(scheduleData) {
  if (scheduleData.schedule){
    return scheduleData.schedule.map((day, index) => (
      <tr key={index}>
        {createDayRows(day)}
      </tr>
    ));
  }
  else return "";
};

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
  
  const schedule_temp = {
  schedule: [
    {
      "date": "1일차",
      "time": "오전 9시",
      "dest": "해운대 해수욕장",
      //"content": "해운대 해수욕장에서 모래사장에서 여유로운 시간을 보내며 해수욕을 즐기세요.",
      "addr": "부산광역시 해운대구 해운대해수욕장로 25",
      "cost": "무료",
      "duration": "2시간"
    },
    {
      "date": "1일차",
      "time": "오전 11시",
      "dest": "해운대 시장",
      //"content": "해운대 시장에서 다양한 해산물과 부산 음식을 맛보세요.",
      "addr": "부산광역시 해운대구 해운대동 14-1",
      "cost": "저녁 식사 비용 1인당 2만원",
      "duration": "1시간 30분"
    },
    {
      "date": "1일차",
      "time": "오후 1시",
      "dest": "태종대",
      //"content": "태종대에서 아름다운 절경을 감상하고 등대를 방문하세요.",
      "addr": "부산광역시 영도구 태종대길 31",
      "cost": "입장료 1인당 1,200원",
      "duration": "2시간 30분"
    },
    {
      "date": "1일차",
      "time": "오후 4시",
      "dest": "국제시장",
      //"content": "국제시장에서 쇼핑과 먹거리를 즐기세요.",
      "addr": "부산광역시 중구 중앙동 4-1",
      "cost": "쇼핑 비용 1인당 1만원",
      "duration": "2시간"
    },
    {
      "date": "1일차",
      "time": "오후 6시",
      "dest": "감천문화마을",
      //"content": "감천문화마을에서 예쁜 골목길과 벽화를 감상하세요.",
      "addr": "부산광역시 서구 감천동 동백길 10",
      "cost": "무료",
      "duration": "1시간 30분"
    },
    {
      "date": "1일차",
      "time": "오후 7시 30분",
      "dest": "Jagalchi Market 야시장",
      //"content": "자갈치 시장 야시장에서 신선한 해산물을 저렴하게 맛보세요.",
      "addr": "부산광역시 중구 중앙동 2-1",
      "cost": "저녁 식사 비용 1인당 2만원",
      "duration": "1시간"
    }
  ]
};
  // console.log(createTableRows(schedule_temp));

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
          <div class="container mx-auto">
            <div class="bg-white shadow-md rounded-lg p-4 mb-4 cursor-pointer" onclick="toggleSchedule('day1')">
              <div class="flex justify-between items-center">
                <div>
                    <h2 class="text-xl font-semibold">Day 1: 2024-05-01</h2>
                    <p>Main Destination: Destination A</p>
                </div>
                <div>
                    <p>Destinations: 3</p>
                    <p>Total Cost: $150</p>
                </div>
              </div>
              <div id="day1" class="mt-4">
                <div class="mb-4">
                  <p><strong>Time:</strong> 09:00 AM</p>
                  <p><strong>Destination:</strong> Destination A <span class="hover-address" data-address="123 Main St, City">📍</span></p>
                  <p><strong>Content:</strong> Visit to museum</p>
                  <p><strong>Cost:</strong> $50</p>
                  <p><strong>Duration:</strong> 2 hours</p>
                  <div class="h-16 bg-gray-300 mt-2" onclick="openImage('image1')">Image Placeholder</div>
                </div>
                <div class="mb-4">
                  <p><strong>Time:</strong> 12:00 PM</p>
                  <p><strong>Destination:</strong> Destination B <span class="hover-address" data-address="456 Elm St, City">📍</span></p>
                  <p><strong>Content:</strong> Lunch at local restaurant</p>
                  <p><strong>Cost:</strong> $30</p>
                  <p><strong>Duration:</strong> 1 hour</p>
                  <div class="h-16 bg-gray-300 mt-2" onclick="openImage('image2')">Image Placeholder</div>
                </div>
                <div class="mb-4">
                  <p><strong>Time:</strong> 02:00 PM</p>
                  <p><strong>Destination:</strong> Destination C <span class="hover-address" data-address="789 Pine St, City">📍</span></p>
                  <p><strong>Content:</strong> Afternoon hike</p>
                  <p><strong>Cost:</strong> $70</p>
                  <p><strong>Duration:</strong> 3 hours</p>
                  <div class="h-16 bg-gray-300 mt-2" onclick="openImage('image3')">Image Placeholder</div>
                </div>
              </div>
            </div>
          </div>

        {/* Table Placeholder (populate with your schedule data) */}
          <div className="w-3/4 pr-4 overflow-auto">
            <table className="table-auto">
              <div id="imageModal" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center hidden">
                <div class="relative">
                  <button onclick="closeImage()" class="absolute top-0 right-0 m-4 text-white text-2xl">×</button>
                  <img id="modalImage" src="" alt="Large view" class="max-w-full max-h-full"/>
                </div>
              </div>
            </table>
          </div>

          <table className="table-auto invisible">
              <thead>
                <tr className="bg-gray-200">
                  {createTableHeaders(schedule_temp)}
                </tr>
              </thead>
              <tbody>
                {createTableRows(schedule_temp)}
              </tbody>
          </table>
        </div>

        {/* Chat Placeholder */}
        <div className="w-1/4 bg-gray-300 p-4">
          <div className="flex-1 sm:px-10 pb-4 sm:pb-10">
            <div className="mx-auto mt-4 sm:mt-12">
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
      </div>
    </div>
  );
}
