import React, { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";

const SearchButton = ({ advancedSearchOptions }) => {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);

    const [search, setSearch] = useState('');
    const [aiResponse, setResponse] = useState('');
    const [loading, setLoading] = useState(false);

    /**
     * Generative AI Call to fetch text insights
     */
    async function aiRun() {
        setLoading(true);
        setResponse('');

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });
        if(advancedSearchOptions) {
            const { budget, meals, intensity, walkingDistance, location, startDate, endDate, guests } = advancedSearchOptions;    
        } else {
            console.warn('advancedSearchOption is undefined');
        }
        

        const prompt = `
            다음 내용을 바탕으로 여행일정을 만들어 줘:
            위치: ${location}
            기간: ${startDate}부터 ${endDate}까지
            인원: ${guests}명
            예산: ${budget}만원
            식사 횟수: ${meals.join(', ')}
            여행강도: ${intensity}이고, 여행강도는 1이 가장 강도가 낮은 여행이고 3이 강도가 가장 높은 여행이야
            1일 도보 이동거리: ${walkingDistance[0]}km 이상 ${walkingDistance[1]}km 이하
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        setResponse(text);
        setLoading(false);
    }

    const handleChangeSearch = (e) => {
        setSearch(e.target.value);
    }

    const handleClick = () => {
        aiRun();
    }

    return (

        <div>
          <button onClick={() => handleClick()}>버튼</button>
            {/* <div style={{ display: 'flex' }}>
                <input placeholder='Search Food with Category using Generative AI' onChange={(e) => handleChangeSearch(e)} />
                <button style={{ marginLeft: '20px' }} onClick={() => handleClick()}>Search</button>
            </div>
            <div>
                <p>예산: {advancedSearchOptions.budget}만원</p>
                <p>식사: {advancedSearchOptions.meals.join(', ')}</p>
                <p>여행 강도: {advancedSearchOptions.intensity}</p>
                <p>도보 거리: {advancedSearchOptions.walkingDistance[0]}km ~ {advancedSearchOptions.walkingDistance[1]}km</p>
            </div>
            {
                loading == true && (aiResponse == '') ?
                    <p style={{ margin: '30px 0' }}>Loading ...</p>
                    :
                    <div style={{ margin: '30px 0' }}>
                        <p>{aiResponse}</p>
                    </div>
            } */}
        </div>
      );
};

export default SearchButton;