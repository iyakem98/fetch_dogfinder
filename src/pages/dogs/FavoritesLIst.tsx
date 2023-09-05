import React from 'react';
import DogCard from '../../components/dogComponents/DogCard';

interface FavoritesListProps {
  favoriteDogs: string[]; // An array of string dog IDs
  onFavoriteToggle: (dogId: string) => void;
  dogs: {
    id: string;
    name: string;
    age: number;
    zip_code: string;
    breed: string;
    img: string;
  }[]; // An array of Dog objects
}

const FavoritesList: React.FC<FavoritesListProps> = ({ favoriteDogs, onFavoriteToggle, dogs }) => {
  return (
    <div className="favorites-container">
      {dogs.map((dog) => (
        <DogCard
          key={dog.id}
          dog={dog} // Pass the Dog object
          onFavoriteToggle={onFavoriteToggle} // Pass the onFavoriteToggle function
          favoriteDogs={favoriteDogs} // Pass the favoriteDogs array
        />
      ))}
    </div>
  );
};

export default FavoritesList;
