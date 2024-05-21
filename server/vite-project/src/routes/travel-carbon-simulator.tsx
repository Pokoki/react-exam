import React, { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';

const rates = {
  thermicCar: 218,
  electricCar: 103,
  longDistanceTrain: 27,
  localTrain: 10,
  plane: 259,
  walk: 0,
  bike: 0,
  electricBike: 11,
};

const TravelCarbonSimulator: React.FC = () => {
  const [travels, setTravels] = useState<number>(0);
  const [distances, setDistances] = useState({
    thermicCar: 0,
    electricCar: 0,
    longDistanceTrain: 0,
    localTrain: 0,
    plane: 0,
    walk: 0,
    bike: 0,
    electricBike: 0,
  });

  const [initialCarbon, setInitialCarbon] = useState<number | null>(null);
  const [currentCarbon, setCurrentCarbon] = useState<number | null>(null);

  const handleDistanceChange = (mode: keyof typeof distances, value: number) => {
    setDistances({ ...distances, [mode]: value });
  };

  const calculateCarbonFootprint = () => {
    const totalCarbon = Object.keys(distances).reduce((acc, key) => {
      return acc + (distances[key as keyof typeof distances] * rates[key as keyof typeof rates]);
    }, 0);

    return (totalCarbon * travels) / 1000; // Convert to kg
  };

  const handleSubmit = () => {
    const initial = calculateCarbonFootprint();
    setInitialCarbon(initial);
    setCurrentCarbon(initial);
  };

  const handleSimulationChange = () => {
    const current = calculateCarbonFootprint();
    setCurrentCarbon(current);
  };

  return (
    <div>
      <h1>Simulateur de carbone de voyage</h1>
      <div>
        <label>
          Nombre de voyages par an:
          <input
            type="number"
            value={travels}
            onChange={(e) => setTravels(Number(e.target.value))}
          />
        </label>
      </div>
      {Object.keys(distances).map((mode) => (
        <div key={mode}>
          <label>
            {mode.replace(/([A-Z])/g, ' $1')} (km):
            <input
              type="number"
              value={distances[mode as keyof typeof distances]}
              onChange={(e) => handleDistanceChange(mode as keyof typeof distances, Number(e.target.value))}
              onBlur={handleSimulationChange}
            />
          </label>
        </div>
      ))}
      <button onClick={handleSubmit}>Valider</button>
      {initialCarbon !== null && (
        <div>
          <p>Emission annuelle de base: {initialCarbon.toFixed(2)} kg</p>
        </div>
      )}
    </div>
  );
};

export const Route = createFileRoute('/travel-carbon-simulator')({
  component: TravelCarbonSimulator,
});
