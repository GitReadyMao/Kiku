import { getCsrfToken } from "@/util/token";
import axios from "axios";

export default async function InitializeLesson() {
    const apiClient = axios.create({
        baseURL: "http://localhost:8080",
        withCredentials: true,
    });

    await apiClient.put(`/api/v1/initialize-lesson`, {
        headers: {
            'X-CSRF-Token': getCsrfToken(),
            'Lesson': 1
        }
    })
    .then(value => {
        console.log("test: " + value.data)
    })
}