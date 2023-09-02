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
}

const DogCard: React.FC<DogCardProps> = ({ dog }) => {
  return (
    <Card className="dog-card"> {/* Apply the 'dog-card' class */}
      <Card.Img variant="top" src={dog.img} alt={dog.name} />
      <Card.Body>
        <Card.Title>Name: {dog.name}</Card.Title>
        <Card.Text>Age: {dog.age}</Card.Text>
        <Card.Text>Zip Code: {dog.zip_code}</Card.Text>
        <Card.Text>Breed: {dog.breed}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default DogCard;
