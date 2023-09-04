import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Row, Col, Container, Button } from 'react-bootstrap';
import DogCard from '../../components/dogComponents/DogCard';
import DogSearch from '../../components/dogComponents/DogSearch';
import LocationFilter from '../../components/dogComponents/LocationFilter';
import './DogList.css';

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
  match: string;
}

interface LocSearchParams {
  city: string;
  states: string[];
  zipCodes: string[];
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

  const [searchParams, setSearchParams] = useState<DogSearchParams>({
    breeds: [],
    zipCodes: [],
    ageMin: undefined,
    ageMax: undefined,
  });

  const [dogListParams, setDogListParams] = useState<DogSearchParams>({
    breeds: [],
    zipCodes: [],
    ageMin: undefined,
    ageMax: undefined,
  });

  const [filterCriteria, setFilterCriteria] = useState<DogSearchParams>({
    breeds: [],
    zipCodes: [],
    ageMin: undefined,
    ageMax: undefined,
  });

  const [searchLocParams, setSearchLocParams] = useState<LocSearchParams>({
    city: '',
    states: [],
    zipCodes: []
  });

  const [locFilterCriteria, setLocFilterCriteria] = useState<LocSearchParams>({
    city: '',
    states: [],
    zipCodes: []
  });
  
  



  

  useEffect(() => {
    console.log('DogList component mounted');

    fetchDogIds(sortOrder, pageSize, currentPage, searchParams.breeds, searchParams.zipCodes, searchParams.ageMin, searchParams.ageMax);
  }, [sortOrder, pageSize, currentPage]);

  async function fetchDogIds(
    sortOrder: string = 'asc',
    customPageSize: number | undefined,
    customCurrentPage: number | undefined,
    breeds: string[] = [],
    zipCodes: string[] = [],
    ageMin: number | undefined,
    ageMax: number | undefined
  ) {
    try {
      const page = customCurrentPage || currentPage;
      const size = customPageSize || pageSize;
  
      const breedsQueryParam = breeds.length > 0 ? `breeds[]=${breeds.join('&breeds[]=')}` : '';
      const zipCodesQueryParam = zipCodes.length > 0 ? `zipCodes[]=${zipCodes.join('&zipCodes[]=')}` : '';
      const ageMinQueryParam = ageMin ? `&ageMin=${ageMin}` : '';
      const ageMaxQueryParam = ageMax ? `&ageMax=${ageMax}` : '';
      
      const response = await axios.get(
        `https://frontend-take-home-service.fetch.com/dogs/search?sort=${sortField}:${sortOrder}&${breedsQueryParam}&${zipCodesQueryParam}&${ageMinQueryParam}&${ageMaxQueryParam}&size=${size}&from=${(page - 1) * size}`,
        {
          withCredentials: true,
        }
      );

      console.log( `popo https://frontend-take-home-service.fetch.com/dogs/search?sort=${sortField}:${sortOrder}&${breedsQueryParam}&${zipCodesQueryParam}&${ageMinQueryParam}&${ageMaxQueryParam}&size=${size}&from=${(page - 1) * size}`,)
      

      console.log('a whaaa', breedsQueryParam)
  
      if (response.status === 200) {
        const dogIds: string[] = response.data.resultIds;
        setNextPageQuery(response.data.next);
        fetchDogDetails(dogIds);
      } else {
        console.error('Failed to fetch dog IDs. Status:', response.status);
      }
    } catch (error) {
      console.error('An error occurred during fetch:', error);
    } finally {
      setIsLoading(false);
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
    console.log('searchParams:', searchParams);
    console.log('Breeds:', searchParams.breeds);
    console.log('Zip Codes:', searchParams.zipCodes);
    console.log('Age Min:', searchParams.ageMin);
    console.log('Age Max:', searchParams.ageMax);
  
    // Call fetchDogIds with the filter parameters
    fetchDogIds(sortOrder, pageSize, currentPage, searchParams.breeds, searchParams.zipCodes, searchParams.ageMin, searchParams.ageMax);
  };
  
  
/*  const handleLocation = async (searchLocParams: LocSearchParams) => {
   
    setLocFilterCriteria(searchLocParams)
    console.log('loc params:', searchLocParams)
  }; */

  const handleLocation = async (searchLocParams: LocSearchParams) => {
    try {
      // Define the request body based on the provided searchLocParams
      const requestBody: any = {
        city: searchLocParams.city, // Set the city parameter
      };
  
      // Check if there are items in the states array before setting it
      if (searchLocParams.states && searchLocParams.states.length > 0) {
        requestBody.states = searchLocParams.states; // Set the states parameter (an array of two-letter state/territory abbreviations)
      }
  
      // Add other parameters as needed (e.g., geoBoundingBox, size, from)
  
      console.log(requestBody);
  
      // Make the POST request to /locations/search
      const response = await axios.post('https://frontend-take-home-service.fetch.com/locations/search', requestBody, {
        withCredentials: true, // Include credentials if required
      });
  
      if (response.status === 200) {
        // Handle the response data, which contains the results
        const searchResults = response.data.results;
        const totalResults = response.data.total;
  
        console.log('Location search results:', searchResults);
        console.log('Total results:', totalResults);

        const zipCodes = searchResults.map((result: any) => result.zip_code);
      console.log('Zip Codes:', zipCodes);

      if (zipCodes.length > 1) {
        // Call fetchDogIds with the zipCodes array
        fetchDogIds(sortOrder, pageSize, currentPage, searchParams.breeds, zipCodes, searchParams.ageMin, searchParams.ageMax);
      }

  
        // You can further process or display the search results here
      } else {
        console.error('Failed to fetch location search results. Status:', response.status);
      }
    } catch (error) {
      console.error('An error occurred during location search:', error);
    }
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
        console.log('i matched bro', match);
        const matchDogDetails = await fetchDogDetails([match]);
        setMatchedDog(match);
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
      // Pass the current sortOrder to fetch the next page with the same sorting order
      fetchDogIds(sortOrder, pageSize, currentPage + 1, searchParams.breeds, searchParams.zipCodes, searchParams.ageMin, searchParams.ageMax);
    }
  };

  const loadPrevPage = () => {
    if (nextPageQuery) {
      setCurrentPage((prevPage) => prevPage - 1);
      fetchDogIds(sortOrder, pageSize, currentPage - 1, searchParams.breeds, searchParams.zipCodes, searchParams.ageMin, searchParams.ageMax);
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
        <LocationFilter onLocationFilterChange={handleLocation} />
      </div>
      <div>
        <Button onClick={handleFindMatch}>Find My Match</Button>
      </div><div>
        <Button onClick={handleFindMatch}>Set Locations</Button>
      </div>
      <div>{matchedDog && <MatchedDog dogId={matchedDog} />}</div>
      <div>
      <Button
          onClick={() => {
            const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
            setSortOrder(newSortOrder);
            fetchDogIds(newSortOrder, pageSize, currentPage, searchParams.breeds, searchParams.zipCodes, searchParams.ageMin, searchParams.ageMax);
          }}
        >
          Toggle Sort Order
        </Button>
      </div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <div className="pages">
            <Button className="bg-light text-dark" onClick={loadPrevPage}>
              Back
            </Button>
            <p>Current Page: {currentPage}</p>
            <Button className="bg-success" onClick={loadNextPage}>
              Go to Page {currentPage + 1}
            </Button>
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
          <div className="pages">
            <Button className="bg-light text-dark" onClick={loadPrevPage}>
              Back
            </Button>
            <p>Current Page: {currentPage}</p>
            <Button className="bg-success" onClick={loadNextPage}>
              Go to Page {currentPage + 1}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DogList;
