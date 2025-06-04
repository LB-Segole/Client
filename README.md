# AI Voice Calling Agent SaaS

A modern SaaS application for managing AI-powered voice calling campaigns.

## Features

- 🔐 Secure authentication with Supabase
- 📊 Interactive dashboard with real-time metrics
- 📱 Campaign management and tracking
- 📞 AI-powered voice calling capabilities
- 📈 Analytics and reporting
- 🎨 Modern UI with Tailwind CSS

## Tech Stack

- React + TypeScript
- Vite
- Tailwind CSS
- React Query
- React Router
- Supabase
- Recharts
- Lucide Icons

## Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Backend API (separate repository)

## Getting Started

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your environment variables:
   ```
   VITE_SUPABASE_URL=your-supabase-project-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   VITE_API_URL=your-backend-api-url
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Deployment to Vercel

1. Create a new project on Vercel
2. Connect your repository
3. Configure environment variables in Vercel project settings
4. Deploy!

### Environment Variables in Vercel

Make sure to add the following environment variables in your Vercel project settings:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_API_URL`

## Project Structure

```
src/
  ├── components/        # Reusable components
  │   ├── auth/         # Authentication components
  │   ├── campaigns/    # Campaign-related components
  │   ├── common/       # Common UI components
  │   └── layout/       # Layout components
  ├── pages/            # Page components
  ├── hooks/            # Custom React hooks
  ├── lib/              # Utility functions and configurations
  ├── types/            # TypeScript type definitions
  └── App.tsx          # Main application component
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
