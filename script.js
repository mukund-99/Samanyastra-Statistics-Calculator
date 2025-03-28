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
    
    // Distribution controls
    const distributionType = document.getElementById('distribution-type');
    const normalParams = document.getElementById('normal-params');
    const binomialParams = document.getElementById('binomial-params');
    const poissonParams = document.getElementById('poisson-params');
    const generateDistributionBtn = document.getElementById('generate-distribution');
    
    // Probability calculator
    const probabilityType = document.getElementById('probability-type');
    const singleValueInputs = document.getElementById('single-value-inputs');
    const betweenValuesInputs = document.getElementById('between-values-inputs');
    const calculateProbabilityBtn = document.getElementById('calculate-probability');
    
    // Chart controls
    const chartType = document.getElementById('chart-type');
    const histogramControls = document.getElementById('histogram-controls');
    const generateChartBtn = document.getElementById('generate-chart');
    
    // Hypothesis testing
    const hypothesisTestType = document.getElementById('hypothesis-test-type');
    const zTestSigmaGroup = document.getElementById('z-test-sigma-group');
    const runHypothesisTestBtn = document.getElementById('run-hypothesis-test');
    
    // Correlation and regression
    const runCorrelationBtn = document.getElementById('run-correlation');
    const runRegressionBtn = document.getElementById('run-regression');
    
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
    document.getElementById('mode').textContent = Array.isArray(stats.mode) ? stats.mode.join(', ') : stats.mode.toFixed(0);
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
    }
    
    // Create chart
    charts.dataVisualization = new Chart(canvas, {
        type: chartType === 'box' ? 'boxplot' : chartType,
        data: chartData,
        options: chartOptions
    });
}
// Generate probability distribution
function generateDistribution() {
    const distributionType = document.getElementById('distribution-type').value;
    const canvas = document.getElementById('distribution-chart');
    
    // Destroy existing chart if it exists
    if (charts.distribution) {
        charts.distribution.destroy();
    }
    
    let chartData, chartOptions;
    
    switch (distributionType) {
        case 'normal':
            const mean = parseFloat(document.getElementById('normal-mean').value);
            const sd = parseFloat(document.getElementById('normal-sd').value);
            
            // Generate x values (from mean-4*sd to mean+4*sd)
            const xMin = mean - 4 * sd;
            const xMax = mean + 4 * sd;
            const step = (xMax - xMin) / 100;
            const xValues = Array.from({ length: 101 }, (_, i) => xMin + i * step);
            
            // Calculate PDF values
            const yValues = xValues.map(x => normalPDF(x, mean, sd));
            
            chartData = {
                labels: xValues.map(x => x.toFixed(2)),
                datasets: [{
                    label: `Normal Distribution (μ=${mean}, σ=${sd})`,
                    data: yValues,
                    borderColor: 'rgba(74, 111, 165, 1)',
                    backgroundColor: 'rgba(74, 111, 165, 0.2)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            };
            break;
            
        case 'binomial':
            const n = parseInt(document.getElementById('binomial-n').value);
            const p = parseFloat(document.getElementById('binomial-p').value);
            
            // Generate values from 0 to n
            const kValues = Array.from({ length: n + 1 }, (_, i) => i);
            
            // Calculate PMF values
            const pmfValues = kValues.map(k => binomialPMF(k, n, p));
            
            chartData = {
                labels: kValues,
                datasets: [{
                    label: `Binomial Distribution (n=${n}, p=${p})`,
                    data: pmfValues,
                    backgroundColor: 'rgba(74, 111, 165, 0.7)',
                    borderColor: 'rgba(74, 111, 165, 1)',
                    borderWidth: 1
                }]
            };
            break;
            
        case 'poisson':
            const lambda = parseFloat(document.getElementById('poisson-lambda').value);
            
            // Generate values from 0 to lambda*3 (or at least 10)
            const maxK = Math.max(Math.ceil(lambda * 3), 10);
            const poissonKValues = Array.from({ length: maxK + 1 }, (_, i) => i);
            
            // Calculate PMF values
            const poissonPmfValues = poissonKValues.map(k => poissonPMF(k, lambda));
            
            chartData = {
                labels: poissonKValues,
                datasets: [{
                    label: `Poisson Distribution (λ=${lambda})`,
                    data: poissonPmfValues,
                    backgroundColor: 'rgba(74, 111, 165, 0.7)',
                    borderColor: 'rgba(74, 111, 165, 1)',
                    borderWidth: 1
                }]
            };
            break;
    }
    
    chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: distributionType === 'normal' ? 'Probability Density' : 'Probability'
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Value'
                }
            }
        }
    };
    
    // Create chart
    charts.distribution = new Chart(canvas, {
        type: distributionType === 'normal' ? 'line' : 'bar',
        data: chartData,
        options: chartOptions
    });
}

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

