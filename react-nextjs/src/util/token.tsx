import getCookie from "./cookies";

export function getCsrfToken(): string {
    return getCookie("csrf_token");
  }