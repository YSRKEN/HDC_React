import * as Chart from 'chart.js';
import * as React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { BsPrefixProps, ReplaceProps } from 'react-bootstrap/helpers';
import { calcMinStopperPower, calcPlotData } from './algorithm';
import './App.css';
import { loadSettingInteger, loadSettingString, saveSettingNumber, saveSettingString } from './data_store';
import InputSetting from './InputSetting';
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
  // 使用する関数を作成した
  const setMaxHpFunc = (value: number) => {
    setMaxHp(value);
    saveSettingNumber('maxHp', value);
    const tempParamList2 = [...paramList, getParam({maxHp: value})];
    setTempParamList(tempParamList2);
    setChartData(createGraphData(tempParamList2, ignoreNames));
  };

  const setArmorFunc = (value: number) => {
    setArmor(value);
    saveSettingNumber('armor', value);
    const tempParamList2 = [...paramList, getParam({armor: value})];
    setTempParamList(tempParamList2);
    setChartData(createGraphData(tempParamList2, ignoreNames));
  };

  const setNowHpFunc = (value: number) => {
    setNowHp(value);
    saveSettingNumber('nowHp', value);
    const tempParamList2 = [...paramList, getParam({nowHp: value})];
    setTempParamList(tempParamList2);
    setChartData(createGraphData(tempParamList2, ignoreNames));
  };

  const onChangeName = (e: React.ChangeEvent<ReplaceProps<"input", BsPrefixProps<"input">>>) => {
    const nameValue = e.target.value;
    if (typeof (nameValue) === "string") {
      setName(nameValue);
      saveSettingString('name', nameValue);
      const tempParamList2 = [...paramList, getParam({name: nameValue})];
      setTempParamList(tempParamList2);
      setChartData(createGraphData(tempParamList2, ignoreNames));
    }
  };

  const getParam = (args: {paramList?:IGraphParam[], maxHp?: number, armor?: number,
    nowHp?: number, name?: string}): IGraphParam => {
    const armor2 = args.armor === undefined ? armor : args.armor;
    const maxHp2 = args.maxHp === undefined ? maxHp : args.maxHp;
    const name2 = args.name === undefined ? name : args.name;
    const nowHp2 = args.nowHp === undefined ? nowHp : args.nowHp;
    return {
      "armor": armor2,
      "maxHp": maxHp2,
      "name": name2,
      "nowHp": nowHp2,
    };
  };

	const createGraphData = (paramListArgs: IGraphParam[], ignoreNamesArgs: string[]) => {
		let rightXValue = 200;
		if (ignoreNamesArgs.length !== paramListArgs.length) {
			rightXValue = Math.max(...paramListArgs
				.filter(param => !ignoreNamesArgs.includes(param.name))
				.map(param => calcMinStopperPower(param.armor, param.nowHp)));
		}
		return {
			datasets: paramListArgs.map((param, i) => ({
				backgroundColor: Chart.helpers.color(CHART_COLORS[i]).alpha(0.2).rgbString(),
				borderColor: CHART_COLORS[i],
				data: calcPlotData(param.maxHp, param.armor, param.nowHp, rightXValue + 10),
				fill: false,
				label: param.name,
				pointRadius: 0
			}))
		};
	};

  const addParam = () => {
    const param1 = getParam({});
    const newParamList = [...paramList, param1];
    setParamList(newParamList);
    saveSettingString('paramList', JSON.stringify(newParamList));
    setName((temp) => temp+'-2');
    const param2 = getParam({name: name+'-2'});
    setTempParamList([...paramList, param1, param2]);
  };

  // Hooksを設定した
  const [maxHp, setMaxHp] = React.useState(loadSettingInteger('maxHp', 35));
  const [armor, setArmor] = React.useState(loadSettingInteger('armor', 49));
  const [nowHp, setNowHp] = React.useState(loadSettingInteger('nowHp', 35));
  const [name, setName] = React.useState(loadSettingString('name', '入力値'));
  const [paramList, setParamList] = React.useState<IGraphParam[]>(
    JSON.parse(loadSettingString('paramList', '[]'))
  );
  const [tempParamList, setTempParamList] = React.useState<IGraphParam[]>([...paramList, getParam({})]);
  const [ignoreNames, setIgnoreNames] = React.useState<string[]>([]);
  const [chartData, setChartData] = React.useState<Chart.ChartData>(createGraphData(tempParamList, ignoreNames));

  return (
    <>
      <Container className="my-3">
        <Row>
          <Col xs={12} md={6} className="mx-auto">
            <h1 className="text-center">艦娘大破率計算機</h1>
            <InputSetting armor={armor} maxHp={maxHp} name={name} nowHp={nowHp}
              setArmorFunc={setArmorFunc} setMaxHpFunc={setMaxHpFunc}
              setNowHpFunc={setNowHpFunc} onChangeName={onChangeName}
              onAddButton={addParam}/>
            <OutputGraph graphData={chartData} setIgnoreNames={setIgnoreNames} />
            <OutputList params={paramList} />
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default App
