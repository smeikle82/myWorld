import React, { Suspense } from 'react';
import { Box, Container, Title, Text, Group, Loader } from '@mantine/core';
import TabNavigation from './TabNavigation';
import { Routes, Route, Navigate } from 'react-router-dom';
import ThemeToggle from '../theme/ThemeToggle';

// Import the main feature components using React.lazy
const CharacterList = React.lazy(() => import('../CharacterManager/CharacterList'));
const DiceRoller = React.lazy(() => import('../DiceRoller/DiceRoller'));
const OracleSystem = React.lazy(() => import('../Oracle/OracleSystem'));

const containerStyle = { maxWidth: 1100 };

// Fallback component for Suspense
const LoadingFallback: React.FC = () => (
    <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
        <Loader />
    </Box>
);

const Layout: React.FC = () => {
  return (
    <Box style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header>
        <Container size="auto" style={containerStyle} py="md">
          <Group justify="space-between" align="center">
            <div>
              <Title order={1}>AI-Powered Roleplay Toolkit</Title>
              <Text c="dimmed" size="md">
                Essential tools for tabletop roleplayers, solo storytellers, and AI-assisted GMs.
              </Text>
            </div>
            <ThemeToggle />
          </Group>
        </Container>
      </header>
      <main style={{ flex: 1 }}>
        <Container size="auto" style={containerStyle} py="md">
          <TabNavigation />
          <Box my="xl">
            {/* Wrap Routes with Suspense */}
            <Suspense fallback={<LoadingFallback />}>
                <Routes>
                    <Route path="/characters" element={<CharacterList />} />
                    <Route path="/roller" element={<DiceRoller />} />
                    <Route path="/oracle" element={<OracleSystem />} />
                    <Route path="*" element={<Navigate to="/characters" replace />} />
                </Routes>
            </Suspense>
          </Box>
        </Container>
      </main>
      <Box component="footer" h={60} p="md" style={{ textAlign: 'center' }}>
        <Text size="sm" c="dimmed">&copy; {new Date().getFullYear()} AI-Powered Roleplay Toolkit</Text>
      </Box>
    </Box>
  );
};

export default Layout; 