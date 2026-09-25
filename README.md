# StudyFlow 🎓
> Modern Student Productivity & Academic Companion Mobile App built with React Native and Expo.

StudyFlow is designed specifically for college students to stay organized, manage assignments, monitor exam preparations, and boost study focus with an integrated Pomodoro timer.

---

## 📱 Features

### 1. 🚀 Splash Screen
- Smooth entrance animation featuring logo scale and fade transitions.
- Offline-first initialization with automatic initial college seed data.

### 2. 📊 Dashboard
- **Personalized Greeting**: Greets the student by name and displays today's date.
- **Study Momentum Widget**: Tracks today's focus minutes against target study hours and shows completion percentage.
- **Quick Actions**: One-tap shortcuts to create tasks, start the timer, schedule exams, or add a subject.
- **Today's Tasks**: Filtered list of assignments due today with instant completion checkboxes.
- **Upcoming Exams**: Quick view of upcoming exams with urgent countdown badges.

### 3. 📚 Subjects
- Full CRUD: Add, Edit, Delete subjects with course codes, instructor names, rooms, and target grades.
- **Customization**: 10 distinct subject colors and academic icon symbols.
- **Live Progress Calculation**: Automatically tracks total vs. completed tasks for each course with an animated progress bar.
- Tap any subject to quickly view and filter its tasks.

### 4. 📝 Tasks & Assignments
- Full CRUD: Add, Edit, Delete tasks.
- **Priority Indicator**: High (Red 🔥), Medium (Amber ⚠️), and Low (Green ✅).
- **Due Date Helpers**: Quick presets for "Today", "Tomorrow", "In 3 Days", "Next Week" plus custom date input.
- **Filters**: Filter by completion status (*All*, *Pending*, *Completed*) and by individual Subject chips.
- **Animated Completion Checkbox**: Satisfying bounce animation when completing tasks.
- Integrated search bar.

### 5. 🎯 Exams & Quizzes
- Schedule upcoming midterms, finals, and quizzes.
- **Live Countdown**: Displays dynamic relative countdowns (*Today!*, *Tomorrow*, *in X days*, *X days ago*).
- **Preparation Readiness**: Set and track preparation progress (0% - 100%) with visual color-coded progress bars.
- Weight tracking (e.g., 25% of final grade), exam venue, and topic syllabus notes.
- Separate tabs for **Upcoming** and **Past** exams.

### 6. ⏱️ Study Timer (Pomodoro Technique)
- **Timer Modes**:
  - 25-minute Pomodoro (Deep Work)
  - 5-minute Short Break
  - 15-minute Long Break
- **Course Tagging**: Tag study sessions to specific subjects.
- **Animated Circular Display**: Pulses smoothly during active sessions with dynamic time countdown (`mm:ss`).
- **Session Controls**: Start, Pause, Resume, Reset, and `+5m` extension button.
- **Persistence**: Completed study sessions are recorded to AsyncStorage and update daily focus time metrics.
- Completion vibration and notification alerts.

### 7. 👤 Profile & Settings
- **Student Profile**: Customize Name, College, Major, Semester, and Daily Study Goals.
- **Theme Switcher**: Seamless Dark Mode / Light Mode toggle with dynamic color tokens.
- **Lifetime Analytics**: Overall completed tasks, active courses, and cumulative study time logged.
- **Data Management**:
  - *Reload Sample College Data*: Instantly resets and loads realistic college demo data (ideal for evaluation).
  - *Clear All Data*: Resets local AsyncStorage.

---

## 🛠️ Tech Stack & Architecture

- **Framework**: React Native with Expo (SDK 57)
- **Language**: Pure JavaScript (No TypeScript)
- **Navigation**: React Navigation (Bottom Tabs + Native Stack)
- **Persistence**: `@react-native-async-storage/async-storage` (100% offline, zero backend required)
- **Icons**: `@expo/vector-icons` (Ionicons)
- **Safe Area**: `react-native-safe-area-context`

### Project Structure
```text
StudyFlow/
├── App.js                      # Root application entry point with Providers
├── app.json                    # Expo configuration
├── package.json                # Project dependencies
└── src/
    ├── constants/
    │   ├── colors.js           # Theme palettes, subject colors & priority config
    │   ├── theme.js            # Spacing, border radius, and elevation shadows
    │   └── typography.js       # Font sizing and hierarchy
    ├── context/
    │   ├── DataContext.js      # Global state for subjects, tasks, exams, sessions
    │   └── ThemeContext.js     # Light / Dark theme management
    ├── services/
    │   └── storageService.js   # AsyncStorage service and sample college mock data
    ├── utils/
    │   ├── dateUtils.js        # Relative dates, countdowns & formatting
    │   └── helpers.js          # ID generators and time formatters
    ├── components/
    │   ├── common/             # Reusable UI (Button, Card, Input, Badge, Header, etc.)
    │   ├── dashboard/          # Quick actions and progress summary widgets
    │   ├── tasks/              # TaskItem and TaskModal components
    │   ├── subjects/           # SubjectCard and SubjectModal components
    │   ├── exams/              # ExamCard and ExamModal components
    │   └── timer/              # Circular TimerDisplay component
    ├── screens/
    │   ├── SplashScreen.js
    │   ├── DashboardScreen.js
    │   ├── SubjectsScreen.js
    │   ├── TasksScreen.js
    │   ├── ExamsScreen.js
    │   ├── StudyTimerScreen.js
    │   └── ProfileSettingsScreen.js
    └── navigation/
        └── AppNavigator.js     # Bottom tab bar and navigation flows
```

---

## 🚀 Getting Started

### 1. Run the Development Server
```bash
npx expo start
```

### 2. View on Device / Emulator
- **Physical Device**: Scan the generated QR code using the **Expo Go** app on iOS or Android.
- **Android Emulator**: Press `a` in the terminal.
- **iOS Simulator**: Press `i` in the terminal (macOS).
- **Web Browser**: Press `w` in the terminal.

---

## 🧪 Testing & Evaluation Tips

1. **Preloaded Demo Data**: The app comes pre-seeded with sample college courses (Data Structures, Operating Systems, Linear Algebra, Web Engineering), tasks with various due dates, upcoming exams, and study logs.
2. **Reset Demo Data**: Navigate to **Profile** -> tap **"Reload Sample College Data"** at any time to restore the complete demo state.
3. **Dark Mode**: Tap the sun/moon icon in the dashboard header or toggle the switch in the **Profile** screen.


## 📥 Android APK

Download and install the latest StudyFlow Android APK:

[Download StudyFlow APK](https://drive.google.com/file/d/1w5ey7c-WzP8G8QX12pI8Pas9UEIkbvAM/view?usp=drivesdk)

> The APK is provided for evaluation and demonstration purposes.



## 🔗 Project Links

- **GitHub Repository:** https://github.com/Abhijeet6080/StudyFlow
- **Android APK:** https://drive.google.com/file/d/1w5ey7c-WzP8G8QX12pI8Pas9UEIkbvAM/view?usp=drivesdk