"use client"

import React from "react";

export interface Token {
    token: string;
    expiresAt: number;
}

export function useAccessToken() {
    const [token, setToken] = React.useState<Token | null>(null);

    React.useEffect(() => {
        const fetchToken = async () => {
            try {
                const response = await fetch("/api/jwt");
                const { token: newToken } = await response.json();
                setToken(newToken);
            } catch  {
                console.warn("Failed to fetch token, using hardcoded fallback");
                setToken({
                    token: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJBNTcyNTg0MjY3ODk2MS1TT0ZUV0FSRU9ORV9QQVJUTkVSLkhJTEFMX1IuU0hBMjU2OlZvNkhIZ3crLzMxVTM3WCtEUHJHK1BYZTIzWlRocUZxOWR4K1lyb0RzWXM9Iiwic3ViIjoiQTU3MjU4NDI2Nzg5NjEtU09GVFdBUkVPTkVfUEFSVE5FUi5ISUxBTF9SIiwiaWF0IjoxNzUxMjE0ODU0LCJleHAiOjE3NTEyMTg0NTR9.dQsBFQQt-gvWeWPFS76cV7VnG1kVITE68PVw0O1nnxbyfd04QaKJ2tB2o_wMLpaFSrqmq68deHxL-HEWd1A4orNjotmYnoZt5x-E57kczjjslX1sEI14syt_eHZgM9Pz7EZSg9p1HpIOa8Ldh5nsUbxvspis_RdaBplwuegnaYHzy5SIn4oBCjrjRLXX7AaK0NP6d0yp_8_1knY5kfhTeEylZMEZ9jrtJejXdrV-jhGl9isFul3oL7w5CAMua17fsopXzUC35Vl3S9e9CYbjgWcKQXqGM6SBGUjchKNWgLKCmKFnSk1Qj2U6GJUF0t2f7HnPGpxjj7-R5xIcKzy3gQ", // 🔐 Replace with your token
                    expiresAt: 1751218334,
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

            const response = await fetch("/api/jwt");
            const { token: newToken } = await response.json();
            setToken(newToken);
        }, 60000);

        return () => clearInterval(intervalId);
    }, [token?.expiresAt]);

    return { token: token?.token ?? '' };
}