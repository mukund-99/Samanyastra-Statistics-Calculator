# Samanyastra Statistics Calculator

**Batch:** A18  
**Team Members:**
| Name            | Email ID                        |
|-----------------|---------------------------------|
| Khedkar Mukund  | mkhedkar9373@gmail.com           |
|  Bade Anjali    | badeanjali41@gmail.com           |
| More Sakshi     | sakshimore79295@gmail.com       |
| Amale Payal     | payalamale01@gmail.com          |
| Dhokale Durga   | durgadhokle43@gmail.com        |
| Mayuri Malvade  | mayurimalvade26@gmail.com      |

## Project Links
- **Netlify Link:** [Netlify Deployment](https://statistics-project-port.netlify.app/)
- **GitHub Repository Link:** [GitHub Repository](https://mukund-99.github.io/Samanyastra-Statistics-Calculator/)

---

## 1. Introduction

Welcome to the **Samanyastra Statistics Calculator**, a web tool designed to calculate various statistical measures for a set of numbers. By inputting a set of comma-separated numbers (e.g., 123, 65, 75, 7, 3), this calculator will provide a wide array of statistical results. The tool covers both **Descriptive Statistics** (like mean, median, and standard deviation) and other types of statistics, such as **Inferential Statistics**, **Distributions**, and **Visualizations**. It's a powerful and user-friendly tool for performing quick statistical analysis.

The **Samanyastra Statistics Calculator** offers a comprehensive set of features for both beginners and experienced users. Here’s an overview of its key features:

---

## 2. Key Features

### 1. User-Friendly Input Section
- **Text Input Field:** Allows users to enter numbers separated by commas.
- **Buttons:**
  - **Calculate:** Computes the statistical measures based on the input numbers.
  - **Clear:** Clears the input field and results section.

### 2. Tab-Based Result Display
- **Tab Navigation:** The results are divided into tabs for easy navigation between different statistical measures:
  - **Descriptive Statistics:** Displays basic statistical measures like the mean, median, and standard deviation.
  - **Visualizations:** Provides graphical representations such as histograms or box plots.

### 3. Descriptive Statistics Section
This section displays key measures that describe the central tendency and spread of the data:
- **Measures of Central Tendency:**
  - **Mean:** The average of all values.
  - **Median:** The middle value of the sorted data.
  - **Mode:** The most frequent value(s).

- **Measures of Dispersion:**
  - **Range:** The difference between the maximum and minimum values.
  - **Variance:** The average of squared deviations from the mean.
  - **Standard Deviation:** The square root of variance, representing how spread out the values are.
  - **IQR (Interquartile Range):** The range between the first (Q1) and third (Q3) quartiles, which captures the middle 50% of the data.

- **Measures of Shape:**
  - **Skewness:** A measure of the asymmetry of the data distribution.
  - **Kurtosis:** A measure of the "tailedness" of the distribution.

- **Other Measures:**
  - **Mean Deviation:** The average absolute deviation from the mean.
  - **Coefficient of Variation:** The ratio of the standard deviation to the mean, expressed as a percentage.

---

## 3. Key Components

### Header Section
- Displays the title of the app `<h1>Samanyastra Statistics Calculator</h1>` and a brief description of how to input data `<p>Enter comma-separated numbers (e.g., 123, 65, 75, 7, 3)</p>`.

### Input Section
- An `<input>` field allows users to enter comma-separated numbers.
- Three buttons:
  - **#calculate-btn:** Initiates calculation of statistics.
  - **#clear-btn:** Clears the input field.
  - **#sample-data-btn:** A button to use predefined sample data.

### Error Message Display
- **#error-message:** Container for displaying any error messages if user input is invalid.

### Results Section
- Hidden by default, this section contains multiple tabs for different types of statistical calculations:
  - Descriptive Statistics
  - Inferential Statistics
  - Distributions
  - Visualizations
  - Data Table

---

## 4. Language Support

Since this is a statistics calculator, the text content (like "Mean," "Median," etc.) can be easily localized by using JavaScript or a templating engine. Additionally, the user interface can support multiple languages by switching the text dynamically.

---

## 5. Purpose

This tool is designed to perform statistical calculations on a set of numbers that users input. These calculations include various **descriptive statistics**, **inferential statistics**, **distributions**, and **visualizations** of the data. It offers functionality for **educational use**, allowing students or professionals to quickly calculate and understand statistical concepts. It also provides a practical way to visualize and analyze data, which can be helpful in academic or training contexts.

---

## 6. Text Editing

The text content throughout the page is customizable and can be adjusted to meet different needs, such as localization (translation into different languages) or updates to descriptions.
- **Descriptions:** Each statistic (e.g., "Mean", "Median", "Range") has a description that explains what it is and how it is calculated.
- **Tool Tips:** You can add more detailed explanations or tooltips that appear when users hover over certain terms like "Standard Deviation" or "Skewness" to enhance learning.

---

## 7. Educational Tool Features

This tool has great potential as an **educational resource** for students learning statistics. By providing clear explanations of statistical terms and measures, the tool could help users better understand the concepts being calculated.

### Educational Enhancements:
- **Descriptive Statistics:**
  - Central Tendency: Mean, Median, Mode.
  - Dispersion: Range, Variance, Standard Deviation, IQR.
  - Shape: Skewness and Kurtosis.
  - Other Measures: Mean Deviation, Coefficient of Variation.

---
