CampusIQ — Campus Rescue Loop

### A Student Success and Academic Recovery Platform

CampusIQ is a web-based platform designed to help students who are struggling with attendance, academics, and placement preparation. Instead of just showing alerts or low scores, it helps mentors and students understand the problem, create a recovery plan, and track progress over time.

The main idea behind Campus Rescue Loop is simple: identify a problem, understand its cause, decide what to do next, and check whether the action actually helped.

The project focuses on making academic support more transparent and useful for both students and mentors.

Problem Statement

Many college advising systems can identify students who are falling behind, but they do not always provide a proper way to help them recover.

Some common problems are:

- Students receive attendance or academic alerts without clear suggestions on what to do next.
- Mentors record discussions in notes, but there is no proper way to track agreed actions and deadlines.
- It is difficult to compare a student's academic condition before and after an intervention.
- Students often do not understand how their academic success score is calculated.
- Placement eligibility can be confusing when companies have different CGPA, backlog, and branch requirements.

CampusIQ addresses these problems by bringing academic monitoring, recovery planning, progress tracking, and placement eligibility into one platform.

Target Users

The application has four main user groups.

**1\. Academic Mentors**

Mentors can review student records, identify areas that need attention, check attendance trends, simulate possible recovery scenarios, and create support plans with students.

**2\. Students**

Students can understand their success scores, view their support plans, update milestones, write weekly reflections, and check whether they meet placement drive requirements.

**3\. Faculty Members and HODs**

Faculty members can manage attendance and assignment evaluations. The demo also supports assigning faculty members to specific branches, sections, semesters, and academic years.

**4\. Placement Coordinators**

Placement coordinators can configure company recruitment drives and check student eligibility based on CGPA, active backlogs, and permitted departments.

Project Objective

The objective of CampusIQ is to turn academic alerts into a proper support process.

The platform combines an explainable success score, an attendance recovery simulator, shared mentor-student plans, and placement eligibility checks. It also records baseline values and later observations so that mentors and students can see whether their recovery efforts are making a difference.

---

## ⚙️ Features and Implementation Status

| Feature | Status | Description |
| --- | --- | --- |
| Success Score Calculation | Implemented | Calculates a score using available academic and student activity data, with normalized weights and a provisional status when data coverage is low. |
| Campus Rescue Loop | Implemented | Supports shared recovery plans, baseline snapshots, milestones, progress updates, mentor check-ins, and before-and-after comparisons. |
| Attendance Simulator | Implemented | Calculates how many future classes a student needs to attend to reach a target attendance percentage. |
| Placement Eligibility | Implemented | Checks CGPA, backlog limits, and allowed departments for each placement drive. |
| Local Data Persistence | Implemented | Saves demo data in browser localStorage and updates connected views through reactive events. |
| Role-Based Demo Views | Implemented for Demo | Includes eight switchable demo personas with different dashboards and available actions. |
| Leadership Directory | Implemented for Demo | Allows the super administrator to view demo users, while other roles can view and contact super administrators. |
| Faculty Assignments | Implemented for Demo | Supports faculty assignments to specific academic cohorts and filters attendance rosters accordingly. |
| Student Recommendations | Implemented | Generates recommendations using local rules and the information available in student records. |
| Acceptance Checks | Demo Aid | Provides an interactive checklist for demonstrating selected application behaviors. |
| Firestore Schema Preview | Illustrative | Shows a possible database structure but does not connect to an actual Firestore database. |
| Live Backend Synchronization | Future Work | Could be added using a backend, Firestore rules, real-time synchronization, and institutional system integrations. |
| Cloud AI Integration | Future Work | Could be added through a secure backend gateway with privacy filtering and an external AI provider. |

The application is currently a client-side demo. Features marked as implemented are available in the prototype, but they should not be interpreted as production-ready authentication or server-side security.

 Demo Users

The project includes sample personas to demonstrate how different users interact with the application.

