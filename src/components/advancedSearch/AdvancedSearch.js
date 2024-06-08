import React, { useState } from 'react';
import { Button } from "@/components/ui/button";

const AdvancedSearch = ({ setAdvancedSearchOptions, onClose }) => {
  const [budget, setBudget] = useState('');
  const [meals, setMeals] = useState([]);
  const [intensity, setIntensity] = useState('');
  const [walkingDistance, setWalkingDistance] = useState('');

  const walkingDistanceOptions = [
    "1km", "3km", "5km", "7km", 
    "9km", "11km", "13km", "15km", "17km","19km", "21km+"
  ];

  const mealsOptions = ["아침", "점심", "저녁", "야식"];

  const intensityOptions = ["낮음", "보통", "높음" ];

  const applyFilters = () => {
    setAdvancedSearchOptions({
      budget,
      meals,
      intensity,
      walkingDistance,
    });
    onClose();  // 필터 적용 후 Popover 창 닫기
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

  return (
    <div className="relative p-4 rounded">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-black"
      >
        &#10005;
      </button>
      <div className="mb-2">
        <label className="block text-sm font-medium text-black bold">총 </label>
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
  );
};

export default AdvancedSearch;
