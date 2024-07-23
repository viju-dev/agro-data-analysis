import { useState } from 'react';
import { useAgroData } from '../hooks/useAgroData';
import { Table, Pagination } from '@mantine/core';
import { createStyles, MantineTheme } from '@mantine/styles'

// Creating styles using Mantine's theming system
const useStyles = createStyles((theme: MantineTheme) => ({
  header: {
    backgroundColor: theme.colors.blue[6],
    color: theme.white,
  },
}));

/**
 * AverageTable component to display average yield and cultivation area per crop.
 */
const AverageTable = () => {
  const { getAverageCropData } = useAgroData();
  const data = getAverageCropData();  // Fetching data for average yield and area
  const { classes } = useStyles();

  // function that divides data into specific length blocks
  function chunk<T>(array: T[], size: number): T[][] {
    if (!array.length) {
      return [];
    }
    const head = array.slice(0, size);
    const tail = array.slice(size);
    return [head, ...chunk(tail, size)];
  }

  const dataPages = chunk(
    data,
    10
  );
  
  // Creating table rows
  const [activePage, setPage] = useState(1);
  const rows = dataPages[activePage - 1]?.map((item, index) => (
    <Table.Tr key={index} style={{textAlign : "left"}}>
      <Table.Td >{item.cropName}</Table.Td>
      <Table.Td >{item.avgYield}</Table.Td>
      <Table.Td >{item.avgArea}</Table.Td>
    </Table.Tr>
  ));


  return (
    <div style={{ 'margin': '20px 20px 50px 20px'}}>
      <h2 style={{'textAlign':'left'}}>Average Yield and Cultivation Area (1950-2020)</h2>
      <div className='tableContainer'>
      <Table verticalSpacing="sm" striped highlightOnHover withRowBorders={false}>
        <Table.Thead className={classes.header}>
          <Table.Tr>
            <Table.Th >Crop</Table.Th>
            <Table.Th >Average Yield (1950-2020)</Table.Th>
            <Table.Th >Average Cultivation Area (1950-2020)</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
      </div>
      <Pagination total={dataPages.length} value={activePage} onChange={setPage} mt="sm" />
    </div>
  );
};

export default AverageTable;