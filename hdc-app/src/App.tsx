import * as React from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import './App.css';
import InputWithSlider from './InputWithSlider';

/**
 * アプリケーション全体
 */
export default class App extends React.Component {
  public render() {
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
                <Button variant="primary" type="submit">
                  送信
                </Button>
              </Form>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}