| Name | Role | Demo ID | Main Use |
| --- | --- | --- | --- |
| Dr. Shweta Rao | Academic Mentor | `user-mentor-1` | Reviews Neha's academic status and manages her recovery plan. |
| Neha Patel | Student | `user-student-2` | Demonstrates an attendance recovery plan and academic support workflow. |
| Aarav Sharma | Student | `user-student-1` | Provides a comparison profile with a higher CGPA and no backlogs. |
| Ms. Priya Deshmukh | Placement Officer | `user-placement-admin-1` | Reviews company drives and student eligibility. |
| Prof. Rajesh Verma | Faculty Member | `user-faculty-1` | Demonstrates attendance and assignment-related workflows. |
| Dr. Evelyn Vance | Super Admin | `user-super-admin` | Demonstrates administrative features and the schema preview. |

The demo contains eight switchable personas in total. The table lists the main personas used in the walkthrough.

 Campus Rescue Loop: How It Works

The Rescue Loop is the main feature of the project. It helps mentors and students work together instead of treating an academic alert as the end of the process.

The workflow follows these steps:

1. **Identify the issue:** Review attendance, academic performance, or other available student data.
2. **Understand the evidence:** Check the records and dates behind the support signal.
3. **Create a recovery plan:** Agree on specific actions and targets with the student.
4. **Track milestones:** Mark completed actions, update progress, and add weekly reflections.
5. **Review progress:** Record mentor check-ins and revise the plan when necessary.
6. **Compare outcomes:** Compare the original baseline with the latest observed results.

For example, Neha Patel's seeded support case begins with a weighted attendance baseline of 51.5% across 13 sessions. Her observed attendance later reaches 65.0% across 18 sessions through October 12.

That is an improvement of 13.5 percentage points. The comparison gives the mentor and student a concrete way to discuss progress rather than relying only on a warning message.

---

## 📊 Success Score Calculation

CampusIQ uses a weighted score to summarize the information available about a student's academic progress and preparation.

The implemented score engine uses six factors:

| Factor | Weight |
| --- | --- |
| Academic performance | 35% |
| Attendance | 20% |
| LMS activity | 15% |
| Engagement | 10% |
| Skills | 10% |
| Placement preparation | 10% |
| **Total** | **100%** |

The calculation considers only factors for which data is available. The remaining weights are normalized so that missing information does not automatically count as zero.

Data coverage is also calculated separately. If coverage falls below 70%, the score is marked as provisional to indicate that there is not enough information for a reliable overall assessment.

This helps students understand that the score is based on available evidence rather than an unexplained number.

**Implementation note:** The six-factor weighting above describes the implemented feature set. The separate architecture notes currently contain a different five-factor formula, so the documentation and code should be aligned before final evaluation.

---

Attendance Recovery Simulator

The attendance simulator allows students and mentors to explore possible attendance outcomes before committing to a recovery target.

Users can select the number of upcoming sessions and see the projected attendance if the student attends those sessions.

The simulator supports targets such as 75% and 85% attendance and calculates the number of future sessions required to reach them. It also displays the assumptions behind the calculation.

For example, in Neha's seeded scenario, attending the next eight sessions would result in approximately 75.8% attendance.

This is a hypothetical projection, not an observed result. Once a suitable target is selected, the user can convert it into a milestone in the recovery plan.

Dynamic Placement Eligibility

Different companies have different placement requirements. CampusIQ checks these requirements dynamically instead of relying on fixed eligibility labels.

The placement engine evaluates three main criteria:

- **Minimum CGPA:** Whether the student's CGPA meets the company's cutoff.
- **Active backlogs:** Whether the student is within the permitted backlog limit.
- **Allowed departments:** Whether the student's department is accepted for the drive.

The `checkPlacementEligibility()` function evaluates the student against each drive's configured requirements and provides a breakdown of the results.

For example, the seeded demo shows Neha with a CGPA of 6.35 and one backlog. If a Microsoft drive requires a CGPA of at least 7.50 and allows no active backlogs, she does not meet those two requirements.

