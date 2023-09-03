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

  const [isVisible, setIsVisible] = useState(true); // Initially visible

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault(); 
    onFilterSort(searchParams);
  };

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  // ...

const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = event.target;

  if (name === 'breeds' || name === 'zipCodes') {
    // Split the input value by commas to create an array
    setSearchParams({
      ...searchParams,
      [name]: value.split(',').map((item) => item.trim()), // Split by comma and trim whitespace
    });
  } else {
    setSearchParams({
      ...searchParams,
      [name]: value,
    });
  }
};

// ...


  return (
    <div className="dog-search-container">
      <Button
        onClick={toggleVisibility}
        variant="primary"
        className="filter-button"
      >
        Filter
      </Button>
      {isVisible && (
        <div className="search-form">
          <Form onSubmit={handleSearch}>
            <FormGroup>
              <FormLabel className="form-label">Breed:</FormLabel>
              <FormControl
                type="text"
                name="breeds"
                value={searchParams.breeds}
                onChange={handleChange}
                className="form-control"
              />
            </FormGroup>
            <FormGroup>
              <FormLabel className="form-label">Zip Code:</FormLabel>
              <FormControl
                type="text"
                name="zipCodes"
                value={searchParams.zipCodes}
                onChange={handleChange}
                className="form-control"
              />
            </FormGroup>
            <FormGroup>
              <FormLabel className="form-label">Age Min:</FormLabel>
              <FormControl
                type="number"
                name="ageMin"
                value={searchParams.ageMin}
                onChange={handleChange}
                className="form-control"
              />
            </FormGroup>
            <FormGroup>
              <FormLabel className="form-label">Age Max:</FormLabel>
              <FormControl
                type="number"
                name="ageMax"
                value={searchParams.ageMax}
                onChange={handleChange}
                className="form-control"
              />
            </FormGroup>
            <Button type="submit" variant="primary" className="search-button">
              Search
            </Button>
          </Form>
        </div>
      )}
    </div>
  );
};

export default DogSearch;
