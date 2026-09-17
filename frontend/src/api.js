import axios from "axios";


const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
  timeout: 30000
});


/* =========================================================
   AUTH TOKEN
========================================================= */

API.interceptors.request.use(
  (config) => {

    const token =
      localStorage.getItem("civicai_token");

    if (
      token &&
      !config.url?.includes("/auth/login") &&
      !config.url?.includes("/auth/signup")
    ) {

      config.headers.Authorization =
        `Bearer ${token}`;

    }

    return config;
  },

  (error) => Promise.reject(error)
);


/* =========================================================
   AUTH ERROR
========================================================= */

API.interceptors.response.use(

  (response) => response,

  (error) => {

    if (
      error.response?.status === 401 &&
      !error.config?.url?.includes("/auth/login")
    ) {

      localStorage.removeItem(
        "civicai_token"
      );

      localStorage.removeItem(
        "civicai_user"
      );

      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);


/* =========================================================
   LOGIN
========================================================= */

export const loginUser =
  async (email, password) => {

    const response =
      await API.post(
        "/auth/login",
        {
          email: email.trim(),
          password
        }
      );

    return response.data;
  };


/* =========================================================
   SIGNUP
========================================================= */

export const signupUser =
  async (name, email, password) => {

    const response =
      await API.post(
        "/auth/signup",
        {
          name,
          email: email.trim(),
          password
        }
      );

    return response.data;
  };


/* =========================================================
   COMPLAINTS
========================================================= */

export const getComplaints =
  async (token) => {

    const response =
      await API.get(
        "/complaints/",
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

    return response.data;
  };


export const createComplaint =
  async (
    token,
    complaintData
  ) => {

    const response =
      await API.post(
        "/complaints/",
        complaintData,
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

    return response.data;
  };


export const getComplaintStats =
  async (token) => {

    const response =
      await API.get(
        "/complaints/stats",
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

    return response.data;
  };


export const updateComplaintStatus =
  async (
    token,
    complaintId,
    status
  ) => {

    const response =
      await API.put(
        `/complaints/${complaintId}/status`,
        null,
        {
          params: {
            status
          },

          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

    return response.data;
  };


/* =========================================================
   OCR
========================================================= */

export const extractComplaintText =
  async (
    token,
    image
  ) => {

    const formData =
      new FormData();

    formData.append(
      "file",
      image
    );

    const response =
      await API.post(
        "/ocr/extract",
        formData,
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

    return response.data;
  };


/* =========================================================
   USERS
========================================================= */

export const getUsers =
  async (token) => {

    const response =
      await API.get(
        "/users/",
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

    return response.data;
  };


/* =========================================================
   HEALTH
========================================================= */

export const getHealth =
  async () => {

    const response =
      await API.get(
        "/health"
      );

    return response.data;
  };


export const getDatabaseHealth =
  async () => {

    const response =
      await API.get(
        "/database-test"
      );

    return response.data;
  };


export default API;