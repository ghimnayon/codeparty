"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useSchedule } from "@/components/schedule/ScheduleContext";
import { db } from "@/firebase";
import { collection, query, getDocs, addDoc, orderBy, where, onSnapshot } from "firebase/firestore";
import { Button } from "@/components/ui/button";

const scheduleCollection = collection(db, "todos");

const formatScheduleDetails = (schedule) => {
  const days = schedule.reduce((acc, item) => {
    const { date, dest, time, duration, cost, content } = item;
    if (!acc[date]) acc[date] = [];
    acc[date].push({ dest, time, duration, cost, content });
    return acc;
  }, {});

  const formattedDetails = Object.entries(days).map(([date, items], index) => {
    const totalCost = items.reduce((sum, { cost }) => sum + parseInt(cost.replace("만원", "")), 0);
    return (
      <div key={date} className="mb-4">
        <h2 className="text-lg font-bold mb-2">{index + 1}일차 여행: {date}</h2>
        <div>주요 목적지: {items[0].dest}</div>
        <div>방문할 장소 📌 {items.length}곳</div>
        <div>총 여행비용 💳 {totalCost}만원</div>
        {items.map((item, idx) => (
          <div key={idx} className="mt-2">
            <div>🕒 {item.time}</div>
            <div>📌 {item.dest}🔗</div>
            <div>⌛ {item.duration}</div>
            <div>💳 {item.cost}</div>
            <div>🎫 {item.content}</div>
          </div>
        ))}
      </div>
    );
  });

  return formattedDetails;
};

export const UserMenu = () => {
  const [schedules, setSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [title, setTitle] = useState("");
  const { schedule } = useSchedule();
  const [isTitleModalOpen, setIsTitleModalOpen] = useState(false);

  const { data, status } = useSession();

  useEffect(() => {
    if (status === "authenticated" && data?.user?.name) {
      const q = query(
        collection(db, "schedules"),
        where("userName", "==", data.user.name),
        orderBy("created")
      );

      const fetchSchedules = async () => {
        try {
          const querySnapshot = await getDocs(q);
          const fetchedSchedules = querySnapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id
          }));
          setSchedules(fetchedSchedules);
        } catch (error) {
          console.error("Error fetching schedules: ", error);
        }
      };

      fetchSchedules();

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const updatedSchedules = snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        }));
        setSchedules(updatedSchedules);
      });

      return () => unsubscribe();
    }
  }, [status, data]);

  const handleSelectSchedule = (item) => {
    if (selectedSchedule?.id === item.id) {
      setSelectedSchedule(null);
    } else {
      setSelectedSchedule(item);
    }
  };

  const handleSave = async () => {
    if (!data?.user?.name) {
      alert("로그인이 필요합니다.");
      return;
    }
    if (!title.trim()) {
      alert("Title is required");
      return;
    }

    try {
      const newSchedule = {
        userName: data.user.name,
        title,
        created: new Date(),
        schedule
      };

      await addDoc(collection(db, "schedules"), newSchedule);
      setTitle(""); // Clear the input after saving
      setIsTitleModalOpen(false); // Close the title input modal
    } catch (error) {
      console.error("Error saving schedule: ", error);
    }
  };

  return (
    <div className="flex flex-col w-55 font-pretendard">
      <div className="mt-2">
        <Button className="w-full bg-blue-500 text-white p-2 rounded-full" onClick={() => setIsTitleModalOpen(true)}>
          일정 저장하기
        </Button>
      </div>
      <div className="w-full bg-gray-200 rounded-full text-center mt-6 font-light">내 일정</div>
      <ul className="mt-4 relative">
        {schedules.map((scheduleItem) => (
          <li key={scheduleItem.id} className="relative">
            <div
              className={`cursor-pointer p-2 text-center font-semibold border rounded-full ${
                selectedSchedule?.id === scheduleItem.id ? "bg-green-500 text-white" : "bg-white text-black"
              } hover:bg-green-500 hover:text-white`}
              onClick={() => handleSelectSchedule(scheduleItem)}
            >
              {scheduleItem.title}
            </div>
            {selectedSchedule?.id === scheduleItem.id && (
              <div className="absolute top-full left-0 mt-2 p-4 bg-white shadow-lg w-full z-10">
                <h2>{scheduleItem.title}</h2>
                <div>{formatScheduleDetails(scheduleItem.schedule)}</div>
              </div>
            )}
          </li>
        ))}
      </ul>
      {isTitleModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 font-pretendard">
          <div className="bg-white p-4 rounded shadow-lg">
            <h2 className="mb-4 font-semibold">일정 제목 입력</h2>
            <input
              className="border p-2 w-full"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="일정의 제목을 입력하세요"
            />
            <div className="flex justify-end mt-4">
              <Button className="mr-2" onClick={() => setIsTitleModalOpen(false)}>
                취소
              </Button>
              <Button onClick={handleSave}>저장</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
