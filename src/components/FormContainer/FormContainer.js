import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const FormContainer = ({children}) => {
  return (
      <Container>
          <Row classname = 'justify-content-md-center'>
              <Col>
                  {children}
              </Col>
          </Row>
      </Container>
  )
};

export default FormContainer;
