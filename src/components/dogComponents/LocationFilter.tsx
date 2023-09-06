/*
"""
The LocationFilter component serves as a feature for users to filter dogs based on city or state preferences.
It operates by fetching zip codes, which are subsequently utilized as input for the primary data-fetching API.
"""
*/
import React, { useState } from 'react';
import { Form, FormGroup, FormLabel, FormControl, Button } from 'react-bootstrap';
import './LocationFilter.css'

interface LocationFilterParams {
  city: string;
  states: string[];
  zipCodes: string[];
}

interface LocationFilterProps {
  onLocationFilterChange: (locationParams: LocationFilterParams) => void;
}

const LocationFilter: React.FC<LocationFilterProps> = ({ onLocationFilterChange }) => {
  const [locationParams, setLocationParams] = useState<LocationFilterParams>({
    city: '',
    states: [],
    zipCodes: [],
  });

  const [isVisible, setIsVisible] = useState(false); 

  const handleLocationFilterChange = () => {
    onLocationFilterChange(locationParams);
  };

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault(); 
    setIsVisible(false)
    onLocationFilterChange(locationParams);
  };




  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  event.preventDefault();
  const { name, value } = event.target;

  if (name === 'city') {
    
    setLocationParams({
      ...locationParams,
      [name]: value.trim(), 
    });
  } else {
    
    setLocationParams({
      ...locationParams,
      [name]: value.split(',').map((item) => item.trim()), 
    });
  }
};

  return (
    <div className="location-filter-container">
      {!isVisible && (
        <Button
          onClick={toggleVisibility}
          variant="primary"
          className="filter-button"
        >
          Filter By Location
        </Button>
      )}
      {isVisible && (
        <div>
          <Button
            onClick={toggleVisibility}
            variant="primary"
            className="filter-button bg-secondary"
          >
            Close Location Filter
          </Button>
          <div>
            <Form onSubmit={handleSearch}>
              <FormGroup>
                <FormLabel className="form-label">City:</FormLabel>
                <FormControl
                  type="text"
                  name="city"
                  value={locationParams.city}
                  onChange={handleChange}
                  className="form-control"
                />
              </FormGroup>
              <FormGroup>
                <FormLabel className="form-label">State:</FormLabel>
                <FormControl
                  type="text"
                  name="states"
                  value={locationParams.states}
                  onChange={handleChange}
                  className="form-control"
                />
              </FormGroup>
              {/* Add ZIP code input fields here if needed */}
              <Button type="submit" className="filter-button">
                Apply Location Filters
              </Button>
            </Form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationFilter;
