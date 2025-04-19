import { getCsrfToken } from "@/util/token";
import axios from "axios";
import { useEffect, useState } from "react";

export default function GetTermCount() {
  const [termID, setTermId] = useState("");
  function getTerm() {
    const apiClient = axios.create({
      baseURL: "http://localhost:8080",
      withCredentials: true,
    });

    apiClient.get(`/api/v1/term-count`, {
      headers: {
        'X-CSRF-Token': getCsrfToken(),
        'Lesson': 1,
      }
    })
      .then(value => {
        setTermId(value.data.count);
      }
      )
  };
  useEffect(() => {
    getTerm();
  }, []);
  return termID;
}