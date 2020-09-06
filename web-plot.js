function appendChart(chartName, data, layout, config) {
    const plots = document.getElementById('plots');
    const images = document.getElementById('images');
    const gd = document.createElement('div');
    plots.append(gd);
    return Plotly.newPlot(gd, data, layout, config).then((gd) => {
        const height = 480;
        const width = 640;
        Plotly.toImage(gd,{
            format: 'svg',
            height,
            width,
        })
        .then((url) => {
            const img = document.createElement('img');
            img.src = url;
            images.append(img);
            const doc = new jspdf.jsPDF({
                orientation: "landscape",
                unit: "mm",
                format: [width, height]
            });

            // This is a little silly, but it seems that svg2pdf requires an SVG element (vs. image with SVG source)
            // and plotly makes multiple SVG elements for its native plots (e.g. separate overlay for axes, legend, ...)
            // so we take the exported SVG data and re-create an SVG element from it to use for svg2pdf.
            let svgString = unescape(url); // data URL contains SVG content
            svgString = svgString.slice(svgString.indexOf('<svg')); // strip-off the data URL header/prefix
            const svg = new DOMParser().parseFromString(svgString, "text/xml").firstChild; // taking a cue from the svg module on npm
            doc.svg(svg, {
                //x:0,
                //y: -20, // I think there was some height reserved for a plot title or something...just looked better to me when scooted up a touch
                //height: 100,
                //width: 200,
                //loadExternalStyleSheets: true
            }).then(() => {
                doc.save(`${chartName}.pdf`);
            });
        })
    });
}

// # of flows varies, # of cores varies
// Exp A (monolithic vs modular)
function expA() {
    const cores = [1, 2, 4, 8, 16, 32];
    const cases = [{
        title: 'Monolithic NF',
        nameInFile: 'monolithic',
        sim(cores, flows) {
            const k = 44;
            const noise = 2 * Math.random();
            const max = 198;
            return Math.min(max, k * Math.pow(cores,0.5) / Math.log(flows)) + noise;
        },
    }, {
        title: 'Modular NF',
        nameInFile: 'modular',
        sim(cores, flows) {
            const k = 100;
            const noise = 10 * Math.random();
            const max = 198;
            return Math.min(max, k * Math.pow(cores,1.1) / Math.log(flows)) + noise;
        },
    }];

    for (let {title, nameInFile, sim} of cases) {
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
            //title: `${name} Performance`,
            title,
            barmode: 'group',
            xaxis: {
                title: 'Number of cores',
                type: 'category'
            },
            yaxis: {
                title: 'Throughput (MPPS)',
                //range: [0, 200],
                type: 'lin',
            },
        };

        appendChart(`expA-${nameInFile}`, traces, layout);
    }
}

// Exp B (centralized control)

// Exp C (co-located control)

// Exp D (scaling co-located control)

// Exp E (velocity)


expA();
