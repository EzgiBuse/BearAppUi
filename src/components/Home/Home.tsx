import React, { useState, useEffect } from 'react';
import './Home.css';

interface Bear {
  id: number;
  name: string;
  size: number;
  colors: { id: number; name: string }[];
}

const Home: React.FC = () => {
  const [bears, setBears] = useState<Bear[]>([]);
  const [filteredBears, setFilteredBears] = useState<Bear[]>([]);
  const [colorFilter, setColorFilter] = useState('');

  useEffect(() => {
    const fetchBears = async () => {
      try {
        const response = await fetch('http://localhost:3000/bear');
        const data: Bear[] = await response.json();
        setBears(data);
        setFilteredBears(data);
      } catch (error) {
        console.error('Error fetching bears:', error);
      }
    };

    fetchBears();
  }, []);

  const handleFilterClick = async () => {
    if (colorFilter.trim() === '') {
      setFilteredBears(bears);
      return;
    }

    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3000/bear/by-color/${colorFilter}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data: string[] = await response.json();
        setFilteredBears(bears.filter(bear => data.includes(bear.name)));
      } catch (error) {
        console.error('Error filtering bears by color:', error);
      }
  };

  return (
    <div className="home-container">
      <h1>Bear List</h1>
      <div className="filter-container">
        <label htmlFor="colorFilter">Filter by color: </label>
        <input
          type="text"
          id="colorFilter"
          value={colorFilter}
          onChange={(e) => setColorFilter(e.target.value)}
        />
        <button onClick={handleFilterClick}>Filter</button>
      </div>
      <ul className="bear-list">
        {filteredBears.map(bear => (
          <li key={bear.id}>
            <h2>{bear.name}</h2>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
