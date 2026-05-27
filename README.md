# 💰 MoneyFlow - Personal Finance Manager

A modern, production-ready web application for intelligent personal finance management with advanced insights and smart categorization.

## 🎯 Features

### 1. **Dashboard**
- Real-time balance overview (total income, expenses, savings)
- Category-wise spending breakdown with pie charts
- Monthly trends visualization with line charts
- Overspending alerts and savings opportunities
- Active financial goals progress tracking

### 2. **Expense Tracking**
- Add, edit, and delete transactions
- Auto-categorization based on description keywords
- Multiple transaction types (income/expense)
- Add notes and tags for better organization
- Clean, intuitive transaction list with date-based sorting

### 3. **Smart Budgeting**
- Set category-wise monthly budgets
- Real-time budget tracking with progress bars
- Budget alerts when threshold (80% by default) is exceeded
- Visual status indicators (on-track, warning, exceeded)
- Category-wise comparison with actual spending

### 4. **AI-Powered Insights** ⭐
- Week-over-week spending comparisons
- Overspending pattern detection
- Smart savings recommendations with monthly potential
- Category performance analysis
- Comprehensive financial health reports

### 5. **Financial Goals**
- Create savings goals with target amounts and deadlines
- Track progress with visual indicators
- Get suggestions on daily savings required
- Set priorities (low, medium, high)
- Categories: Emergency Fund, Vacation, Investment, Education, Home, Other

### 6. **Advanced Features**
- Multi-currency support (₹, $, €, £, ¥, ₽)
- User authentication with JWT
- Dark mode support
- Responsive mobile-first design
- Real-time budget alerts

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Fast build tool
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization
- **React Router** - Navigation
- **Lucide React** - Icons
- **Axios** - HTTP client

### Backend
- **Node.js & Express** - Server framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcryptjs** - Password hashing

## 📋 Project Structure

```
money-management-app/
├── backend/
│   ├── src/
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Transaction.js
│   │   │   ├── Budget.js
│   │   │   └── Goal.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── transactionController.js
│   │   │   ├── budgetController.js
│   │   │   ├── insightController.js
│   │   │   └── goalController.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── transactions.js
│   │   │   ├── budgets.js
│   │   │   ├── insights.js
│   │   │   └── goals.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── errorHandler.js
│   │   ├── utils/
│   │   │   ├── categorization.js
│   │   │   └── insights.js
│   │   ├── scripts/
│   │   │   └── seedData.js
│   │   └── server.js
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Layout.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Transactions.jsx
│   │   │   ├── Budgets.jsx
│   │   │   ├── Goals.jsx
│   │   │   ├── Insights.jsx
│   │   │   └── LoginRegister.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── DataContext.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── .env.example
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance like MongoDB Atlas)
- npm or yarn

### Step 1: Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with your MongoDB URI
# MONGODB_URI=mongodb://localhost:27017/money-management
# JWT_SECRET=your-secret-key

# Seed sample data (optional)
npm run seed

# Start backend server
npm run dev
```

Backend will run on `http://localhost:5000`

### Step 2: Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start development server
npm run dev
```

Frontend will run on `http://localhost:3000`

### Step 3: Access Application

1. Open `http://localhost:3000` in your browser
2. Sign up with a new account or use sample credentials:
   - **Email**: john@example.com
   - **Password**: password123
3. Start managing your finances!

## 📖 Key Features Explained

### Auto-Categorization
The system uses keyword matching to automatically categorize transactions:
- "Swiggy" or "Zomato" → Food
- "Uber" or "Metro" → Transport
- "Netflix" or "Movie" → Entertainment
- "Electricity" or "Rent" → Utilities

### Insights Generation
Three types of insights:
1. **Comparison**: Week-over-week spending comparison by category
2. **Patterns**: Detects categories with >25% spending increases
3. **Recommendations**: Suggests monthly savings opportunities

### Budget Alerts
- **Green (0-79%)**: On track
- **Yellow (80-99%)**: Warning - approaching limit
- **Red (100%+)**: Exceeded budget

### Smart Goals
- Calculates daily saving requirement based on deadline
- Shows progress percentage
- Auto-completes when target is reached
- Provides motivational suggestions

## 🔐 API Endpoints

### Authentication
```
POST   /api/auth/register       # Create new account
POST   /api/auth/login          # Login user
GET    /api/auth/me             # Get current user (auth required)
PUT    /api/auth/profile        # Update profile (auth required)
```

