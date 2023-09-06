/* This is the FilterContext component that basically globalizes the properties of each dog that are subject to edit using
filtering. By moving these properties here, we make sure their changes are globalized and each component can access the 
latest versions of them. For example, if we want to go to the next page after filtering, this makes sure that our filters
are still set in place when we go to the next page. */

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DogSearchParams {
  breeds: string[];
  zipCodes: string[];
  ageMin?: number | null;
  ageMax?: number | null;
}

interface FilterContextType {
  filterCriteria: DogSearchParams; 
  setFilterCriteria: (criteria: DogSearchParams) => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const useFilterContext = (): FilterContextType => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilterContext must be used within a FilterProvider');
  }
  return context;
};

export const FilterProvider: React.FC<{ children: ReactNode }>  = ({ children }) => {
  const [filterCriteria, setFilterCriteria] = useState<DogSearchParams>({
    breeds: [],
    zipCodes: [],
    ageMin: undefined,
    ageMax: undefined,
  });

  return (
    <FilterContext.Provider value={{ filterCriteria, setFilterCriteria }}>
      {children}
    </FilterContext.Provider>
  );
};
