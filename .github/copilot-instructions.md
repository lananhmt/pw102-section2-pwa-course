# Copilot Instructions for PWA Course Test Automation Project

## Project Overview
This is a Playwright-based test automation project structured around modular lesson sections. The project demonstrates various testing approaches and patterns for web applications, APIs, and special test scenarios.

## Architecture & Structure

### Key Directories
- `/pom` - Page Object Models directory
  - `/e-commerce-API` - API testing modules
  - `/e-commerce-web` - Web UI testing modules (admin/user flows)
  - `/material-page` - Special component testing
  - `/websocket` - WebSocket testing implementations

### Tests Organization
Tests are organized by lessons in `/tests` directory:
- Each lesson folder (e.g., `lesson-01`, `lesson-02`) contains:
  - Key takeaways markdown file (`01-key-takeaways.md`)
  - Test implementation files (`.spec.ts`)
  - Supporting utilities and fixtures
  - Lesson-specific data files

## Development Workflow

### Test Execution Commands
```bash
# Run smoke tests
npm run lananh:run-smoke

# Run tests in Chrome
npm run lananh:run-chrome

# Run with UI mode
npm run lananh:run-chrome-headed

# Retry failed tests
npm run lananh:run-last-failed

# Run tests multiple times
npm run lananh:run-3times
```

### Environment Configuration
- Environment variables are loaded from `.env.{ENV}` files
- Configuration is managed through `playwright.config.ts`
- Test data is separated by environment (dev/prod) in `test-data` directories

## Project Patterns

### Page Object Model Implementation
- Base page functionality in `pom/base-page.ts`
- Separate models for admin and user flows
- API clients are organized by domain (e.g., products, categories)

### Test Data Management
- JSON-based test data files in `test-data` folders
- Environment-specific data files (dev vs prod)
- Utility functions in `utils/json-reader.ts`

### Fixture Patterns
See `tests/lesson-02/fixture/` for examples of:
- Custom fixtures for authentication
- Worker-scoped fixtures
- Data-driven test setup

## Integration Points
- Database integration using TypeORM (see dependencies in `package.json`)
- WebSocket testing support (`/pom/websocket`)
- API testing modules in `pom/e-commerce-API`
- TOTP authentication testing support

## Special Testing Features
- File download handling
- Dialog/popup management
- WebSocket communication testing
- Time-based One-Time Password (TOTP) testing
- Database fixtures for test data management