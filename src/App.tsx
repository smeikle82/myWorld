import React from 'react';
import { MantineProvider, ColorSchemeScript } from '@mantine/core';
import { BrowserRouter } from 'react-router-dom';
import { Notifications } from '@mantine/notifications';
import Layout from './components/layout/Layout';
import { CharacterProvider } from './context/CharacterContext';

// Import Mantine core styles - Required for v7+
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

function App() {
  return (
    <>
      <ColorSchemeScript />
      <MantineProvider>
        <Notifications />
        <CharacterProvider>
          <BrowserRouter>
            <Layout />
          </BrowserRouter>
        </CharacterProvider>
      </MantineProvider>
    </>
  );
}

export default App;
