"use client"

import React from "react";
import axios from "axios";
export interface Token {
    token: string;
    expiresAt: number;
}

export function useAccessToken() {
    const [token, setToken] = React.useState<Token | null>(null);

    React.useEffect(() => {
        const fetchToken = async () => {
            const response = await axios.get("/api/jwt");
            const { token: newToken } = await response.data;
            setToken(newToken);
        };

        fetchToken();
    }, []);

    React.useEffect(() => {
        if (!token?.expiresAt) return;

        const intervalId = setInterval(async () => {
            const currentTime = Date.now() / 1000;
            if (currentTime < token.expiresAt) return;

            const response = await axios.get("/api/jwt");
            const { token: newToken } = await response.data;
            setToken(newToken);
        }, 60000);

        return () => clearInterval(intervalId);
    }, [token?.expiresAt]);

    return { token: token?.token ?? '' };
}