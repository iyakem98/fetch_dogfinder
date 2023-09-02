import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Row, Col, Container, Button } from 'react-bootstrap';
import DogCard from '../../components/dogComponents/DogCard';
import DogSearch from '../../components/dogComponents/DogSearch';
import './DogList.css'

import MatchedDog from './MatchedDog'; 

interface Dog {
  id: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
  breed: string;
}

interface DogSearchParams {
  breeds: string[];
  zipCodes: string[];
  ageMin?: number | undefined;
  ageMax?: number | undefined;
}

interface Match {
  match: string
}

const DogList: React.FC = () => {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [isFiltering, setIsFiltering] = useState(false);

  const [isLoading, setIsLoading] = useState(true); 

  const [sortField, setSortField] = useState<string>('breed'); // Default sort by breed
const [sortOrder, setSortOrder] = useState<string>('asc'); // Default ascending order

const [matchedDog, setMatchedDog] = useState<string | null>(null);

const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);
  const [totalDogs, setTotalDogs] = useState<number>(0);
  const [nextPageQuery, setNextPageQuery] = useState<string | null>(null);




const url = `https://frontend-take-home-service.fetch.com/dogs/search?sort=${sortField}:${sortOrder}`;

const [filterCriteria, setFilterCriteria] = useState<DogSearchParams>({
  breeds: [],
  zipCodes: [],
  ageMin: undefined,
  ageMax: undefined,
});



  useEffect(() => {
    console.log('DogList component mounted');
  

    fetchDogIds();
  }, [currentPage]);

    // Fetch dog IDs from the API
    async function fetchDogIds() {
      try {
        const response = await axios.get(
          `${url}&size=${pageSize}&from=${(currentPage - 1) * pageSize}`,
          {
            withCredentials: true,
          }
        );
  
        if (response.status === 200) {
          const dogIds: string[] = response.data.resultIds;
          setNextPageQuery(response.data.next);
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

    async function fetchDogDetails(dogIds: string[]) {
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
          // Set the 'dogs' state directly with the new list of dogs
          setDogs(dogResponse.data);
        } else {
          console.error('Failed to fetch dog details. Status:', dogResponse.status);
        }
      } catch (error) {
        console.error('An error occurred during fetch: details', error);
      }
    }
    
  
  
   

  const handleFilterSort = (searchParams: DogSearchParams) => {
    // Update the filterCriteria state with the provided search parameters
    setFilterCriteria(searchParams);
  
    // Filter and sort the dogs based on the criteria
    const filteredAndSortedDogs = dogs
      .filter((dog) => {
        // Filter by breed (case-insensitive)
        if (
          searchParams.breeds.length > 0 &&
          !searchParams.breeds.some((breed) =>
            dog.breed.toLowerCase().includes(breed.toLowerCase())
          )
        ) {
          return false;
        }
  
        // Filter by zip code
        if (
          searchParams.zipCodes.length > 0 &&
          !searchParams.zipCodes.includes(dog.zip_code)
        ) {
          return false;
        }
  
        // Filter by age range
        if (
          (searchParams.ageMin !== undefined && dog.age < searchParams.ageMin) ||
          (searchParams.ageMax !== undefined && dog.age > searchParams.ageMax)
        ) {
          return false;
        }
  
        return true;
      })
      .sort((a, b) => {
        const fieldA = (a as any)[sortField] || ''; // Use type assertion as any
        const fieldB = (b as any)[sortField] || ''; // Use type assertion as any
  
        if (sortOrder === 'asc') {
          return fieldA.localeCompare(fieldB);
        } else {
          return fieldB.localeCompare(fieldA);
        }
      });
  
    // Update the 'dogs' state with the filtered and sorted results
    setDogs(filteredAndSortedDogs);
  };
  
  
  
  async function fetchMatchedDog(dogIds: string[]): Promise<string | null> {
    try {
      const response = await axios.post(
        'https://frontend-take-home-service.fetch.com/dogs/match',
        dogIds,
        {
          withCredentials: true,
        }
      );
  
      if (response.status === 200) {
        const match: string = response.data.match;
        console.log('i matched bro', match)
        const matchDogDetails = await fetchDogDetails([match])
        setMatchedDog(match)
        return match;
      } else {
        console.error('Failed to fetch matched dog. Status:', response.status);
        return null;
      }
    } catch (error) {
      console.error('An error occurred during fetch:', error);
      return null;
    }
  }

  const handleFindMatch = async () => {
  const dogIds = dogs.map((dog) => dog.id); // Assuming 'dogs' is your array of dogs

  const matchedDog = await fetchMatchedDog(dogIds);

  if (matchedDog) {
    // You can now display or handle the matched dog as needed
    console.log('Matched dog ID:', matchedDog);
  }
};

const loadNextPage = () => {
  if (nextPageQuery) {
    setCurrentPage((prevPage) => prevPage + 1);
    
  }
};

const loadPrevPage = () => {
  if (nextPageQuery) {
    setCurrentPage((prevPage) => prevPage - 1);
    
  }
};






  
  return (
    <div>
      <h2>Dog Breeds</h2>
      <h3>{currentPage}</h3>
      <div>
        <DogSearch onFilterSort={handleFilterSort} />
      </div>
      <div>
      <Button onClick={handleFindMatch}>Find My Match</Button>

      </div>
      <div>
      {matchedDog && <MatchedDog dogId={matchedDog} />}
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
        <div>
          <div className='pages'>
       <Button className='bg-light text-dark' onClick={loadPrevPage}>Back</Button>
       <p>
        Current Page: {currentPage}
       </p>
      <Button className='bg-success' onClick={loadNextPage}>Go to Page {currentPage+1}</Button>
      </div>
        <Container>
          <Row>
            {dogs.map((dog, index) => (
              <Col sm={12} md={6} lg={4} xl={3} key={index}>
                <DogCard dog={dog} />
              </Col>
            ))}
          </Row>
        </Container>
        <div className='pages'>
       <Button className='bg-light text-dark' onClick={loadPrevPage}>Back</Button>
       <p>
        Current Page: {currentPage}
       </p>
      <Button className='bg-success' onClick={loadNextPage}>Go to Page {currentPage+1}</Button>
      </div>
        </div>
      )}
       
    </div>
  );
};

export default DogList;
