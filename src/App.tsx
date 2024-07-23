import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { theme } from "./theme";
import "./App.css"


import MaxMinTable from './components/MaxMinTable';
import AverageTable from './components/AverageTable';
import { useAgroData } from './hooks/useAgroData';

const App = () => {
  const { error } = useAgroData();

  return (
    <MantineProvider theme={theme}>
    <div className="App">
    <h1>Agricultural Data Analysis</h1>
    {error ? (
      <p className="error">Error: {error}</p>
    ) : (
      <>
      <MaxMinTable />
      <AverageTable />
      </>
    )}
  </div>
  </MantineProvider>
    
  );
};

export default App;