Aarav's seeded profile has a CGPA of 8.78 and no backlogs, making him eligible for drives whose other requirements he also satisfies.

This makes the result easier to understand because students can see which specific criteria they meet or need to improve.

 Two-Minute Demo Walkthrough

Follow these steps to demonstrate the main features during a project evaluation.

### Step 1: Open the Application (0:00–0:20)

1. Start the application using `npm run dev`.
2. Open `http://localhost:5173/`.
3. On the login page, select the Academic Mentor demo account for Dr. Shweta Rao.
4. The application opens the mentor workspace.

### Step 2: Review Neha's Academic Status (0:20–0:50)

1. Check that Neha Patel (`21CS078`) is selected.
2. Review her success score and the records behind the attendance support signal.
3. Examine the dated attendance data.

The seeded records show six present sessions out of six in early September. By October 7, her weighted attendance is 51.5% across 13 sessions, including six present sessions, one late session weighted at 0.7, and six absences.

### Step 3: Test the Recovery Simulator (0:50–1:20)

1. Open the Attendance Recovery Scenario card.
2. Set the number of future sessions to eight.
3. Review the hypothetical attendance projection of approximately 75.8% if all eight sessions are attended.
4. Click **Turn into Plan Milestone**.
5. Review the Active Support Plan, including its baseline snapshot, completed milestones, progress update, and mentor check-in.
6. Check the later observed attendance of 65.0% across 18 sessions through October 12.

You can also toggle an upcoming milestone, such as joining the peer-assisted tutorial circle, to demonstrate progress tracking.

### Step 4: Switch to Student View (1:20–1:40)

1. Use the role switcher to select Neha Patel.
2. Open her Active Academic Support Plan.
3. Update a milestone or submit a weekly reflection.
4. Test the attendance simulator from the student dashboard.
5. Switch to Aarav Sharma and compare his score, support signals, and placement overview.

### Step 5: Check Placement Eligibility (1:40–2:00)

1. Switch to Ms. Priya Deshmukh's Placement Officer view.
2. Review the seeded company drives, including Google, Microsoft, Infosys, and Cognizant.
3. Compare Aarav's and Neha's eligibility results.
4. Open the Acceptance Checks panel to demonstrate its interactive checklist.

The acceptance panel is only a demo aid. It does not prove that the application has secure authentication or production-ready authorization.

---

## 🛠️ Installation and Setup

### Prerequisites

- Node.js 18 or later.
- npm 9 or later.

The project has been tested with Node.js 20 and 22.

### Run the Project Locally

Open a terminal in the project directory and run:

```
# Install project dependencies
npm install

# Start the development server
npm run dev

# Build the project and check TypeScript
npm run build

# Preview the production build
npm run preview
```

The development server normally runs at:

`http://localhost:5173/`

 Architecture

The project uses React 19 and Tailwind CSS for the user interface, with separate services for state management, analytics, placement eligibility, and recommendations.

The current application runs entirely in the browser.

### 1\. State Management — `storageService.ts`

The storage service manages 18 normalized collections in memory and saves the data to browser `localStorage` using the key `campusiq_state_v1`.

Whenever data changes, the service emits events so that connected parts of the interface can update without reloading the page.

The application also provides a Reset Demo Data option to restore the initial sample data.

### 2\. Analytics — `analyticsService.ts`

The analytics service calculates student scores, checks data coverage, and generates support signals.

It also handles attendance session deduplication so that multiple entries for the same date and class do not inflate the session count.

The support signals are intended to encourage a review and discussion with the student rather than act as punitive alerts.

### 3\. Placement Eligibility — `placementEligibility.ts`

This service compares student records against the requirements configured for each placement drive.

It checks CGPA, backlog limits, and allowed departments, then returns a criterion-by-criterion result.

### 4\. Recommendations — `geminiService.ts`

Despite its filename, the current recommendation implementation uses deterministic local rules. It does not call an external AI service and does not require an AI API key.

Recommendations are generated using the student information and score components available in the demo.

### Data Flow

