var dataJson = {};
for (var i in data3) {
    for (var j in data3[i]) {
        if (dataJson.hasOwnProperty(j)) {
            if (parseFloat(data3[i][j]) != NaN && j != '时间')
                dataJson[j].push(parseFloat(data3[i][j]));
            else
                dataJson[j].push(data3[i][j]);
        }
        else {
            var array = [];
            dataJson[j] = array;
        }
    }
}
console.log(dataJson);
Highcharts.chart('container', {
    chart: {
        type: 'area',
        zoomType: 'x',
        panning: true,
        panKey: 'shift',
        scrollablePlotArea: {
            minWidth: 600
        }
    },

    caption: {
        text: 'This chart uses the Highcharts Annotations feature to place labels at various points of interest. The labels are responsive and will be hidden to avoid overlap on small screens.'
    },

    title: {
        text: '2017 Tour de France Stage 8: Dole - Station des Rousses'
    },

    accessibility: {
        description: 'This line chart uses the Highcharts Annotations feature to place labels at various points of interest. The labels are responsive and will be hidden to avoid overlap on small screens. Image description: An annotated line chart illustrates the 8th stage of the 2017 Tour de France cycling race from the start point in Dole to the finish line at Station des Rousses. Altitude is plotted on the Y-axis, and distance is plotted on the X-axis. The line graph is interactive, and the user can trace the altitude level along the stage. The graph is shaded below the data line to visualize the mountainous altitudes encountered on the 187.5-kilometre stage. The three largest climbs are highlighted at Col de la Joux, Côte de Viry and the final 11.7-kilometer, 6.4% gradient climb to Montée de la Combe de Laisia Les Molunes which peaks at 1200 meters above sea level. The stage passes through the villages of Arbois, Montrond, Bonlieu, Chassal and Saint-Claude along the route.',
        landmarkVerbosity: 'one'
    },

    lang: {
        accessibility: {
            screenReaderSection: {
                annotations: {
                    descriptionNoPoints: '{annotationText}, at distance {annotation.options.point.x}km, elevation {annotation.options.point.y} meters.'
                }
            }
        }
    },

    credits: {
        enabled: false
    },

    annotations: [{
        draggable: '',
        labelOptions: {
            backgroundColor: 'rgba(255,255,255,0.5)',
            verticalAlign: 'top',
            y: 15
        },
    }],

    xAxis: {
        labels: {
            format: '{value}'
        },
        categories: dataJson['时间'],
        minRange: 5,
        title: {
            text: 'Distance'
        },
        accessibility: {
            rangeDescription: 'Range: 0 to 187.8km.'
        }
    },

    yAxis: {
        startOnTick: true,
        endOnTick: false,
        maxPadding: 0.35,
        title: {
            text: null
        },
        labels: {
            format: '{value} m'
        },
        accessibility: {
            description: 'Elevation',
            rangeDescription: 'Range: 0 to 1,553 meters'
        }
    },

    tooltip: {
        headerFormat: 'Distance: {point.x:.1f} km<br>',
        pointFormat: '{point.y} m a. s. l.',
        shared: true
    },

    legend: {
        enabled: false
    },

    series: [{
        data: dataJson['WIN_D']
    }]
});
