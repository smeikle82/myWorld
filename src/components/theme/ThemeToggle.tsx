import React from 'react';
import { ActionIcon, useMantineColorScheme, Group, Tooltip } from '@mantine/core';
import { IconSun, IconMoon } from '@tabler/icons-react';

const ThemeToggle: React.FC = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';

  return (
    <Group justify="flex-end">
      <Tooltip label={dark ? 'Switch to light mode' : 'Switch to dark mode'}>
        <ActionIcon
          variant="outline"
          color={dark ? 'yellow' : 'blue'}
          onClick={() => toggleColorScheme()}
          size="lg"
          aria-label="Toggle color scheme"
        >
          {dark ? <IconSun size={20} /> : <IconMoon size={20} />}
        </ActionIcon>
      </Tooltip>
    </Group>
  );
};

export default ThemeToggle; 