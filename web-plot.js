function appendChart(data, layout, config) {
    const plots = document.getElementById('plots');
    const images = document.getElementById('images');
    const gd = document.createElement('div');
    plots.append(gd);
    return Plotly.newPlot(gd, data, layout, config).then((gd) => {
        Plotly.toImage(gd,{
            format: 'svg',
            height: 300,
            width: 400,
        })
        .then((url) => {
            const img = document.createElement('img');
            img.src = url;
            images.append(img);
        })
    });
}

// # of flows varies, # of cores varies
// Exp A (monolithic vs modular)
function expA() {
    const cores = [1, 2, 4, 8, 16, 32];
    function sim(cores, flows) {
        const k = 100;
        const noise = 10 * Math.random();
        const max = 198;
        return Math.min(max, k * Math.pow(cores,1.1) / Math.log(flows)) + noise;
    }

    const traces = [{
        y: cores.map(c => sim(c, 100)),
        name: '100 flows',
    }, {
        y: cores.map(c => sim(c, 1000)),
        name: '1k flows',
    }, {
        y: cores.map(c => sim(c, 1e4)),
        name: '10k flows',
    }, {
        y: cores.map(c => sim(c, 1e5)),
        name: '100k flows',
    }, {
        y: cores.map(c => sim(c, 1e6)),
        name: '1M flows',
    }].map((t) => {
        t.x = cores;
        t.type = 'bar';
        return t;
    });

    const layout = {
        //title: 'Exp A',
        barmode: 'group',
        xaxis: {
            title: 'Number of cores',
            type: 'category'
        },
        yaxis: {
            title: 'Throughput (MPPS)',
        },
    };

    appendChart(traces, layout);
}

// Exp B (centralized control)

// Exp C (co-located control)

// Exp D (scaling co-located control)

// Exp E (velocity)


expA();
