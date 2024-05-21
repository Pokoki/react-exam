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

  const handleDistanceChange = (mode: string, value: number) => {
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

  const handleChoice = async () => {
    const reduction = initialCarbon! - currentCarbon!;
    try {
      const response = await fetch('http://localhost:3000/reduce', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ yearlyCarbonReduction: reduction }),
      });
      if (!response.ok) {
        throw new Error('Echec de l\'envoie de la reduction');
      }
      alert(`Vous avez réduit votre empreinte carbon de ${reduction.toFixed(2)} ! kg/an, Bravo !`);
    } catch (error) {
      console.error('Echec de l\'envoie de la reduction:', error);
    }
  };

  return (
    <div>
      <h1>Travel Carbon Simulator</h1>
      <label>
        Nombre de voyage par an:
        <input
          type="number"
          value={travels}
          onChange={(e) => setTravels(Number(e.target.value))}
        />
      </label>
      {Object.keys(distances).map((mode) => (
        <label key={mode}>
          {mode.replace(/([A-Z])/g, ' $1')} (km):
          <input
            type="number"
            value={distances[mode as keyof typeof distances]}
            onChange={(e) => handleDistanceChange(mode, Number(e.target.value))}
            onBlur={handleSimulationChange}
          />
        </label>
      ))}
      <button onClick={handleSubmit}>Validé</button>
      {initialCarbon !== null && (
        <div>
          <p>Emission annuel de base: {initialCarbon.toFixed(2)} kg</p>
          {currentCarbon !== null && (
            <div>
              <p>Emission annuel maintenant: {currentCarbon.toFixed(2)} kg</p>
              <p>Difference: {(initialCarbon - currentCarbon).toFixed(2)} kg</p>
              {currentCarbon < initialCarbon && (
                <button onClick={handleChoice}>Mon choix!</button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const Route = createFileRoute('/travel-carbon-simulator')({
  component: TravelCarbonSimulator,
});
