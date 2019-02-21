import * as React from 'react';
import { Col, Container, Form, Row } from 'react-bootstrap';
import { Scatter } from 'react-chartjs-2';
import { calcPlotData } from './algorithm';
import './App.css';
import InputWithSlider from './InputWithSlider';

/**
 * アプリケーション全体
 */
const App: React.SFC = () => {
  // Hooksを設定した
  const [maxHp, setMaxHp] = React.useState(35);
  const [armor, setArmor] = React.useState(49);
  const [nowHp, setNowHp] = React.useState(35);
  const [graphData] = React.useState({});

  // 使用する関数を作成した
  const setMaxHpFunc = (value: number) => {
    setMaxHp(value);
    redrawGraphFunc();
  };

  const setArmorFunc = (value: number) => {
    setArmor(value);
    redrawGraphFunc();
  };

  const setNowHpFunc = (value: number) => {
    setNowHp(value);
    redrawGraphFunc();
  };

  const redrawGraphFunc = () => {
    const plotData = calcPlotData(maxHp, armor, nowHp);
    // tslint:disable-next-line:no-console
    console.log(plotData);
  }

  return (
    <>
      <Container className="my-3">
        <Row>
          <Col xs={12} md={6} className="mx-auto">
            <Form>
              <Form.Group controlId="test">
                <InputWithSlider label="最大耐久" min={Math.max(1, nowHp)} max={200} initialValue={maxHp} setFunc={setMaxHpFunc}/>
                <InputWithSlider label="艦娘装甲" min={0} max={200} initialValue={armor} setFunc={setArmorFunc}/>
                <InputWithSlider label="現在耐久" min={1} max={Math.min(200, maxHp)} initialValue={nowHp} setFunc={setNowHpFunc}/>
              </Form.Group>
              <span>{maxHp} {armor} {nowHp}</span>
              <Scatter data={graphData}/>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default App
