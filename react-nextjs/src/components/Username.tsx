import { getCsrfToken } from "@/util/token";
import axios from "axios";
import { useState, useEffect } from "react";

export default function GetUsername() {
    const [userName, setUserName] = useState("");
  
    function getUserApi() {
      const apiClient = axios.create({
        baseURL: "http://localhost:8080",
        withCredentials: true,
      });
  
       apiClient.get(`/api/v1/current-user`, {
          headers: {
            'X-CSRF-Token': getCsrfToken()
          }
        })
        .then(value => {
            setUserName(value.data.username);
        }
    )};
    useEffect(() => {
      getUserApi();
    }, []);

    return userName;
}