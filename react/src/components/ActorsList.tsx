// src/components/ActorList.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Actor {
  Actor: string;
}

const ActorList: React.FC = () => {
  const [actors, setActors] = useState<Actor[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActors = async () => {
      try {
        const response = await axios.get<Actor[]>('http://127.0.0.1:8000/api/actores/');
        // console.log(response.data);
        setActors(response.data);
      } catch (err) {
        setError('Error fetching data');
        console.error(err);
      }
    };

    fetchActors();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Actors List</h1>
      <ul>
        {actors.map((actor, index) => (
          <li key={index}>{actor.Actor}</li>
        ))}
      </ul>
    </div>
  );
};

export default ActorList;
