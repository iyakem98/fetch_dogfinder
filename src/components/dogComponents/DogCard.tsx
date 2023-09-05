import React from 'react';
import Card from 'react-bootstrap/Card';
import './DogCard.css'; // Import your CSS file

interface DogCardProps {
  dog: {
    name: string;
    age: number;
    zip_code: string;
    breed: string;
    img: string;
    id: string;
  };
  favoriteDogs: string[]; // Add favoriteDogs prop
  onFavoriteToggle: (dogId: string) => void;
}

const DogCard: React.FC<DogCardProps> = ({ dog, favoriteDogs, onFavoriteToggle }) => {
  const isFavorite = favoriteDogs.includes(dog.id);

  const handleFavoriteClick = () => {
    onFavoriteToggle(dog.id);
  };

  return (
    <Card className="dog-card">
      <Card.Img variant="top" src={dog.img} alt={dog.name} />
      <Card.Body>
        <Card.Title>Name: {dog.name}</Card.Title>
        <Card.Text>Age: {dog.age}</Card.Text>
        <Card.Text>Zip Code: {dog.zip_code}</Card.Text>
        <Card.Text>Breed: {dog.breed}</Card.Text>
        <button onClick={handleFavoriteClick}>
          {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
        </button>
      </Card.Body>
    </Card>
  );
};

export default DogCard;
