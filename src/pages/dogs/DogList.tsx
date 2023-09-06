import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Row, Col, Container, Button } from 'react-bootstrap';
import DogCard from '../../components/dogComponents/DogCard';
import DogSearch from '../../components/dogComponents/DogSearch';
import LocationFilter from '../../components/dogComponents/LocationFilter';
import './DogList.css';
import {Link, useNavigate} from 'react-router-dom'
import {AiFillHeart} from "react-icons/ai"




import { useFilterContext } from '../../context/FilterContext';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

  const { filterCriteria, setFilterCriteria } = useFilterContext();

  const [isLoading, setIsLoading] = useState(true);

  const [sortField, setSortField] = useState<string>('breed'); // Default sort by breed
  const [sortOrder, setSortOrder] = useState<string>('asc'); // Default ascending order

  const [matchedDog, setMatchedDog] = useState<string | null>(null);

  

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);
  const [totalDogs, setTotalDogs] = useState<number>(0);
  const [nextPageQuery, setNextPageQuery] = useState<string | null>(null);

  const [favoriteDogs, setFavoriteDogs] = useState<string[]>([]);
  const [favCounter, setFavCounter] = useState<number>(favoriteDogs.length)

  const [isNoMatch, setIsNoMatch] = useState(false)

  const navigate = useNavigate()

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
    fetchDogIds(searchParams, sortOrder, pageSize, currentPage);
  }, [sortOrder, pageSize, currentPage]);

  useEffect(() => {
    // Update favCounter whenever favoriteDogs changes
    setFavCounter(favoriteDogs.length);
  }, [favoriteDogs]);


  async function fetchDogIds(
    searchParams: DogSearchParams, // Include searchParams as a parameter
    sortOrder: string = 'asc',
    customPageSize: number | undefined,
    customCurrentPage: number | undefined
  ) {
    try {
      const page = customCurrentPage || currentPage;
      const size = customPageSize || pageSize;
  
      const breedsQueryParam = searchParams.breeds.length > 0 ? `breeds[]=${searchParams.breeds.join('&breeds[]=')}` : '';
      const zipCodesQueryParam = searchParams.zipCodes.length > 0 ? `zipCodes[]=${searchParams.zipCodes.join('&zipCodes[]=')}` : '';
      const ageMinQueryParam = searchParams.ageMin ? `&ageMin=${searchParams.ageMin}` : '';
      const ageMaxQueryParam = searchParams.ageMax ? `&ageMax=${searchParams.ageMax}` : '';
  
      const response = await axios.get(
        `https://frontend-take-home-service.fetch.com/dogs/search?sort=${sortField}:${sortOrder}&${breedsQueryParam}&${zipCodesQueryParam}&${ageMinQueryParam}&${ageMaxQueryParam}&size=${size}&from=${(page - 1) * size}`,
        {
          withCredentials: true,
        }
      );
  
      if (response.status === 200) {
        const dogIds: string[] = response.data.resultIds;
        setNextPageQuery(response.data.next);
        fetchDogDetails(dogIds);
      } else if (response.status === 401) {
        navigate('/login');
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
    // Update the filterCriteria state in the context with the provided search parameters
    setFilterCriteria(searchParams);

    // Pass the updated searchParams to fetchDogIds
    fetchDogIds(searchParams, sortOrder, pageSize, currentPage);
  };
  
/*  const handleLocation = async (searchLocParams: LocSearchParams) => {
   
    setLocFilterCriteria(searchLocParams)
    console.log('loc params:', searchLocParams)
  }; */

  const handleLocation = async (searchLocParams: LocSearchParams) => {
    try {
      const requestBody: any = {
        city: searchLocParams.city,
      };

      if (searchLocParams.states && searchLocParams.states.length > 0) {
        requestBody.states = searchLocParams.states;
      }

      const response = await axios.post('https://frontend-take-home-service.fetch.com/locations/search', requestBody, {
        withCredentials: true,
      });

      if (response.status === 200) {
        const searchResults = response.data.results;
        const totalResults = response.data.total;

        const zipCodes = searchResults.map((result: any) => result.zip_code);

        if (zipCodes.length > 1) {
          // Update the searchParams directly with the retrieved zip codes
          searchParams.zipCodes = zipCodes;

          // Call fetchDogIds with the updated searchParams
          fetchDogIds(searchParams, sortOrder, pageSize, currentPage);
        }
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


  const notify = () => toast("Wow so easy!");

  const handleFindMatch = async (favoriteDogIds: string[]) => {
    if (favoriteDogIds.length < 1) {
      toast("Add dogs to your favorites' list first"); 
      return; 
    }
    const randomIndex = Math.floor(Math.random() * favoriteDogIds.length);
    const matchedDogId = favoriteDogIds[randomIndex];
  

    const matchedDog = await fetchMatchedDog([matchedDogId]);
    
  
    if (matchedDog) {

      console.log('Matched dog ID:', matchedDog);
    }
  };
  

  
  const loadNextPage = () => {
    if (nextPageQuery) {
      setCurrentPage((prevPage) => prevPage + 1);
  
      fetchDogIds(searchParams, sortOrder, pageSize, currentPage+1);
    }
  };

  const loadPrevPage = () => {
    if (nextPageQuery) {
      setCurrentPage((prevPage) => prevPage - 1);
      fetchDogIds(searchParams, sortOrder, pageSize, currentPage-1);
    }
  };

  const handleFavoriteToggle = (dogId: string) => {
    if (favoriteDogs.includes(dogId)) {
      // Dog is already in favorites, so remove it
      const updatedFavorites = favoriteDogs.filter((id) => id !== dogId);
      setFavoriteDogs(updatedFavorites);
    } else {
      // Dog is not in favorites, so add it
      setFavoriteDogs([...favoriteDogs, dogId]);
    }
  };
  
  


  return (
     <div className='listContainer'>
      <h2>Find your next friend!</h2>
      {favCounter > 0 && 
        <div style={{ marginTop: 20}}>
          <h4><AiFillHeart size={40} color='red'/>: {favCounter}</h4>
        </div>
      }
      <div className='filtersBox'>
        <div className="mb-3">
          <DogSearch onFilterSort={handleFilterSort} />
        </div>
        <div className="mb-3">
          <LocationFilter onLocationFilterChange={handleLocation} />
        </div>
      </div>
      <div className="mb-3">
        <Button className='matchButton' onClick={() => handleFindMatch(favoriteDogs)} variant="primary">
          Find My Match
        </Button>
      </div>
      <div>{matchedDog && <MatchedDog dogId={matchedDog} />}</div>
      <div className="mb-3">
        
      </div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <div className="d-flex justify-content-between align-items-center mb-3">
            {currentPage > 1 &&  
                     <Button variant="light" onClick={loadPrevPage}>
                     Back
                   </Button>
            }

            {currentPage === 1 && 

                  <div> </div>
            }
               
                  <div className='rightHandSide'>
                  <Button
                onClick={() => {
                  const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
                  setSortOrder(newSortOrder);
                  fetchDogIds(searchParams, sortOrder, pageSize, currentPage);
                }}
                variant="dark"
              >
                Reverse Result
              </Button>
            <Button className='rightButton' variant="light" onClick={loadNextPage}>
              Go to Page {currentPage + 1}
            </Button>
            </div>
            {/*<p>Current Page: {currentPage}</p> */}
         
          </div>
          <Container>
            <Row>
            {dogs.map((dog, index) => (
              <Col sm={12} md={6} lg={4} xl={3} key={index}>
                <DogCard dog={dog} favoriteDogs={favoriteDogs} onFavoriteToggle={handleFavoriteToggle} />
              </Col>
            ))}

            </Row>
          </Container>
          <div className="d-flex justify-content-between align-items-center mt-3">
            {currentPage > 1 && 
             <Button variant="light" onClick={loadPrevPage}>
             Back
           </Button>
            }
            {currentPage === 1 && 

              <div> </div>
              }

            <Button variant="success" onClick={loadNextPage}>
              Go to Page {currentPage + 1}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DogList;
