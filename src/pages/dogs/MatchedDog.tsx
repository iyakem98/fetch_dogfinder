/* This is the MatchedDog component that is responsible for displaying the dog users are matched with. To do this, 
users will choose a few dogs as their "favorites" and click on "Find a Match", which picks a random dog out of the 
ones in the favorites list */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {Button, Image} from 'react-bootstrap'

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
          <div style={{
            marginBottom: '30px'
          }}>
            <h4>
              Say Hello to {dogDetails.name}! You guys are an amazing fit!
            </h4>
            <h5>
              {dogDetails.name} is a {dogDetails.age}-year(s)-old {dogDetails.breed} that lives around {dogDetails.zip_code}. 
            </h5>
            </div>
          <Image style={{
            borderRadius: '10%'
          }} src={dogDetails.img} alt={dogDetails.name} />
        </div>
      ) : (
        <p>Loading dog details...</p>
      )}
    </div>
  );
};

export default MatchedDog;

