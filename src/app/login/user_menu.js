import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useSchedule } from "@/components/schedule/ScheduleContext";
import { splitSchedule, summarizeSchedule } from "@/components/schedule/ScheduleParser";
import { db } from "@/firebase";
import { collection, query, getDocs, addDoc, deleteDoc, doc, orderBy, where, onSnapshot } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { FaListUl } from "react-icons/fa"; // 리스트 아이콘을 가져오기 위해 추가

const scheduleCollection = collection(db, "schedules");

const formatScheduleDetails = (schedule) => {

  const split_data = splitSchedule(schedule);
  var daySummaries = [];

  for (var dayno in split_data) {
    var summary = summarizeSchedule(split_data[dayno]);
    summary["dayno"] = dayno;
    daySummaries.push(summary);
  }

  const formattedSummaries = daySummaries.map((summary, index) => (
    <div key={summary["date"]} className="flex flex-row mb-4 p-4 rounded-lg shadow-lg bg-blue-100 font-pretendard">
      <div className="flex flex-col w-2/3 ml-2 mt-2">
        <h2 className="text-2xl font-bold mb-4 text-blue-500 font-titan">Day {summary["dayno"]}</h2>
        <div className="text-black mb-2">
          <span className="font-semibold">주요 목적지:</span> {summary["mainDest"]}
        </div>
      </div>
      <div>
        <br></br>
        <div className="text-black mb-0 text-m">방문할 장소 📌 {summary["destCount"]}곳</div>
        <div className="text-black mb-4 text-m">총 여행비용 💳 {summary["totalCost"]}만원</div>
      </div>
    </div>
  ));

  return formattedSummaries;


  const days = schedule.reduce((acc, item) => {
    const { date, dest, time, duration, cost, content } = item;
    if (!acc[date]) acc[date] = [];
    acc[date].push({ dest, time, duration, cost, content });
    return acc;
  }, {});

  const formattedDetails = Object.entries(days).map(([date, items], index) => {
    const totalCost = items.reduce((sum, { cost }) => sum + parseInt(cost.replace("만원", "")), 0);
    return (
      <div key={date} className="mb-6 p-6 rounded-lg shadow-lg bg-blue-100 font-pretendard">
        <h2 className="text-2xl font-bold mb-4 text-blue-500 font-titan">Day {index + 1} {date}</h2>
        <div className="text-black mb-2">
          <span className="font-semibold">주요 목적지:</span> {items[0].dest}
        </div>
        <div className="text-black mb-0 text-m">방문할 장소 📌 {items.length}곳</div>
        <div className="text-black mb-4 text-m">총 여행비용 💳 {totalCost}만원</div>
        {items.map((item, idx) => (
          <div key={idx} className="mt-4 bg-gray-100 opacity-50% rounded-full shadow-lg">
            <div className="flex flex-wrap p-6">
              <span className="mr-6 text-black">🕒 {item.time}</span>
              <span className="mr-6 text-black">📌 {item.dest}🔗</span>
              <span className="mr-6 text-black">⌛ {item.duration}</span>
              <span className="mr-6 text-black">💳 {item.cost}</span>
              <span className="text-black">🎫 {item.content}</span>
            </div>
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
  const { schedule, setSchedule } = useSchedule();
  const [isTitleModalOpen, setIsTitleModalOpen] = useState(false);

  const { data: session, status } = useSession();

  useEffect(() => {
    // console.log("UserMenu - session:", session); // 로그 추가
    if (status === "authenticated" && session?.user?.name) {
      const q = query(
        collection(db, "schedules"),
        where("userName", "==", session.user.name),
        orderBy("created", "desc")
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
  }, [status, session]);

  const handleSelectSchedule = (item) => {
    if (selectedSchedule?.id === item.id) {
      setSelectedSchedule(null);
    } else {
      setSelectedSchedule(item);
    }
  };

  const handleSave = async () => {
    if (status !== "authenticated" || !session?.user?.name) {
      alert("로그인이 필요합니다.");
      return;
    }
    if (!title.trim()) {
      alert("Title is required");
      return;
    }

    try {
      const newSchedule = {
        userName: session.user.name,
        title,
        created: new Date(),
        schedule
      };

      await addDoc(scheduleCollection, newSchedule);
      setTitle(""); // Clear the input after saving
      setIsTitleModalOpen(false); // Close the title input modal
    } catch (error) {
      console.error("Error saving schedule: ", error);
    }
  };

  const handleDelete = async (scheduleId) => {
    if (confirm("정말로 이 일정을 삭제하시겠습니까?")) {
      try {
        await deleteDoc(doc(db, "schedules", scheduleId));
        setSchedules(schedules.filter(schedule => schedule.id !== scheduleId));
        if (selectedSchedule?.id === scheduleId) {
          setSelectedSchedule(null);
        }
      } catch (error) {
        console.error("Error deleting schedule: ", error);
      }
    }
  };

  return (
    <div className="flex flex-col w-55 font-Pretendard">
      <div className="mt-0">
        <Button className="w-full bg-blue-500 text-white p-2 rounded-full font-Pretendard" onClick={() => setIsTitleModalOpen(true)}>
          일정 저장하기
        </Button>
      </div>
      <div className="flex items-center justify-center w-full rounded-full text-center mt-2 font-medium text-sm text-black bg-gray-200" style={{height:'30px'}}>
        <FaListUl className="inline-block text-xs mr-2 text-black font-Pretendard" /> {/* 아이콘 크기 작게 및 우측에 텍스트 추가 */}
          내 일정
      </div>
      <ul className="mt-2 relative">
        {schedules.map((scheduleItem) => (
          <li key={scheduleItem.id} className="relative">
            <div
              className={`flex justify-between cursor-pointer mb-2 p-2 text-center font-semibold font-Pretendard border rounded-full ${
                selectedSchedule?.id === scheduleItem.id ? "bg-green-500 text-white" : "bg-white text-black"
              } hover:bg-green-500 hover:text-white`}
              onClick={() => handleSelectSchedule(scheduleItem)}
            >
              <div className="flex text-center items-center ml-4">
                {scheduleItem.title}
              </div>
              <Button
              className="bg-red-500 rounded-full"
              onClick={() => handleDelete(scheduleItem.id)}
              >
                🗑
              </Button>
            </div>
            
            {selectedSchedule?.id === scheduleItem.id && (
              <div className="absolute top-[-45px] right-full mr-8 ml-2 p-4 bg-white shadow-lg z-10" style={{ width:'600px', padding: '10px', maxHeight: '420px', overflowY: 'auto'}}> {/* 팝오버 창 위치 수정 */}
                {/* <h2>{scheduleItem.title}</h2> */}
                <div>{formatScheduleDetails(scheduleItem.schedule)}</div>
                <div className="flex justify-center p-4"> {/* 버튼을 오른쪽 끝으로 정렬 */}
                  <Button
                    className="flex justify-center bg-red-500 text-white p-2 rounded mr-6"
                    onClick={() => handleDelete(scheduleItem.id)}
                  >
                    일정 삭제
                  </Button>
                  <Button
                    className="flex justify-center bg-green-500 text-white p-2 rounded ml-6"
                    onClick={() => setSchedule(selectedSchedule?.schedule)}
                  >
                    불러오기
                  </Button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
      {isTitleModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 font-Pretendard">
          <div className="bg-white p-4 rounded shadow-lg mr-5 ml-5">
            <h2 className="mb-4 font-semibold text-m font-Pretendard">일정 제목 입력</h2>
            <input
              className="border rounded p-2 w-full font-Pretendard"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력하세요"
            />
            <div className="flex justify-end mt-4">
            <Button variant="destructive" className="mr-2 font-Pretendard" onClick={() => setIsTitleModalOpen(false)}>
                취소
              </Button>
              <Button onClick={handleSave} className = 'font-Pretendard hover:bg-green-500'>저장</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
