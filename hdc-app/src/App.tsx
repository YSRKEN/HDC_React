import * as React from 'react';
import { Col, Container, Form, Row } from 'react-bootstrap';
import { Scatter } from 'react-chartjs-2';
import './App.css';
import InputWithSlider from './InputWithSlider';

/**
 * アプリケーション全体
 */
const App: React.SFC = () => {
  const [graphData] = React.useState({});
  return (
    <>
      <Container className="my-3">
        <Row>
          <Col xs={12} md={6} className="mx-auto">
            <Form>
              <Form.Group controlId="test">
                <InputWithSlider label="最大耐久" min={1} max={200} initialValue={35}/>
                <InputWithSlider label="艦娘装甲" min={0} max={200} initialValue={49}/>
                <InputWithSlider label="現在耐久" min={1} max={200} initialValue={35}/>
              </Form.Group>
              <Scatter data={graphData}/>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default App
