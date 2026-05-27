# 🎓 Code Quality & Best Practices Guide

## Architecture Principles

### 1. Separation of Concerns
Each layer handles one responsibility:
- **Models**: Data structure
- **Controllers**: Business logic
- **Routes**: API endpoints
- **Middleware**: Cross-cutting concerns
- **Context**: Frontend state management

### 2. MVC Pattern
- **Models**: `src/models/*.js` - Database schemas
- **Views**: React components - UI rendering
- **Controllers**: `src/controllers/*.js` - Logic

### 3. DRY Principle
- Reusable utilities in `utils/` folder
- Shared components for UI
- Context API for state management
- API client wrapper for HTTP calls

---

## Code Structure

### Backend Structure

#### Controllers (Business Logic)
```javascript
// ✅ Good: Clear, focused, error handled
export const addTransaction = asyncHandler(async (req, res) => {
  const { amount, category, type } = req.body;
  const userId = req.userId;

  if (!amount || !type) {
    return res.status(400).json({ success: false, error: 'Required fields' });
  }

  const transaction = await Transaction.create({...});
  res.status(201).json({ success: true, data: transaction });
});

// ❌ Avoid: Mixed concerns, no error handling
export const addTransaction = (req, res) => {
  // No validation
  // No error handling
  // Mixed business and presentation logic
};
```

#### Models (Schema Definition)
```javascript
// ✅ Good: Indexed, validated, documented
const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true  // ← Fast queries
  },
  amount: {
    type: Number,
    required: [true, 'Amount required'],  // ← Clear error
    min: [0, 'Must be positive']
  }
});

// ❌ Avoid: No validation, no indexes
const transactionSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  amount: Number
});
```

#### Routes (Clean Endpoints)
```javascript
// ✅ Good: Clean, focused, authenticated
router.post('/', auth, addTransaction);
router.get('/', auth, getTransactions);
router.delete('/:id', auth, deleteTransaction);

// ❌ Avoid: Mixed logic, duplicated middleware
router.post('/', (req, res) => {
  // Authentication code inline
  // Business logic inline
  // Makes testing hard
});
```

### Frontend Structure

#### Components (UI Building Blocks)
```javascript
// ✅ Good: Focused, reusable, prop-based
function MetricCard({ icon, label, value, currency, color }) {
  return (
    <div className={color}>
      <div>{label}</div>
      <div>{currency}{value}</div>
    </div>
  );
}

// ❌ Avoid: Hardcoded data, tight coupling
function MetricCard() {
  return (
    <div className="bg-blue">
      <div>Total Balance</div>
      <div>₹50000</div>  // ← Hardcoded
    </div>
  );
}
```

#### Context (State Management)
```javascript
// ✅ Good: Clear API, error handling, memoization
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be within AuthProvider');
  }
  return context;
};

// ❌ Avoid: No error checking, direct state access
const user = authContext.user; // ← May break if context missing
```

---

## Code Quality Checklist

### Backend Guidelines

- [ ] **Validation**: All inputs validated at controller level
- [ ] **Error Handling**: Try-catch with asyncHandler
- [ ] **Indexing**: Frequently queried fields indexed
- [ ] **Pagination**: Large datasets paginated
- [ ] **Authentication**: All routes require auth
- [ ] **Comments**: Complex logic documented
- [ ] **Naming**: camelCase for variables, PascalCase for classes
- [ ] **Constants**: Magic numbers in constants
- [ ] **Security**: No passwords in responses/logs

### Frontend Guidelines

- [ ] **Props**: Components accept props, not hardcoded
- [ ] **State**: Local state or context (no prop-drilling)
- [ ] **Effects**: useEffect has dependency array
- [ ] **Events**: Handlers prefixed with 'handle' (handleClick)
- [ ] **Loading**: Shows loading state during API calls
- [ ] **Errors**: Error messages displayed to user
- [ ] **Responsive**: Works on mobile, tablet, desktop
- [ ] **Accessibility**: Semantic HTML, proper labels
- [ ] **Performance**: Memoized expensive components

---

## Performance Optimization

### Database

```javascript
// ✅ Indexed query - Fast
const transactions = await Transaction.find({ userId, date: { $gte: startDate } })
  .select('amount category date')  // ← Only needed fields
  .sort({ date: -1 })
  .limit(20);  // ← Paginated

// ❌ Slow - Full collection scan
const transactions = await Transaction.find({});
```

### Frontend

```javascript
// ✅ Memoized component - Re-renders only if props change
const MetricCard = React.memo(({ value, label }) => (
  <div>{label}: {value}</div>
));

// ❌ Re-renders on every parent update
const MetricCard = ({ value, label }) => (
  <div>{label}: {value}</div>
);
```

### API Calls

