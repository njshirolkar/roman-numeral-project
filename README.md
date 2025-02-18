# Roman Numeral Converter

## Introduction

This project is a monorepo containing both a backend API and a frontend UI for converting numbers to Roman numerals and vice versa. The backend is built with **Node.js, Express, and TypeScript**, while the frontend is a **React application** using **Adobe React Spectrum** for UI components.

I had a lot of fun working on this project! It may appear simple (which it is), but there were some intentional design choices made around **input sanitization, dynamic UI behavior, and range expansion using vinculum notation**. My goal was to keep the UI **minimalist and user-friendly**.

---

## UI Design Choices

This project follows a **minimalist UI design philosophy**.

### **Adaptive Input Field**
- The input field provides an initial level of sanitization, which changes based on the current conversion mode:
  - **Number-to-Roman mode** and **Limitless Number-to-Roman mode**: Only numeric input is allowed (no decimals or non-numeric characters).
  - **Roman-to-Number mode**: Only valid Roman numeral characters are accepted. Special characters like `_` are not allowed.
  - **Limitless Roman mode (unlocked when converting numbers >= 4000)**: The `_` character is **allowed** for vinculum notation.

### **Range Expansion w/ Vinculum**
- By default, the converter **only supports numbers up to 3999** which accounts for most use cases.
- If a user enters a number >= 4000, a hidden feature unlocks allowing them to expand the range. This was intentional to prevent unnecessary complexity for users who don't need larger conversions.

### **Light/Dark Mode**
- The app by default adapts to the system's theme (light or dark mode).
- A toggle button allows users to override the default mode.

---

## Framework & Technology Choices

- **Frontend:**
    - **Adobe React Spectrum**: Used for UI elements, reccomended to me but also chosen for its flexibility and polished, accessible components.
    - **React/Node.js/TypeScipt**: A popular tech stack and also one I'm familiar with.

- **Backend:**
    - **Containerization:** Docker is used to package the backend for easier deployment.
    - **Node.js/Express/TypeScript**: Leveraging TypeScript’s static typing elevated code reliability and maintainability. Node.js ensured seamless integration with the React-based frontend, while Express served as a lightweight yet powerful framework for handling routes.

---

## Backend

The backend is a **Node.js API** that handles conversion logic, logging, metrics collection, and health checks.

### **How to Run the Backend Locally**
1. Install dependencies:
   ```sh
   cd backend
   npm i
   ```
2. Build the project:
    ```
    npm run build
    ```
3. Start the server:
     ```
    npm run start
    ```
4. Run tests:
    ```
    npm test
    ```

### **Running with Docker (recommended)**
1. Build the Docker image:
    ```
    docker build -t roman-service .
    ```

2. Run the container:
    ```
    docker run -p 8080:8080 roman-service
    ```

### **Available API Endpoints**

| Endpoint                          | Description                                               |
|-----------------------------------|-----------------------------------------------------------|
| `/romannumeral`                   | Converts numbers (1–3999) to Roman numerals              |
| `/romannumeralreverse`            | Converts Roman numerals (I–MMMCMXCIX) to numbers         |
| `/romannumerallimitless`          | Converts numbers (1–3999999) using vinculum notation     |
| `/romannumeralreverselimitless`   | Converts Roman numerals with vinculum notation to numbers|
| `/metrics`                        | Provides Prometheus metrics for monitoring               |
| `/health`                         | Returns "OK", for health checks                   |


---

## Frontend

The frontend is a **React app** built with **Adobe React Spectrum**.


### **How to Run the Frontend Locally**
1. Install dependencies:
   ```sh
   cd frontend
   npm i
   ```

2. Run in development mode:
    ```
    npm start
    ```
This launches the app at http://localhost:3000.

3. Build for production:
     ```
    npm run build
    ```

4. Run tests:
    ```
    npm test -- --watchAll=false
    ```

---
## DevOps: Metrics, Health Checks & Logging

### Containerization

The backend is fully containerized using Docker, ensuring consistent behavior across environments and simplifying deployment and scaling.

### Metrics & Monitoring

A Prometheus metrics endpoint (/metrics, http://localhost:8080/metrics) provides insights into CPU usage (process_cpu_user_seconds_total), memory usage (process_resident_memory_bytes), event loop lag (nodejs_eventloop_lag_seconds), and garbage collection duration (nodejs_gc_duration_seconds).

### Health Check Endpoint

The /health endpoint returns "OK", signaling that the backend is up and running.

### Logging

The backend logs to console using Winston. In a production environment, logs can be redirected to a file, logging service, or database.

---

## Sources & References

- [Roman Numerals Reference](https://www.romannumerals.org/)
- [Roman Numerals – Wikipedia](https://en.wikipedia.org/wiki/Roman_numerals)
- [Bar Notation in Mathematics – Britannica](https://www.britannica.com/science/bar-mathematics)