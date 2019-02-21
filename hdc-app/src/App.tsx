import * as Chart from 'chart.js';
import * as React from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { BsPrefixProps, ReplaceProps } from 'react-bootstrap/helpers';
import { Scatter } from 'react-chartjs-2';
import { calcPlotData } from './algorithm';
import './App.css';
import { loadSettingInteger, loadSettingString, saveSettingNumber, saveSettingString } from './data_store';
import InputWithSlider from './InputWithSlider';

const CHART_COLORS = {
  blue: "#00FF00",
  red: "#FF0000"
};

/**
 * アプリケーション全体
 */
const App: React.SFC = () => {
  const createGraphData = () => {
    const plotData = calcPlotData(maxHp, armor, nowHp);
    return {
      datasets: [{
        backgroundColor: Chart.helpers.color(CHART_COLORS.red).alpha(0.2).rgbString(),
        borderColor: CHART_COLORS.red,
        data: plotData,
        label: name
      }]
    };
  }

  // Hooksを設定した
  const [maxHp, setMaxHp] = React.useState(loadSettingInteger('maxHp', 35));
  const [armor, setArmor] = React.useState(loadSettingInteger('armor', 49));
  const [nowHp, setNowHp] = React.useState(loadSettingInteger('nowHp', 35));
  const [name, setName] = React.useState(loadSettingString('name', '入力値'));
  const [graphData, setGraphData] = React.useState(createGraphData());

  // 使用する関数を作成した
  const setMaxHpFunc = (value: number) => {
    setMaxHp(value);
    saveSettingNumber('maxHp', value);
    redrawGraphFunc();
  };

  const setArmorFunc = (value: number) => {
    setArmor(value);
    saveSettingNumber('armor', value);
    redrawGraphFunc();
  };

  const setNowHpFunc = (value: number) => {
    setNowHp(value);
    saveSettingNumber('nowHp', value);
    redrawGraphFunc();
  };

  const onChangeName = (e: React.ChangeEvent<ReplaceProps<"input", BsPrefixProps<"input">>>) => {
		const nameValue = e.target.value;
		if (typeof(nameValue) === "string") {
      setName(nameValue);
      saveSettingString('name', nameValue);
      redrawGraphFunc();
    }
	};

  const redrawGraphFunc = () => {
    setGraphData(createGraphData());
  }

  return (
    <>
      <Container className="my-3">
        <Row>
          <Col xs={12} md={6} className="mx-auto">
            <h1 className="text-center">艦娘大破率計算機</h1>
            <Form className="border p-3">
              <Form.Group controlId="param">
                <InputWithSlider label="最大耐久" min={Math.max(1, nowHp)} max={200} initialValue={maxHp} setFunc={setMaxHpFunc} />
                <InputWithSlider label="艦娘装甲" min={0} max={200} initialValue={armor} setFunc={setArmorFunc} />
                <InputWithSlider label="現在耐久" min={1} max={Math.min(200, maxHp)} initialValue={nowHp} setFunc={setNowHpFunc} />
                <div className="d-flex my-1">
                  <Form.Label className="mr-3 text-nowrap mt-2">設定名</Form.Label>
                  <Form.Control type='text' value={name} onChange={onChangeName}/>
                </div>
              </Form.Group>
              <Button type="button" className="w-100">追加</Button>
            </Form>
            <Scatter width={450} height={450} data={graphData} options={{
              elements: { line: { tension: 0 } },
              scales: {
                xAxes: [{ scaleLabel: { display: true, labelString: '最終攻撃力' }, }],
                yAxes: [{ scaleLabel: { display: true, labelString: '大破率(％)' }, }]
              },
              showLines: true
            }} />
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default App
