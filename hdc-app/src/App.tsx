import * as React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { BsPrefixProps, ReplaceProps } from 'react-bootstrap/helpers';
import './App.css';
import { loadSettingInteger, loadSettingString, saveSettingNumber, saveSettingString } from './data_store';
import InputSetting from './InputSetting';
import OutputGraph from './OutputGraph';

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
  // Hooksを設定した
  const [maxHp, setMaxHp] = React.useState(loadSettingInteger('maxHp', 35));
  const [armor, setArmor] = React.useState(loadSettingInteger('armor', 49));
  const [nowHp, setNowHp] = React.useState(loadSettingInteger('nowHp', 35));
  const [name, setName] = React.useState(loadSettingString('name', '入力値'));
  const [paramList] = React.useState<IGraphParam[]>([
    { maxHp: 23, armor: 38, nowHp: 23, name: '神風改' },
    { maxHp: 31, armor: 50, nowHp: 31, name: '暁改二' },
    { maxHp: 36, armor: 59, nowHp: 36, name: '島風改' }
  ]);

  // 使用する関数を作成した
  const setMaxHpFunc = (value: number) => {
    setMaxHp(value);
    saveSettingNumber('maxHp', value);
  };

  const setArmorFunc = (value: number) => {
    setArmor(value);
    saveSettingNumber('armor', value);
  };

  const setNowHpFunc = (value: number) => {
    setNowHp(value);
    saveSettingNumber('nowHp', value);
  };

  const onChangeName = (e: React.ChangeEvent<ReplaceProps<"input", BsPrefixProps<"input">>>) => {
    const nameValue = e.target.value;
    if (typeof (nameValue) === "string") {
      setName(nameValue);
      saveSettingString('name', nameValue);
    }
  };

  const getParamList = (arg1: number, arg2: number, arg3: number, arg4: string) => {
    const param: IGraphParam = {"maxHp": arg1, "armor": arg2, "nowHp": arg3, "name": arg4};
    return [...paramList, param];
  };

  return (
    <>
      <Container className="my-3">
        <Row>
          <Col xs={12} md={6} className="mx-auto">
            <h1 className="text-center">艦娘大破率計算機</h1>
            <InputSetting armor={armor} maxHp={maxHp} name={name} nowHp={nowHp}
              setArmorFunc={setArmorFunc} setMaxHpFunc={setMaxHpFunc}
              setNowHpFunc={setNowHpFunc} onChangeName={onChangeName} />
            <OutputGraph params={getParamList(maxHp, armor, nowHp, name)} />
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default App