### Transactions
```
POST   /api/transactions         # Add transaction
GET    /api/transactions         # Get transactions (with filters)
GET    /api/transactions/:id     # Get transaction by ID
PUT    /api/transactions/:id     # Update transaction
DELETE /api/transactions/:id     # Delete transaction
GET    /api/transactions/summary/monthly   # Monthly summary
GET    /api/transactions/breakdown/category # Category breakdown
```

### Budgets
```
POST   /api/budgets              # Set budget
GET    /api/budgets              # Get all budgets
GET    /api/budgets/:category    # Get budget by category
DELETE /api/budgets/:id          # Delete budget
GET    /api/budgets/alerts/status # Get budget alerts
```

### Insights
```
GET    /api/insights/dashboard           # Dashboard overview
GET    /api/insights/comparison          # Spending comparison
GET    /api/insights/patterns            # Overspending patterns
GET    /api/insights/recommendations     # Savings recommendations
GET    /api/insights/comprehensive       # Complete analysis
GET    /api/insights/trends              # 6-month trends
```

### Goals
```
POST   /api/goals                # Create goal
GET    /api/goals                # Get all goals
GET    /api/goals/:id            # Get goal by ID
PUT    /api/goals/:id            # Update goal
DELETE /api/goals/:id            # Delete goal
GET    /api/goals/:id/progress   # Get goal progress details
```

## 🎨 UI/UX Highlights

- **Clean Fintech Design**: Modern, minimal interface
- **Dark Mode Support**: Easy on the eyes
- **Mobile Responsive**: Works seamlessly on all devices
- **Real-time Updates**: Live budget tracking
- **Intuitive Navigation**: Easy to find features
- **Visual Indicators**: Color-coded status (red/yellow/green)
- **Interactive Charts**: Recharts for data visualization

## 💡 Key Implementation Details

### Auto-Categorization (`utils/categorization.js`)
- Rule-based keyword matching system
- Can be extended with ML models (TensorFlow.js)
- Confidence scoring for model improvement

### Insights Engine (`utils/insights.js`)
- Aggregation pipeline for MongoDB queries
- Comparison functions for period analysis
- Pattern detection algorithms
- Savings potential calculations

### Context API Usage
- **AuthContext**: User authentication and profile
- **DataContext**: Global state for transactions, budgets, goals, insights

### Security
- JWT token-based authentication
- Password hashing with bcryptjs
- Error handling middleware
- Input validation

## 📊 Sample Data

The app comes with sample data generator (`backend/src/scripts/seedData.js`):
- 10 sample transactions
- 5 budgets across categories
- 4 financial goals
- Realistic spending patterns

Run with: `npm run seed`

## 🚀 Performance Optimizations

- ✅ Indexed MongoDB queries
- ✅ Lazy component loading
- ✅ Pagination for transactions
- ✅ Caching in context
- ✅ Optimized Recharts rendering
- ✅ Tailwind CSS purging

## 🔮 Future Enhancements

1. **ML-based Insights**: TensorFlow.js integration for better pattern detection
2. **Chatbot Assistant**: Voice-enabled expense logging
3. **Bank Integration**: Open Banking API for auto-sync
4. **Report Generation**: PDF export of financial reports
5. **Sharing & Collaboration**: Family budget management
6. **Notifications**: Push alerts for budget milestones
7. **Advanced Analytics**: Forecasting with time-series analysis
8. **Multi-Account Support**: Track multiple accounts

## 🤝 Contributing

Feel free to enhance this project with:
- New insight types
- Additional categorization keywords
- UI improvements
- API optimizations
- Bug fixes

## 📝 License

This project is open source and available for personal and commercial use.

## ❓ Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running locally: `mongod`
- Or use MongoDB Atlas connection string
- Update `MONGODB_URI` in `.env`

### CORS Error
- Ensure backend is running on port 5000
- Frontend should be on port 3000
- Check `.env` files for correct URLs

### Token Expired
- Clear localStorage: `localStorage.clear()`
- Re-login to get new token

### Transaction not appearing
- Wait for page refresh or click "Add Transaction" again
- Check browser console for errors
- Verify MongoDB has data

## 📞 Support

For issues or questions:
1. Check the API endpoints documentation
2. Review error messages in browser console
3. Check MongoDB logs
4. Enable debug mode by setting NODE_ENV=development

---

**Built with ❤️ for better financial management**
