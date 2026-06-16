# TutorConnect — Modern Home & Online Tuition Platform

TutorConnect is a responsive web application built with **React 19**, **Vite**, and **Tailwind CSS v4** that connects students and parents with verified private home and online tutors.

---

## 🚀 Technology Stack

- **Framework**: [React 19](https://react.dev/)
- **Bundler & Server**: [Vite](https://vite.dev/)
- **Routing**: [React Router DOM v6](https://reactrouter.com/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (using native `@tailwindcss/vite` plugin)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Form Management**: [React Hook Form](https://react-hook-form.com/)
- **Validation**: [Yup Schema Validation](https://github.com/jquense/yup)
- **Metadata (SEO)**: [React Helmet Async](https://github.com/staylor/react-helmet-async)
- **API client**: [Axios](https://axios-http.com/)

---

## ✨ Features

1. **Home Landing Page**:
   - High-impact animated Hero section with CTAs.
   - Core trust metrics panel.
   - Dynamic subject categories carousel.
   - Top-rated featured tutors panel.
   - Steps-by-step process timeline layout.
   - Auto-scrolling parent/student testimonials.
   - Interactive FAQ accordions.

2. **Tutor Search Directory**:
   - Free text search querying names, qualifications, or subjects.
   - Multiple criteria filters (Subject, Class, Teaching Mode, City, Price Range).
   - Syncs filter parameters directly with the browser URL (enables sharing specific search links).
   - Responsive sidebar with a slide-out filter drawer for mobile viewports.
   - Shimmer Skeletons showing visual feedback during queries.

3. **Detailed Tutor Profiles**:
   - Comprehensive resume detailing qualifications, teaching experience, biography, subjects, classes, availability schedules, and direct hourly rates.
   - Interactive lists of student-written reviews.

4. **Multi-Step Tutor Registration**:
   - 4-step wizard collecting Personal, Education, Preferences, and Resume files.
   - Strict validation preventing progression with missing fields.

5. **Demo Booking System**:
   - Global booking modal launcher accessible from any card or profile.
   - Captures student requirements and schedules trial classes.

6. **Premium Visuals**:
   - Light/Dark mode toggling with preferences saved in `localStorage`.
   - Subtle scroll indicators and progress-ring back-to-top floating actions.

---

## 📂 Project Directory Structure

```
src/
├── assets/            # Global visual assets
├── components/
│   ├── common/        # Reusable primitives (Buttons, Modals, SEO headers, skeletons)
│   ├── layout/        # Shared frameworks (Sticky Header/Navbar, Footer)
│   ├── forms/         # Validated inputs (Contact, Booking, multi-step become-tutor)
│   └── sections/      # Home sections (Hero, How-it-Works, carousels)
├── pages/             # Layout viewports (Home, Directory, Profiles, Registration, etc.)
├── hooks/             # Custom triggers
├── services/          # API mock wrappers & Axios instances
├── routes/            # Routes configuration with lazy loaded chunk definitions
├── utils/             # Helpers
├── data/              # JSON databases (tutors, testimonials)
├── context/           # Global states (Theme dark/light context, modal context)
├── constants/         # Constant structures (FAQs, categories, links)
└── styles/            # Styles entry point (index.css)
```

---

## ⚙️ Running the Project Locally

### 1. Prerequisite
Ensure that [Node.js](https://nodejs.org/) (v18 or higher) is installed on your local machine.

### 2. Install Dependencies
Run the command below in the project root to install the packages:
```bash
npm install
```

### 3. Start Development Server
Launch the development server:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your web browser.

### 4. Build for Production
Generate optimized, code-splitted production bundle:
```bash
npm run build
```
The compiled build output will be stored inside the `dist/` directory.

---

## 🔌 API Swapping Architecture

Services in `src/services/` are structured to support immediate REST API integration. Each service is written with a conditional check:
```javascript
const USE_MOCK = true; // Set to false to immediately direct requests to your live REST APIs.
```
When `USE_MOCK` is toggled to `false`, requests are dispatched to the Axios instance in `src/services/api.js` (pointing to the environment VITE_API_URL or defaults).
