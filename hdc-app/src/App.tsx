import * as Chart from 'chart.js';
import * as React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { calcMinStopperPower, calcPlotData } from './algorithm';
import './App.css';
import EnemySelectorImpl from './containers/EnemySelectorImpl';
import InputSettingImpl from './containers/InputSettingImpl';
import { loadSettingInteger, loadSettingString, saveSettingString } from './data_store';
import FinalAttackSlider from './FinalAttackSlider';
import OutputGraph from './OutputGraph';
import OutputList from './OutputList';

export interface IGraphParam {
  maxHp: number;
  armor: number;
  nowHp: number;
  name: string;
}

export const CHART_COLORS = [
	"#FF4B00",
	"#FFF100",
	"#03AF7A",
	"#005AFF",
	"#4DC4FF",
	"#FF8082",
	"#F6AA00",
	"#990099",
	"#804000",
];

/**
 * アプリケーション全体
 */
const App: React.FC = () => {
  const redrawNowChartData= () => {
    const tempParamList2 = [...paramList, getParam({})];
		setTempParamList(tempParamList2);
		setChartData(createGraphData(tempParamList2, ignoreNames));
  }

  const getParam = (arg: {armor?: number, maxHp?: number, graphName?: string, nowHp?: number}): IGraphParam => {
    return {
      "armor": arg.armor ? arg.armor : loadSettingInteger('armor', 49),
      "maxHp": arg.maxHp ? arg.maxHp : loadSettingInteger('maxHp', 35),
      "name": arg.graphName ? arg.graphName : loadSettingString('name', '入力値'),
      "nowHp": arg.nowHp ? arg.nowHp : loadSettingInteger('nowHp', 35),
    };
  }

	const createGraphData = (paramListArgs: IGraphParam[], ignoreNamesArgs: string[]) => {
		let rightXValue = 200;
		if (ignoreNamesArgs.length !== paramListArgs.length) {
			rightXValue = Math.max(...paramListArgs
				.filter(param => !ignoreNamesArgs.includes(param.name))
				.map(param => calcMinStopperPower(param.armor, param.nowHp)));
    }
    const datasets = {
			datasets: paramListArgs.map((param, i) => ({
				backgroundColor: Chart.helpers.color(CHART_COLORS[i]).alpha(0.2).rgbString(),
				borderColor: CHART_COLORS[i],
				data: calcPlotData(param.maxHp, param.armor, param.nowHp, rightXValue + 10),
				fill: false,
				label: param.name,
				pointRadius: 0
			}))
    };
    return datasets;
	};

  const createNewName = (nameArgs: string, list: string[]) => {
    nameArgs = nameArgs.replace(/-[0-9]+$/g, '');
    let i = 2;
    while(true) {
      const name2 = `${nameArgs}-${i}`;
      if (list.includes(name2)) {
        ++i;
      } else {
        return name2;
      }
    }
  }

  const addParam = () => {
    const param1 = getParam({});
    if (paramList.map(p => p.name).includes(param1.name)) {
      return;
    }
    if (paramList.map(p => `${p.maxHp}-${p.armor}-${p.nowHp}`).includes(`${param1.maxHp}-${param1.armor}-${param1.nowHp}`)) {
      return;
    }
    const newParamList = [...paramList, param1];
    setParamList(newParamList);
    saveSettingString('paramList', JSON.stringify(newParamList));
    const newName = createNewName(name, newParamList.map(p => p.name));
    saveSettingString('name', newName);
    const param2 = getParam({graphName: newName});
    setTempParamList([...paramList, param1, param2]);
  };

  const deleteParam = (deletedName: string) => {
    if (paramList.map(p => p.name).includes(deletedName)) {
      const newParamList = [];
      for (const data of paramList){
        if (data.name === deletedName) {
          continue;
        }
        const newData = {
          "armor": data.armor,
          "maxHp": data.maxHp,
          "name": data.name,
          "nowHp": data.nowHp,
        };
        newParamList.push(newData);
      }
      setParamList(newParamList);
      saveSettingString('paramList', JSON.stringify(newParamList));
      const newName = createNewName(name, newParamList.map(p => p.name));
      saveSettingString('name', newName);
      const param2 = getParam({graphName: newName});
      const tempParamList2 = [...paramList, param2];
      setTempParamList(tempParamList2);
      setChartData(createGraphData(tempParamList2, ignoreNames));
    }
  };

  const setFinalAttackFunc = (value: number) => {
    setFinalAttack(value);
    const temp: any = chartData.datasets;
    const result = temp.map((data: any) => {
      const plotData = data.data;
      const plotDataLen = plotData.length;
      if (plotData[0].x > value) {
        return {'value': plotData[0].y, 'label': data.label};
      } else if (plotData[plotDataLen - 1].x < value) {
        return {'value': plotData[plotDataLen - 1].y, 'label': data.label};
      } else {
        return {'value': plotData.filter((pair: any) => pair.x === value).map((pair:any) => pair.y)[0], 'label': data.label};
      }
    });
    // tslint:disable-next-line: no-console
    console.log(result);
    let logText = '';
    for (const pair of result) {
      logText += `${pair.label}：${pair.value}％\n`
    }
    setCursorLog(logText);
  }

  // Hooksを設定した
  const [finalAttack, setFinalAttack] = React.useState(50);
  const [paramList, setParamList] = React.useState<IGraphParam[]>(
    JSON.parse(loadSettingString('paramList', '[]'))
  );
  const [tempParamList, setTempParamList] = React.useState<IGraphParam[]>([...paramList, getParam({})]);
  const [ignoreNames, setIgnoreNames] = React.useState<string[]>([]);
  const [minFinalAttack, setMinFinalAttack] = React.useState(0);
  const [maxFinalAttack, setMaxFinalAttack] = React.useState(200);
  const [chartData, setChartData] = React.useState<Chart.ChartData>(createGraphData(tempParamList, ignoreNames));
  const [cursorLog, setCursorLog] = React.useState('');

  React.useEffect(() => {
    const temp: any = chartData.datasets;
    const minX = Math.min(...temp.map(
      (data: any) => Math.min(...data.data.map(
        (pair: any) => pair.x
      ))
    ));
    const maxX = Math.max(...temp.map(
      (data: any) => Math.max(...data.data.map(
        (pair: any) => pair.x
      ))
    ));
    setMinFinalAttack(minX);
    setMaxFinalAttack(maxX);
  }, [chartData]);

  return (
    <>
      <Container className="my-3">
        <Row>
          <Col xs={12} md={6} className="mx-auto">
            <h1 className="text-center">艦娘大破率計算機</h1>
            <InputSettingImpl redrawNowChartData={redrawNowChartData} addParam={addParam}/>
            <OutputGraph graphData={chartData} setIgnoreNames={setIgnoreNames} />
            <EnemySelectorImpl/>
            <FinalAttackSlider initialValue={finalAttack} min={minFinalAttack} max={maxFinalAttack}
              setFinalAttackFunc={setFinalAttackFunc} cursorLog={cursorLog}/>
            <OutputList params={paramList} deleteParam={deleteParam}/>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default App
