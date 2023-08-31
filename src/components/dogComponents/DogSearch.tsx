import React, { useState } from 'react';
import './DogSearch.css';
import { Form, Button, FormGroup, FormLabel, FormControl } from 'react-bootstrap';

interface DogSearchParams {
  breeds: string[];
  zipCodes: string[];
  ageMin?: number | undefined;
  ageMax?: number | undefined;
}

interface DogSearchProps {
  onFilterSort: (searchParams: DogSearchParams) => void;
}

const DogSearch: React.FC<DogSearchProps> = ({ onFilterSort }) => {
  const [searchParams, setSearchParams] = useState<DogSearchParams>({
    breeds: [],
    zipCodes: [],
    ageMin: undefined,
    ageMax: undefined,
  });

  const [isVisible, setIsVisible] = useState(false);

  const handleSearch = () => {
    onFilterSort(searchParams);
  };

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setSearchParams({
      ...searchParams,
      [name]: value,
    });
  };

  return (
    <div>
      <Button onClick={toggleVisibility} variant="primary">
        Filter
      </Button>
      {isVisible && (
        <div className="search-container">
          <Form onSubmit={handleSearch}>
            <FormGroup>
              <FormLabel>Breed:</FormLabel>
              <FormControl
                type="text"
                name="breeds"
                value={searchParams.breeds}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <FormLabel>Zip Code:</FormLabel>
              <FormControl
                type="text"
                name="zipCodes"
                value={searchParams.zipCodes}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <FormLabel>Age Min:</FormLabel>
              <FormControl
                type="number"
                name="ageMin"
                value={searchParams.ageMin}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <FormLabel>Age Max:</FormLabel>
              <FormControl
                type="number"
                name="ageMax"
                value={searchParams.ageMax}
                onChange={handleChange}
              />
            </FormGroup>
            <Button type="submit" variant="primary">
              Search
            </Button>
          </Form>
        </div>
      )}
    </div>
  );
};

export default DogSearch;
