// Global variables
let data = [];
let charts = {};

// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    // Input and calculation buttons
    const dataInput = document.getElementById('data-input');
    const calculateBtn = document.getElementById('calculate-btn');
    const clearBtn = document.getElementById('clear-btn');
    const sampleDataBtn = document.getElementById('sample-data-btn');
    const errorMessage = document.getElementById('error-message');
    const resultsContainer = document.getElementById('results-container');
    
    // Tab navigation
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    // Chart controls
    const chartType = document.getElementById('chart-type');
    const histogramControls = document.getElementById('histogram-controls');
    const generateChartBtn = document.getElementById('generate-chart');
    
    // Event Listeners
    calculateBtn.addEventListener('click', calculateStatistics);
    clearBtn.addEventListener('click', clearAll);
    sampleDataBtn.addEventListener('click', useSampleData);
    
    // Tab navigation
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Add active class to clicked button and corresponding pane
            this.classList.add('active');
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Distribution type change
    distributionType.addEventListener('change', function() {
        // Hide all parameter groups
        normalParams.style.display = 'none';
        binomialParams.style.display = 'none';
        poissonParams.style.display = 'none';
        
        // Show the selected parameter group
        switch(this.value) {
            case 'normal':
                normalParams.style.display = 'flex';
                break;
            case 'binomial':
                binomialParams.style.display = 'flex';
                break;
            case 'poisson':
                poissonParams.style.display = 'flex';
                break;
        }
    });
    
    // Probability type change
    probabilityType.addEventListener('change', function() {
        if (this.value === 'between') {
            singleValueInputs.style.display = 'none';
            betweenValuesInputs.style.display = 'block';
        } else {
            singleValueInputs.style.display = 'block';
            betweenValuesInputs.style.display = 'none';
        }
    });
    
    // Chart type change
    chartType.addEventListener('change', function() {
        if (this.value === 'histogram') {
            histogramControls.style.display = 'block';
        } else {
            histogramControls.style.display = 'none';
        }
    });
    
    // Hypothesis test type change
    hypothesisTestType.addEventListener('change', function() {
        if (this.value === 'ztest') {
            zTestSigmaGroup.style.display = 'block';
        } else {
            zTestSigmaGroup.style.display = 'none';
        }
    });
    
    // Button event listeners
    generateDistributionBtn.addEventListener('click', generateDistribution);
    calculateProbabilityBtn.addEventListener('click', calculateProbability);
    generateChartBtn.addEventListener('click', generateChart);
    runHypothesisTestBtn.addEventListener('click', runHypothesisTest);
    runCorrelationBtn.addEventListener('click', runCorrelation);
    runRegressionBtn.addEventListener('click', runRegression);
});

// Calculate statistics from input data
function calculateStatistics() {
    const dataInput = document.getElementById('data-input');
    const errorMessage = document.getElementById('error-message');
    const resultsContainer = document.getElementById('results-container');
    
    try {
        // Parse input data
        data = parseData(dataInput.value);
        
        if (data.length === 0) {
            throw new Error('Please enter at least one number');
        }
        
        // Hide error message and show results
        errorMessage.style.display = 'none';
        resultsContainer.classList.remove('hidden');
        
        // Calculate and display descriptive statistics
        displayDescriptiveStatistics();
        
        // Update data tables
        updateDataTables();
        
        // Generate default chart
        generateChart();
        
    } catch (error) {
        // Show error message
        errorMessage.textContent = error.message;
        errorMessage.style.display = 'block';
        resultsContainer.classList.add('hidden');
    }
}

// Parse input data string into array of numbers
function parseData(inputString) {
    return inputString
        .split(',')
        .map(item => item.trim())
        .filter(item => item !== '')
        .map(item => {
            const num = parseFloat(item);
            if (isNaN(num)) {
                throw new Error(`Invalid number: ${item}`);
            }
            return num;
        });
}

// Clear all inputs and results
function clearAll() {
    document.getElementById('data-input').value = '';
    document.getElementById('error-message').style.display = 'none';
    document.getElementById('results-container').classList.add('hidden');
    data = [];
}

