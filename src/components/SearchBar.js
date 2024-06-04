// components/SearchBar.js
require('dotenv').config()

import { useState, useRef } from 'react';
import { Popover as HeadlessPopover } from '@headlessui/react'; // npm install @headlessui/react

import { CalendarIcon, UserIcon, LocationMarkerIcon, SearchIcon } from '@heroicons/react/solid'; //npm install @heroicons/react@v1
import DatePicker from 'react-datepicker'; // npm install react-datepicker. 오류나면 npm install react-datepicker --legacy-peer-deps


import 'react-datepicker/dist/react-datepicker.css';
import '@/styles/datepicker.css';
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const SearchBar = () => {
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [guests, setGuests] = useState(1);
  const [budget, setBudget] = useState('');
  const [meals, setMeals] = useState([]);
  const [intensity, setIntensity] = useState('');
  const [walkingDistance, setWalkingDistance] = useState('');
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [advancedSearchOptions, setAdvancedSearchOptions] = useState({});
  const checkInRef = useRef();

  // 기존 SearchBar.js 영역
  const handleCheckOutClick = () => {
    if (checkInRef.current) {
      checkInRef.current.click();
    }
  };

  const handleSearchClick = () => {
    aiRun();
  };

  const togglePopover = () => {
    setIsPopoverOpen(prevState => !prevState);
  };

  const closePopover = () => {
    setIsPopoverOpen(false);
  };

  const walkingDistanceOptions = [
    "1km", "3km", "5km", "7km", 
    "9km", "11km", "13km", "15km", "17km", "19km", "21km+"
  ];

  const mealsOptions = ["아침", "점심", "저녁", "야식"];

  const intensityOptions = ["낮음", "보통", "높음"];

  const applyFilters = () => {
    setAdvancedSearchOptions({
      budget,
      meals,
      intensity,
      walkingDistance,
      location,
      startDate,
      endDate,
      guests,
    });
    closePopover();  // 필터 적용 후 Popover 창 닫기
  };

  const handleBudgetChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setBudget(value);
    }
  };

  const toggleMealSelection = (meal) => {
    setMeals((prev) => 
      prev.includes(meal) ? prev.filter(m => m !== meal) : [...prev, meal]
    );
  };

  const isActive = (option, state) => state.includes(option);

   // Generative AI Call to fetch text insights
   async function aiRun() {
    setLoading(true);
    setResponse('');

    const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro"});

    if(advancedSearchOptions) {
      const { budget, meals, intensity, walkingDistance, location, startDate, endDate, guest } = advancedSearchOptions;

      const prompt = `
        다음 내용을 바탕으로 여행 일정을 만들어 줘:
        위치: ${location}
        기간: ${startDate ? startDate.toLocaleDateString() : ''}부터 ${endDate ? endDate.toLocaleDateString() : ''}까지
        인원: ${guests}명
        예산: ${budget}만원
        식사 횟수: ${meals.join(', ')}
        여행강도: ${intensity}이고, 여행강도는 1이 가장 강도가 낮은 여행이고 3이 가장 높은 여행이야
        1일 도보 이동거리: ${walkingDistance}
        `;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = await response.text();
      setResponse(text);
      setLoading(false);
    } else {
      console.warn('advancedSearchOption is undefined');
      setLoading(false);
    }
  }

  return (
    <div className="w-full flex-col items-center">
      <div className="flex justify-between items-center border rounded-full p-4 shadow-md w-2/3 mx-auto bg-white">
        <div className="flex items-center space-x-2">
          <LocationMarkerIcon className="h-5 w-5 text-gray-500" />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="여행지"
            className="focus:outline-none"
          />
        </div>

        <HeadlessPopover className="relative">
          <HeadlessPopover.Button ref={checkInRef} className="flex items-center space-x-2">
            <CalendarIcon className="h-5 w-5 text-gray-500" />
            <span>{startDate ? startDate.toLocaleDateString() : '체크인'}</span>
          </HeadlessPopover.Button>
          <HeadlessPopover.Panel className="absolute z-10 p-4 rounded-lg w-96 -translate-x-1/2 mt-4">
            <div className="flex justify-around w-full">
              <DatePicker
                selected={startDate}
                onChange={(dates) => {
                  const [start, end] = dates;
                  setStartDate(start);
                  setEndDate(end);
                }}
                startDate={startDate}
                endDate={endDate}
                selectsRange
                inline
                monthsShown={2}
                minDate={new Date()}
                className="rounded"
              />
            </div>
          </HeadlessPopover.Panel>
        </HeadlessPopover>

        <button
          className="flex items-center space-x-2 ml-4"
          onClick={handleCheckOutClick}
        >
          <CalendarIcon className="h-5 w-5 text-gray-500" />
          <span>{endDate ? endDate.toLocaleDateString() : '체크아웃'}</span>
        </button>

        <HeadlessPopover className="relative">
          <HeadlessPopover.Button className="flex items-center space-x-2">
            <UserIcon className="h-5 w-5 text-gray-500" />
            <span>{guests > 1 ? `여행자 ${guests}명` : '여행자'}</span>
          </HeadlessPopover.Button>
          <HeadlessPopover.Panel className="absolute z-10 p-4 shadow-lg rounded-lg w-40">
            <input
              type="number"
              value={guests}
              min="1"
              onChange={(e) => setGuests(e.target.value)}
              className="border p-2 rounded w-full"
            />
          </HeadlessPopover.Panel>
        </HeadlessPopover>

        <button
          className="flex items-center justify-center bg-red-500 text-white p-2 rounded-full"
          onClick={handleSearchClick}
        >
          <SearchIcon className="h-5 w-5" />
        </button>
      </div>
      
      <div className="p-4 relative mt-1 flex justify-center">
        <Popover>
          <PopoverTrigger asChild>
            <Button className="bg-gray-500 text-white ml-2" onClick={togglePopover}>
              고급 검색
            </Button>
          </PopoverTrigger>
          {isPopoverOpen && (
            <PopoverContent align="center" style={{ width: '380px', padding: '20px', maxHeight: '420px', overflowY: 'auto' }}>
              <div className="relative p-4 rounded">
                <button
                  onClick={closePopover}
                  className="absolute top-2 right-2 text-black"
                >
                  &#10005;
                </button>
                <div className="mb-2">
                  <label className="block text-sm font-medium text-black bold">총 예산</label>
                  <div className="flex items-center mt-2">
                    <input
                      type="text"
                      value={budget}
                      onChange={handleBudgetChange}
                      className="p-2 border rounded w-3/5 text-sm"
                    />
                    <span className="ml-2 text-sm text-black bold">만원</span>
                  </div>
                </div>
    
                <hr className="my-4 border-grey" />

                <div className="mb-4">
                  <label className="block text-sm font-medium text-black bold">여행 강도</label>
                  <div className="mt-2 grid grid-cols-4 gap-2">
                    {intensityOptions.map(option => (
                      <Button
                        key={option}
                        onClick={() => setIntensity(option)}
                        className={`p-2 border rounded-full text-xs ${isActive(option, [intensity]) ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-300 hover:text-black'}`}
                        style={{ width: '60px', height: '40px' }}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                </div>

                <hr className="my-4 border-grey" />
  
                <div className="mb-4">
                  <label className="block text-sm font-medium text-black bold">1일 도보 이동 거리 (km)</label>
                   <div className="mt-2 grid grid-cols-4 gap-2">
                    {walkingDistanceOptions.map(option => (
                      <Button
                        key={option}
                        onClick={() => setWalkingDistance(option)}
                        className={`p-2 border rounded-full text-xs ${isActive(option, [walkingDistance]) ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-300 hover:text-black'}`}
                        style={{ width: '60px', height: '40px' }}
                      >
                        {option}
                     </Button>
                    ))}
                  </div>
                </div>
    
                 <hr className="my-4 border-grey" />
    
                <div className="mb-6">
                  <label className="block text-sm font-medium text-black bold">식사 횟수</label>
                  <div className="mt-2 grid grid-cols-4 gap-2">
                    {mealsOptions.map(option => (
                      <Button
                        key={option}
                        onClick={() => toggleMealSelection(option)}
                        className={`p-2 border rounded-full text-xs ${isActive(option, meals) ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-300 hover:text-black'}`}
                        style={{ width: '60px', height: '40px' }}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                </div>
    
                <div className="flex justify-center mt-4">
                  <Button onClick={applyFilters} className="bg-gray-700 text-white hover:bg-black">적용</Button>
                </div>
              </div>
            </PopoverContent>
          )}
        </Popover>
      </div>
    </div>
  );
};

export default SearchBar;