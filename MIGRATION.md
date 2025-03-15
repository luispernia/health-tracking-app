# Migration to src Directory Structure

This document explains the process of migrating the project to a cleaner, more organized directory structure with a `src` folder.

## New Project Structure

The new project structure follows a clean, modular architecture:

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

## Migration Process

We've created several scripts to help with the migration process:

1. **Migrate to src**: Moves files from the old structure to the new `src` directory structure.
   ```bash
   npm run migrate-to-src
   ```

2. **Update imports**: Updates import statements in your code to use the new path aliases.
   ```bash
   npm run update-imports
   ```

3. **Cleanup after migration**: Removes the original directories after migration (optional).
   ```bash
   npm run cleanup-after-migration
   ```

4. **Run the entire migration process**:
   ```bash
   npm run run-migration
   ```

## Path Aliases

The project now uses TypeScript path aliases for cleaner imports:

- `@/*` - Root src directory
- `@components/*` - UI Components
- `@features/*` - Feature modules 
- `@hooks/*` - Custom hooks
- `@constants/*` - Constants
- `@utils/*` - Utility functions
- `@layouts/*` - Layout components
- `@types/*` - TypeScript types
- `@assets/*` - Static assets

## Before Running Migration

1. Make sure you have committed your changes to git before proceeding.
2. Run the migration script: `npm run run-migration`
3. Test your app thoroughly before cleaning up the original directories.
4. If everything works correctly, run `npm run cleanup-after-migration` to remove the original directories.

## Manual Changes

You may need to make some manual changes after the migration:

1. Update any import statements that weren't automatically updated.
2. Update any references to files that were moved to the `src` directory.
3. Update any scripts or configurations that reference files in the old structure. 