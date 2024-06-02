"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Schedule } from "@/components/schedule/Schedule"; // Schedule 컴포넌트를 import
import { useSchedule } from "@/components/schedule/ScheduleContext"; // ScheduleContext를 사용하기 위해 import

export function UserMenu() {
  const [schedules, setSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const router = useRouter();
  const { schedule, setSchedule } = useSchedule(); // useSchedule 훅을 사용

  useEffect(() => {
    // 로그인한 사용자의 스케줄 데이터를 가져오는 로직을 추가
    // 예: fetch("/api/schedules").then((res) => res.json()).then((data) => setSchedules(data));
    const fetchSchedules = async () => {
      try {
        const response = await fetch("/api/schedules"); // 이 엔드포인트는 예시입니다.
        const data = await response.json();
        setSchedules(data);
      } catch (error) {
        console.error("Failed to fetch schedules:", error);
      }
    };

    fetchSchedules();
  }, []);

  const handleScheduleClick = (schedule) => {
    setSelectedSchedule(schedule);
    setSchedule(schedule); // 선택한 스케줄을 ScheduleContext에 설정
  };

  const handleCloseDetails = () => {
    setSelectedSchedule(null);
  };

  return (
    <div className="w-full h-full p-4">
      {selectedSchedule ? (
        <div className="p-4 bg-white shadow-lg rounded">
          <h2 className="text-xl font-bold mb-4">{selectedSchedule.title}</h2>
          <p>{selectedSchedule.description}</p>
          {/* 추가적인 스케줄 상세 정보를 표시 */}
          <button
            className="mt-4 p-2 bg-gray-500 text-white rounded"
            onClick={handleCloseDetails}
          >
            닫기
          </button>
          <div className="mt-4">
            <Schedule />
          </div>
        </div>
      ) : (
        <div className="p-4 bg-white shadow-lg rounded">
          <h2 className="text-xl font-bold mb-4">일정</h2>
          <ul className="space-y-2">
            {schedules.map((schedule) => (
              <li key={schedule.id}>
                <button
                  className="w-full p-2 bg-gray-200 hover:bg-gray-300 rounded"
                  onClick={() => handleScheduleClick(schedule)}
                >
                  {schedule.title}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
