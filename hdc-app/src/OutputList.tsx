import * as React from 'react';
import { IGraphParam } from './App';

const OutputList: React.FC<{params: IGraphParam[], deleteParam: ((value: string) => void)}> = ({params, deleteParam}) => {
	const onclick = (value: string) => {
		deleteParam(value);
	};
	return (<ul className="list-group border p-3">
		{params.map((param, i) => (
			<li className="list-group-item py-1" key={i}>
				<span className="p-1 mr-3 btn-danger btn" onClick={
					// tslint:disable-next-line: jsx-no-lambda
					() => onclick(param.name)
				}>削除</span>
				{param.name} | 最大{param.maxHp}-装甲{param.armor}-現在{param.nowHp}
			</li>
		))}
	</ul>);
}

export default OutputList
