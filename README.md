# Golden State Realities: A Comprehensive Analysis of California's Housing Landscape

This project is a comprehensive data visualization analysis of California's housing market using D3.js. It explores the relationships between median house prices, population, income, age, and ocean proximity across various counties in California. The visualizations are designed to be interactive, allowing users to engage with the data and uncover key trends and insights.

## Project Overview

California's housing market has been a topic of significant interest due to ongoing affordability issues and rapid population growth. This project visualizes critical factors that influence housing prices, providing a deeper understanding of the state's housing dynamics.

### Visualizations Included

1. **Scatter Plot: Population vs. House Prices**
   - **Question**: Is there a trend between the number of population and house price?
   - **Details**: This scatter plot visualizes the relationship between population size and median house prices across California counties. It highlights outliers using a binary color scheme, improving the readability of the plot.

2. **Bar Chart: Ocean Proximity vs. Average House Prices**
   - **Question**: How do average house prices vary with different levels of ocean proximity?
   - **Details**: This bar chart categorizes regions by their proximity to the ocean and compares average house prices. A sorting function allows users to order the data in ascending or descending price order.

3. **Stacked Bar Chart: House Price Ranges vs. Age, Income, and Household Count**
   - **Question**: What is the distribution of age, income, and household count across different house price ranges?
   - **Details**: This visualization stacks these variables to show how they vary across different price brackets, revealing trends associated with higher-priced properties.

4. **Bubble Map: Geographic Distribution of House Prices**
   - **Question**: Which California counties have the highest and lowest house prices, and what is the overall distribution?
   - **Details**: A bubble map is used to represent house prices geographically across California, with bubbles sized according to price and colored to indicate outliers.

5. **Heatmap: Median House Prices by Ocean Proximity and Population**
   - **Question**: How do median house prices vary by ocean proximity and population?
   - **Details**: This heatmap provides a detailed view of house prices, categorized by proximity to the ocean and population subclasses. Users can interact with the map using tooltips that display detailed information.

### Interactive Features

- **Sorting**: Users can sort the bar chart by average house prices.
- **Tooltips**: Hovering over elements in the stacked bar chart and bubble map reveals detailed information.
- **Animation**: The bar chart sorting feature includes animations for a more dynamic user experience.
- **Sliders**: A slider in the scatter plot allows users to filter house prices by population groupings.

## Dataset

- **Source**: [Kaggle Housing Prices Dataset](https://www.kaggle.com/datasets/shibumohapatra/house-price?resource=download)
- **Attributes**: 
  - `longitude`, `latitude`: Geographic coordinates.
  - `housing_median_age`: Median age of houses.
  - `total_rooms`, `total_bedrooms`: Number of rooms and bedrooms.
  - `population`: Population count.
  - `households`: Number of households.
  - `median_income`: Median household income.
  - `ocean_proximity`: Type of landscape (e.g., NEAR BAY, INLAND).
  - `median_house_value`: Median value of houses.

## Project Goals

- To provide an interactive and visually appealing analysis of California's housing market.
- To uncover patterns and relationships that can inform housing policies and strategies.
- To demonstrate proficiency in data visualization using D3.js.

## Tools Used

- **D3.js**: For creating dynamic and interactive visualizations.
- **HTML/CSS/JavaScript**: For structuring and styling the webpage.

## Contact

If you have any questions or would like to collaborate, feel free to reach out.
