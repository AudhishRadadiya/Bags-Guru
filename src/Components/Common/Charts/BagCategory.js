import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import variablePie from 'highcharts/modules/variable-pie.js';

variablePie(Highcharts);

export default function BagCategory() {
  const options = {
    chart: {
      type: 'column',
    },
    title: {
      text: '',
    },
    xAxis: {
      categories: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ],
      crosshair: true,
    },
    yAxis: {
      title: {
        text: 'Rainfall (mm)',
      },
    },
    plotOptions: {
      column: {
        pointPadding: 0,
        borderWidth: 0,
      },
    },
    credits: {
      enabled: false,
    },
    legend: {
      enabled: false,
    },
    series: [
      {
        data: [
          43934, 48656, 65165, 81827, 112143, 142383, 171533, 165174, 155157,
          161454, 154610, 15020,
        ],
        color: '#0094FF',
      },
      {
        data: [
          24916, 37941, 29742, 29851, 32490, 30282, 38121, 36885, 33726, 34243,
          31050, 15020,
        ],
        color: '#FBCF4F',
      },
      {
        data: [
          11744, 30000, 16005, 19771, 20185, 24377, 32147, 30912, 29243, 29213,
          25663, 15020,
        ],
        color: '#ED701E',
      },
      {
        data: [
          43934, 48656, 65165, 81827, 112143, 142383, 171533, 165174, 155157,
          161454, 154610, 15020,
        ],
        color: '#1C8F3C',
      },
      {
        data: [
          11744, 30000, 16005, 19771, 20185, 24377, 32147, 30912, 29243, 29213,
          25663, 15020,
        ],
        color: '#322972',
      },
    ],

    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 500,
          },
        },
      ],
    },
  };
  return (
    <div className="bag_category_wrap p-3 bg_white rounded-3 border h-100">
      <div className="sales_comparison_top mb-3">
        <ul className="justify-content-start">
          <li>
            <h3>Bag Category</h3>
            <p className="m-0">Jan - Dec 2022</p>
          </li>
          <li>
            <h5 className="text-center mb-2">Bag Category</h5>
            <div className="chart_title_list">
              <ul>
                <li>
                  <span className="green dot"></span>
                  <label>Box Bag</label>
                </li>
                <li>
                  <span className="purple dot"></span>
                  <label>Loop Handle bag</label>
                </li>
                <li>
                  <span className="light_blue dot"></span>
                  <label>Zipper Bag</label>
                </li>
                <li>
                  <span className="yellow dot"></span>
                  <label>2 Side Gusset Bag</label>
                </li>
                <li>
                  <span className="blue dot"></span>
                  <label>D- Cut Bag</label>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
      <div className="sales_comparison_chart_wrap">
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
    </div>
  );
}
