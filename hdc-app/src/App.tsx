import * as Chart from 'chart.js';
import * as React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { BsPrefixProps, ReplaceProps } from 'react-bootstrap/helpers';
import { calcMinStopperPower, calcPlotData } from './algorithm';
import './App.css';
import { loadSettingInteger, loadSettingString, saveSettingNumber, saveSettingString } from './data_store';
import EnemySelector from './EnemySelector';
import FinalAttackSlider from './FinalAttackSlider';
import InputSetting from './InputSetting';
import OutputGraph from './OutputGraph';
import OutputList from './OutputList';
import { readJson } from './rest-service';

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
    setName(newName);
    const param2 = getParam({name: newName});
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
      setName(newName);
      const param2 = getParam({name: newName});
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

  const calcFinalAttack = () => {
// tslint:disable-next-line: no-console
    console.log(`敵名=${enemyName}, 敵陣形=${enemyFormation}, 敵攻撃種=${enemyAttackName}`);
  }

  // Hooksを設定した
  const [maxHp, setMaxHp] = React.useState(loadSettingInteger('maxHp', 35));
  const [armor, setArmor] = React.useState(loadSettingInteger('armor', 49));
  const [nowHp, setNowHp] = React.useState(loadSettingInteger('nowHp', 35));
  const [finalAttack, setFinalAttack] = React.useState(50);
  const [name, setName] = React.useState(loadSettingString('name', '入力値'));
  const [paramList, setParamList] = React.useState<IGraphParam[]>(
    JSON.parse(loadSettingString('paramList', '[]'))
  );
  const [tempParamList, setTempParamList] = React.useState<IGraphParam[]>([...paramList, getParam({})]);
  const [ignoreNames, setIgnoreNames] = React.useState<string[]>([]);
  const [minFinalAttack, setMinFinalAttack] = React.useState(0);
  const [maxFinalAttack, setMaxFinalAttack] = React.useState(200);
  const [chartData, setChartData] = React.useState<Chart.ChartData>(createGraphData(tempParamList, ignoreNames));
  const [cursorLog, setCursorLog] = React.useState('');
  const [mapList, setMapList] = React.useState<string[]>([]);
  const [mapName, setMapName] = React.useState('1-1');
  const [positionList, setPositionList] = React.useState<string[]>([]);
  const [positionName, setPositionName] = React.useState('A-1');
  const [enemyList, setEnemyList] = React.useState<string[]>([]);
  const [enemyName, setEnemyName] = React.useState('駆逐イ級');
  const [enemyFormation, setEnemyFormation] = React.useState('T有');
  const [enemyAttackName, setEnemyAttackName] = React.useState('航空');

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

  React.useEffect(() => {
    readJson('map-names').then(jsonData => {
      setMapList(jsonData);
    });
  }, []);

  React.useEffect(() => {
    readJson('map-positions', `map=${mapName}`).then(jsonData => {
      setPositionList(jsonData);
    });
  }, [mapName]);

  React.useEffect(() => {
    readJson('enemy-names', `map=${mapName}&point=${positionName}&level=3`).then((jsonData: any) => {
      // 敵名一覧を取得
      const enemyListTemp: Array<{'name': string, 'id': number}> = jsonData.enemy;

      // 重複している様を弾く
      const enemyMap = new Map();
      for (const enemy of enemyListTemp) {
        const key = `${enemy.id}-${enemy.name}`;
        enemyMap.set(key, enemy);
      }
      const enemyListTemp2: Array<{'name': string, 'id': number}> = Array.from(enemyMap.values());

      // 名前だけ抽出して返す
      setEnemyList(enemyListTemp2.map((fleet: any) => fleet.name));
    });
  }, [positionName]);

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
            <EnemySelector mapList={mapList} setMapName={setMapName} positionList={positionList}
              setPositionName={setPositionName} enemyList={enemyList} setEnemyName={setEnemyName}
              setEnemyFormation={setEnemyFormation} setEnemyAttackName={setEnemyAttackName}
              calcFinalAttack={calcFinalAttack}/>
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
