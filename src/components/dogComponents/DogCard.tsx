import React from 'react';
import Card from 'react-bootstrap/Card';
import './DogCard.css'; 
import {Button} from 'react-bootstrap'
import { useEffect } from 'react';
import { FaHeart } from "react-icons/fa";
import {AiFillHeart, AiOutlineHeart} from "react-icons/ai"

interface DogCardProps {
  dog: {
    name: string;
    age: number;
    zip_code: string;
    breed: string;
    img: string;
    id: string;
  };
  favoriteDogs: string[]; 
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
        <Button onClick={handleFavoriteClick}  style = {{padding: '0px'}} variant={isFavorite ? 'white' : 'white'}>
          {isFavorite ? <AiFillHeart size={30} color='red'/>: <AiOutlineHeart size={30}/>}
        </Button>
      </Card.Body>
    </Card>
  );
};

export default DogCard;
