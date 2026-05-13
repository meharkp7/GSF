# Contributing to GSF

First off, thank you for taking the time to contribute to GSF 🚀

GSF (Global Society of Founders) is built to empower ambitious student founders through mentorship, collaboration, and venture-building opportunities. We welcome contributions that improve the platform, developer experience, and community ecosystem.

---

# 📚 Table of Contents

- [Getting Started](#-getting-started)
- [Contribution Workflow](#-contribution-workflow)
- [Branch Naming Convention](#-branch-naming-convention)
- [Commit Message Convention](#-commit-message-convention)
- [Code Style Guidelines](#-code-style-guidelines)
- [Testing Requirements](#-testing-requirements)
- [Pull Request Guidelines](#-pull-request-guidelines)
- [Repository Standards](#-repository-standards)
- [Do’s and Don’ts](#-dos-and-donts)
- [Reporting Bugs](#-reporting-bugs)
- [Feature Requests](#-feature-requests)
- [Code of Conduct](#-code-of-conduct)
- [Need Help?](#-need-help)

---

# 🚀 Getting Started

## 1. Fork the Repository

Click the **Fork** button on GitHub to create your own copy of the repository.

---

## 2. Clone Your Fork

```bash
git clone https://github.com/YOUR_USERNAME/GSF.git
cd GSF/GSF
```

---

## 3. Install Dependencies

```bash
npm install
```

---

## 4. Configure Environment Variables

Create a `.env.local` file in the project root.

Example:

```env
NEXT_PUBLIC_API_URL=your_api_url
```

---

## 5. Start Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

# 🔄 Contribution Workflow

1. Fork the repository
2. Clone your fork locally
3. Create a new branch
4. Make your changes
5. Run lint/tests
6. Commit your changes
7. Push your branch
8. Open a Pull Request

---

# 🌿 Branch Naming Convention

Use meaningful and descriptive branch names.

## Examples

```bash
feature/add-dashboard-analytics
fix/navbar-mobile-overflow
docs/update-contributing-guide
refactor/improve-auth-flow
```

Avoid generic branch names like:

```bash
new-feature
update
changes
```

---

# 📝 Commit Message Convention

Use clear and structured commit messages.

## Examples

```bash
feat: add mentor filtering system
fix: resolve session booking bug
docs: improve README structure
refactor: simplify dashboard state logic
ui: improve landing page responsiveness
```

---

# 🎨 Code Style Guidelines

To maintain consistency across the project:

- Use TypeScript strictly
- Prefer functional React components
- Keep components modular and reusable
- Follow existing project structure
- Use Tailwind CSS utility classes consistently
- Write readable and maintainable code
- Avoid unnecessary complexity

---

### UI/UX Principles

* Clean, premium, minimal
* Founder-first experience
* Fast interactions (no laggy flows)

### Folder Structure

Follow the existing structure:

* app/ → routes
* components/ → reusable UI
* landing/ → homepage sections
* ui/ → atomic components

---

# 🧪 Testing Requirements

Before opening a Pull Request, ensure the following:

```bash
npm run lint
npm run build
```

If applicable:

```bash
npm run test
```

Make sure:

- No TypeScript errors exist
- The application builds successfully
- No console errors are introduced
- Existing functionality remains unaffected

---

# 📦 Pull Request Guidelines

Before submitting your Pull Request:

- Keep PRs focused and minimal
- Link related issues when applicable
- Add screenshots/videos for UI changes
- Ensure lint/build checks pass
- Update documentation if necessary

## PR Title Examples

```bash
docs: improve contributor onboarding documentation
fix: resolve mobile navbar alignment issue
feat: add expert profile filtering
```

---

# 🛡️ Repository Standards

## Protected Branch Workflow

- Direct pushes to `main` are restricted
- All changes must go through Pull Requests

## Code Review Process

- PRs require maintainer approval before merge
- Requested changes should be addressed promptly
- Keep discussions respectful and constructive

## CI/CD Expectations

Contributors should ensure:

- Build passes successfully
- Linting passes
- No breaking changes are introduced

---

# ✅ Do’s and ❌ Don’ts

## ✅ Do’s

- Write clean and readable code
- Use meaningful variable and branch names
- Test your changes locally
- Follow project conventions
- Be respectful during discussions

## ❌ Don’ts

- Don’t push directly to `main`
- Don’t submit unrelated changes in one PR
- Don’t spam Pull Requests
- Don’t introduce breaking changes unnecessarily

---

# 🐛 Reporting Bugs

When reporting bugs, include:

- Clear bug description
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots/videos if applicable
- Environment details if relevant

---

# 💡 Feature Requests

We welcome ideas that:

- Improve founder experience
- Enhance accessibility and usability
- Improve platform scalability
- Strengthen developer experience
- Support meaningful collaboration

---

# 🤝 Code of Conduct

Please maintain a respectful and collaborative environment.

- Be constructive
- Respect contributors and maintainers
- Avoid toxic or offensive behavior
- Support new contributors

---

# 📬 Need Help?

If you have questions or need guidance, feel free to reach out:

📧 hello@gsf.community

---

Happy Contributing ❤️