// Run hypothesis test
function runHypothesisTest() {
    const testType = document.getElementById('hypothesis-test-type').value;
    const mu0 = parseFloat(document.getElementById('hypothesis-mu').value);
    const alpha = parseFloat(document.getElementById('hypothesis-alpha').value);
    const resultsContent = document.getElementById('hypothesis-results-content');
    
    if (data.length < 2) {
        resultsContent.innerHTML = '<p>Error: Need at least 2 data points for hypothesis testing.</p>';
        return;
    }
    
    let testStatistic, pValue, criticalValue, conclusion;
    
    if (testType === 'ttest') {
        // One-sample t-test
        const n = data.length;
        const xBar = data.reduce((sum, x) => sum + x, 0) / n;
        const s = Math.sqrt(data.reduce((sum, x) => sum + Math.pow(x - xBar, 2), 0) / (n - 1));
        
        testStatistic = (xBar - mu0) / (s / Math.sqrt(n));
        
        // Approximate p-value using normal distribution (for large samples)
        // For small samples, we should use t-distribution, but we'll approximate
        pValue = 2 * (1 - Math.abs(normalCDF(Math.abs(testStatistic), 0, 1)));
        
        // Critical value (approximated)
        criticalValue = 1.96; // For alpha = 0.05, two-tailed
        if (alpha === 0.01) criticalValue = 2.576;
        if (alpha === 0.1) criticalValue = 1.645;
        
        conclusion = pValue < alpha ? 
            `Reject H₀ at α = ${alpha}. There is sufficient evidence that the population mean differs from ${mu0}.` :
            `Fail to reject H₀ at α = ${alpha}. There is insufficient evidence that the population mean differs from ${mu0}.`;
        
        resultsContent.innerHTML = `
            <p><strong>One-sample t-test</strong></p>
            <p>H₀: μ = ${mu0}</p>
            <p>H₁: μ ≠ ${mu0}</p>
            <p>Sample mean (x̄) = ${xBar.toFixed(4)}</p>
            <p>Sample standard deviation (s) = ${s.toFixed(4)}</p>
            <p>Sample size (n) = ${n}</p>
            <p>Test statistic (t) = ${testStatistic.toFixed(4)}</p>
            <p>p-value = ${pValue.toFixed(6)}</p>
            <p>Critical value = ±${criticalValue} (α = ${alpha}, two-tailed)</p>
            <p><strong>Conclusion:</strong> ${conclusion}</p>
        `;
    } else { // z-test
        const sigma = parseFloat(document.getElementById('hypothesis-sigma').value);
        const n = data.length;
        const xBar = data.reduce((sum, x) => sum + x, 0) / n;
        
        testStatistic = (xBar - mu0) / (sigma / Math.sqrt(n));
        
        // p-value
        pValue = 2 * (1 - Math.abs(normalCDF(Math.abs(testStatistic), 0, 1)));
        
        // Critical value
        criticalValue = 1.96; // For alpha = 0.05, two-tailed
        if (alpha === 0.01) criticalValue = 2.576;
        if (alpha === 0.1) criticalValue = 1.645;
        
        conclusion = pValue < alpha ? 
            `Reject H₀ at α = ${alpha}. There is sufficient evidence that the population mean differs from ${mu0}.` :
            `Fail to reject H₀ at α = ${alpha}. There is insufficient evidence that the population mean differs from ${mu0}.`;
        
        resultsContent.innerHTML = `
            <p><strong>One-sample z-test</strong></p>
            <p>H₀: μ = ${mu0}</p>
            <p>H₁: μ ≠ ${mu0}</p>
            <p>Sample mean (x̄) = ${xBar.toFixed(4)}</p>
            <p>Known population standard deviation (σ) = ${sigma.toFixed(4)}</p>
            <p>Sample size (n) = ${n}</p>
            <p>Test statistic (z) = ${testStatistic.toFixed(4)}</p>
            <p>p-value = ${pValue.toFixed(6)}</p>
            <p>Critical value = ±${criticalValue} (α = ${alpha}, two-tailed)</p>
            <p><strong>Conclusion:</strong> ${conclusion}</p>
        `;
    }
}
// Run correlation analysis
function runCorrelation() {
    const correlationType = document.getElementById('correlation-type').value;
    const yDataInput = document.getElementById('correlation-data-y').value;
    const resultsContent = document.getElementById('correlation-results-content');
    const chartContainer = document.getElementById('correlation-chart-container');
    
    try {
        // Parse Y data
        const yData = parseData(yDataInput);
        
        if (yData.length !== data.length) {
            throw new Error('X and Y datasets must have the same length');
        }
        
        let correlationCoefficient, interpretation;
        
        if (correlationType === 'pearson') {
            // Calculate Pearson correlation coefficient
            correlationCoefficient = calculatePearsonCorrelation(data, yData);
            
            // Interpret the correlation
            interpretation = interpretCorrelation(correlationCoefficient);
            
            resultsContent.innerHTML = `
                <p><strong>Pearson Correlation Coefficient</strong></p>
                <p>r = ${correlationCoefficient.toFixed(4)}</p>
                <p><strong>Interpretation:</strong> ${interpretation}</p>
                <p>r² = ${Math.pow(correlationCoefficient, 2).toFixed(4)} (coefficient of determination)</p>
            `;
        } else { // Spearman
            // Calculate Spearman rank correlation
            correlationCoefficient = calculateSpearmanCorrelation(data, yData);
            
            // Interpret the correlation
            interpretation = interpretCorrelation(correlationCoefficient);
            
            resultsContent.innerHTML = `
                <p><strong>Spearman Rank Correlation Coefficient</strong></p>
                <p>ρ = ${correlationCoefficient.toFixed(4)}</p>
                <p><strong>Interpretation:</strong> ${interpretation}</p>
            `;
        }
        
        // Show chart container
        chartContainer.style.display = 'block';
        
        // Create scatter plot
        if (charts.correlation) {
            charts.correlation.destroy();
        }
        
        charts.correlation = new Chart(document.getElementById('correlation-chart'), {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Data Points',
                    data: data.map((x, i) => ({ x, y: yData[i] })),
                    backgroundColor: 'rgba(74, 111, 165, 0.7)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'X Values'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Y Values'
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: `Scatter Plot (${correlationType === 'pearson' ? 'r' : 'ρ'} = ${correlationCoefficient.toFixed(4)})`
                    }
                }
            }
        });
        
    } catch (error) {
        resultsContent.innerHTML = `<p>Error: ${error.message}</p>`;
        chartContainer.style.display = 'none';
    }
}

