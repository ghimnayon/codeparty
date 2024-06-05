import { splitSchedule, summarizeSchedule } from "./ScheduleParser";
import { useSchedule } from "./ScheduleContext";


export const schedule_temp = {
    schedule: [
      {
        "date": "05-01",
        "time": "09:00",
        "dest": "해운대 해수욕장",
        "content": "해운대 해수욕장에서 모래사장에서 여유로운 시간을 보내며 해수욕을 즐기세요.",
        "cost": "0만원",
        "duration": "120분"
      },
      {
        "date": "05-01",
        "time": "11:00",
        "dest": "해운대 시장",
        "content": "해운대 시장에서 다양한 해산물과 부산 음식을 맛보세요.",
        "cost": "2만원",
        "duration": "90분"
      },
      {
        "date": "05-02",
        "time": "13:00",
        "dest": "태종대",
        "content": "태종대에서 아름다운 절경을 감상하고 등대를 방문하세요.",
        "cost": "1만원",
        "duration": "150분"
      },
      {
        "date": "05-02",
        "time": "16:00",
        "dest": "국제시장",
        "content": "국제시장에서 쇼핑과 먹거리를 즐기세요.",
        "cost": "1만원",
        "duration": "120분"
      },
      {
        "date": "05-02",
        "time": "18:00",
        "dest": "감천문화마을",
        "content": "감천문화마을에서 예쁜 골목길과 벽화를 감상하세요.",
        "cost": "0만원",
        "duration": "90분"
      },
      {
        "date": "05-03",
        "time": "19:30",
        "dest": "자갈치 시장 야시장",
        "content": "자갈치 시장 야시장에서 신선한 해산물을 저렴하게 맛보세요.",
        "cost": "2만원",
        "duration": "60분"
      }
    ]
  };
// 🕒💰💳⌚📌🎫⏰⌛🌏


export const schedule_temp2 = [
    {
      "date": "06-01",
      "time": "09:00",
      "dest": "경포대",
      "content": "경포대 해수욕장에서 모래사장에서 여유로운 시간을 보내며 해수욕을 즐기세요.",
      "cost": "0만원",
      "duration": "120분"
    },
    {
      "date": "06-01",
      "time": "11:00",
      "dest": "경포대 시장",
      "content": "경포대 시장에서 다양한 해산물과 부산 음식을 맛보세요.",
      "cost": "2만원",
      "duration": "90분"
    },
    {
      "date": "06-02",
      "time": "13:00",
      "dest": "정동진",
      "content": "정동진에서 아름다운 절경을 감상하고 등대를 방문하세요.",
      "cost": "1만원",
      "duration": "150분"
    },
    {
      "date": "06-02",
      "time": "16:00",
      "dest": "강릉시장",
      "content": "강릉시장에서 쇼핑과 먹거리를 즐기세요.",
      "cost": "1만원",
      "duration": "120분"
    },
    {
      "date": "06-02",
      "time": "18:00",
      "dest": "속초문화마을",
      "content": "속초문화마을에서 예쁜 골목길과 벽화를 감상하세요.",
      "cost": "0만원",
      "duration": "90분"
    },
    {
      "date": "06-03",
      "time": "19:30",
      "dest": "평양 야시장",
      "content": "평양 야시장에서 신선한 해산물을 저렴하게 맛보세요.",
      "cost": "2만원",
      "duration": "60분"
    }
  ];

function toggleSchedule(dayId) {
    // console.log(dayId);
    const schedule = document.getElementById(dayId);
    // console.log(schedule);
    schedule.classList.toggle('hidden');
}

function openImage(imageId) {
    const imageModal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    modalImage.src = `path/to/${imageId}.jpg`; // Replace with actual image paths
    imageModal.classList.remove('hidden');
}

function closeImage() {
    const imageModal = document.getElementById('imageModal');
    imageModal.classList.add('hidden');
}

function daySummary(dayno, date, mainDest, destCount, cost) {
  return (
    <>
      <div className="flex flex-row justify-between items-center md:hidden" onClick={() => toggleSchedule(date)}> {/*Small screens */}
        <div className="w-3/5">
            <h2 className="text-xl font-semibold">{dayno}일차</h2>
            <p>{date}</p>
        </div>
        <div className="w-2/5">
            <p>📌 {destCount}곳</p>
            <p>💳 {cost}만원</p>
        </div>
      </div>
      <div className="flex flex-row hidden justify-between items-center md:flex lg:hidden" onClick={() => toggleSchedule(date)}> {/*Medium screens */}
        <div className="w-3/5 mr-4">
            <h2 className="text-xl font-semibold">{dayno}일차: {date}</h2>
            <p> {mainDest}</p>
        </div>
        <div className="w-2/5">
            <p> 방문장소 📌 {destCount}</p>
            <p> 총 비용 💳 {cost}만원</p>
        </div>
      </div>
      <div className="flex flex-row justify-between items-center hidden lg:flex" onClick={() => toggleSchedule(date)}> {/*Large screens */}
        <div className="w-3/5 mr-4">
            <h2 className="text-xl font-semibold">{dayno}일차 여행: {date}</h2>
            <p> 주요 목적지: {mainDest}</p>
        </div>
        <div className="w-2/5">
            <p> 방문할 장소 📌 {destCount}곳</p>
            <p> 총 여행비용 💳 {cost}만원</p>
        </div>
      </div>
    </>
  )
}


function singleSchedule(singleData) {
  const googleMapAddress = encodeURI("https://www.google.com/maps/search/?api=1&query=" + singleData["dest"]);

  return (
    <>
      <div className="flex justify-left mb-2">
        <div className="text-center whitespace-nowrap mr-6">
          <div>🕒 {singleData["time"]}</div>
        </div>
        <div className="text-center w-full text-wrap line-clamp-3 mr-6">
          <div>📌 {singleData["dest"]}<a target="_blank" href={googleMapAddress}>🔗</a></div>
        </div>
        <div className="text-center whitespace-nowrap mr-6">
          <div>⌛ {singleData["duration"]}</div>
        </div>
        <div className="text-center whitespace-nowrap mr-6">
          <div>💳 {singleData["cost"]}</div>
        </div>
      </div>
      <div className="flex mt-4 mb-6">
        <div className="mr-4">🎫</div>
        <div className="text-left">{singleData["content"]}</div>
      </div>
      <div className="border-t-2 border-gray-400 my-3"></div>
    </>
  );
}


function dayDetails(data) {
  
  return (
    <>
    <div id={data[0]["date"]} className="container mt-4 mb-6 p-2">
      {
        data.map((entry, index) => (
          singleSchedule(entry)
        ))
      }
    </div>
    </>
  );
}


export const Schedule = () => {
    
    const { schedule, setSchedule } = useSchedule();
    // const split_data = splitSchedule(schedule_temp["schedule"]);
    const split_data = splitSchedule(schedule);
    var daySummaries = [];

    for (var dayno in split_data) {
      var summary = summarizeSchedule(split_data[dayno]);
      summary["dayno"] = dayno;
      daySummaries.push(summary);
    }

    return(
        <div className="container mx-auto p-0">
          {daySummaries.map((summary, index) => (
            <div className="flex flex-col bg-sky-100 shadow-md rounded-lg p-4 mb-4 cursor-pointer">
              {daySummary(summary["dayno"], summary["date"], summary["mainDest"], summary["destCount"], summary["totalCost"])}
            <div className="border-t-2 border-blue-600 my-3"></div>
              {dayDetails(split_data[index+1])}
            </div>
          ))
          }
        </div>
    );
}