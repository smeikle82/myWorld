import React from 'react';
import { Tabs } from '@mantine/core';
import { useLocation, useNavigate } from 'react-router-dom';

const tabData = [
  { label: 'Characters', value: '/characters' },
  { label: 'Dice Roller', value: '/roller' },
  { label: 'Oracle', value: '/oracle' },
];

const TabNavigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Find the current tab based on the path
  const currentTab = tabData.find(tab => location.pathname.startsWith(tab.value))?.value || '/characters';

  return (
    <Tabs value={currentTab} onChange={value => value && navigate(value)}>
      <Tabs.List>
        {tabData.map(tab => (
          <Tabs.Tab key={tab.value} value={tab.value}>{tab.label}</Tabs.Tab>
        ))}
      </Tabs.List>
    </Tabs>
  );
};

export default TabNavigation;

 