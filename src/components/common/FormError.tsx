import React from 'react';
import { Text } from '@mantine/core';

interface FormErrorProps {
    message: string | undefined; // Pass the error message or undefined
}

const FormError: React.FC<FormErrorProps> = ({ message }) => {
    if (!message) {
        return null; // Don't render anything if there's no error
    }

    return (
        <Text c="red" size="sm" mt={2} ml={5}>
            {message}
        </Text>
    );
};

export default FormError; 