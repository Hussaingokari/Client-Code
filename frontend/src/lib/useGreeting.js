'use client';
import { useState } from 'react';
import api from '@/lib/axios';

export const useGreeting = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const sendGreeting = async (request) => {
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const response = await api.post('/api/greeting/send', request);
            setSuccess(response.data.message || 'Greeting sent successfully!');
            setLoading(false);
            return { success: true, ...response.data };
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
            setError(`Error: ${errorMessage}`);
            setLoading(false);
            return null;
        }
    };

    return {
        loading,
        error,
        success,
        sendGreeting,
    };
};