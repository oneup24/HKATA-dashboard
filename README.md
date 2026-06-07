# 🚀 HKATA Sales & Marketing Command Center

A real-time, fully integrated React and Firebase dashboard designed to streamline operations, automate KPI tracking, and replace messy, conflicting Google Sheets with an interactive, multi-user CRM environment.

## 🎯 Executive Overview

**The Problem:** Relying entirely on shared Google Sheets for rapid B2C sales follow-ups (Meta Ads) and B2B pipeline management results in overwritten data, lack of accountability, and zero real-time visibility for management.

**The Solution:** The HKATA Command Center. A centralized hub where marketing data flows in, management distributes the workload, and the sales team executes their daily calls and WhatsApp messages in isolated, distraction-free workspaces.

## ✨ Core Features

**Real-Time Dashboard & KPIs:** Live tracking of daily generated leads, WhatsApp messages sent, calls made, and closed revenue. Updates instantly across all screens using Firebase Firestore.

**B2C Master Operations Pool:** An automated Google Sheets sync engine pulls raw Meta Ad leads into a secure "Unassigned" pool. Management can route these leads to specific sales reps without flooding their queues.

**Isolated Sales Workspaces:** Eric, Carmen, and Jason have their own personal queues. They feature one-click checklist toggles (Call, WhatsApp, Follow-up) and instant status updates (New, Interested, Busy, Closed).

**B2B Kanban Pipeline:** A dedicated CRM view for longer sales cycles. Syncs B2B leads and allows the team to move clients dynamically from Prospecting to Closed/Won.

**Automated Google Sheets Sync Engine:** A custom-built CSV parser that dynamically reads your specific column headers (full_name, email, phone) straight from Google Sheets, ensuring zero data misalignment.

## 🛠️ Technology Stack

- **Frontend:** React (Hooks, state management).
- **Styling:** Tailwind CSS (Utility-first, responsive design).
- **Database:** Firebase Firestore (Real-time NoSQL database).
- **Authentication:** Firebase Auth (Anonymous & Custom Token auth).
- **Data Ingestion:** Google Visualization API (for extracting live CSV data from published Google Sheets).

## 📖 Operational Workflows (SOPs)

### B2C Daily Workflow (Meta Ads -> Tele-sales)

1. **Syncing Data:** The Marketing Lead navigates to **Google Sheet Sync** and clicks "Import All Leads". Data is fetched from the Meta Ads Google Sheet.

2. **Distribution:** The Marketing Lead navigates to the **All Leads Master (B2C)** tab. All new leads sit in the "Unassigned Pool". The Lead uses the dropdown to assign batches of leads to specific sales reps.

3. **Execution:** Sales reps log in and open their specific **Sales Workspaces**. They work through their list, clicking the Y/N toggles for Calls and WhatsApps, and update the lead statuses.

4. **Monitoring:** The Boss monitors the **Dashboard Overview** to watch the daily KPIs tick up in real-time.

### B2B Daily Workflow

1. **Syncing Data:** Navigate to the **B2B Sales Pipeline** and click "Sync B2B Sheet".

2. **Pipeline Management:** As conversations progress with schools or corporate clients, the team updates the stage dropdown on the client card, moving them left-to-right across the Kanban board until closed.

## 💻 Developer Setup Guide

If you need to deploy this locally or hand it off to another developer:

### Prerequisites

- Node.js (v16+)
- A Firebase Project with Firestore and Authentication (Anonymous) enabled.

### 1. Install Dependencies

```bash
npm install firebase react react-dom
npm install -D tailwindcss postcss autoprefixer
```

### 2. Environment Variables

You will need your Firebase configuration keys. Create a `.env` file in the root directory:

```
REACT_APP_FIREBASE_API_KEY="your_api_key"
REACT_APP_FIREBASE_AUTH_DOMAIN="your_auth_domain"
REACT_APP_FIREBASE_PROJECT_ID="your_project_id"
```

### 3. Google Sheets Permissions

For the sync engine to work, the source Google Sheets must have their share settings set to:
**General Access: Anyone with the link (Viewer).**
If this is restricted, the fetch requests will fail due to Google's CORS/Authentication blocks.

### 4. Run the Application

```bash
npm start
```

## 🚀 Future Roadmap (Phase 2)

- **Zapier Webhook Integration:** Bypass the Google Sheet Sync button entirely by routing Meta Instant Forms directly into Firebase via Zapier Webhooks.

- **Social Media Planner:** Activate the social media tab to allow marketing to upload assets, draft copy, and submit to management for approval.

- **Dynamic Target Settings:** Build an admin panel to adjust the daily HK$50,000 revenue target based on seasonality.
