# Calories Tracker App

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Project Structure

The project follows a clean, modular architecture:

```
src/
├── app/              # Expo Router app directory
│   └── (tabs)/       # Tab navigation screens
├── components/       # Reusable UI components
│   └── ui/           # Basic UI elements
├── features/         # Feature-based modules
│   └── calories/     # Calories tracking feature components
├── hooks/            # Custom React hooks
├── constants/        # App constants and configuration
├── utils/            # Utility functions
├── types/            # TypeScript type definitions
└── assets/           # Static assets
```

## Getting Started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

## Path Aliases

The project uses TypeScript path aliases for cleaner imports:

- `@/*` - Root src directory
- `@components/*` - UI Components
- `@features/*` - Feature modules 
- `@hooks/*` - Custom hooks
- `@constants/*` - Constants
- `@utils/*` - Utility functions
- `@layouts/*` - Layout components
- `@types/*` - TypeScript types
- `@assets/*` - Static assets

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
