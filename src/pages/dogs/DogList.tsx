/* This is the DogList component that is responsible for displaying the list of dogs with or without filters.
There are different interfaces to handle the dog cards and their properties incluiding, search parameters, location parameters,
and matching parameters, all of which will be described in their respective components. Note that the states use context
provider in order to be global so every component can track their changes*/

import React, { useState, useEffect} from 'react';
import axios from 'axios';
import { Row, Col, Container, Button } from 'react-bootstrap';
import DogCard from '../../components/dogComponents/DogCard';
import DogSearch from '../../components/dogComponents/DogSearch';
import LocationFilter from '../../components/dogComponents/LocationFilter';
import './DogList.css';
import {Link, useNavigate} from 'react-router-dom'
import {AiFillHeart, AiOutlineClose} from "react-icons/ai"




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
  ageMin?: number | null;
  ageMax?: number | null;
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
    ageMin: null,
    ageMax: null,
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
    fetchDogIds(filterCriteria, sortOrder, pageSize, currentPage);
  }, [sortOrder, pageSize, currentPage]);

  useEffect(() => {
 
    setFavCounter(favoriteDogs.length);
  }, [favoriteDogs]);


  async function fetchDogIds(
    filterCriteria: DogSearchParams, 
    sortOrder: string = 'asc',
    customPageSize: number | undefined,
    customCurrentPage: number | undefined
  ) {
    try {
      const page = customCurrentPage || currentPage;
      const size = customPageSize || pageSize;
  
      const breedsQueryParam = filterCriteria.breeds.length > 0 ? `breeds[]=${filterCriteria.breeds.join('&breeds[]=')}` : '';
      const zipCodesQueryParam = filterCriteria.zipCodes.length > 0 ? `zipCodes[]=${filterCriteria.zipCodes.join('&zipCodes[]=')}` : '';
      const ageMinQueryParam = filterCriteria.ageMin ? `&ageMin=${filterCriteria.ageMin}` : '';
      const ageMaxQueryParam = filterCriteria.ageMax ? `&ageMax=${filterCriteria.ageMax}` : '';
  
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
          setFilterCriteria(searchParams)
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

      console.log(filterCriteria)
  
      fetchDogIds(filterCriteria, sortOrder, pageSize, currentPage+1);
    }
  };

  const loadPrevPage = () => {
    if (nextPageQuery) {
      setCurrentPage((prevPage) => prevPage - 1);
      fetchDogIds(filterCriteria, sortOrder, pageSize, currentPage-1);
    }
  };

  const handleFavoriteToggle = (dogId: string) => {
    if (favoriteDogs.includes(dogId)) {
      const updatedFavorites = favoriteDogs.filter((id) => id !== dogId);
      setFavoriteDogs(updatedFavorites);
    } else {
      setFavoriteDogs([...favoriteDogs, dogId]);
    }
  };

  const onReset = () => {

    const nullSearchParams = {
      breeds: [],
      zipCodes: [],
      ageMin: null,
      ageMax: null,
    };

    setSearchParams(nullSearchParams)
    
    setFilterCriteria(nullSearchParams);

    // Pass the updated searchParams to fetchDogIds
    fetchDogIds(nullSearchParams, sortOrder, pageSize, currentPage);
  };
  
  const handleSort = () => {
    if (sortOrder === 'asc'){
        setSortOrder('desc');
        fetchDogIds(filterCriteria, 'desc', pageSize, currentPage);
    }

    else {
    setSortOrder('asc');
    fetchDogIds(filterCriteria, 'asc', pageSize, currentPage);
    }
    
  }

  const onBackMatch = () => {
    setMatchedDog(null)
    onReset()
    setFavoriteDogs([]);
  }

  const removeFav = () => {
    setFavoriteDogs([]);
  }
  


  return (
     <div className='listContainer'>
      {!matchedDog && 
       <div>
        <h1 style={{
          marginBottom: "18px"
        }}>Find your next friend!</h1>
      <div className='filtersBox'>
        <div className="mb-3">
          <DogSearch onFilterSort={handleFilterSort} />
        </div>
        <div>
          <Button onClick={onReset} variant='light'>
            Reset all Filters
          </Button>
        </div>
        <div className="mb-3">
          <LocationFilter onLocationFilterChange={handleLocation} />
        </div>
      </div>
      <div className="mb-3" style={{
        display: 'flex',
        width: '100%',
        justifyContent: 'center'
      }}>
      {favCounter > 0 && 
        <div style={{ marginTop: 20, display: 'flex'}}>
            <Button variant='white' onClick={removeFav}>
              Remove Favorites 
            <AiOutlineClose size={20} style={{marginBottom: 12}}/>
          </Button>
          <h4><AiFillHeart size={40} color='red'/>: {favCounter}</h4>
        </div>
      }
        <Button className='matchButton' onClick={() => handleFindMatch(favoriteDogs)} variant="primary">
          Find My Match
        </Button>
      </div>
       </div>
      }
      
      <div>{matchedDog && 
      
      <div style={{display: 'flex'}}>
        <div style={{marginBottom: '20px', width: '20%'}}>
          <Button onClick={onBackMatch} variant='primary' style={{
            height: '50px',
            width: '100px',
            fontSize: '20px',
            marginLeft: '40px'
          }}>
            Go Back
          </Button>
        </div>
        <div style={{ 
          width: '80%',
          //alignItems: 'center',
          paddingRight: '20%'
          
        }}>
        <MatchedDog dogId={matchedDog} />
        </div>
      </div>
      
      
     
      
      
      
      
      }</div>
      <div className="mb-3">
        
      </div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <div className="d-flex justify-content-between align-items-center mb-3">
            {currentPage > 1 &&  
                     <Button variant="light" onClick={loadPrevPage} style={{
                      marginLeft: 12
                     }}>
                     Back to page {currentPage-1}
                   </Button>
            }

            {currentPage === 1 && 

                  <div> </div>
            }
              {!matchedDog && 

                <div className='rightHandSide'>
                <Button
                onClick={handleSort}
                variant="dark"
                >
                {sortOrder === 'asc'? 'Display z-a' : 'Display a-z'}
                </Button>
                <Button className='rightButton' variant="light" onClick={loadNextPage} style={{
                  marginRight: 12,
                }}>
                Go to Page {currentPage + 1}
                </Button>
                </div>

              
              } 
                 
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
             <Button variant="light" onClick={loadPrevPage} style={{
              marginLeft: 12,
             }}>
             Back to page {currentPage-1}
           </Button>
            }
            {currentPage === 1 && 

              <div> </div>
              }

              {!matchedDog && 

            <Button variant="light" onClick={loadNextPage} style={{
              marginRight: 12,
            }}>
            Go to Page {currentPage + 1}
          </Button>
              }

          </div>
        </div>
      )}
    </div>
  );
};

export default DogList;
