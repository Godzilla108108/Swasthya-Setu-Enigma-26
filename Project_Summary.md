# Swasthya Setu: Project Overview

## What is Swasthya Setu?
Swasthya Setu is an AI-enabled, comprehensive healthcare companion application built for the Enigma'26 Hackathon in Jaipur. It serves as a bridge between patients and healthcare providers, aiming to digitize and simplify the medical experience through a unified, accessible interface.

## Core Features & Capabilities

The project is currently equipped with several primary modules that work together to provide a seamless healthcare journey:

### 1. Multilingual Support
- **Global Accessibility**: Integrated with Google Translate to dynamically translate the entire application into English as well as all major Indian regional languages (Hindi, Bengali, Telugu, Marathi, Tamil, Urdu, Gujarati, Kannada, Malayalam, Punjabi, Odia, Assamese, Maithili, Sanskrit, Sindhi).

### 2. Medical Reports Repository 
- **Centralized Health Records**: A dedicated dashboard for patients to upload and manage their medical documents.
- **Smart Categorization**: Documents can be explicitly categorized during upload (e.g., Lab Report, Prescription, Imaging, Certificate).
- **Search & Filter**: Users can quickly find past reports by searching names/doctors or filtering by category tags.
- **In-App Preview**: Rather than blind downloads, clicking a document opens an interactive full-screen preview for both images and embedded PDFs directly within the app.

### 3. AI Prescription Analyzer
- **Automated Extraction**: Uses AI to automatically parse and extract information from uploaded prescription images or PDFs.
- **Actionable Insights**: Instantly converts static doctor's handwriting into active medication schedules, dosage instructions, and warnings for the patient dashboard.

### 4. Find Doctor & Analytics Dashboard
- **Smart Search**: Browse and filter through a list of specialist doctors and general physicians.
- **Video Consultations**: Toggle view to only show doctors available for remote video consultations.
- **Doctor Analytics Engine**: A built-in market insight tool that evaluates all doctors in a filtered list. It calculates a "Value Score" (weighing high ratings against consultation fees) to automatically recommend the "Best Value" doctor for any given specialty.

### 5. Patient Dashboard & Adherence
- **Medication Tracking**: A panel to monitor daily prescriptions, allowing patients to mark medications as taken.
- **Animated Statistics**: Engaging visual data on the home dashboard to keep patients informed of their health metrics.
- **SOS Emergency Protocol**: A quick-access emergency overlay to immediately contact designated emergency contacts or services.

### 6. Relative / Caregiver Access
- **Delegated Monitoring**: Patients can invite a trusted relative via email to their profile.
- **Access Boundaries**: When a relative logs in, they are immediately placed in "Caregiver Mode", allowing them to monitor the patient's dashboard and upload medical reports, but preventing them from modifying sensitive profile data or booking unauthorized appointments.

### 7. Secure Authentication
- **Flexibility**: The system has been structured to support robust user authentication paradigms, specifically configured to manage varied login states, secure routes, and profile data securely via standard email/password or third-party integrations (MongoDB/Firebase implementations).

## Technical Architecture
**Frontend**: 
- **Framework**: React (using Vite for lightning-fast bundling)
- **Language**: TypeScript for type safety and code quality
- **Styling**: Tailwind CSS utilizing a modern "glassmorphism" aesthetic with custom animations and deeply integrated Dark/Light modes.
- **Icons & UI**: Lucide-react for crisp, consistent iconography.

**Backend/Services**:
- Node.js server infrastructure designed to handle API requests, database connections, and AI integrations (Google Gemini Pro).

## Project Goal
The ultimate goal of Swasthya Setu is to reduce the friction in seeking medical help. By combining AI triage, transparent doctor analytics, centralized record management, and multilingual accessibility, the project aspires to make premium healthcare management available to everyone, regardless of their technical literacy or primary language.