// Run regression analysis
function runRegression() {
    const regressionType = document.getElementById('regression-type').value;
    const yDataInput = document.getElementById('regression-data-y').value;
    const resultsContent = document.getElementById('regression-results-content');
    const chartContainer = document.getElementById('regression-chart-container');
    
    try {
        // Parse Y data
        const yData = parseData(yDataInput);
        
        if (yData.length !== data.length) {
            throw new Error('X and Y datasets must have the same length');
        }
        
        if (regressionType === 'linear') {
            // Calculate linear regression
            const { slope, intercept, r2, regressionEquation } = calculateLinearRegression(data, yData);
            
            resultsContent.innerHTML = `
                <p><strong>Simple Linear Regression</strong></p>
                <p>Regression equation: ${regressionEquation}</p>
                <p>Slope (b₁) = ${slope.toFixed(4)}</p>
                <p>Intercept (b₀) = ${intercept.toFixed(4)}</p>
                <p>R² = ${r2.toFixed(4)} (coefficient of determination)</p>
                <p><strong>Interpretation:</strong></p>
                <p>- For each unit increase in X, Y changes by ${slope.toFixed(4)} units on average.</p>
                <p>- When X = 0, the predicted value of Y is ${intercept.toFixed(4)}.</p>
                <p>- The model explains ${(r2 * 100).toFixed(2)}% of the variation in Y.</p>
            `;
            
            // Show chart container
            chartContainer.style.display = 'block';
            
            // Create regression plot
            if (charts.regression) {
                charts.regression.destroy();
            }
            
            // Generate regression line points
            const minX = Math.min(...data);
            const maxX = Math.max(...data);
            const regressionPoints = [
                { x: minX, y: intercept + slope * minX },
                { x: maxX, y: intercept + slope * maxX }
            ];
            
            charts.regression = new Chart(document.getElementById('regression-chart'), {
                type: 'scatter',
                data: {
                    datasets: [
                        {
                            label: 'Data Points',
                            data: data.map((x, i) => ({ x, y: yData[i] })),
                            backgroundColor: 'rgba(74, 111, 165, 0.7)'
                        },
                        {
                            label: 'Regression Line',
                            data: regressionPoints,
                            type: 'line',
                            borderColor: 'rgba(255, 99, 132, 1)',
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                            borderWidth: 2,
                            pointRadius: 0
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'X Values'
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Y Values'
                            }
                        }
                    },
                    plugins: {
                        title: {
                            display: true,
                            text: `Linear Regression (Y = ${intercept.toFixed(2)} + ${slope.toFixed(2)}X)`
                        }
                    }
                }
            });
        }
        
    } catch (error) {
        resultsContent.innerHTML = `<p>Error: ${error.message}</p>`;
        chartContainer.style.display = 'none';
    }
}
// Statistical Distribution Functions

