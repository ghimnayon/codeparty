"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { schedule_temp2 } from "@/components/schedule/Schedule";
import { useRouter } from "next/navigation";
import { Schedule } from "@/components/schedule/Schedule"; // Schedule 컴포넌트를 import
import { useSchedule } from "@/components/schedule/ScheduleContext"; // ScheduleContext를 사용하기 위해 import

import { db } from "@/firebase";

const scheduleCollection = collection(db, "todos");


export const UserMenu = () => {

  const [schedules, setSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [title, setTitle] = useState("");
  const { schedule, setSchedule } = useSchedule(); // useSchedule 훅을 사용

  const { data } = useSession();
  const q = query(scheduleCollection, where("userName", "==", data?.user?.name), orderBy('created'));

  // Fetch schedules from Firestore
  useEffect(() => {
    setSchedule(schedule_temp2);
    const fetchSchedules = async () => {
      const querySnapshot = await getDocs(collection(db, "schedules"));
      const fetchedSchedules = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }));
      setSchedules(fetchedSchedules);
    };

    fetchSchedules();

    // Subscribe to real-time updates
    const unsubscribe = onSnapshot(collection(db, "schedules"), (snapshot) => {
      const updatedSchedules = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }));
      setSchedules(updatedSchedules);
    });

    return () => unsubscribe();
  }, []);

  // Handle schedule selection
  const handleSelectSchedule = (item) => {
    setSelectedSchedule(item);
    setSchedule(item.schedule);
  };

  return (
    <div className="flex flex-col">
      <div className="w-full bg-gray-200 text-center"> 내 일정 </div> 
    
      <div className="flex flex-row">
        <input
          className="w-4/5 text-center b-2"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter schedule title"
        />  
        <button className="w-1/5" onClick={handleSave}>Save</button>
      </div>
  
      <ul>
        {schedules.map((scheduleItem) => (
          <li
            key={scheduleItem.id}
            onClick={() => handleSelectSchedule(scheduleItem)}
            style={{ background: selectedSchedule?.id === scheduleItem.id ? 'lightgray' : 'white' }}
          >
            {scheduleItem.title}
          </li>
        ))}
      </ul>
      <button className="w-full bg-green-100" onClick={() => setSchedule(selectedSchedule?.schedule)}>Load</button>
    </div>
  );
};