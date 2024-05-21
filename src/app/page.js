import Image from "next/image"
import { stringify } from "postcss";


function createTableHeaders(scheduleData) {
  if (scheduleData.days){
    const headerList = Object.keys(scheduleData.days[0]);
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
    <td className="border px-4 py-2">{day[header]}</td>
  );
}

function createTableRows(scheduleData) {
  if (scheduleData.days){
    return scheduleData.days.map((day, index) => (
      <tr key={index}>
        {createDayRows(day)}
      </tr>
    ));
  }
  else return "";
};

export default function Home() {
  
  const schedule_temp = {
    "title": "일본 4일 여행 일정 (도쿄 기준)",
    "days": [
      {
        "date": "1일차",
        "morning": [
          "하네다 공항 도착 후 숙소 체크인 및 짐 보관",
          "시부야 방문: 하치코 동상, 스크램블 교차로, 109 백화점 등",
          "쇼핑 및 길거리 음식 즐기기"
        ],
        "afternoon": [
          "신주쿠 방문: 도쿄 도청 전망대, 도쿄 메트로폴리탄 정원, 오모이데 요코초 등",
          "로봇 레스토랑 또는 이자카야 체험"
        ],
        "evening": [
          "신주쿠에서 저녁 식사"
        ],
        "transportation": "지하철, 버스",
        "cost": "₩100,000",
        "tips": [
          "하치코 동상 앞에서 사진 찍기",
          "스크램블 교차로에서 사람들 구경하기",
          "오모이데 요코초에서 분위기 있는 골목길散策"
        ]
      },
      {
        "date": "2일차",
        "morning": [
          "아사쿠사 방문: 센소지, 나카미세 거리, 도쿄 스카이트리 등",
          "전통 의상 대여 및 기념촬영"
        ],
        "afternoon": [
          "우에노 공원 방문: 국립과학박물관, 동물원, 우에노 공원 동물원 등",
          "아메야마 시장에서 쇼핑 및 길거리 음식 즐기기"
        ],
        "evening": [
          "아사쿠사에서 저녁 식사"
        ],
        "transportation": "지하철, 버스",
        "cost": "₩80,000",
        "tips": [
          "센소지에서 참배하기",
          "나카미세 거리에서 기념품 쇼핑",
          "아메야마 시장에서 다양한 먹거리 맛보기"
        ]
      },
      {
        "date": "3일차",
        "morning": [
          "하코네 당일치기 여행: 하코네 로프웨이, 아시노코 호수, 오오쿠노 쓰루미 온천 등",
          "계절에 따라 특별 체험 (예: 유람선 탑승, 박물관 관람)"
        ],
        "afternoon": [
          "하코네에서 저녁 식사"
        ],
        "evening": [
          "없음"
        ],
        "transportation": "로컬 열차, 버스, 케이블카",
        "cost": "₩150,000",
        "tips": [
          "하코네 로프웨이 타고 아름다운 풍경 감상",
          "아시노코 호수에서 유람선 탑승",
          "계절에 따라 특별 체험 즐기기"
        ]
      },
      {
        "date": "4일차",
        "morning": [
          "츠키지 시장 방문: 신선한 해산물 및 일본 음식 즐기기",
          "기념품 쇼핑"
        ],
        "afternoon": [
          "아키하바라 방문: 전자제품, 애니메이션, 만화 등 쇼핑"
        ],
        "evening": [
          "츠키지에서 저녁 식사"
        ],
        "transportation": "지하철, 버스",
        "cost": "₩50,000",
        "tips": [
          "츠키지 시장에서 신선한 해산물 맛보기",
          "아키하바라에서 좋아하는 캐릭터 및 전자제품 구매"
        ]
      }
    ],
    "notes": [
      "위 일정은 예시이며, 개인 취향에 따라 변경 가능합니다.",
      "교통카드 (Suica, Pasmo) 구매를 추천합니다.",
      "일본어 간단한 회화를 연습하면 도움이 됩니다."
    ],
      
    "totalCost": "₩380,000",
    "additionalConsiderations": [
      {
        "title": "관심 분야",
        "description": "역사, 문화, 자연, 쇼핑 등 관심 분야에 따라 일정을 조정할 수 있습니다."
      },
      {
        "title": "여행 스타일",
        "description": "편안한 여행을 원한다면 여유로운 일정을, 액티비티를 많이 하고 싶다면 빡빡한 일정을 잡는 것이 좋습니다."
      },
      {
        "title": "예산",
        "description": "예산에 따라 숙박, 식사, 교통 등을 선택할 수 있습니다."
      }
    ]
  };
  // console.log(createTableRows(schedule_temp));
  return (
    <div className="h-full w-4/5 mx-auto flex">
      <div className="w-2/3">
        <div className="h-64 bg-red-300">
          Top Section
        </div>
        <div className="overflow-y-auto bg-blue-300">  
          <table className="w-full border-collapse border">
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
      </div>
      <div className="w-1/3 bg-green-300">
        <img src="https://via.placeholder.com/300" alt="Sample Image" className="w-full h-full object-cover"/>
      </div>
    </div>



    
  );
}
