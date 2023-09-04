import React, { useState } from 'react';
import { Form, FormGroup, FormLabel, FormControl, Button } from 'react-bootstrap';

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

  const [isVisible, setIsVisible] = useState(false); // Initially visible

  const handleLocationFilterChange = () => {
    onLocationFilterChange(locationParams);
  };

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault(); 
    onLocationFilterChange(locationParams);
  };




  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  event.preventDefault();
  const { name, value } = event.target;

  if (name === 'city') {
    // If name is "city," set the value as a string
    setLocationParams({
      ...locationParams,
      [name]: value.trim(), // Trim whitespace
    });
  } else {
    // For other names (including "states"), split the input value by commas to create an array
    setLocationParams({
      ...locationParams,
      [name]: value.split(',').map((item) => item.trim()), // Split by comma and trim whitespace
    });
  }
};

  return (
    <div>
      <div>
        <Button
          onClick={toggleVisibility}
          variant="primary"
          className="filter-button"
        >
          Filter Loc
        </Button>
      </div>
      {isVisible && (
        <div>
          <Form onSubmit={handleSearch}>
          <FormGroup>
  <FormLabel className="form-label">City:</FormLabel>
  <FormControl
    type="text"
    name="city"
    value={locationParams.city}
    //onChange={handleChange}
    onChange={(e) => setLocationParams({ ...locationParams, city: e.target.value })}
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
            <Button type="submit">Apply Location Filters</Button>
          </Form>
        </div>
      )}
    </div>
  );
};

export default LocationFilter;
