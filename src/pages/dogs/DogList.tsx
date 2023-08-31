import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Row, Col, Container, Button } from 'react-bootstrap';
import DogCard from '../../components/dogComponents/DogCard';
import DogSearch from '../../components/dogComponents/DogSearch';

interface Dog {
  id: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
  breed: string;
}

const DogList: React.FC = () => {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [isFiltering, setIsFiltering] = useState(false);

  const [isLoading, setIsLoading] = useState(true); 

  const [sortField, setSortField] = useState<string>('breed'); // Default sort by breed
const [sortOrder, setSortOrder] = useState<string>('asc'); // Default ascending order

const url = `https://frontend-take-home-service.fetch.com/dogs/search?sort=${sortField}:${sortOrder}`;


  useEffect(() => {
    console.log('DogList component mounted');
    // Fetch dog IDs from the API
    async function fetchDogIds() {
      try {
        const response = await axios.get(
          url,
          {
            withCredentials: true,
          }
        );

        if (response.status === 200) {
          const dogIds: string[] = response.data.resultIds;
          fetchDogDetails(dogIds); // Call the function to fetch dog details
        } else {
          console.error('Failed to fetch dog IDs. Status:', response.status);
        }
      } catch (error) {
        console.error('An error occurred during fetch:', error);
      } finally {
        setIsLoading(false); // Set loading to false when fetch is complete
      }
    }

    fetchDogIds();
  }, []);

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
        console.log('details fetched');
        // Use concat to add the fetched dogs to the array and update state
        const newDogs = fetchedDogs.concat(dogResponse.data);
        console.log('Fetched dogs:', dogResponse.data);
        setDogs(newDogs);
      } else {
        console.error('Failed to fetch dog details. Status:', dogResponse.status);
      }
    } catch (error) {
      console.error('An error occurred during fetch: details', error);
    }
  }
  
  
  
   

// Function to handle filtering and sorting
const handleFilterSort = (searchParams: any) => {
  // Implement filtering logic here if needed

  // Sort the dogs array based on the selected field and order
  const sortedDogs = [...dogs].sort((a, b) => {
    const fieldA = (a as any)[sortField] || ''; // Use type assertion as any
    const fieldB = (b as any)[sortField] || ''; // Use type assertion as any

    if (sortOrder === 'asc') {
      return fieldA.localeCompare(fieldB);
    } else {
      return fieldB.localeCompare(fieldA);
    }
  });

  // Update the 'dogs' state with the sorted results
  setDogs(sortedDogs);
};




  return (
    <div>
      <h2>Dog Breeds</h2>
      <div>
        <DogSearch onFilterSort={handleFilterSort} />
      </div>
      <div>
      <Button
  onClick={() => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  }}
>
  Toggle Sort Order
</Button>
      </div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <Container>
          <Row>
            {dogs.map((dog, index) => (
              <Col sm={12} md={6} lg={4} xl={3} key={index}>
                <DogCard dog={dog} />
              </Col>
            ))}
          </Row>
        </Container>
      )}
    </div>
  );
};

export default DogList;