```javascript
// ✅ Cached in context - Fetch once, use everywhere
const { insights, fetchInsights } = useData();
useEffect(() => {
  if (!insights) fetchInsights();
}, []);

// ❌ Fetch every page load
useEffect(() => {
  fetchInsights();
}, []);  // ← Missing dependency, fetches repeatedly
```

---

## Testing Checklist

### Manual Testing
- [ ] Create account with email validation
- [ ] Add transaction with auto-categorization
- [ ] Set budget and trigger alert
- [ ] Create goal and track progress
- [ ] View insights with data
- [ ] Delete transaction and verify update
- [ ] Logout and login again
- [ ] Test on mobile browser

### Error Scenarios
- [ ] Invalid email format - error shown
- [ ] Password too short - error shown
- [ ] Duplicate category budget - error shown
- [ ] Negative amount - error shown
- [ ] Missing required field - error shown
- [ ] Network disconnected - error handled
- [ ] MongoDB offline - error shown
- [ ] Token expired - redirect to login

---

## Security Practices

### Backend

```javascript
// ✅ Secure: Validate, hash, check user ownership
export const deleteTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findById(req.params.id);
  
  if (!transaction) {
    return res.status(404).json({ error: 'Not found' });
  }

  // ← CRITICAL: Verify user owns this
  if (transaction.userId.toString() !== req.userId) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  await Transaction.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// ❌ Insecure: No ownership check
export const deleteTransaction = asyncHandler(async (req, res) => {
  await Transaction.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});
```

### Frontend

```javascript
// ✅ Secure: Store token securely, send with auth header
const apiClient = axios.create({...});
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');  // ← From localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;  // ← With Bearer
  }
  return config;
});

// ❌ Insecure: Token in URL or unencrypted cookie
fetch('/api/data?token=' + token);  // ← Never in URL
```

---

## Error Handling

### Backend Error Pattern

```javascript
// ✅ Structured error handling
export const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).json({
    success: false,
    error: {
      status,
      message
      // No stack trace in production
    }
  });
};

// ✅ Asyncronous handler
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Usage
export const getTransactions = asyncHandler(async (req, res) => {
  const transactions = await Transaction.find({});
  res.json({ success: true, data: transactions });
});
```

### Frontend Error Pattern

```javascript
// ✅ User-friendly error display
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    setLoading(true);
    const response = await api.addTransaction(data);
    setTransactions([...transactions, response.data]);
    setError('');  // ← Clear error
  } catch (err) {
    const message = err.response?.data?.error || 'An error occurred';
    setError(message);  // ← Show user
  } finally {
    setLoading(false);
  }
};
```

---

## Debugging Tips

### Backend
```bash
# Enable debug logs
DEBUG=money-app:* npm run dev

# Check MongoDB
mongosh
db.transactions.find({})

# Test API with Postman
POST /api/transactions
Header: Authorization: Bearer <token>
Body: { amount: 100, category: 'Food' }
```

### Frontend
```javascript
// Add console logs for tracing
console.log('User:', user);
console.log('Transactions:', transactions);
console.log('API Response:', response);

// React DevTools - Chrome extension
// Check component tree and state

// Network tab - See API calls
// Check request/response in DevTools Network tab

// Local Storage
localStorage.getItem('token')  // ← Check token
localStorage.clear()  // ← Reset state
```

---

## Common Pitfalls & Solutions

### 1. N+1 Query Problem
```javascript
// ❌ Bad: Query in loop → N+1 queries
for (let budget of budgets) {
  const spent = await Transaction.findOne({  // ← Query inside loop
    category: budget.category
  });
}

// ✅ Good: Aggregation → 1 query
const spent = await Transaction.aggregate([
  { $match: { userId } },
  { $group: { _id: '$category', total: { $sum: '$amount' } } }
]);
```

### 2. Memory Leak in useEffect
```javascript
// ❌ Bad: No cleanup
useEffect(() => {
  const timer = setInterval(() => {
    console.log('tick');
  }, 1000);
}, []); // ← Timer never cleared

// ✅ Good: Cleanup function
useEffect(() => {
  const timer = setInterval(() => {
    console.log('tick');
  }, 1000);
  
  return () => clearInterval(timer);  // ← Cleanup
}, []);
```

### 3. Stale Closures
```javascript
// ❌ Bad: Missing dependency
useEffect(() => {
  console.log(count);  // ← Logs old value
}, []);  // ← No count dependency

// ✅ Good: Proper dependency
useEffect(() => {
  console.log(count);
}, [count]);  // ← Include count
```

---

## Code Review Checklist

Before committing:
- [ ] No console.logs left in code
- [ ] No hardcoded values
- [ ] Error handling present
- [ ] Authentication checks included
- [ ] Input validation done
- [ ] Comments added for complex logic
- [ ] No commented code left behind
- [ ] Variable names are clear
- [ ] Functions are focused and small
- [ ] Tests pass (if any)

---

**Follow these practices for maintainable, secure, performant code! 🚀**