// Normal distribution PDF
function normalPDF(x, mean, sd) {
    return (1 / (sd * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - mean) / sd, 2));
}

// Normal distribution CDF (approximation)
function normalCDF(x, mean, sd) {
    // Convert to standard normal
    const z = (x - mean) / sd;
    
    // Approximation of the standard normal CDF
    if (z < -6) return 0;
    if (z > 6) return 1;
    
    let sum = 0;
    let term = z;
    let i = 3;
    
    while (Math.abs(term) > 1e-10) {
        sum += term;
        term = term * z * z / i;
        i += 2;
    }
    
    return 0.5 + sum * 0.3989422804014327; // 0.3989... = 1/sqrt(2*PI)
}

// Binomial PMF
function binomialPMF(k, n, p) {
    if (k < 0 || k > n) return 0;
    
    // Calculate binomial coefficient (n choose k)
    let coeff = 1;
    for (let i = 1; i <= k; i++) {
        coeff *= (n - (i - 1)) / i;
    }
    
    return coeff * Math.pow(p, k) * Math.pow(1 - p, n - k);
}

// Binomial CDF
function binomialCDF(k, n, p) {
    let sum = 0;
    for (let i = 0; i <= k; i++) {
        sum += binomialPMF(i, n, p);
    }
    return sum;
}

