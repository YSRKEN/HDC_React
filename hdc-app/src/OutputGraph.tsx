import * as Chart from 'chart.js';
import * as React from 'react';
import { Scatter } from 'react-chartjs-2';
import { calcPlotData } from './algorithm';
import { IGraphParam } from './App';

const CHART_COLORS = [
	"#FF0000",
	"#00FF00",
	"#0000FF",
	"#FFFF00",
	"#00FFFF",
	"#FF00FF",
	"#000000",
];

const OutputGraph: React.FC<{params: IGraphParam[]}> = ({params}) => {
	const createGraphData = () => ({
		datasets: params.map((param, i) => ({
			backgroundColor: Chart.helpers.color(CHART_COLORS[i]).alpha(0.2).rgbString(),
			borderColor: CHART_COLORS[i],
			data: calcPlotData(param.maxHp, param.armor, param.nowHp),
			label: param.name
		}))
	});

	return (
		<Scatter width={450} height={450} data={createGraphData} options={{
			elements: { line: { tension: 0 } },
			scales: {
				xAxes: [{ scaleLabel: { display: true, labelString: '最終攻撃力' }, }],
				yAxes: [{ scaleLabel: { display: true, labelString: '大破率(％)' }, }]
			},
			showLines: true
		}} />
	);
}

export default OutputGraph
