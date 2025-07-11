# holanda-commerce

holanda-commerce is a fictional e-commerce website built with Next.js 15, TypeScript, and Tailwind CSS v4. The project demonstrates modern web development best practices, focusing on performance, accessibility, and clean code. It features a responsive design, SEO optimizations, and a user-friendly interface for browsing, searching, and managing products.

some stuff, like the currency and date, is based on brazil format

## Features
- Product catalog with categories
- Product detail pages
- Shopping cart and wishlist
- User authentication and profile management
- Responsive and accessible UI
- Modern design using Tailwind CSS v4

## Getting Started

To run the development server:

```bash
cd holanda_commerce
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

### Backend API

To start the backend server (holanda_commerce_API):

```bash
cd holanda_commerce_API
npm install
npm run dev
```

By default, the backend will run on [http://localhost:8000](http://localhost:8000).

## Todos
- [ ] Make the stock system fully functional, so it increases and decreases depending on user actions (`src/app/pages/products/[id]/page.tsx`)
- [ ] Implement 'removing...' and 'remove to kart' button states (`src/app/pages/products/[id]/page.tsx`)
- [ ] make an section in main page thats changes depending on season or forecast
- [ ] make the 'admin' part, managing products and transaction history
- [ ] (personal, only me can do it) make an 'what i learned' markdown file
