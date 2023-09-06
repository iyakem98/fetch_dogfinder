import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Dog {
  id: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
  breed: string;
}

interface DogDetailsCardProps {
  dogId: string;
}


const MatchedDog: React.FC<DogDetailsCardProps> = ({ dogId }) => {
  const [dogDetails, setDogDetails] = useState<Dog | null>(null);

  useEffect(() => {
   
    fetchDogDetails([dogId]);
  }, [dogId]);

  async function fetchDogDetails(dogIds: string[]) {
    
    const fetchedDogs: Dog[] = [];

    try {
      const dogResponse = await axios.post(
        'https://frontend-take-home-service.fetch.com/dogs',
        dogIds,
        {
          withCredentials: true,
        }
      );

      if (dogResponse.status === 200) {
        console.log('Details fetched');
      
        const newDogs = fetchedDogs.concat(dogResponse.data);
        console.log('Fetched dogs:', dogResponse.data);
        setDogDetails(newDogs[0]); 
      } else {
        console.error('Failed to fetch dog details. Status:', dogResponse.status);
      }
    } catch (error) {
      console.error('An error occurred during fetch: details', error);
    }
  }

  return (
    <div className="dog-details-card">
      {dogDetails ? (
        <div>
          <img src={dogDetails.img} alt={dogDetails.name} />
          <h3>{dogDetails.name}</h3>
          <p>Breed: {dogDetails.breed}</p>
          <p>Age: {dogDetails.age}</p>
          <p>Zip Code: {dogDetails.zip_code}</p>
        </div>
      ) : (
        <p>Loading dog details...</p>
      )}
    </div>
  );
};

export default MatchedDog;