// Use sample data
function useSampleData() {
    document.getElementById('data-input').value = '123, 65, 75, 7, 3, 42, 88, 56, 29, 11';
    calculateStatistics();
}

// Display descriptive statistics
function displayDescriptiveStatistics() {
    // Calculate statistics
    const stats = calculateDescriptiveStatistics(data);
    
    // Update DOM elements with calculated values
    document.getElementById('mean').textContent = stats.mean.toFixed(4);
    document.getElementById('median').textContent = stats.median.toFixed(4);
    document.getElementById('mode').textContent = Array.isArray(stats.mode) ? stats.mode.join(', ') : stats.mode.toFixed(4);
    document.getElementById('range').textContent = stats.range.toFixed(4);
    document.getElementById('variance').textContent = stats.variance.toFixed(4);
    document.getElementById('std-dev').textContent = stats.standardDeviation.toFixed(4);
    document.getElementById('iqr').textContent = stats.iqr.toFixed(4);
    document.getElementById('skewness').textContent = stats.skewness.toFixed(4);
    document.getElementById('kurtosis').textContent = stats.kurtosis.toFixed(4);
    document.getElementById('mean-deviation').textContent = stats.meanDeviation.toFixed(4);
    document.getElementById('cv').textContent = stats.coefficientOfVariation.toFixed(4);
}

// Calculate descriptive statistics
function calculateDescriptiveStatistics(data) {
    const n = data.length;
    const sortedData = [...data].sort((a, b) => a - b);
    
    // Mean
    const sum = data.reduce((acc, val) => acc + val, 0);
    const mean = sum / n;
    
    // Median
    let median;
    if (n % 2 === 0) {
        median = (sortedData[n/2 - 1] + sortedData[n/2]) / 2;
    } else {
        median = sortedData[Math.floor(n/2)];
    }
    
    // Mode
    const frequency = {};
    let maxFrequency = 0;
    let modes = [];
    
    data.forEach(value => {
        frequency[value] = (frequency[value] || 0) + 1;
        if (frequency[value] > maxFrequency) {
            maxFrequency = frequency[value];
        }
    });
    
    for (const [value, count] of Object.entries(frequency)) {
        if (count === maxFrequency) {
            modes.push(parseFloat(value));
        }
    }
    
    // If all values appear the same number of times, there is no mode
    const mode = modes.length === Object.keys(frequency).length ? NaN : 
                 modes.length === 1 ? modes[0] : modes;
    
    // Range
    const min = sortedData[0];
    const max = sortedData[n - 1];
    const range = max - min;
    
    // Variance
    const squaredDiffs = data.map(value => Math.pow(value - mean, 2));
    const variance = squaredDiffs.reduce((acc, val) => acc + val, 0) / n;
    
    // Standard Deviation
    const standardDeviation = Math.sqrt(variance);
    
    // Quartiles and IQR
    const q1Index = Math.floor(n * 0.25);
    const q3Index = Math.floor(n * 0.75);
    const q1 = n % 4 === 0 ? (sortedData[q1Index - 1] + sortedData[q1Index]) / 2 : sortedData[q1Index];
    const q3 = n % 4 === 0 ? (sortedData[q3Index - 1] + sortedData[q3Index]) / 2 : sortedData[q3Index];
    const iqr = q3 - q1;
    
    // Skewness (Pearson's moment coefficient of skewness)
    const cubedDiffs = data.map(value => Math.pow(value - mean, 3));
    const sumCubedDiffs = cubedDiffs.reduce((acc, val) => acc + val, 0);
    const skewness = sumCubedDiffs / (n * Math.pow(standardDeviation, 3));
    
    // Kurtosis
    const fourthPowerDiffs = data.map(value => Math.pow(value - mean, 4));
    const sumFourthPowerDiffs = fourthPowerDiffs.reduce((acc, val) => acc + val, 0);
    const kurtosis = sumFourthPowerDiffs / (n * Math.pow(standardDeviation, 4)) - 3; // Excess kurtosis
    
    // Mean Deviation
    const absoluteDiffs = data.map(value => Math.abs(value - mean));
    const meanDeviation = absoluteDiffs.reduce((acc, val) => acc + val, 0) / n;
    
    // Coefficient of Variation
    const coefficientOfVariation = (standardDeviation / mean) * 100;
    
    return {
        mean,
        median,
        mode,
        range,
        variance,
        standardDeviation,
        q1,
        q3,
        iqr,
        skewness,
        kurtosis,
        meanDeviation,
        coefficientOfVariation
    };
}

