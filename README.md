# 🚚 Smart Logistics (Frontend)

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn/ui-000000?style=for-the-badge&logo=shadcnui&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-8B0000?style=for-the-badge&logo=sqlalchemy&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Pandas](https://img.shields.io/badge/Pandas-150458?style=for-the-badge&logo=pandas&logoColor=white)
![scikit-learn](https://img.shields.io/badge/scikit--learn-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=black)
![AWS Lightsail](https://img.shields.io/badge/AWS_Lightsail-FF9900?style=for-the-badge&logo=amazonaws&logoColor=black)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

---

## 📌 Overview

This backend powers an **industry-grade logistics and inventory management system** with integrated **Machine Learning for demand forecasting and inventory optimization**.

The system is designed to:
- Track real-time inventory across warehouses
- Capture historical stock movements
- Forecast future product demand using ML
- Recommend optimal reorder quantities
- Support role-based access for different users

This project follows **backend-first architecture**, **production ML practices**, and **explainable decision logic**.

---

## 🛠️ Tech Stack

## Frontend
- **NextJS** - Full-stack React framework using the App Router for routing, layouts, and server components.
- **Tailwind CSS** - Utility-first CSS framework for fast, consistent, and scalable UI styling.
- **Shadcn UI** - Accessible, customizable component library built on Radix UI, improving code readability and reducing boilerplate.  

### Backend
- **FastAPI** – High-performance REST API framework
- **SQLAlchemy** – ORM for database interaction
- **PostgreSQL** – Relational database
- **Alembic** – Database migrations
- **JWT (python-jose)** – Authentication & authorization
- **Passlib (argon2)** – Secure password hashing
- **dotenv** – Environment variable management

### Machine Learning & Data Science
- **Pandas** – Data manipulation
- **NumPy** – Numerical computing
- **scikit-learn** – ML modeling
- **RandomForestRegressor** – Demand forecasting model
- **Joblib** – Model serialization

---

## 👥 User Roles

| Role | Capabilities |
|----|----|
| **Super Admin** | Full system access |
| **Warehouse Manager** | Inventory, orders, ML insights |
| **Delivery Boy** | Delivery status updates |

---

## 🧱 Backend Architecture

```
backend/
├── core/
├── models/
├── schemas/
├── api/
├── ml/
├── scripts/
├── alembic/
├── main.py
└── requirements.txt
```

---

## 🔐 Authentication & Authorization

- JWT-based stateless authentication
- Role-based route protection
- Secure password hashing using bcrypt
- Environment-based secret management

---

## 📦 Inventory System Design (ML-Ready)

### Key Tables
- **inventory** → Current stock state
- **inventory_logs** → Historical stock movements

### Why `inventory_logs` exists
- Captures every stock change as a time-stamped event
- Enables demand trend analysis
- Serves as the **only data source for ML training**
- Provides auditability and traceability

---

## 🧠 Machine Learning Pipeline

### Demand Forecasting
- Supervised regression problem
- Trained on 6 months of synthetic inventory consumption data
- Features: warehouse, product, day, month, weekday, weekend
- Model: RandomForestRegressor
- Metric: Mean Absolute Error (MAE ≈ 4.2)

### Reorder Recommendation Engine
- Combines ML forecasts with inventory logic
- Calculates reorder point, safety stock, and reorder quantity
- Fully explainable decision system

---

## 🔁 Synthetic Data Generation

- Simulates realistic logistics operations
- Includes seasonal demand and weekend spikes
- Generates ML-grade training data

---

## 🌐 Deployment

- Backend: AWS Lightsail (Amazon Linux 2023)
- Database: PostgreSQL
- ML inference served via FastAPI
- Secrets managed using `.env`

---

## ✅ Key Highlights

- Backend-first architecture
- Realistic ML pipeline
- Explainable AI decisions
- Industry-aligned logistics use cases

---

## 💻 Run frontend on your device
```
git clone https://github.com/chiragRane-Projects/inv_frontend.git

cd inv_frontend/

npm install

npm run dev
```

---

## </> Backend repository 
- **Backend:** [Backend Link](https://github.com/chiragRane-Projects/inv_backend.git) 

---

## 👨🏻‍💻 Developer Information
- **Portfolio:** [Portfolio Link](https://chirag-v-rane.vercel.app/)

- **Linkedin:** [LinkedIn Link](https://www.linkedin.com/in/chirag-v-rane/)