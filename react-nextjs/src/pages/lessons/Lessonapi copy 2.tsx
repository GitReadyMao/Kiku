import { getCsrfToken } from "@/util/token";
import axios from "axios";
import { useEffect, useState } from "react";

export default function GetQuestionTerms() {
  const [termID, setTermId] = useState("");
  function getTerm() {
    const apiClient = axios.create({
      baseURL: "http://localhost:8080",
      withCredentials: true,
    });

    apiClient.get(`/api/v1/question-terms`, {
      headers: {
        'X-CSRF-Token': getCsrfToken(),
        'ID': 1,
      }
    })
      .then(value => {
        setTermId(value.data);
        console.log(value.data);
      }
      )
  };
  useEffect(() => {
    getTerm();
  }, []);
  return termID;
}

export async function getQuestionTerms(): Promise<any> {
  const apiClient = axios.create({
    baseURL: "http://localhost:8080",
    withCredentials: true,
  });

  await apiClient.get(`/api/v1/question-terms`, {
    headers: {
      'X-CSRF-Token': getCsrfToken(),
      'ID': 1,
    }
  })
    .then(value => {
      console.log(value.data);
      return value.data
    }
    )
}


export async function getNextTerm(): Promise<string> {
  const apiClient = axios.create({
    baseURL: "http://localhost:8080",
    withCredentials: true,
  });

  await apiClient.get(`/api/v1/term`, {
    headers: {
      'X-CSRF-Token': getCsrfToken(),
      'Lesson': 1,
    }
  })
    .then(value => {
      console.log(value.data);
      return value.data.data.term_id;
    }
    )
  return "";
}
