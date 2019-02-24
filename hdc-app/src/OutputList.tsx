import * as React from 'react';
import { Button } from 'react-bootstrap';
import { IGraphParam } from './App';

const OutputList: React.FC<{params: IGraphParam[]}> = ({params}) => {
	return (<ul className="list-group border p-3">
		{params.map(param => (
			<li className="list-group-item py-1">
				<Button className="p-1 mr-3" variant="danger">削除</Button>
				{param.name} | 最大{param.maxHp}-装甲{param.armor}-現在{param.nowHp}
			</li>
		))}
	</ul>);
}

export default OutputList
