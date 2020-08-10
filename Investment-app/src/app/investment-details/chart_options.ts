

export class ChartOptions {
    constructor() {}
    static getChart1Options()
    {
        const chart1_options = {
            showLabels: true,
            animations: true,
            xAxis: true,
            yAxis: true,
            showYAxisLabel: true,
            showXAxisLabel: true,
            xAxisLabel: 'Day of the Month',
            yAxisLabel: '€',
            timeline: true,
            colorScheme: {
              domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
            }
          };
        return chart1_options;
    }

    static getChart2Options()
    {
        const chart2_options = {
            showLabels: true,
            animations: true,
            xAxis: true,
            yAxis: true,
            showYAxisLabel: true,
            showXAxisLabel: true,
            xAxisLabel: 'Month',
            yAxisLabel: '€',
            timeline: true,
            colorScheme: {
              domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
            }
          };
        return chart2_options;
    }

    static getChart3Options()
    {
        const chart3_options = {
            showLabels: true,
            animations: true,
            doughnut: true,
            legend: true,
            colorScheme: {
              domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
            }
          };
        return chart3_options;
    }
}