// Update data tables
function updateDataTables() {
    const inputDataTable = document.getElementById('input-data-table').querySelector('tbody');
    const sortedDataTable = document.getElementById('sorted-data-table').querySelector('tbody');
    const summaryTable = document.getElementById('summary-table').querySelector('tbody');
    
    // Clear existing rows
    inputDataTable.innerHTML = '';
    sortedDataTable.innerHTML = '';
    summaryTable.innerHTML = '';
    
    // Add input data rows
    data.forEach((value, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${value}</td>
        `;
        inputDataTable.appendChild(row);
    });
    
    // Add sorted data rows
    const sortedData = [...data].sort((a, b) => a - b);
    sortedData.forEach((value, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${value}</td>
        `;
        sortedDataTable.appendChild(row);
    });
    
    // Add summary statistics
    const stats = calculateDescriptiveStatistics(data);
    const summaryStats = [
        { name: 'Count', value: data.length },
        { name: 'Sum', value: data.reduce((acc, val) => acc + val, 0).toFixed(4) },
        { name: 'Mean', value: stats.mean.toFixed(4) },
        { name: 'Median', value: stats.median.toFixed(4) },
        { name: 'Mode', value: Array.isArray(stats.mode) ? stats.mode.join(', ') : stats.mode.toFixed(4) },
        { name: 'Minimum', value: Math.min(...data).toFixed(4) },
        { name: 'Maximum', value: Math.max(...data).toFixed(4) },
        { name: 'Range', value: stats.range.toFixed(4) },
        { name: 'Variance', value: stats.variance.toFixed(4) },
        { name: 'Standard Deviation', value: stats.standardDeviation.toFixed(4) },
        { name: 'Q1 (25th Percentile)', value: stats.q1.toFixed(4) },
        { name: 'Q3 (75th Percentile)', value: stats.q3.toFixed(4) },
        { name: 'IQR', value: stats.iqr.toFixed(4) },
        { name: 'Skewness', value: stats.skewness.toFixed(4) },
        { name: 'Kurtosis', value: stats.kurtosis.toFixed(4) },
        { name: 'Mean Deviation', value: stats.meanDeviation.toFixed(4) },
        { name: 'Coefficient of Variation (%)', value: stats.coefficientOfVariation.toFixed(4) }
    ];
    
    summaryStats.forEach(stat => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${stat.name}</td>
            <td>${stat.value}</td>
        `;
        summaryTable.appendChild(row);
    });
}


// ------------------------------------------------------------------------------------------------generate-chart-------------------------------------------------------------------------------

// Generate chart based on selected type
function generateChart() {
    const chartType = document.getElementById('chart-type').value;
    const canvas = document.getElementById('data-visualization-chart');
    
    // Destroy existing chart if it exists
    if (charts.dataVisualization) {
        charts.dataVisualization.destroy();
    }
    
    // Prepare chart data and options based on chart type
    let chartData, chartOptions;
    
    switch (chartType) {
        case 'bar':
            chartData = {
                labels: data.map((_, index) => `Item ${index + 1}`),
                datasets: [{
                    label: 'Values',
                    data: data,
                    backgroundColor: 'rgba(74, 111, 165, 0.7)',
                    borderColor: 'rgba(74, 111, 165, 1)',
                    borderWidth: 1
                }]
            };
            chartOptions = {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            };
            break;
            
        case 'histogram':
            const binCount = parseInt(document.getElementById('histogram-bins').value);
            const min = Math.min(...data);
            const max = Math.max(...data);
            const binWidth = (max - min) / binCount;
            
            // Create bins
            const bins = Array(binCount).fill(0);
            data.forEach(value => {
                const binIndex = Math.min(Math.floor((value - min) / binWidth), binCount - 1);
                bins[binIndex]++;
            });
            
            // Create bin labels
            const binLabels = Array(binCount).fill(0).map((_, i) => {
                const lowerBound = min + i * binWidth;
                const upperBound = min + (i + 1) * binWidth;
                return `${lowerBound.toFixed(2)} - ${upperBound.toFixed(2)}`;
            });
            
            chartData = {
                labels: binLabels,
                datasets: [{
                    label: 'Frequency',
                    data: bins,
                    backgroundColor: 'rgba(74, 111, 165, 0.7)',
                    borderColor: 'rgba(74, 111, 165, 1)',
                    borderWidth: 1
                }]
            };
            chartOptions = {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Frequency'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Value Ranges'
                        }
                    }
                }
            };
            break;
            
        case 'line':
            chartData = {
                labels: data.map((_, index) => `Item ${index + 1}`),
                datasets: [{
                    label: 'Values',
                    data: data,
                    fill: false,
                    backgroundColor: 'rgba(74, 111, 165, 0.7)',
                    borderColor: 'rgba(74, 111, 165, 1)',
                    tension: 0.1
                }]
            };
            chartOptions = {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            };
            break;
            
        case 'pie':
            // Count frequency of each value
            const frequency = {};
            data.forEach(value => {
                frequency[value] = (frequency[value] || 0) + 1;
            });
            
            const pieLabels = Object.keys(frequency);
            const pieData = Object.values(frequency);
            
            // Generate colors
            const pieColors = pieLabels.map((_, i) => {
                const hue = (i * 137.5) % 360; // Golden angle approximation for nice color distribution
                return `hsl(${hue}, 70%, 60%)`;
            });
            
            chartData = {
                labels: pieLabels,
                datasets: [{
                    data: pieData,
                    backgroundColor: pieColors,
                    borderWidth: 1
                }]
            };
            chartOptions = {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right'
                    }
                }
            };
            break;
            
        case 'box':
            const stats = calculateDescriptiveStatistics(data);
            
            chartData = {
                labels: ['Dataset'],
                datasets: [{
                    label: 'Box Plot',
                    data: [{
                        min: Math.min(...data),
                        q1: stats.q1,
                        median: stats.median,
                        q3: stats.q3,
                        max: Math.max(...data)
                    }],
                    backgroundColor: 'rgba(74, 111, 165, 0.7)',
                    borderColor: 'rgba(74, 111, 165, 1)',
                    borderWidth: 1
                }]
            };
            chartOptions = {
                responsive: true,
                maintainAspectRatio: false
            };
            break;
    }
    
    // Create chart
    charts.dataVisualization = new Chart(canvas, {
        type: chartType === 'box' ? 'boxplot' : chartType,
        data: chartData,
        options: chartOptions
    });
}


// -------------------------------------------------------------------------------geratate chart -end-------------------------------------------------------------------------------

// Calculate probability based on distribution
function calculateProbability() {
    const distributionType = document.getElementById('distribution-type').value;
    const probabilityType = document.getElementById('probability-type').value;
    const resultContent = document.getElementById('probability-result-content');
    
    let probability, description;
    
    switch (distributionType) {
        case 'normal':
            const mean = parseFloat(document.getElementById('normal-mean').value);
            const sd = parseFloat(document.getElementById('normal-sd').value);
            
            if (probabilityType === 'between') {
                const a = parseFloat(document.getElementById('probability-a').value);
                const b = parseFloat(document.getElementById('probability-b').value);
                
                probability = normalCDF(b, mean, sd) - normalCDF(a, mean, sd);
                description = `P(${a} ≤ X ≤ ${b}) for X ~ N(${mean}, ${sd}²)`;
            } else if (probabilityType === 'less-than') {
                const x = parseFloat(document.getElementById('probability-x').value);
                
                probability = normalCDF(x, mean, sd);
                description = `P(X ≤ ${x}) for X ~ N(${mean}, ${sd}²)`;
            } else { // greater-than
                const x = parseFloat(document.getElementById('probability-x').value);
                
                probability = 1 - normalCDF(x, mean, sd);
                description = `P(X ≥ ${x}) for X ~ N(${mean}, ${sd}²)`;
            }
            break;
            
        case 'binomial':
            const n = parseInt(document.getElementById('binomial-n').value);
            const p = parseFloat(document.getElementById('binomial-p').value);
            
            if (probabilityType === 'between') {
                const a = parseInt(document.getElementById('probability-a').value);
                const b = parseInt(document.getElementById('probability-b').value);
                
                // Calculate P(a ≤ X ≤ b) = P(X ≤ b) - P(X < a)
                probability = binomialCDF(b, n, p) - (a > 0 ? binomialCDF(a - 1, n, p) : 0);
                description = `P(${a} ≤ X ≤ ${b}) for X ~ B(${n}, ${p})`;
            } else if (probabilityType === 'less-than') {
                const x = parseInt(document.getElementById('probability-x').value);
                
                probability = binomialCDF(x, n, p);
                description = `P(X ≤ ${x}) for X ~ B(${n}, ${p})`;
            } else { // greater-than
                const x = parseInt(document.getElementById('probability-x').value);
                
                probability = 1 - (x > 0 ? binomialCDF(x - 1, n, p) : 0);
                description = `P(X ≥ ${x}) for X ~ B(${n}, ${p})`;
            }
            break;
            
        case 'poisson':
            const lambda = parseFloat(document.getElementById('poisson-lambda').value);
            
            if (probabilityType === 'between') {
                const a = parseInt(document.getElementById('probability-a').value);
                const b = parseInt(document.getElementById('probability-b').value);
                
                // Calculate P(a ≤ X ≤ b) = P(X ≤ b) - P(X < a)
                probability = poissonCDF(b, lambda) - (a > 0 ? poissonCDF(a - 1, lambda) : 0);
                description = `P(${a} ≤ X ≤ ${b}) for X ~ Poisson(${lambda})`;
            } else if (probabilityType === 'less-than') {
                const x = parseInt(document.getElementById('probability-x').value);
                
                probability = poissonCDF(x, lambda);
                description = `P(X ≤ ${x}) for X ~ Poisson(${lambda})`;
            } else { // greater-than
                const x = parseInt(document.getElementById('probability-x').value);
                
                probability = 1 - (x > 0 ? poissonCDF(x - 1, lambda) : 0);
                description = `P(X ≥ ${x}) for X ~ Poisson(${lambda})`;
            }
            break;
    }
    
    resultContent.innerHTML = `
        <p><strong>${description}</strong></p>
        <p>Probability = ${probability.toFixed(6)} (${(probability * 100).toFixed(4)}%)</p>
    `;
}
function poissonCDF(k, lambda) {
    let sum = 0;
    for (let i = 0; i <= k; i++) {
        sum += poissonPMF(i, lambda);
    }
    return sum;
}
// Calculate Spearman rank correlation
function calculateSpearmanCorrelation(xData, yData) {
    const n = xData.length;
    
    // Create arrays of [value, index] pairs
    const xPairs = xData.map((value, index) => ({ value, index }));
    const yPairs = yData.map((value, index) => ({ value, index }));
    
    // Sort by value
    xPairs.sort((a, b) => a.value - b.value);
    yPairs.sort((a, b) => a.value - b.value);
    
    // Assign ranks (handling ties by averaging)
    const xRanks = new Array(n);
    const yRanks = new Array(n);
    
    for (let i = 0; i < n; i++) {
        let j = i;
        while (j < n - 1 && xPairs[j].value === xPairs[j + 1].value) {
            j++;
        }
        
        // Assign average rank for ties
        const rank = (i + j) / 2 + 1;
        for (let k = i; k <= j; k++) {
            xRanks[xPairs[k].index] = rank;
        }
        
        i = j;
    }
    
    for (let i = 0; i < n; i++) {
        let j = i;
        while (j < n - 1 && yPairs[j].value === yPairs[j + 1].value) {
            j++;
        }
        
        // Assign average rank for ties
        const rank = (i + j) / 2 + 1;
        for (let k = i; k <= j; k++) {
            yRanks[yPairs[k].index] = rank;
        }
        
        i = j;
    }
    
    // Calculate sum of squared differences of ranks
    let d2 = 0;
    for (let i = 0; i < n; i++) {
        d2 += Math.pow(xRanks[i] - yRanks[i], 2);
    }
    
    // Calculate Spearman's rho
    return 1 - (6 * d2) / (n * (n * n - 1));
}