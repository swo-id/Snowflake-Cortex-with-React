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
            try {
                const response = await axios.get("/api/jwt");
                const { token: newToken } = await response.data;
                setToken(newToken);
            } catch {
                console.warn("Failed to fetch token, using hardcoded fallback");
                setToken({
                    token: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJBNTcyNTg0MjY3ODk2MS1TT0ZUV0FSRU9ORV9QQVJUTkVSLkhJTEFMX1IuU0hBMjU2OlZvNkhIZ3crLzMxVTM3WCtEUHJHK1BYZTIzWlRocUZxOWR4K1lyb0RzWXM9Iiwic3ViIjoiQTU3MjU4NDI2Nzg5NjEtU09GVFdBUkVPTkVfUEFSVE5FUi5ISUxBTF9SIiwiaWF0IjoxNzUxMjcyNzg4LCJleHAiOjE3NTM4NjQ3ODh9.dVbflcF-XSANgiTsKQvFW6iGQgCWjCLfxZuKw_pLbnNgVG8Mxkm7vKOqyrvAqKhi_Za--tJFJeDNUihWd7WpbroQqvI3OXQecO1Rz2U0C6O_iYRF_nEAFPdWy3JOXqqSEdpWp5riGNz8koyOkM4yrWcfaJoWkaAfumZm6k6xQaRRejphibXHa3OPlnti_KZr-9bR6pWx2WZhQCdgRfYzkjVxNEtxqSOlIVZlwNQSGVPMXr9Ck8ZpBsMK62CtRndjyTRQvQfyk9WwwqRIhhW26dMq-wIBTul9MYRty21donUsSvftn-oKgxNrOcaZOZS7uHOR3N5NrkerOgc-8zls4w", // 🔐 Replace with your token
                    expiresAt: 1753864668,
                });
            }
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