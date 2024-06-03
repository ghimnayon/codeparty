// import React, { useState } from 'react';
// import AdvancedSearch from '@/components/advancedSearch/AdvancedSearch';
// import SearchButton from '@/components/search/SearchButton';
// import SearchBar from '@/components/SearchBar';

// const SearchContainer = () => {
//   const [advancedSearchOptions, setAdvancedSearchOptions] = useState({
//     budget: '',
//     meals: [],
//     intensity: '',
//     walkingDistance: [0, 20],
//     location: '',
//     startDate: '',
//     endDate: '',import React, { useState } from 'react';
import React, { useState } from 'react';
import SearchBar from '@/components/SearchBar';
import AdvancedSearch from '@/components/advancedSearch/AdvancedSearch';
import SearchButton from '@/components/search/SearchButton';

const SearchContainer = () => {
  const [budget, setBudget] = useState('');
  const [meals, setMeals] = useState([]);
  const [intensity, setIntensity] = useState('');
  const [walkingDistance, setWalkingDistance] = useState([0, 20]);
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [guests, setGuests] = useState(1);

  const advancedSearchOptions = {
    budget,
    meals,
    intensity,
    walkingDistance,
    location,
    startDate,
    endDate,
    guests,
  };

  return (
    <div>
      <SearchBar
        budget={budget}
        meals={meals}
        intensity={intensity}
        walkingDistance={walkingDistance}
        location={location}
        startDate={startDate}
        endDate={endDate}
        guests={guests}
        setBudget={setBudget}
        setMeals={setMeals}
        setIntensity={setIntensity}
        setWalkingDistance={setWalkingDistance}
        setLocation={setLocation}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        setGuests={setGuests}
      />
      <AdvancedSearch
        setBudget={setBudget}
        setMeals={setMeals}
        setIntensity={setIntensity}
        setWalkingDistance={setWalkingDistance}
      />
      <SearchButton advancedSearchOptions={{
        budget,
        meals,
        intensity,
        walkingDistance,
        location,
        startDate,
        endDate,
        guests,
      }} />
    </div>
  );
};

export default SearchContainer;
