# 🛡️ ShiftGuard AI — UN SDG 8 Decent Work & Economic Growth

> A modern, mobile-first frontline worker platform and employer compliance dashboard designed to eliminate opaque pay, unaddressed workplace hazards, and fatigue risks under **UN SDG 8 (Target 8.8: Protect labour rights and promote safe & secure working environments)**.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)
![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)
![React](https://img.shields.io/badge/React-18-blue.svg)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8.svg)
![Vite](https://img.shields.io/badge/Vite-6.1-purple.svg)

---

## ⚡ How to Push & Deploy to Vercel (2 Quick Ways)

### Option 1: Push to GitHub & Connect to Vercel (Recommended)

1. **Create a new repository on [GitHub](https://github.com/new)** (e.g. `shiftguard-ai`).
2. **Push your local code to GitHub**:
   ```bash
   git add .
   git commit -m "Initial commit of ShiftGuard AI"
   git remote add origin https://github.com/<your-username>/shiftguard-ai.git
   git branch -M main
   git push -u origin main
   ```
3. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**:
   - Click **"Add New..."** → **"Project"**.
   - Select your `shiftguard-ai` GitHub repository.
   - Framework preset will automatically detect **Vite**.
   - Click **"Deploy"**!
   - Your project will be live on `https://shiftguard-ai-xxx.vercel.app` in seconds! 🚀

---

### Option 2: Deploy Instantly via Vercel CLI (No GitHub needed)

You can deploy directly from your terminal using Vercel CLI:

```bash
npx vercel
```

- Follow the terminal prompts (accept defaults by pressing Enter).
- When asked for production deployment:
  ```bash
  npx vercel --prod
  ```
- Your live production URL will be generated immediately!

---

## 🔑 Demo Login Credentials

The prototype features pre-filled credentials for testing all worker categories and site supervisors:

### 👷 Frontline Worker Accounts:
| Worker Category | Name | Employee ID | Password | Worksites |
| :--- | :--- | :--- | :--- | :--- |
| **Construction Worker** | Ramesh Kumar | `CONST-8842` | `password123` | Metro Infra Line 3 (Pier 44 Zone B) |
| **Nurse (Healthcare Staff)** | Sister Ananya Sen | `NURSE-3312` | `password123` | City Metro Hospital (Trauma ICU) |
| **School Support Staff** | Rajeshwar Sharma | `SCH-6671` | `password123` | St. Jude Model School (Science Labs) |
| **Cleaning Lady / Sanitation** | Sunita Devi | `CLEAN-5512` | `password123` | University Main Campus (Facilities) |

### 🏛️ Employer / Site Admin Accounts:
| Authority Role | Name | Admin ID | Password | Organization |
| :--- | :--- | :--- | :--- | :--- |
| **Owner of Construction Site** | Vikram Singh | `ADMIN-CONST` | `adminpassword` | Metro Infra Consortium |
| **Head of Hospital (Medical Supt.)** | Dr. Arvinder Mehta | `ADMIN-HOSP` | `adminpassword` | City Metro Health Authority |
| **Head of School (Principal)** | Sister Mary Thomas | `ADMIN-SCH` | `adminpassword` | St. Jude Educational Trust |
| **Head of University Facilities** | Dr. Anita Roy | `ADMIN-CAMPUS` | `adminpassword` | Central University Operations |

---

## 🌟 Key Features

### 📱 1. Worker Mobile View (Smartphone Mockup)
- **1.0 km GPS Geofence Restriction**: The "Check In to Shift" button is **strictly locked** if the worker is outside 1.0 km radius. Includes real-time distance simulator (`On-Site (350m)` vs `Off-Site (2.4km)`).
- **Mandatory Site Photo Proof**: Verification selfie with timestamp, GPS geo-tag, and biometric alignment box on both **Check-In** and **Clock-Out**.
- **Transparent Wage Calculator (₹ INR)**: Base hourly rate + 1.5x overtime rate (>8 hrs) calculated live into Aadhaar-UPI linked bank account with zero deductions.
- **Anonymous Voice Hazard Reporter**: 2-second simulated audio recording with waveform animation, sector-specific hazard transcribing, and instant supervisor dispatch.
- **Dedicated Full Profile Screen**:
  - Name, Age, Height, Weight, Blood Type (with blood icon)
  - Emergency safety contact with direct SOS phone call button
  - Chief Supervisor name, supervisor ID, and phone number
  - Total lifetime working hours & lifetime earnings in ₹ INR
  - W3C Portable Skill & Safety Passport with scannable QR code

### 🖥️ 2. Employer Admin Dashboard
- **Top KPI Cards**: Total active on-site workers (100% geofenced), high fatigue risk alerts (>10h consecutive), open priority tickets, daily wage liabilities in escrow.
- **Shift & Overtime Trend Analytics**: Monday to Sunday stacked bar visualizer benchmarking statutory safe hours vs overtime bursts.
- **Real-Time Ticket Queue**: 1-click **`[ Resolve Ticket ]`** action updating status to Resolved with interactive toast notifications.
- **Workforce Fatigue & Attendance Monitor**: Displays verified check-in photos, hours worked today, and 1-click **`[ Trigger Mandatory Break ]`** enforcing 45m paid rest periods under SDG 8 compliance.

---

## 💻 Local Development

```bash
# 1. Clone or open directory
cd shiftguard-ai

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev

# 4. Build for production
npm run build
```

---

## 📄 License
MIT License • UN SDG 8 Decent Work & Economic Growth
