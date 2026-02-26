# Sales CRM with Real-Time Automation

A specialized **Sales CRM** built using the **MERN stack** that automates lead ingestion from Google Sheets and intelligently assigns leads to sales callers based on:

-  State-specific availability  
-  Daily lead limits  
-  Fair round-robin distribution  

The system ensures balanced workload distribution and provides near real-time updates using **Socket.io**.

---
## System Architecture
<p align="center">
  <img src="./assets/design" width="800" alt="n8n Automation Workflow"/>
</p>

---

##  Features

- Automated lead ingestion from Google Sheets (via n8n)
- Intelligent state-based caller assignment
- Daily capacity enforcement per caller
- Automatic daily reset of workload counters
- Round-robin lead distribution logic
- Real-time frontend updates using Socket.io
- Scalable MongoDB database design

---


## Setup Instructions

### Prerequisites

- Node.js (v16+)
- npm
- MongoDB (Local or Atlas)
- n8n (Desktop or Cloud)
- ngrok

---

##  1. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file inside `server`:

```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
```

Start the backend:

```bash
npm start
```

---

##  2. Frontend Setup

```bash
cd client
npm install
npm run dev
```

---

##  3. n8n Automation Setup

1. Import `n8n_automation.json` into n8n.
2. Configure the **Google Sheets Trigger**:
   - Add your Google credentials
   - Use Spreadsheet ID:

```
1lUGM3NqeNThqM6PBpHPfibc7okPZgfI3v-aDElYVoKc
```

3. Update the **HTTP Request Node URL** to:

```
https://your-ngrok-url.ngrok.io/api/leads/ingest
```

---

## Automation Workflow

<p align="center">
  <img src="./assets/n8n_workflow" width="800" alt="n8n Automation Workflow"/>
</p>

### 1.Trigger
- Event: `rowUpdate`
- Monitors Google Sheet for new/updated rows

### 2. Filter
- Processes only rows where:

```
Status = "DONE"
```

### 3. Action
- Sends POST request to:

```
/api/leads/ingest
```

Payload:
- Name
- Phone
- State
- Source

---

## Database Structure

###  Leads Collection

Stores:
- Name
- Phone
- Source
- State
- assignedCaller (ObjectId reference)
- Timestamp

---

### Callers Collection

Stores:
- Name
- assignedStates (Array)
- dailyLeadLimit
- leadsToday
- lastAssignedAt
- isActive

---

##  Assignment Logic (`assignmentService.js`)

### 1. Daily Reset
Automatically resets `leadsToday` for all callers at the start of a new day.

### 2. State-Based Matching
Finds active callers assigned to the lead’s state.

### 3. Capacity Check
Filters out callers who have reached their `dailyLeadLimit`.

### 4. Fallback Mechanism
If no state-specific caller is available, falls back to all active callers.

### 5. Round-Robin Distribution
Among eligible callers, selects the one who was assigned the longest time ago to ensure fair workload balancing.

---

##  Real-Time Updates

- Uses **Socket.io**
- Emits event when a lead is ingested
- Updates frontend instantly without refresh

---

##  Automation Trigger Mechanism

- n8n polls Google Sheets every 1 minute.
- When a row meets filter criteria:
  1. Data is sent to backend
  2. Lead is stored in MongoDB
  3. Assignment logic runs
  4. UI updates via Socket.io

---

## Future Improvements

###  1.Lead Reassignment
Manual UI toggle to reassign leads between callers.

###  2.Language Matching
Match lead preferred language with caller’s supported languages.

###  3.Analytics Dashboard
- Conversion rate per caller
- State-wise lead density
- Caller performance metrics

###  4.Authentication & Roles
- Admin vs Caller roles
- Secure login system
- Protected lead data

---
