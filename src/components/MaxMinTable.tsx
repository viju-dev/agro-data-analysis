import { useState } from 'react';
import { useAgroData } from '../hooks/useAgroData';
import { Table,Pagination } from '@mantine/core';
import { createStyles, MantineTheme } from '@mantine/styles'

// Creating styles using Mantine's theming system
const useStyles = createStyles((theme: MantineTheme) => ({
  header: {
    backgroundColor: theme.colors.blue[6],
    color: theme.white,
  },
}));

/**
 * MaxMinTable component to display maximum and minimum production crops per year.
 */
const MaxMinTable = () => {
  const { getMaxMinProductionData } = useAgroData();
  const data = getMaxMinProductionData(); // Fetching data for max and min crops
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
    <Table.Tr key={index}>
      <Table.Td >{item.year}</Table.Td>
      <Table.Td >{item.maxCrop}</Table.Td>
      <Table.Td >{item.minCrop}</Table.Td>
    </Table.Tr>
  ));

  return (
    <div style={{ 'margin': '20px 20px 50px 20px', 'overflow':'scroll' }}>
      <h2 style={{ "textAlign": "left" }}>Crops with Maximum and Minimum Production Each Year</h2>
      <div className='tableContainer'>
      <Table verticalSpacing="sm" striped highlightOnHover withRowBorders={false}>
        <Table.Thead className={classes.header}>
          <Table.Tr>
            <Table.Th >Year</Table.Th>
            <Table.Th >Crop with Maximum Production in that Year</Table.Th>
            <Table.Th >Crop with Minimum Production in that Year</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
      </div>
      <Pagination total={dataPages.length} value={activePage} onChange={setPage} mt="sm" />
    </div>
  );
};

export default MaxMinTable;