import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DogSearchParams {
  breeds: string[];
  zipCodes: string[];
  ageMin?: number | undefined;
  ageMax?: number | undefined;
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
