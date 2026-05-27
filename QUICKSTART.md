# 🚀 Quick Start Guide

## 5-Minute Setup

### Prerequisites Check
```bash
# Check Node.js version (need 16+)
node --version

# Check npm
npm --version

# Make sure MongoDB is ready (local or Atlas connection string)
```

### Step 1: Backend Setup (2 minutes)

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

**Edit `backend/.env`**:
```
# Option A: Local MongoDB
MONGODB_URI=mongodb://localhost:27017/money-management

# Option B: MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/money-management

PORT=5000
NODE_ENV=development
JWT_SECRET=your-super-secret-key-change-this-in-production
FRONTEND_URL=http://localhost:3000
```

```bash
# Seed sample data (optional)
npm run seed

# Start backend
npm run dev
```

✅ Backend running on `http://localhost:5000`

### Step 2: Frontend Setup (2 minutes)

**New terminal window**:
```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

**Edit `frontend/.env`**:
```
VITE_API_URL=http://localhost:5000/api
```

```bash
# Start frontend
npm run dev
```

✅ Frontend running on `http://localhost:3000`

### Step 3: Access & Login (1 minute)

1. Open browser: `http://localhost:3000`
2. If you seeded data, use:
   - **Email**: john@example.com
   - **Password**: password123
3. Or create new account

🎉 **You're done! Start managing finances!**

---

## 📱 Test All Features

### 1. Dashboard
- ✅ See overall balance
- ✅ View spending breakdown pie chart
- ✅ Check monthly trends
- ✅ Review active savings goals

### 2. Add Transaction
- ✅ Click "Add Transaction"
- ✅ Enter: `Amount: 500, Category: Food, Type: Expense`
- ✅ (Auto-fills category if notes mention food items)
- ✅ Watch dashboard update in real-time

### 3. Set Budget
- ✅ Go to Budgets page
- ✅ Click "Set Budget"
- ✅ Set Food budget: ₹5000/month
- ✅ Add more expense categories

### 4. Create Goal
- ✅ Go to Goals page
- ✅ Click "New Goal"
- ✅ Create: Emergency Fund, Target: ₹100,000, Deadline: 1 year
- ✅ Track progress

### 5. View Insights
- ✅ Go to Insights page
- ✅ See 6-month spending trends
- ✅ View AI-generated recommendations
- ✅ Check overspending alerts

---

## 🐛 Troubleshooting

### ERROR: Cannot connect to MongoDB
```bash
# Option 1: Start local MongoDB
mongod

# Option 2: Use MongoDB Atlas
# Update MONGODB_URI in .env with cloud connection string
```

### ERROR: Port 5000 or 3000 already in use
```bash
# Kill process on port 5000 (Linux/Mac)
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Windows - Use Task Manager or:
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### ERROR: Module not found
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

### ERROR: CORS error
- Ensure backend runs on 5000
- Ensure frontend runs on 3000
- Check `.env` files have correct URLs

### ERROR: Login fails
```bash
# If using seed data:
# Email: john@example.com
# Password: password123

# Clear localStorage:
localStorage.clear()
# Then refresh page
```

---

## 📚 File Operations During Development

### Add New API Endpoint

1. **Create Controller** (`backend/src/controllers/itemController.js`):
```javascript
export const getItems = asyncHandler(async (req, res) => {
  const items = await Item.find({ userId: req.userId });
  res.json({ success: true, data: items });
});
```

2. **Create Route** (`backend/src/routes/items.js`):
```javascript
import { getItems } from '../controllers/itemController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();
router.use(auth);
router.get('/', getItems);
export default router;
```

3. **Register Route** (`backend/src/server.js`):
```javascript
import itemRoutes from './routes/items.js';
app.use('/api/items', itemRoutes);
```

4. **Create API Service** (`frontend/src/services/api.js`):
```javascript
export const itemAPI = {
  getItems: () => apiClient.get('/items')
};
```

5. **Use in Component** (`frontend/src/pages/Items.jsx`):
```javascript
const { items, fetchItems } = useData();
useEffect(() => {
  fetchItems();
}, []);
```

---

## 🔧 Configuration Tips

### Change Currency
1. Sign in or create account
2. Update in user preferences (backend will return currency)
3. All amounts display in selected currency

### Change Alert Threshold
1. When setting budget, adjust "Alert Threshold"
2. Default: 80% (alert at 80% of budget spent)

### Customize Categories
Edit in:
- `backend/src/models/Transaction.js` (categoryKeywords array)
- `backend/src/utils/categorization.js`
- Update keywords for better auto-matching

---

## 📊 Sample Data

### Pre-seeded Sample Data
- User: john@example.com / password123
- 10 Transactions (₹62,600 total)
- 5 Budgets set
- 4 Financial Goals

### Add Your Own Data
1. Login/Register
2. Go to Transactions page
3. Click "Add Transaction"
4. Enter details
5. System auto-categorizes
6. View in Dashboard

---

## 🎯 Next Steps

After setup:

1. **Explore Dashboard**: Understand data visualization
2. **Add Transactions**: Try auto-categorization
3. **Set Budgets**: Track spending limits
4. **Create Goals**: Plan savings targets
5. **Check Insights**: Compare patterns and get recommendations
6. **Read ARCHITECTURE.md**: Understand technical design

---

## 💡 Tips & Tricks

### Quick Spending Check
1. Go to Dashboard
2. Scroll to "Spending by Category" pie chart
3. Hover over slice for exact amount

### Set Realistic Budgets
1. Review last month's spending (Dashboard)
2. Set budget 10-15% lower than average
3. Set alert threshold at 80%

### Achieve Goals Faster
1. Create multiple smaller goals
2. Review Daily Savings Requirement
3. Track progress regularly

### Understand Insights
- **Green Cards**: Good financial behavior
- **Yellow Cards**: Warnings/alerts
- **Red Cards**: Immediate action needed

---

## 🆘 Need Help?

1. **Backend Issues**: Check backend console for error logs
2. **Frontend Issues**: Check browser DevTools (F12 → Console)
3. **Database Issues**: Check MongoDB logs
4. **API Issues**: Test with Postman using token from login

---

## 📦 Production Deployment

### Backend (Example: Heroku)
```bash
# Install Heroku CLI
# heroku login
# heroku create money-app-backend

# Set environment variables
heroku config:set MONGODB_URI=<your-atlas-uri>
heroku config:set JWT_SECRET=<strong-secret>

# Deploy
git push heroku main
```

### Frontend (Example: Vercel)
```bash
# Install Vercel CLI
# vercel login

# Deploy
vercel build
vercel --prod

# Set environment variable in Vercel dashboard
VITE_API_URL=<backend-production-url>/api
```

---

**Happy coding! 🚀💰**
