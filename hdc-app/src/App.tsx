import * as React from 'react';
import { ChartData } from 'chart.js';
import { Col, Container, Row } from 'react-bootstrap';
import './App.css';
import OutputGraph from './components/OutputGraph';
import OutputList from './components/OutputList';
import EnemySelectorImpl from './containers/EnemySelectorImpl';
import FinalAttackSliderImpl from './containers/FinalAttackSliderImpl';
import InputSettingImpl from './containers/InputSettingImpl';
import { calcMinStopperPower, calcPlotData } from './services/algorithm';
import { loadSettingInteger, loadSettingString, saveSettingString } from './services/local_storage';

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

interface IGraphPoint {
  x: number;
  y: number;
}

type ScatterChartData = ChartData<'scatter', IGraphPoint[], number>;

const hexToRgba = (hexColor: string, alpha: number): string => {
  const hex = hexColor.replace('#', '');
  if (hex.length !== 6) {
    return hexColor;
  }
  const r = Number.parseInt(hex.slice(0, 2), 16);
  const g = Number.parseInt(hex.slice(2, 4), 16);
  const b = Number.parseInt(hex.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

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
      "armor": arg.armor ?? loadSettingInteger('armor', 49),
      "maxHp": arg.maxHp ?? loadSettingInteger('maxHp', 35),
      "name": arg.graphName ?? loadSettingString('name', '入力値'),
      "nowHp": arg.nowHp ?? loadSettingInteger('nowHp', 35),
    };
  }

	const createGraphData = (paramListArgs: IGraphParam[], ignoreNamesArgs: string[]): ScatterChartData => {
		let rightXValue = 200;
		if (ignoreNamesArgs.length !== paramListArgs.length) {
			rightXValue = Math.max(...paramListArgs
				.filter(param => !ignoreNamesArgs.includes(param.name))
				.map(param => calcMinStopperPower(param.armor, param.nowHp)));
    }
    const datasets: ScatterChartData = {
			datasets: paramListArgs.map((param, i) => ({
				backgroundColor: hexToRgba(CHART_COLORS[i % CHART_COLORS.length], 0.2),
				borderColor: CHART_COLORS[i],
				data: calcPlotData(param.maxHp, param.armor, param.nowHp, rightXValue + 10),
				fill: false,
				label: param.name,
				pointRadius: 0,
        showLine: true
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
    const newName = createNewName(graphName, newParamList.map(p => p.name));
    saveSettingString('name', newName);
    setGraphName(newName);
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
      const newName = createNewName(graphName, newParamList.map(p => p.name));
      saveSettingString('name', newName);
      setGraphName(newName);
      const param2 = getParam({graphName: newName});
      const tempParamList2 = [...paramList, param2];
      setTempParamList(tempParamList2);
      setChartData(createGraphData(tempParamList2, ignoreNames));
    }
  };

  /**
   * カーソル(value)を合わせた位置の大破率のテキストを生成する
   * @param value カーソル値
   * @param chart グラフ情報
   */
  const calcLogText = (value: number, chart: ScatterChartData): string => {
    const result = chart.datasets.map(data => {
      const plotData = data.data as IGraphPoint[];
      const plotDataLen = plotData.length;
      if (plotDataLen === 0) {
        return {'value': 0, 'label': data.label ?? ''};
      }
      if (plotData[0].x > value) {
        return {'value': plotData[0].y, 'label': data.label ?? ''};
      } else if (plotData[plotDataLen - 1].x < value) {
        return {'value': plotData[plotDataLen - 1].y, 'label': data.label ?? ''};
      } else {
        const sameXPair = plotData.find(pair => pair.x === value);
        const fallback = sameXPair ?? plotData[plotDataLen - 1];
        return {'value': fallback.y, 'label': data.label ?? ''};
      }
    });
    let logText = '';
    for (const pair of result) {
      logText += `${pair.label}：${pair.value}％\n`
    }
    return logText;
  }

  /**
   * カーソル(value)を合わせた位置の大破率のテキストを生成する
   * @param value カーソル値
   */
  const calcLogTextImpl = (value: number): string => calcLogText(value, chartData);

  const setFinalAttack2 = (value: number) => {
    setFinalAttack(value);
    setCursorLog(calcLogTextImpl(value));
  }

  // Hooksを設定した
	const [graphName, setGraphName] = React.useState(loadSettingString('name', '入力値'));
  const [paramList, setParamList] = React.useState<IGraphParam[]>(
    JSON.parse(loadSettingString('paramList', '[]'))
  );
  const [tempParamList, setTempParamList] = React.useState<IGraphParam[]>([...paramList, getParam({})]);
  const [ignoreNames, setIgnoreNames] = React.useState<string[]>([]);
  const [minFinalAttack, setMinFinalAttack] = React.useState(0);
  const [maxFinalAttack, setMaxFinalAttack] = React.useState(200);
  const [chartData, setChartData] = React.useState<ScatterChartData>(createGraphData(tempParamList, ignoreNames));
  const [finalAttack, setFinalAttack] = React.useState(50);
	const [cursorLog, setCursorLog] = React.useState('');

  React.useEffect(() => {
    const datasets = chartData.datasets.map(data => data.data as IGraphPoint[]);
    if (datasets.length === 0) {
      return;
    }
    const minX = Math.min(...datasets.map(data => Math.min(...data.map(pair => pair.x))));
    const maxX = Math.max(...datasets.map(data => Math.max(...data.map(pair => pair.x))));
    setMinFinalAttack(minX);
    setMaxFinalAttack(maxX);
  }, [chartData]);

  return (
    <>
      <Container className="my-3">
        <Row>
          <Col xs={12} md={6} className="mx-auto">
            <h1 className="text-center">艦娘大破率計算機</h1>
            <InputSettingImpl redrawNowChartData={redrawNowChartData} addParam={addParam}
              graphName={graphName} setGraphName={setGraphName}/>
            <OutputGraph graphData={chartData} setIgnoreNames={setIgnoreNames} />
            <EnemySelectorImpl setFinalAttack={setFinalAttack2}/>
            <FinalAttackSliderImpl min={minFinalAttack} max={maxFinalAttack}
            finalAttack={finalAttack} setFinalAttack={setFinalAttack2} cursorLog={cursorLog}/>
            <OutputList params={paramList} deleteParam={deleteParam}/>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default App
