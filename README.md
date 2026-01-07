# BitacoraFx - Trading Journal

A modern Trading Journal mobile application built with React Native, Expo, and TypeScript. Track your trading accounts, daily profit/loss, and analyze your performance with beautiful charts.

## Features

- 📊 **Multiple Trading Accounts** - Manage multiple trading accounts with different currencies
- 💰 **Daily Profit/Loss Tracking** - Record daily trading results with notes
- 🔄 **Balance Auto-Calculation** - Automatic balance updates based on daily entries
- 📈 **Dynamic Charts** - Visualize your trading performance with interactive charts
- 🔥 **Firebase Firestore** - Persistent cloud storage for your data
- 🎨 **Clean & Minimal UI** - Beautiful iOS-inspired design
- 🌐 **Expo Web Support** - Deploy to web via Netlify

## Tech Stack

- **React Native** - Mobile framework
- **Expo** - Development platform
- **TypeScript** - Type-safe development
- **React Navigation** - Navigation library
- **Firebase Firestore** - Cloud database
- **React Native Chart Kit** - Data visualization
- **Expo Vector Icons** - Icon library

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Expo CLI (installed automatically)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/jeremyagnz/BitacoraFx.git
cd BitacoraFx
```

2. Install dependencies:
```bash
npm install --legacy-peer-deps
```

3. Configure Firebase:
   - Create a Firebase project at [https://console.firebase.google.com](https://console.firebase.google.com)
   - Enable Firestore Database
   - Update Firebase configuration in `src/services/firebase.ts` or use environment variables

### Running the App

Start the development server:
```bash
npm start
```

Run on different platforms:
```bash
npm run android  # Run on Android
npm run ios      # Run on iOS (macOS only)
npm run web      # Run on web browser
```

## Project Structure

The project follows a scalable, feature-organized structure designed for maintainability and performance:

```
BitacoraFx/
├── src/
│   ├── api/                # API layer - Firebase abstractions
│   │   ├── accounts.api.ts
│   │   ├── entries.api.ts
│   │   └── index.ts
│   ├── components/         # Reusable UI components
│   │   ├── AccountCard.tsx
│   │   ├── BalanceChart.tsx
│   │   ├── Button.tsx
│   │   └── EntryCard.tsx
│   ├── config/            # Configuration (Firebase, etc.)
│   │   ├── firebase.config.ts
│   │   └── index.ts
│   ├── constants/         # App-wide constants
│   │   ├── colors.ts
│   │   ├── app.constants.ts
│   │   └── index.ts
│   ├── hooks/             # Custom React hooks
│   │   ├── useAccounts.ts
│   │   ├── useEntries.ts
│   │   └── index.ts
│   ├── models/            # Data models and types
│   │   ├── entities/
│   │   │   ├── TradingAccount.ts
│   │   │   ├── DailyEntry.ts
│   │   │   ├── Navigation.ts
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── navigation/        # Navigation configuration
│   │   ├── RootNavigator.tsx
│   │   └── TabNavigator.tsx
│   ├── screens/           # App screens
│   │   ├── AccountsScreen.tsx
│   │   ├── AnalyticsScreen.tsx
│   │   └── DashboardScreen.tsx
│   ├── theme/             # Theme configuration
│   │   └── index.ts
│   └── utils/             # Utility functions
│       └── helpers.ts
├── assets/                # Images and fonts
├── App.tsx               # App entry point
└── package.json          # Dependencies
```

**📖 For detailed documentation, see [STRUCTURE.md](./STRUCTURE.md)**

### Key Benefits

- **🚀 Performance**: Optimized imports and code organization
- **📦 Scalability**: Easy to add new features and modules
- **🔧 Maintainability**: Clear separation of concerns
- **♻️ Reusability**: Custom hooks and API layer reduce duplication
- **🛡️ Type Safety**: Comprehensive TypeScript types
- **🎨 Theming**: Centralized theme and constants

## Usage

### Creating an Account

1. Open the app and tap the **+** button in the Accounts screen
2. Enter account name, initial balance, and select currency
3. Tap **Create Account**

### Adding Daily Entries

1. Tap on an account to view its dashboard
2. Tap the **+** button to add a new entry
3. Enter profit/loss amount (positive or negative)
4. Optionally add notes about the trade
5. Tap **Add Entry**

### Viewing Analytics

Navigate to the Analytics tab to view:
- Total portfolio balance
- Overall profit/loss
- Win rate percentage
- Best and worst trading days
- Per-account performance summary

## Deploying to Netlify

1. Build the web version:
```bash
npm run build:web
```

2. Deploy the `dist` folder to Netlify

3. Configure Netlify settings:
   - Build command: `npm run build:web`
   - Publish directory: `dist`

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
