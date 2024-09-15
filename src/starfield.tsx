import React, { useState, useEffect } from 'react';
import './starfield.css';

interface StarStyle {
  left: string;
  top: string;
  width: string;
  height: string;
  animationDuration: string;
  animationDelay: string;
}

const StarField: React.FC = () => {
  const initialNumStars = 200;  // Initial stars on page load
  const [stars, setStars] = useState<StarStyle[]>([]);

  // Function to generate a new random star
  const createStar = (): StarStyle => {
    return {
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      width: '2px',
      height: '2px',
      animationDuration: `${Math.random() * 100 + 5}s`,  // Random duration between 5s and 105s
      animationDelay: `${Math.random() * 5}s`,  // Random delay up to 5 seconds
    };
  };

  // Initialize a large number of stars on component mount
  useEffect(() => {
    const initialStars = Array.from({ length: initialNumStars }).map(() => createStar());
    setStars(initialStars);
  }, []);

  // Gradually add more stars in smaller chunks over time
  useEffect(() => {
    const interval = setInterval(() => {
      setStars(prevStars => {
        const numStarsToAdd = 10;  // Add 10 stars at a time
        const newStars = Array.from({ length: numStarsToAdd }).map(() => createStar());
        return [...prevStars, ...newStars];  // Add new stars to the existing ones
      });
    }, 1000);  // Add 10 stars every 100ms (staggered appearance)

    return () => clearInterval(interval);  // Cleanup the interval on component unmount
  }, []);

  return (
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
      {stars.map((star, index) => (
        <div key={index} className="star" style={star} />
      ))}
      <div className="shooting-star" style={{ right: `${35 - Math.random() * 35}%`, top: `${35 - Math.random() * 35}%` }} />
    </div>
  );
};

export default StarField;
