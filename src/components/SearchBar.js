import { useState, useRef } from 'react';
import { Popover as HeadlessPopover } from '@headlessui/react';
import { CalendarIcon, UserIcon, LocationMarkerIcon, SearchIcon, AdjustmentsIcon } from '@heroicons/react/solid';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '@/styles/datepicker.css';
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const SearchBar = ({ onSearch }) => {
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
    "9km", "11km", "13km", "15km",
    "17km", "19km", "21km+"
  ];

  const mealsOptions = ["아침", "점심", "저녁", "야식"];

  const intensityOptions = ["낮음", "보통", "높음"];

  const applyFilters = () => {
    setAdvancedSearchOptions({
      budget,
      meals,
      intensity,
      walkingDistance,
    });
    closePopover(); // 필터 적용 후 Popover 창 닫기
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
  function aiRun() {
    let prompt;
    if (Object.keys(advancedSearchOptions).length > 0) {
      const { budget, meals, intensity, walkingDistance } = advancedSearchOptions;

      prompt = `다음 내용을 바탕으로 여행 일정을 만들어 줘:\n` +
        `위치: ${location}\n` +
        `기간: ${startDate ? startDate.toLocaleDateString() : ''}부터 ${endDate ? endDate.toLocaleDateString() : ''}까지\n` +
        `인원: ${guests}명\n` +
        `예산: ${budget}만원\n` +
        `식사 횟수: ${meals.join(', ')}\n` +
        `여행강도: ${intensity}\n` +
        `1일 도보 이동거리: ${walkingDistance} 이하`;
    } else {
      prompt = `다음 내용을 바탕으로 여행 일정을 만들어 줘:\n` +
        `위치: ${location}\n` +
        `기간: ${startDate ? startDate.toLocaleDateString() : ''}부터 ${endDate ? endDate.toLocaleDateString() : ''}까지\n` +
        `인원: ${guests}명`;
    }
    onSearch(prompt);
    return;
  }

  return (
    <div className="w-full flex-col items-center font-pretendard">
      <div className="flex justify-between items-center border rounded-full p-4 shadow-md mx-auto bg-white font-medium" style={{ width: '720px', height: '60px' }}>
        <div className="flex items-center space-x-2">
          <LocationMarkerIcon className="h-5 w-5 text-gray-500" />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="여행지"
            className="focus:outline-none font-pretendard"
          />
        </div>

        <HeadlessPopover className="relative w-32 font-medium">
          <HeadlessPopover.Button ref={checkInRef} className="flex items-center space-x-2">
            <CalendarIcon className="h-5 w-5 text-gray-500 font-pretendard" />
            <span>{startDate ? startDate.toLocaleDateString() : '체크인'}</span>
          </HeadlessPopover.Button>
          <HeadlessPopover.Panel className="absolute z-10 p-5 shadow-lg rounded-xl w-120 -translate-x-1/3 mt-8 shadow-lg bg-white">
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
                className="rounded font-pretendard"
              />
            </div>
          </HeadlessPopover.Panel>
        </HeadlessPopover>

        <button
          className="flex items-center w-32 space-x-2 ml-4 font-medium"
          onClick={handleCheckOutClick}
        >
          <CalendarIcon className="h-5 w-5 text-gray-500" />
          <span className= "font-pretendard" >{endDate ? endDate.toLocaleDateString() : '체크아웃'}</span>
        </button>

        <HeadlessPopover className="relative">
          <HeadlessPopover.Button className="flex items-center space-x-2 font-medium font-Pretendard w-16 mr-4">
            <UserIcon className="h-5 w-5 text-gray-500" />
            <span>{guests > 1 ? `인원 ${guests}명` : '인원'}</span>
          </HeadlessPopover.Button>
          <HeadlessPopover.Panel className="absolute z-10 p-4 shadow-lg rounded-lg mt-4" style={{ width: '80px', height: '40px' }}>
            <input
              type="number"
              value={guests}
              min="1"
              onChange={(e) => setGuests(e.target.value)}
              className="border p-2 rounded w-full"
              style={{ width: '80px', height: '40px' }}
            />
          </HeadlessPopover.Panel>
        </HeadlessPopover>

        <div className="flex items-center space-x-2">
          <button
            className="flex items-center justify-center bg-blue-500 text-white p-2 rounded-full"
            onClick={handleSearchClick}
          >
            <SearchIcon className="h-5 w-5" />
          </button>

          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="text-black ml-2 font-pretendard font-medium">
                <AdjustmentsIcon className="h-5 w-5 text-black" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="center" className="font-Pretendard scrollbar-custom" style={{ width: '360px', padding: '20px', maxHeight: '420px', overflowY: 'auto' }}>
              <div className="relative p-5 rounded">
                <button
                  onClick={closePopover}
                  className="absolute top-2 right-2 text-black"
                >
                  &#10005;
                </button>
                <div className="mb-3">
                  <label className="block text-m font-semibold text-black bold mb-3">총 예산</label>
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
                  <label className="block text-m font-medium font-semibold text-black bold mb-3">여행 강도</label>
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
                  <label className="block text-m font-medium font-semibold text-black bold mb-3">1일 도보 이동 거리 (km)</label>
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
                  <label className="block text-m font-medium font-semibold text-black bold mb-3">식사 횟수</label>
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

                <div className="flex justify-center mt-8">
            <Button 
              onClick={applyFilters} 
              className="font-pretendard bg-blue-500 text-white font-semibold hover:bg-green-500 hover:text-white"
              >
                적용
              </Button>
            </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
