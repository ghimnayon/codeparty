// components/SearchBar.js
import { useState, useRef } from 'react';
import { Popover } from '@headlessui/react'; // npm install @headlessui/react

import { CalendarIcon, UserIcon, LocationMarkerIcon, SearchIcon } from '@heroicons/react/solid'; //npm install @heroicons/react@v1
import DatePicker from 'react-datepicker'; // npm install react-datepicker. 오류나면 npm install react-datepicker --legacy-peer-deps


import 'react-datepicker/dist/react-datepicker.css';
import '@/styles/datepicker.css'; // Custom CSS for datepicker

const SearchBar = () => {
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [guests, setGuests] = useState(1);
  const checkInRef = useRef();

  const handleCheckOutClick = () => {
    if (checkInRef.current) {
      checkInRef.current.click();
    }
  };

  const handleSearchClick = () => {
    // 검색 버튼 클릭 시 입력 필드 초기화
    setLocation('');
    setStartDate(null);
    setEndDate(null);
    setGuests(1);
  };

  return (
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

      <Popover className="relative">
        <Popover.Button ref={checkInRef} className="flex items-center space-x-2">
          <CalendarIcon className="h-5 w-5 text-gray-500" />
          <span>{startDate ? startDate.toLocaleDateString() : '체크인'}</span>
        </Popover.Button>
        <Popover.Panel className="absolute z-10 p-4 rounded-lg w-96 -translate-x-1/2 mt-4">
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
        </Popover.Panel>
      </Popover>

      <button
        className="flex items-center space-x-2 ml-4"
        onClick={handleCheckOutClick}
      >
        <CalendarIcon className="h-5 w-5 text-gray-500" />
        <span>{endDate ? endDate.toLocaleDateString() : '체크아웃'}</span>
      </button>

      <Popover className="relative">
        <Popover.Button className="flex items-center space-x-2">
          <UserIcon className="h-5 w-5 text-gray-500" />
          <span>{guests > 1 ? `여행자 ${guests}명` : '여행자'}</span>
        </Popover.Button>
        <Popover.Panel className="absolute z-10 p-4 shadow-lg rounded-lg w-40">
          <input
            type="number"
            value={guests}
            min="1"
            onChange={(e) => setGuests(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </Popover.Panel>
      </Popover>

      <button
        className="flex items-center justify-center bg-red-500 text-white p-2 rounded-full"
        onClick={handleSearchClick}
      >
        <SearchIcon className="h-5 w-5" />
      </button>
    </div>
  );
};

export default SearchBar;
