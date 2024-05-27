import Script from "next/script";


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
// 🕒💰💳⌚📌🎫⏰

function toggleSchedule(dayId) {
    const schedule = document.getElementById(dayId);
    console.log(schedule);
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

export const Schedule = () => {
    return(
        <>
          <div className="container mx-auto p-0">
            <div className="bg-white shadow-md rounded-lg p-4 mb-4 cursor-pointer" onClick={() => toggleSchedule('day1')}>
              <div className="flex justify-between items-center md:hidden"> {/*Small screens */}
                <div>
                    <h2 className="text-xl font-semibold">1일차</h2>
                    <p>05-01</p>
                </div>
                <div>
                    <p>📌 3</p>
                    <p>💳 $150</p>
                </div>
              </div>
              <div className="flex justify-between items-center hidden md:block lg:hidden"> {/*Medium screens */}
                <div>
                    <h2 className="text-xl font-semibold">1일차: 2024-05-01</h2>
                    <p>Main Destination: Destination A</p>
                </div>
                <div>
                    <p>Destinations: 3</p>
                    <p>Total Cost: $150</p>
                </div>
              </div>
              <div className="flex justify-between items-center hidden lg:block"> {/*Large screens */}
                <div>
                    <h2 className="text-xl font-semibold">Day 1: 2024-05-01</h2>
                    <p>Main Destination: Destination A</p>
                </div>
                <div>
                    <p>Destinations: 3</p>
                    <p>Total Cost: $150</p>
                </div>
              </div>
              <div id="day1" className="mt-4 hidden">
                <div className="mb-4">
                  <p><strong>Time:</strong> 09:00 AM</p>
                  <p><strong>Destination:</strong> Destination A <span className="hover-address" data-address="123 Main St, City">📍</span></p>
                  <p><strong>Content:</strong> Visit to museum</p>
                  <p><strong>Cost:</strong> $50</p>
                  <p><strong>Duration:</strong> 2 hours</p>
                  <div className="h-16 bg-gray-300 mt-2" onClick={() => openImage('image1')}>Image Placeholder</div>
                </div>
                <div className="mb-4">
                  <p><strong>Time:</strong> 12:00 PM</p>
                  <p><strong>Destination:</strong> Destination B <span className="hover-address" data-address="456 Elm St, City">📍</span></p>
                  <p><strong>Content:</strong> Lunch at local restaurant</p>
                  <p><strong>Cost:</strong> $30</p>
                  <p><strong>Duration:</strong> 1 hour</p>
                  <div className="h-16 bg-gray-300 mt-2" onClick={() => openImage('image2')}>Image Placeholder</div>
                </div>
                <div className="mb-4">
                  <p><strong>Time:</strong> 02:00 PM</p>
                  <p><strong>Destination:</strong> Destination C <span className="hover-address" data-address="789 Pine St, City">📍</span></p>
                  <p><strong>Content:</strong> Afternoon hike</p>
                  <p><strong>Cost:</strong> $70</p>
                  <p><strong>Duration:</strong> 3 hours</p>
                  <div className="h-16 bg-gray-300 mt-2" onClick={() => openImage('image3')}>Image Placeholder</div>
                </div>
              </div>
            </div>
            <div className="bg-white shadow-md rounded-lg p-4 mb-4 cursor-pointer" onClick={() => toggleSchedule('day2')}>
              <div className="flex justify-between items-center md:hidden"> {/*Small screens */}
                <div>
                    <h2 className="text-xl font-semibold">2일차</h2>
                    <p>05-02</p>
                </div>
                <div>
                    <p>📌 4</p>
                    <p>💳 $200</p>
                </div>
              </div>
              <div className="flex justify-between items-center hidden md:block lg:hidden"> {/*Medium screens */}
                <div>
                    <h2 className="text-xl font-semibold">2일차: 2024-05-02</h2>
                    <p>Main Destination: Destination A</p>
                </div>
                <div>
                    <p>Destinations: 4</p>
                    <p>Total Cost: $200</p>
                </div>
              </div>
              <div className="flex justify-between items-center hidden lg:block"> {/*Large screens */}
                <div>
                    <h2 className="text-xl font-semibold">Day 1: 2024-05-01</h2>
                    <p>Main Destination: Destination A</p>
                </div>
                <div>
                    <p>Destinations: 3</p>
                    <p>Total Cost: $150</p>
                </div>
              </div>
              <div id="day2" className="mt-4 hidden">
                <div className="mb-4">
                  <p><strong>Time:</strong> 09:00 AM</p>
                  <p><strong>Destination:</strong> Destination A <span className="hover-address" data-address="123 Main St, City">📍</span></p>
                  <p><strong>Content:</strong> Visit to museum</p>
                  <p><strong>Cost:</strong> $50</p>
                  <p><strong>Duration:</strong> 2 hours</p>
                  <div className="h-16 bg-gray-300 mt-2" onClick={() => openImage('image1')}>Image Placeholder</div>
                </div>
                <div className="mb-4">
                  <p><strong>Time:</strong> 12:00 PM</p>
                  <p><strong>Destination:</strong> Destination B <span className="hover-address" data-address="456 Elm St, City">📍</span></p>
                  <p><strong>Content:</strong> Lunch at local restaurant</p>
                  <p><strong>Cost:</strong> $30</p>
                  <p><strong>Duration:</strong> 1 hour</p>
                  <div className="h-16 bg-gray-300 mt-2" onClick={() => openImage('image2')}>Image Placeholder</div>
                </div>
                <div className="mb-4">
                  <p><strong>Time:</strong> 02:00 PM</p>
                  <p><strong>Destination:</strong> Destination C <span className="hover-address" data-address="789 Pine St, City">📍</span></p>
                  <p><strong>Content:</strong> Afternoon hike</p>
                  <p><strong>Cost:</strong> $70</p>
                  <p><strong>Duration:</strong> 3 hours</p>
                  <div className="h-16 bg-gray-300 mt-2" onClick={() => openImage('image3')}>Image Placeholder</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="w-3/4 pr-4 overflow-auto">
            <div id="imageModal" className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center hidden">
                        <div className="relative">
                        <button onClick={() => closeImage()} className="absolute top-0 right-0 m-4 text-white text-2xl">×</button>
                        <img id="modalImage" src="" alt="Large view" className="max-w-full max-h-full"/>
                        </div>
            </div>
          </div>
        </>
    );
}