import { useEffect, useState } from 'react';

interface CropData {
  Country: string; 
  Year: string;   
  "Crop Name": string; // Name of the crop
  "Crop Production (UOM:t(Tonnes))": number; 
  "Yield Of Crops (UOM:Kg/Ha(KilogramperHectare))": number; 
  "Area Under Cultivation (UOM:Ha(Hectares))": number; 
}

export const useAgroData = () => {
  const [data, setData] = useState<CropData[]>([]); // State to hold processed crop data
  const [error, setError] = useState<string | null>(null); // state to hold error message

  useEffect(() => {
    // Function to fetch and process JSON data
    async function fetchData() {
      try {
        const response = await fetch('/agroDataset.json'); // Fetching JSON file
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`); // Error handling 
        }
        const dataset = await response.json();

        // processing dataset to ensure numerical values are parsed correctly
        const processedData = dataset.map((item: any) => ({
          ...item,
          "Crop Production (UOM:t(Tonnes))": parseFloat(item["Crop Production (UOM:t(Tonnes))"]) || 0,
          "Yield Of Crops (UOM:Kg/Ha(KilogramperHectare))": parseFloat(item["Yield Of Crops (UOM:Kg/Ha(KilogramperHectare))"]) || 0,
          "Area Under Cultivation (UOM:Ha(Hectares))": parseFloat(item["Area Under Cultivation (UOM:Ha(Hectares))"]) || 0,
        }));

        setData(processedData); // setting processed data into state
      } catch (e: any) {
        setError(e.message); // setting error message if catch any
      }
    }

    fetchData(); // Fetching data upon component mount
  }, []);

  // Function to calculate crop with highest and lowest production for each year
  const getMaxMinProductionData = () => {
    const maxMinData = data.reduce((acc: any, crop) => {
      const year = crop.Year;
      if (!acc[year]) acc[year] = { max: crop, min: crop };

      if (crop["Crop Production (UOM:t(Tonnes))"] > acc[year].max["Crop Production (UOM:t(Tonnes))"]) {
        acc[year].max = crop;
      }
      if (crop["Crop Production (UOM:t(Tonnes))"] < acc[year].min["Crop Production (UOM:t(Tonnes))"]) {
        acc[year].min = crop;
      }

      return acc;
    }, {});

    // Converting maxMinData to an array format suitable for table rendering
    return Object.keys(maxMinData).map((year) => ({
      year,
      maxCrop: maxMinData[year].max["Crop Name"],
      minCrop: maxMinData[year].min["Crop Name"],
    }));
  };

  // Function to calculate average yield and cultivation area for each crop
  const getAverageCropData = () => {
    const cropAccumulator: any = {};

    // calculating yield and area for each crop
    data.forEach(crop => {
      const cropName = crop["Crop Name"];
      if (!cropAccumulator[cropName]) {
        cropAccumulator[cropName] = { totalYield: 0, totalArea: 0, count: 0 };
      }

      cropAccumulator[cropName].totalYield += crop["Yield Of Crops (UOM:Kg/Ha(KilogramperHectare))"];
      cropAccumulator[cropName].totalArea += crop["Area Under Cultivation (UOM:Ha(Hectares))"];
      cropAccumulator[cropName].count += 1;
    });

    // Calculating average yield and area
    return Object.keys(cropAccumulator).map(cropName => ({
      cropName,
      avgYield: (cropAccumulator[cropName].totalYield / cropAccumulator[cropName].count).toFixed(3),
      avgArea: (cropAccumulator[cropName].totalArea / cropAccumulator[cropName].count).toFixed(3),
    }));
  };

  return {
    getMaxMinProductionData, // data for table displaying max and min production crps per year
    getAverageCropData, // data for table displaying average yield and area for each crop
    error, // Error state
  };
};