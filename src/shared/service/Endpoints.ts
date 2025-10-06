export const BASE_URL = "http://127.0.0.1:8000/api/v1/invook/";

export const ENDPOINTS = {
    LOGIN: BASE_URL + "auth/login/",
    REFRESH: BASE_URL + "auth/refresh/",
    STATS: BASE_URL + "statistics/",
    EQUIPOS: BASE_URL + "inventory/hardware/",
    CONSUMIBLES: BASE_URL + "inventory/supply/",
    PRESTAMISTAS: BASE_URL + "users/lenders/",
    MONITORES: BASE_URL + "users/admins/",
    PRESTAMOS: BASE_URL + "loan/",
    CONSUMOS: BASE_URL + "consum/"
}