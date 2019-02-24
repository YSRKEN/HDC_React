import * as React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { BsPrefixProps, ReplaceProps } from 'react-bootstrap/helpers';
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

/**
 * アプリケーション全体
 */
const App: React.FC = () => {
  // 使用する関数を作成した
  const setMaxHpFunc = (value: number) => {
    setMaxHp(value);
    saveSettingNumber('maxHp', value);
    setTempParamList([...paramList, getParam({maxHp: value})]);
  };

  const setArmorFunc = (value: number) => {
    setArmor(value);
    saveSettingNumber('armor', value);
    setTempParamList([...paramList, getParam({armor: value})]);
  };

  const setNowHpFunc = (value: number) => {
    setNowHp(value);
    saveSettingNumber('nowHp', value);
    setTempParamList([...paramList, getParam({nowHp: value})]);
  };

  const onChangeName = (e: React.ChangeEvent<ReplaceProps<"input", BsPrefixProps<"input">>>) => {
    const nameValue = e.target.value;
    if (typeof (nameValue) === "string") {
      setName(nameValue);
      saveSettingString('name', nameValue);
      setTempParamList([...paramList, getParam({name: nameValue})]);
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

  const addParam = () => {
    const param1 = getParam({});
    setParamList([...paramList, param1]);
    const param2 = getParam({});
    setTempParamList([...paramList, param1, param2]);
  };

  // Hooksを設定した
  const [maxHp, setMaxHp] = React.useState(loadSettingInteger('maxHp', 35));
  const [armor, setArmor] = React.useState(loadSettingInteger('armor', 49));
  const [nowHp, setNowHp] = React.useState(loadSettingInteger('nowHp', 35));
  const [name, setName] = React.useState(loadSettingString('name', '入力値'));
  const [paramList, setParamList] = React.useState<IGraphParam[]>([
    { maxHp: 23, armor: 38, nowHp: 23, name: '神風改' },
    { maxHp: 30, armor: 49, nowHp: 30, name: '吹雪改' },
    { maxHp: 31, armor: 50, nowHp: 31, name: '暁改二' },
    { maxHp: 36, armor: 59, nowHp: 36, name: '島風改' },
    { maxHp: 37, armor: 53, nowHp: 37, name: '秋月改' },
    { maxHp: 37, armor: 86, nowHp: 37, name: 'Верный+バルジ4' },
  ]);
  const [tempParamList, setTempParamList] = React.useState<IGraphParam[]>([...paramList, getParam({})]);

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
            <OutputGraph params={tempParamList} />
            <OutputList params={paramList} />
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default App
