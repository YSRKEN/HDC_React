import * as Chart from 'chart.js';
import * as React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { BsPrefixProps, ReplaceProps } from 'react-bootstrap/helpers';
import { calcPlotData } from './algorithm';
import './App.css';
import { loadSettingInteger, loadSettingString, saveSettingNumber, saveSettingString } from './data_store';
import InputSetting from './InputSetting';
import OutputGraph from './OutputGraph';

const CHART_COLORS = {
  blue: "#00FF00",
  red: "#FF0000"
};

/**
 * アプリケーション全体
 */
const App: React.FC = () => {
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
            <InputSetting armor={armor} maxHp={maxHp} name={name} nowHp={nowHp}
              setArmorFunc={setArmorFunc} setMaxHpFunc={setMaxHpFunc}
              setNowHpFunc={setNowHpFunc} onChangeName={onChangeName}/>
            <OutputGraph data={graphData}/>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default App