The main flow of the application is:

1. The React interface reads and updates application state.
2. The storage service persists changes in localStorage.
3. The analytics service calculates scores and support signals.
4. The placement service evaluates company drive requirements.
5. The recommendation service generates suggestions from available records.
6. The interface refreshes when relevant state changes occur.

Security, Privacy, and Limitations

CampusIQ is currently a prototype intended for demonstrations and project evaluation.

- **No live institutional connection:** The application uses fictional sample records and does not connect to a college SIS, ERP, or external identity provider.
- **Browser-based persistence:** Student plans, attendance data, and other changes are stored locally in the browser. Clearing the relevant browser data can remove saved changes and restore the initial seed state.
- **Demo role switching:** The role switcher demonstrates different dashboards, but it is not a real login system.
- **Client-side permissions:** Directory visibility and faculty cohort filtering are prototype behaviors, not server-enforced authorization.
- **Local audit logs:** Actions can generate timestamped audit entries, but these logs are stored on the client and are not an immutable cloud audit trail.
- **No live AI integration:** Recommendations currently use deterministic local rules.
- **Decision support only:** Scores, alerts, and attendance projections are intended to support conversations between students and mentors. They should not be used as the sole basis for academic or placement decisions.

For production use, the project would need secure authentication, server-side authorization, validated APIs, protected institutional data, reliable multi-device synchronization, and appropriate audit and privacy controls.

Future Improvements

The next stage of development could focus on the following areas:

1. **Backend integration:** Connect the application to a secure backend and Firestore or another suitable database.
2. **Real-time synchronization:** Allow students and mentors to see updates across different devices.
3. **Institutional integration:** Connect attendance, grades, and enrollment data from existing college systems.
4. **Secure role-based access:** Enforce permissions on the server rather than relying on client-side rules.
5. **Cloud AI gateway:** Add an optional backend service for AI-assisted recommendations, with appropriate privacy filtering and access controls.
6. **Automated testing:** Add unit tests for score calculations, attendance projections, placement eligibility, and intervention workflows.
7. **Improved outcome reporting:** Track which interventions are associated with measurable improvements over time.

These improvements would help move CampusIQ from a local demonstration to a platform that could be evaluated for real institutional use.

Deployment

The repository includes a GitHub Actions workflow that builds the Vite application and deploys the generated `dist` directory to GitHub Pages when changes are pushed to the `main` branch.

To enable deployment:

1. Open the repository's Settings.
2. Go to Pages.
3. Set the build and deployment source to **GitHub Actions**.
4. Push changes to `main` and check the workflow result.

The configured project URL is:

https://shaikmastan7337-cpu.github.io/campusiq-campus-rescue-loop/

The deployed version is a static client-side demo. It uses fictional seed data and browser-local storage and does not provide live backend services or real authentication.
📄 License

No open-source license has been added to the repository yet. The project is currently shared for hackathon judging, demonstration, and review.

Conclusion

CampusIQ was developed to make academic support more actionable and transparent. Instead of simply showing that a student is falling behind, it gives mentors and students a shared place to understand the problem, agree on recovery targets, track progress, and compare results.

The Rescue Loop, attendance simulator, explainable score calculation, and dynamic placement eligibility checks form the core of the current demo.

Although the application still needs backend integration and production-grade security before it can be used with real institutional data, the prototype demonstrates how academic monitoring can be connected to a more structured and measurable student support process.

One important thing before submitting: your original documentation has a few technical inconsistencies worth correcting so your explanation matches the actual code:

- The success score is described as a six-factor model in the feature section, but the architecture section lists a different five-factor formula.
- The attendance example uses both 51.5% across 13 sessions and 65.0% across 18 sessions. Keep the dates and weighted-attendance assumptions consistent wherever these values appear.
- The introduction describes eight demo personas, but only six are listed in the table. Add the other two if they exist in the application.

This version is written in a more natural, straightforward project-documentation style. Make sure you review it and adjust any descriptions that don't match what you personally implemented or tested.
