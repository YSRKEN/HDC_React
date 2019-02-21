import * as React from 'react';
import { Button, Form, } from 'react-bootstrap';
import { BsPrefixProps, ReplaceProps } from 'react-bootstrap/helpers';
import InputWithSlider from './InputWithSlider';

const InputSetting: React.FC<{
	armor: number,
	maxHp: number,
	name: string,
	nowHp: number,
	setArmorFunc: (value: number) => void,
	setMaxHpFunc: (value: number) => void,
	setNowHpFunc: (value: number) => void,
	onChangeName: (e: React.ChangeEvent<ReplaceProps<"input", BsPrefixProps<"input">>>) => void
}> = ({armor, maxHp, name, nowHp, setArmorFunc, setMaxHpFunc, setNowHpFunc, onChangeName}) => (
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
);

export default InputSetting
