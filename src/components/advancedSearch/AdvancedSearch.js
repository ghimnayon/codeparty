import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider"; // Import Shadcn slider component

const AdvancedSearch = ({ setAdvancedSearchOptions }) => {
  const [budget, setBudget] = useState('');
  const [intensity, setIntensity] = useState(1);
  const [meals, setMeals] = useState(3);
  const [walkingDistance, setWalkingDistance] = useState([0, 20]);

  const applyFilters = () => {
    setAdvancedSearchOptions({
      budget,
      intensity,
      meals,
      walkingDistance,
    });
  };

  const handleBudgetChange = (e) => {
    const value = e.target.value;
    if(/^\d*$/.test(value)) {
      setBudget(value);
    }
  }

  return (
    <div className="mt-4 p-4 border rounded bg-gray-100">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">총 예산 (만원)</label>
        <input
          type="text"
          value={budget}
          onChange={handleBudgetChange}
          className="mt-2 p-2 border rounded w-full"
          placeholder="예산을 입력하세요"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          여행 강도
          <span className="text-xs text-gray-500 ml-2">(숫자가 클수록 여행의 강도가 높아집니다)</span>
        </label>
        <input
          type="number"
          value={intensity}
          onChange={(e) => setIntensity(e.target.value)}
          min={1}
          max={5}
          className="mt-2 p-2 border rounded w-full"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">식사 횟수</label>
        <input
          type="number"
          value={meals}
          onChange={(e) => setMeals(e.target.value)}
          min={1}
          max={5}
          className="mt-2 p-2 border rounded w-full"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">1일 도보 이동 거리 (km)</label>
        <Slider
          defaultValue={[walkingDistance[0], walkingDistance[1]]}
          onValueChange={setWalkingDistance}
          min={0}
          max={20}
          step={1}
          // minStepsBetweenThumbs={1}
          className="mt-2"
        />
        <div className="flex justify-between text-xs">
          <span>{0} km</span>
          <span>{20} km</span>
        </div>
        <div className="text-center mt-2">
            <span>현재 설정 이동거리: {walkingDistance[0]}km ~ {walkingDistance[1]}km</span>
        </div>
      </div>
      <Button onClick={applyFilters} className="bg-blue-500 text-white">필터 적용</Button>
    </div>
  );
};

export default AdvancedSearch;
