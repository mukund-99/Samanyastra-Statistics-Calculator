document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const dataInput = document.getElementById('dataInput');
    const dataTitle = document.getElementById('dataTitle');
    const calculateBtn = document.getElementById('calculateBtn');
    const sampleDataBtn = document.getElementById('sampleDataBtn');
    const exportPdfBtn = document.getElementById('exportPdf');
    const zScoreValueInput = document.getElementById('zScoreValue');
    const calculateZScoreBtn = document.getElementById('calculateZScore');
    
    // Stats elements
    const meanElement = document.getElementById('mean');
    const medianElement = document.getElementById('median');
    const modeElement = document.getElementById('mode');
    const stdDevElement = document.getElementById('stdDev');
    const varianceElement = document.getElementById('variance');
    const rangeElement = document.getElementById('range');
    const minElement = document.getElementById('min');
    const maxElement = document.getElementById('max');
    const countElement = document.getElementById('count');
    const zScoreResult = document.getElementById('zScoreResult');
    const percentileResult = document.getElementById('percentileResult');
    
    // Chart contexts
    const bellCurveCtx = document.getElementById('bellCurve').getContext('2d');
    const dataDistributionCtx = document.getElementById('dataDistribution').getContext('2d');
    
    // Chart instances
    let bellCurveChart = null;
    let dataDistributionChart = null;
    
    // Current dataset statistics
    let currentStats = {
        data: [],
        mean: 0,
        stdDev: 0
    };
    
    // Event listeners
    calculateBtn.addEventListener('click', calculateStatistics);
    sampleDataBtn.addEventListener('click', loadSampleData);
    exportPdfBtn.addEventListener('click', exportToPdf);
    calculateZScoreBtn.addEventListener('click', calculateZScore);
    
    // Load sample data
    function loadSampleData() {
        dataInput.value = "8,9,99,45,10,6,19,3,1";
        dataTitle.value = "Sample Test Scores";
        calculateStatistics();
    }
    
    // Parse input data
    function parseData() {
        const rawData = dataInput.value.trim();
        if (!rawData) return [];
        
        return rawData.split(',')
            .map(item => parseFloat(item.trim()))
            .filter(item => !isNaN(item));
    }
    
    // Calculate statistics
    function calculateStatistics() {
        const data = parseData();
        if (data.length === 0) {
            alert('Please enter valid data');
            return;
        }
        
        // Sort data for calculations
        const sortedData = [...data].sort((a, b) => a - b);
        
        // Calculate basic statistics
        const mean = calculateMean(data);
        const median = calculateMedian(sortedData);
        const mode = calculateMode(data);
        const stdDev = calculateStandardDeviation(data, mean);
        const variance = stdDev * stdDev;
        const min = sortedData[0];
        const max = sortedData[sortedData.length - 1];
        const range = max - min;
        
        // Update current stats
        currentStats = {
            data: data,
            mean: mean,
            stdDev: stdDev
        };
        
        // Update UI
        meanElement.textContent = mean.toFixed(2);
        medianElement.textContent = median.toFixed(2);
        modeElement.textContent = mode.join(', ');
        stdDevElement.textContent = stdDev.toFixed(2);
        varianceElement.textContent = variance.toFixed(2);
        rangeElement.textContent = range.toFixed(2);
        minElement.textContent = min.toFixed(2);
        maxElement.textContent = max.toFixed(2);
        countElement.textContent = data.length;
        
        // Generate charts
        generateBellCurve(mean, stdDev, min, max);
        generateDataDistribution(data);
    }
    
    // Calculate mean
    function calculateMean(data) {
        const sum = data.reduce((acc, val) => acc + val, 0);
        return sum / data.length;
    }
    
    // Calculate median
    function calculateMedian(sortedData) {
        const mid = Math.floor(sortedData.length / 2);
        return sortedData.length % 2 !== 0
            ? sortedData[mid]
            : (sortedData[mid - 1] + sortedData[mid]) / 2;
    }
    
    // Calculate mode
    function calculateMode(data) {
        const frequency = {};
        data.forEach(value => {
            frequency[value] = (frequency[value] || 0) + 1;
        });
        
        let maxFrequency = 0;
        let modes = [];
        
        for (const key in frequency) {
            const freq = frequency[key];
            if (freq > maxFrequency) {
                maxFrequency = freq;
                modes = [parseFloat(key)];
            } else if (freq === maxFrequency) {
                modes.push(parseFloat(key));
            }
        }
        
        return modes;
    }
    
    // Calculate standard deviation
    function calculateStandardDeviation(data, mean) {
        const squaredDifferences = data.map(value => Math.pow(value - mean, 2));
        const variance = squaredDifferences.reduce((acc, val) => acc + val, 0) / data.length;
        return Math.sqrt(variance);
    }
    
    // Generate bell curve
    function generateBellCurve(mean, stdDev, min, max) {
        // Create data points for the bell curve
        const padding = stdDev * 3; // Show 3 standard deviations on each side
        const start = Math.max(min - padding, mean - stdDev * 4);
        const end = Math.min(max + padding, mean + stdDev * 4);
        const step = (end - start) / 100;
        
        const labels = [];
        const bellCurveData = [];
        
        for (let x = start; x <= end; x += step) {
            labels.push(x.toFixed(1));
            bellCurveData.push(normalDistribution(x, mean, stdDev));
        }
        
        // Create or update bell curve chart
        if (bellCurveChart) {
            bellCurveChart.destroy();
        }
        
        bellCurveChart = new Chart(bellCurveCtx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Normal Distribution',
                    data: bellCurveData,
                    borderColor: '#4a6fa5',
                    backgroundColor: 'rgba(74, 111, 165, 0.2)',
                    borderWidth: 2,
                    pointRadius: 0,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: dataTitle.value || 'Bell Curve Distribution'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `Value: ${context.label}, Probability: ${context.raw.toFixed(4)}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Values'
                        },
                        ticks: {
                            maxTicksLimit: 10
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Probability Density'
                        },
                        beginAtZero: true
                    }
                }
            }
        });
        
        // Add mean and standard deviation lines
        addVerticalLine(bellCurveChart, mean, 'Mean', '#dc3545');
        addVerticalLine(bellCurveChart, mean - stdDev, '-1 StdDev', '#ffc107');
        addVerticalLine(bellCurveChart, mean + stdDev, '+1 StdDev', '#ffc107');
    }
    
    // Generate data distribution histogram
    function generateDataDistribution(data) {
        // Calculate histogram bins
        const binCount = Math.min(20, Math.ceil(Math.sqrt(data.length)));
        const min = Math.min(...data);
        const max = Math.max(...data);
        const binWidth = (max - min) / binCount;
        
        const bins = Array(binCount).fill(0);
        const binLabels = [];
        
        // Create bin labels
        for (let i = 0; i < binCount; i++) {
            const binStart = min + i * binWidth;
            const binEnd = binStart + binWidth;
            binLabels.push(`${binStart.toFixed(1)}-${binEnd.toFixed(1)}`);
        }
        
        // Fill bins with data
        data.forEach(value => {
            const binIndex = Math.min(
                Math.floor((value - min) / binWidth),
                binCount - 1
            );
            bins[binIndex]++;
        });
        
        // Create or update data distribution chart
        if (dataDistributionChart) {
            dataDistributionChart.destroy();
        }
        
        dataDistributionChart = new Chart(dataDistributionCtx, {
            type: 'bar',
            data: {
                labels: binLabels,
                datasets: [{
                    label: 'Frequency',
                    data: bins,
                    backgroundColor: 'rgba(74, 111, 165, 0.7)',
                    borderColor: '#4a6fa5',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: `${dataTitle.value || 'Data'} Distribution`
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Value Ranges'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Frequency'
                        },
                        beginAtZero: true
                    }
                }
            }
        });
    }
    
    // Add vertical line annotation to chart
    function addVerticalLine(chart, value, label, color) {
        const line = {
            id: `line-${label}`,
            type: 'line',
            mode: 'vertical',
            scaleID: 'x',
            value: value,
            borderColor: color,
            borderWidth: 2,
            label: {
                content: label,
                enabled: true,
                position: 'top'
            }
        };
        
        if (!chart.options.plugins.annotation) {
            chart.options.plugins.annotation = {
                annotations: {}
            };
        }
        
        chart.options.plugins.annotation.annotations[line.id] = line;
        chart.update();
    }
    
    // Normal distribution function
    function normalDistribution(x, mean, stdDev) {
        const exponent = -Math.pow(x - mean, 2) / (2 * Math.pow(stdDev, 2));
        return (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(exponent);
    }
    
    // Calculate Z-score
    function calculateZScore() {
        const value = parseFloat(zScoreValueInput.value);
        
        if (isNaN(value)) {
            alert('Please enter a valid number');
            return;
        }
        
        if (!currentStats.data.length) {
            alert('Please calculate statistics first');
            return;
        }
        
        const zScore = (value - currentStats.mean) / currentStats.stdDev;
        const percentile = calculatePercentile(zScore);
        
        zScoreResult.textContent = zScore.toFixed(2);
        percentileResult.textContent = `${percentile.toFixed(2)}%`;
    }
    
    // Calculate percentile from Z-score
    function calculatePercentile(zScore) {
        // Approximation of the cumulative distribution function
        const p = zScore < 0 ? 1 - normalCDF(-zScore) : normalCDF(zScore);
        return p * 100;
    }
    
    // Normal cumulative distribution function approximation
    function normalCDF(x) {
        // Constants for approximation
        const b1 = 0.31938153;
        const b2 = -0.356563782;
        const b3 = 1.781477937;
        const b4 = -1.821255978;
        const b5 = 1.330274429;
        const p = 0.2316419;
        const c = 0.39894228;
        
        if (x >= 0) {
            const t = 1.0 / (1.0 + p * x);
            return 1.0 - c * Math.exp(-x * x / 2.0) * t * (t * (t * (t * (t * b5 + b4) + b3) + b2) + b1);
        } else {
            return 1.0 - normalCDF(-x);
        }
    }
    
    // Export to PDF
    function exportToPdf() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Set title
        const title = dataTitle.value || 'Statistical Analysis';
        doc.setFontSize(18);
        doc.text(title, 105, 15, { align: 'center' });
        
        // Add date
        const date = new Date().toLocaleDateString();
        doc.setFontSize(10);
        doc.text(`Generated on: ${date}`, 195, 10, { align: 'right' });
        
        // Add statistics table
        doc.setFontSize(14);
        doc.text('Statistical Measures', 15, 30);
        
        doc.setFontSize(10);
        const stats = [
            ['Mean', meanElement.textContent],
            ['Median', medianElement.textContent],
            ['Mode', modeElement.textContent],
            ['Standard Deviation', stdDevElement.textContent],
            ['Variance', varianceElement.textContent],
            ['Range', rangeElement.textContent],
            ['Minimum', minElement.textContent],
            ['Maximum', maxElement.textContent],
            ['Count', countElement.textContent]
        ];
        
        let y = 40;
        stats.forEach(([label, value]) => {
            doc.text(`${label}: ${value}`, 20, y);
            y += 7;
        });
        
        // Add bell curve chart
        doc.setFontSize(14);
        doc.text('Bell Curve Distribution', 15, 110);
        
        // Convert canvas to image
        const bellCurveCanvas = document.getElementById('bellCurve');
        const bellCurveImg = bellCurveCanvas.toDataURL('image/png');
        doc.addImage(bellCurveImg, 'PNG', 15, 120, 180, 70);
        
        // Add data distribution chart on new page
        doc.addPage();
        doc.setFontSize(14);
        doc.text('Data Distribution', 15, 20);
        
        const dataDistCanvas = document.getElementById('dataDistribution');
        const dataDistImg = dataDistCanvas.toDataURL('image/png');
        doc.addImage(dataDistImg, 'PNG', 15, 30, 180, 70);
        
        // Add raw data
        doc.setFontSize(14);
        doc.text('Raw Data', 15, 120);
        
        doc.setFontSize(10);
        const rawData = currentStats.data.join(', ');
        const splitData = doc.splitTextToSize(rawData, 180);
        doc.text(splitData, 15, 130);
        
        // Save PDF
        doc.save(`${title.replace(/\s+/g, '_')}_statistics.pdf`);
    }
    
    // Initialize with sample data
    loadSampleData();
});