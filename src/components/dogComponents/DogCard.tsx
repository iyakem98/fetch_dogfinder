import React from 'react';
import Card from 'react-bootstrap/Card';

interface DogCardProps {
  dog: {
    name: string;
    age: number;
    zip_code: string;
    breed: string;
    img: string;
    id: string,
  };
}

const DogCard: React.FC<DogCardProps> = ({ dog }) => {
  return (
    <Card style={{ width: '18rem' }}>
      <Card.Img variant="top" src={dog.img} alt={dog.name} /> 
      <Card.Body>
        <Card.Title>Name: {dog.name}</Card.Title>
        <Card.Title>Name: {dog.id}</Card.Title>
        <Card.Text>Age: {dog.age}</Card.Text>
        <Card.Text>Zip Code: {dog.zip_code}</Card.Text>
        <Card.Text>Breed: {dog.breed}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default DogCard;