// Poisson PMF
function poissonPMF(k, lambda) {
    if (k < 0) return 0;
    
    // Calculate k!
    let factorial = 1;
    for (let i = 2; i <= k; i++) {
        factorial *= i;
    }
    
    return Math.exp(-lambda) * Math.pow(lambda, k) / factorial;
}

// Poisson CDF
function poissonCDF(k, lambda) {
    let sum = 0;
    for (let i = 0; i <= k; i++) {
        sum += poissonPMF(i, lambda);
    }
    return sum;
}

// Statistical Analysis Functions

// Calculate Pearson correlation coefficient
function calculatePearsonCorrelation(xData, yData) {
    const n = xData.length;
    
    // Calculate means
    const xMean = xData.reduce((sum, x) => sum + x, 0) / n;
    const yMean = yData.reduce((sum, y) => sum + y, 0) / n;
    
    // Calculate sums of squares and products
    let ssxx = 0, ssyy = 0, ssxy = 0;
    
    for (let i = 0; i < n; i++) {
        const xDiff = xData[i] - xMean;
        const yDiff = yData[i] - yMean;
        
        ssxx += xDiff * xDiff;
        ssyy += yDiff * yDiff;
        ssxy += xDiff * yDiff;
    }
    
    // Calculate correlation coefficient
    return ssxy / Math.sqrt(ssxx * ssyy);
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

// Interpret correlation coefficient
function interpretCorrelation(r) {
    const absR = Math.abs(r);
    
    if (absR < 0.2) {
        return 'Very weak or negligible correlation';
    } else if (absR < 0.4) {
        return 'Weak correlation';
    } else if (absR < 0.6) {
        return 'Moderate correlation';
    } else if (absR < 0.8) {
        return 'Strong correlation';
    } else {
        return 'Very strong correlation';
    }
}

// Calculate linear regression
function calculateLinearRegression(xData, yData) {
    const n = xData.length;
    
    // Calculate means
    const xMean = xData.reduce((sum, x) => sum + x, 0) / n;
    const yMean = yData.reduce((sum, y) => sum + y, 0) / n;
    
    // Calculate sums of squares and products
    let ssxx = 0, ssyy = 0, ssxy = 0;
    
    for (let i = 0; i < n; i++) {
        const xDiff = xData[i] - xMean;
        const yDiff = yData[i] - yMean;
        
        ssxx += xDiff * xDiff;
        ssyy += yDiff * yDiff;
        ssxy += xDiff * yDiff;
    }
    
    // Calculate regression coefficients
    const slope = ssxy / ssxx;
    const intercept = yMean - slope * xMean;
    
    // Calculate R-squared
    const r = ssxy / Math.sqrt(ssxx * ssyy); // Correlation coefficient
    const r2 = r * r; // Coefficient of determination
    
    // Format regression equation
    const sign = intercept >= 0 ? '+' : '';
    const regressionEquation = `Y = ${intercept.toFixed(4)} ${sign} ${slope.toFixed(4)}X`;
    
    return { slope, intercept, r2, regressionEquation };
}
// ------------------------------------------------------------------------------------------for download pdf button-----------------------------------------------------------
function exportToPDF() {
    const { jsPDF } = window.jspdf || window.jspdf.jsPDF;
    const pdf = new jsPDF();

    // Title
    pdf.setFontSize(18);
    pdf.text('Statistics Report', 10, 10);
    pdf.setFontSize(12);

    // Results get Data 
    const statsText = document.getElementById('results-container').innerText.trim();
    const formattedText = pdf.splitTextToSize(statsText, 180); // Text wrapping
    pdf.text(formattedText, 10, 20);

    // Chart (Canvas) add in pdf
    const canvas = document.getElementById('dataChart');
    if (canvas) {
        try {
            const chartImage = canvas.toDataURL('image/png');
            pdf.addImage(chartImage, 'PNG', 10, pdf.internal.pageSize.height / 2, 180, 100);
        } catch (error) {
            console.error('Error adding chart image:', error);
        }
    }
    // PDF download
    pdf.save('statistics-report.pdf');
}
