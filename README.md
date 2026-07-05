# Invoice & Quotation Management System

A simple, modern, and responsive web application to create, manage, preview, and track invoices and quotations. Built with **React 19**, **Vite**, **Redux Toolkit**, and **Tailwind CSS v4**.

---

## 🚀 Features

- **Create Invoices & Quotations**: Toggle between Invoices and Quotations with automated unique ID generation (e.g., `INV-2026-XXXX` or `QTN-2026-XXXX`).
- **Dynamic Calculations**: Real-time updates of subtotal, tax amounts, discount deductions, and grand totals as you add or modify items.
- **Invoice Tracking**: View list of all documents with status labels (e.g., Draft, Sent, Paid) and quick actions.
- **Detailed Previews**: Clean, print-friendly preview layouts for individual invoices/quotations.
- **Status Management**: Easily update the status of existing invoices or delete them.
- **Modern Responsive Design**: Built using Tailwind CSS v4 with adaptive layout support.

---

## 🛠️ Tech Stack

- **Frontend Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 8](https://vite.dev/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/) & [React Redux](https://react-redux.js.org/)
- **Routing**: [React Router DOM v7](https://reactrouter.com/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Linter**: [Oxlint](https://github.com/oxc-project/oxc)

---

## ⚙️ Getting Started

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed, and [pnpm](https://pnpm.io/) package manager (since this project uses `pnpm`).

### Installation

1. Clone the repository:
   ```bash
   git clone <https://github.com/satyasandhya97/Invoice-Quotation-Management.git>
   cd Invoice-Quotation-Management
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

### Running the App

- **Development Server**: Run the application locally with Hot Module Replacement (HMR).
  ```bash
  pnpm dev
  ```
  Open `http://localhost:5173` (or the port specified in terminal) in your browser.

- **Build**: Compile and optimize the application for production.
  ```bash
  pnpm build
  ```

- **Preview**: Run the production build locally to test.
  ```bash
  pnpm preview
  ```

- **Lint**: Run Oxlint to check for code quality and errors.
  ```bash
  pnpm lint
  ```

---

## 📁 Project Structure

```
├── public/              # Static public assets
├── src/
│   ├── components/      # Reusable UI components (Navbar, LoadingSpinner, ErrorBoundary)
│   ├── pages/           # Page views (InvoiceList, InvoiceForm, InvoiceDetail)
│   ├── store/           # Redux state store config & invoice slices
│   ├── App.jsx          # App routing and global layout
│   ├── index.css        # Global CSS stylesheet & Tailwind setup
│   └── main.jsx         # Application entry point
├── package.json         # Scripts and project dependencies
└── vite.config.js       # Vite configuration
```
# Live URL = https://invoice-quotation-management-rust.vercel.app/ 