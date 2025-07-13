# holanda-commerce

holanda-commerce is a fictional e-commerce website built with Next.js, TypeScript, and Tailwind CSS v4. The project demonstrates modern web development best practices, focusing on performance, accessibility, and clean code. It features a responsive design, SEO optimizations, and a user-friendly interface for browsing, searching, and managing products.

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

## Backend API

### Create .env File

create a .env file in holanda_commerce_API folder
with the following keys and values:

```env
HOST="localhost"
PORT="your_port (default 8000)"
USER="your_user"
PASSWORD="your_password"
DATABASE="holanda_commerce"
JWT_SECRET="your_JWT_SECRET"
```

## Populate your database with sample data
the sample data can be found in:
```
holanda_commerce_API/src/sql
```

### Now, Start the Backend Server

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
- [ ] Make an section in main page thats changes depending on season or forecast
- [ ] Make the 'admin' part, managing products and transaction history
- [ ] (Personal, only me can do it) Make an 'what i learned' markdown file
- [ ] Change repeated images from some products, changing to real or ai images