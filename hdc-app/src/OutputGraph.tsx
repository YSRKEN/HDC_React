import * as React from 'react';
import { ChartData, Scatter } from 'react-chartjs-2';

const OutputGraph: React.FC<{data: ChartData<Chart.ChartData>}> = ({data}) => (
	<Scatter width={450} height={450} data={data} options={{
		elements: { line: { tension: 0 } },
		scales: {
		  xAxes: [{ scaleLabel: { display: true, labelString: '最終攻撃力' }, }],
		  yAxes: [{ scaleLabel: { display: true, labelString: '大破率(％)' }, }]
		},
		showLines: true
	  }} />
);

export default OutputGraph
