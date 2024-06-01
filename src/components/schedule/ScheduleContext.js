"use client";

import React, { createContext, useState, useContext } from 'react';

// Create a context for the schedule
const ScheduleContext = createContext();

// Create a provider component
export const ScheduleProvider = ({ children }) => {
  const [schedule, setSchedule] = useState([]);

  return (
    <ScheduleContext.Provider value={{ schedule, setSchedule }}>
      {children}
    </ScheduleContext.Provider>
  );
};

// Custom hook to use the Schedule context
export const useSchedule = () => {
  return useContext(ScheduleContext);
};

export const updateSchedule = async (schedule) => {
  try {
    const response = await fetch("/api/updateSchedule", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(schedule),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error);
    }
  } catch (error) {
    console.log(error.message);
  }

  // 응답을 JSON 형태로 변환
  // 비동기 API 를 사용하여 응답을 받기 때문에 await 사용
  const result = await response.json();

  if (!result) {
    return;
  }
}