# Architecture & Feature Breakdown

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     React Frontend (Vite)                    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Pages: Dashboard, Transactions, Budgets, Goals, Insights │
│  │  Components: Layout, Forms, Charts, Progress Bars   │   │
│  └──────────────────────────────────────────────────────┘   │
│                           │                                  │
│                    Axios HTTP Requests                      │
│                           │                                  │
└────────────────────────────┼──────────────────────────────────┘
                             │
┌────────────────────────────┼──────────────────────────────────┐
│             Express Backend (Node.js)                         │
│  ┌─────────────────────────▼──────────────────────────┐     │
│  │              API Routes & Controllers              │     │
│  │  • Auth (Register, Login, Profile)                │     │
│  │  • Transactions (CRUD, Aggregations)              │     │
│  │  • Budgets (Set, Get, Track, Alerts)             │     │
│  │  • Insights (Analysis, Patterns, Recommendations) │     │
│  │  • Goals (Create, Track, Progress)               │     │
│  └─────────────────────────┬──────────────────────────┘     │
│                            │                                │
│  ┌──────────────────────────▼──────────────────────┐        │
│  │         Middleware Layer                        │        │
│  │  • JWT Authentication                           │        │
│  │  • Error Handling                               │        │
│  │  • Input Validation                             │        │
│  └──────────────────────────┬──────────────────────┘        │
│                             │                               │
│  ┌──────────────────────────▼──────────────────────┐        │
│  │      Utils & Logic Layer                        │        │
│  │  • Auto-Categorization Engine                   │        │
│  │  • Insights Generation (Patterns, Analysis)     │        │
│  │  • Budget Tracking Logic                        │        │
│  └──────────────────────────┬──────────────────────┘        │
│                             │                               │
└─────────────────────────────┼───────────────────────────────┘
                              │
┌─────────────────────────────┼───────────────────────────────┐
│              MongoDB Database                               │
│  ├─ Users Collection                                       │
│  ├─ Transactions Collection (Indexed)                      │
│  ├─ Budgets Collection                                     │
│  └─ Goals Collection                                       │
└─────────────────────────────────────────────────────────────┘
```

## 📊 Data Models

### User Schema
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  currency: String (₹, $, €, etc),
  timezone: String,
  preferences: {
    theme: 'light' | 'dark',
    notifications: Boolean,
    budgetAlerts: Boolean
  }
}
```

### Transaction Schema
```javascript
{
  userId: ObjectId (ref: User),
  amount: Number,
  category: String (Food, Transport, etc),
  type: 'income' | 'expense',
  date: Date,
  notes: String,
  tags: [String],
  timestamps: true
}
```

### Budget Schema
```javascript
{
  userId: ObjectId,
  category: String,
  limit: Number,
  period: 'monthly' | 'weekly' | 'yearly',
  alertThreshold: Number (default: 80%),
  isActive: Boolean,
  timestamps: true
}
```

### Goal Schema
```javascript
{
  userId: ObjectId,
  name: String,
  description: String,
  category: String,
  targetAmount: Number,
  currentAmount: Number,
  deadline: Date,
  priority: 'low' | 'medium' | 'high',
  status: 'active' | 'completed' | 'abandoned',
  timestamps: true
}
```

## 🧠 Core Features Implementation

### 1. Auto-Categorization Engine

**File**: `backend/src/utils/categorization.js`

**How it works**:
- Maintains keyword-to-category mapping
- Analyzes transaction description
- Performs substring matching (case-insensitive)
- Returns matched category or 'Other'

**Example**:
```
Input: "Swiggy food delivery"
Process: Matches "swiggy" in Food keywords
Output: Category = "Food"
```

**Extensibility**:
- Can integrate with ML models
- Add confidence scoring
- Train on user's categorization patterns

### 2. Insights & Analytics Engine

**File**: `backend/src/utils/insights.js`

**Modules**:

#### a) **Spending Comparison**
```javascript
// Compares spending between two periods
// Returns: percentage change, absolute difference
// Use case: "You spent 25% more on Food this week"
```

#### b) **Overspending Pattern Detection**
```javascript
// Detects categories with >25% spending increase
// Week-over-week comparison
// Returns: list of concerning categories with details
```

#### c) **Savings Recommendations**
```javascript
// Analyzes monthly spending
// Suggests 10% reduction potential
// Calculates annual savings: potential * 12
```

#### d) **Spending Summary**
```javascript
// Aggregates income/expenses for period
// Category-wise breakdown
// Calculates savings rate
```

### 3. Budget Tracking System

**Features**:
- Real-time progress tracking
- Alert thresholds (default 80%)
- Status indicators:
  - **Green (0-79%)**: On track
  - **Yellow (80-99%)**: Warning
  - **Red (100%+)**: Exceeded

