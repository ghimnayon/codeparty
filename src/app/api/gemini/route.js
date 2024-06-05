const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);
export const maxDuration = 60; // This function can run for a maximum of 5 seconds
export const dynamic = 'force-dynamic';

/*
  System Prompt 설정
  이 설정에 따라 AI 의 대답의 유형을 다르게 만들 수 있음
  단, 이 설정을 항상 확실히 참조하지는 않음
  이 설정은 메시지 목록의 첫 번째 메시지로 사용됨
*/
const systemInstruction =
  '너의 이름은 코드트래블이고, 여행 전문가인 나의 AI 친구야.' +
  '원하는 여행 일정을 알려주면 그에 맞게 추천을 해 줘.' +
  '대답은 두 가지로 나누어서, 다음과 같은 json 형식을 반드시 따라줘.' + 
  '{"answer": "여기에 너의 자연어 응답을 넣어주고", "schedule": "여기에 json 형식의 일정을 넣어줘."}' + 
  '와 같이 대답과 일정으로 구성된 json 방식으로 응답을 부탁해.' + 
  '일정은 반드시 다음과 같은 json 형식으로 대답해줘.' + 
  '[{date: 05-01, time: 11:00, dest: 목적지, content: 내용, address: 목적지주소, cost: 5만원, duration: 70분}, ' + 
  '{date: 05-01, time: 17:00, dest: 목적지, content: 내용, address: 목적지주소, cost: 6만원, duration: 20분}' +
  '날짜는 MM-DD 형식, 시간은 24시간 형식이고, 비용은 만원 단위로, duration은 10분 단위로 대답해줘. 무료여도 0만원으로 대답해줘.' + 
  '비용은 무조건 1인당 비용으로 계산해서 만원 단위로만 알려줘.' +
  '장소의 경우 @Google 지도에 있는 장소만 추천해주고, 주소도 @Google 지도 기준으로 알려줘.' +
  '형식을 꼭 지켜서 대답해줘. 대답과 일정 외에는 어떤 대답도 하지 말아줘.';

export async function POST(req) {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-pro-latest",
    // model: "gemini-1.0-pro",
    systemInstruction: systemInstruction,
  });

  // POST 로 전송받은 내용 중 messages 를 추출
  const data = await req.json();
  // console.dir([...data.messages], { depth: 3 });

  const chat = model.startChat({
    // 컨텍스트 유지를 위해 이전 메시지를 포함해서 보냄
    history: [
      ...data.messages,
      // Message history example:
      //   {
      //     role: "user",
      //     parts: [{ text: "오늘 신나는 일이 있었어. 한 번 들어볼래?" }],
      //   },
      //   {
      //     role: "model",
      //     parts: [
      //       {
      //         text: "좋아! 무슨 일인데? 얼른 말해줘! 나 완전 귀 쫑긋 세우고 있단 말이야! 😄",
      //       },
      //     ],
      //   },
    ],
    generationConfig: {
      // temperature 값이 높을 수록 AI 의 답변이 다양해짐
      temperature: 1,
      // max_tokens 값을 제한함. 이 값을 크게하면 컨텍스트 히스토리에 제약이 커짐.
      maxOutputTokens: 5000,
    },
  });

  const result = await chat.sendMessage("");
  const response = await result.response;
  const text = response.text();
  console.log(response.candidates[0].content);
  //   console.log(response.candidates[0].safetyRatings);

  return Response.json({
    // AI 의 답변은 model 역할로 전송
    role: "model",
    parts: [{ text: text }],
  });
}
