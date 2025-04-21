import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { getCsrfToken } from "@/util/token";

export default function useUsername() {
  const [username, setUsername] = useState("Guest");

  const fetchUsername = useCallback(async () => {
    const apiClient = axios.create({
      baseURL: "http://localhost:8080",
      withCredentials: true,
    });

    try {
      const res = await apiClient.get("/api/v1/current-user", {
        headers: { 
            "X-CSRF-Token": getCsrfToken() 
        },
      });
      setUsername(res.data.username);
    } 
    
    catch (err) {
      setUsername("Guest");
    }
  }, []);

  useEffect(() => {
    fetchUsername();
  }, 
  
  [fetchUsername]);

  return { username, refreshUsername: fetchUsername };
}