**Implementation**:
- Aggregation pipeline for fast calculation
- Index on (userId, category, date) for performance
- Efficient percentage calculation in controller

### 4. Financial Goals Management

**Features**:
- Progress tracking with percentage
- Deadline-based suggestions
- Daily savings requirement calculation
- Auto-completion when target reached

**Calculation**:
```
daysRemaining = ceil((deadline - now) / millisPerDay)
remainingAmount = targetAmount - currentAmount
requiredPerDay = remainingAmount / daysRemaining
```

## 🎯 Frontend Architecture

### State Management
- **AuthContext**: User authentication state, actions (login, logout, register)
- **DataContext**: Global data fetching and state management for all resources

### Component Hierarchy
```
App
├── AuthProvider
│   └── ProtectedRoute
│       └── DataProvider
│           └── Layout
│               ├── Dashboard
│               ├── Transactions
│               ├── Budgets
│               ├── Goals
│               └── Insights
```

### Page Components

#### Dashboard (`pages/Dashboard.jsx`)
- Displays KPIs (balance, income, expenses, savings rate)
- Shows spending breakdow pie chart
- Lists overspending patterns
- Displays active goals progress
- Real-time budget alerts

#### Transactions (`pages/Transactions.jsx`)
- Add/Edit/Delete transactions
- Auto-categorization on form submit
- Filter by category, type, date range
- Sortable transaction table
- Category badges for quick visual identification

#### Budgets (`pages/Budgets.jsx`)
- Set budgets by category
- Visual progress bars
- Real-time percentage tracking
- Alert status indicators
- Remaining budget calculation

#### Goals (`pages/Goals.jsx`)
- Create multiple financial goals
- Track progress with visual bars
- Shows days remaining and daily requirement
- Separate active/completed goals view
- Edit goal progress

#### Insights (`pages/Insights.jsx`)
- 6-month spending trends chart
- AI-generated insights (3 types)
- Overspending alerts with week-over-week comparison
- Savings opportunities ranked by potential
- Actionable recommendations

## 🔐 Authentication Flow

```
User Registration/Login
        │
        ▼
Validate Credentials (Login) / Check Email exists (Register)
        │
        ▼
Hash Password (Register) / Compare Password (Login)
        │
        ▼
Create JWT Token
        │
        ▼
Send Token to Frontend
        │
        ▼
Store in localStorage
        │
        ▼
Include in Authorization Header
        │
        ▼
Verify Token Middleware
        │
        ▼
Attach userId to Request
        │
        ▼
Process Request
```

## 📈 Performance Optimizations

### Database
- ✅ Indexed queries on (userId, date), (userId, category)
- ✅ Aggregation pipeline for analytics
- ✅ Pagination for transaction lists

### Frontend
- ✅ Component lazy loading with React Router
- ✅ Memoized Recharts components
- ✅ Context-based caching
- ✅ Debounced API calls

### Backend
- ✅ Efficient MongoDB aggregations
- ✅ Response streaming for large datasets
- ✅ JWT token caching
- ✅ Error handling middleware

## 🛡️ Security Features

1. **Authentication**: JWT-based stateless authentication
2. **Authorization**: User-specific data filtering
3. **Password**: Bcrypt hashing with 10 salt rounds
4. **CORS**: Proper origin validation
5. **Input Validation**: Express validator on all inputs
6. **Error Handling**: No stack traces in production
7. **Environment Variables**: Secrets not in code

## 🚀 Deployment Checklist

- [ ] Set strong `JWT_SECRET` in production
- [ ] Use MongoDB Atlas or production DB
- [ ] Enable HTTPS
- [ ] Set `NODE_ENV=production`
- [ ] Remove console logs
- [ ] Enable database backups
- [ ] Set up monitoring/logging
- [ ] Configure rate limiting
- [ ] Set up CI/CD pipeline
- [ ] Use environment-specific configs

## 📊 API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation completed",
  "data": { }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "status": 400,
    "message": "Error description"
  }
}
```

## 🔄 Data Flow Example: Adding Expense

```
User Input Form
       │
       ▼
Form Validation (Frontend)
       │
       ▼
POST /api/transactions
       │
       ▼
JWT Validation Middleware
       │
       ▼
Extract userId from token
       │
       ▼
Auto-categorize if needed
       │
       ▼
Schema Validation
       │
       ▼
Create MongoDB Document
       │
       ▼
Update Context State
       │
       ▼
Re-render Dashboard/Transactions
       │
       ▼
Show Success Toast / Update Budget Status
```

---

**This architecture ensures scalability, maintainability, and excellent user experience.**
