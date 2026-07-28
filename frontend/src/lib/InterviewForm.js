'use client';

import { useState } from 'react';
import api from '@/lib/axios';

export const useInterview = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const sendOnlineInterview = async (request) => {
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const response = await api.post('/api/greeting/send-online-interview', request);
            setSuccess(response.data.message);
            setLoading(false);
            return response.data;
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
            setError(`Error: ${errorMessage}`);
            setLoading(false);
            return null;
        }
    };

    const sendOfflineInterview = async (request) => {
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const response = await api.post('/api/greeting/send-offline-interview', request);
            setSuccess(response.data.message);
            setLoading(false);
            return response.data;
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
            setError(`Error: ${errorMessage}`);
            setLoading(false);
            return null;
        }
    };

    const sendOfferLetter = async (request) => {
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const response = await api.post('/api/greeting/send-offer-letter', request);
            setSuccess(response.data.message);
            setLoading(false);
            return response.data;
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
        sendOnlineInterview,
        sendOfflineInterview,
        sendOfferLetter,
    };
};