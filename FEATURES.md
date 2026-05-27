# 🎯 Feature Documentation

## Dashboard

### Overview
The Dashboard is your personal financial command center, providing real-time insights into your financial health.

### Components

#### Key Metrics (KPI Cards)
| Metric | Description | Update Frequency |
|--------|-------------|------------------|
| **Total Balance** | Lifetime income - expenses | Real-time |
| **Monthly Income** | Income for current month | Real-time |
| **Monthly Expense** | Expenses for current month | Real-time |
| **Savings Rate** | (Income - Expense) / Income % | Real-time |

#### Visualizations

**1. Spending by Category (Pie Chart)**
- Shows expense distribution
- Each slice is color-coded
- Hover for exact amounts
- Only expenses included (not income)

**2. Financial Overview**
- Income vs Expense comparison
- Net savings calculation
- Quick reference panel

#### Smart Alerts
- **Overspending Patterns**: Shows top 3 concerning categories
- **Savings Opportunities**: Quick savings potential
- **Active Goals**: Progress on 3 main goals

### Usage Tips
1. Check dashboard first thing to see financial health
2. Investigate red alerts (overspending)
3. Review goals progress weekly
4. Use savings opportunities to plan budget cuts

---

## Transactions

### Add Transaction
**Form Fields**:
- **Amount**: Transaction value (required, positive)
- **Category**: Pre-defined list (auto-filled by notes)
- **Type**: Income or Expense
- **Date**: When transaction occurred (default: today)
- **Notes**: Description (used for auto-categorization)

**Auto-Categorization Rules**:
```
"swiggy" OR "zomato" → Food
"uber" OR "metro" OR "taxi" → Transport
"netflix" OR "movie" → Entertainment
"electricity" OR "internet" → Utilities
"salary" OR "paycheck" → Salary
"freelance" OR "project" → Freelance
```

### View Transactions
- **Table View**: All transactions sorted by date (newest first)
- **Filters**: By category, type, date range
- **Pagination**: 20 items per page
- **Actions**: Edit or delete any transaction

### Edit/Delete
- Click edit icon to modify
- Confirm delete action
- Changes reflect immediately in dashboard

### Best Practices
1. Add transactions same day
2. Use descriptive notes for better categorization
3. Review weekly for accuracy
4. Delete duplicates immediately

---

## Budgets

### What is a Budget?
A budget is a monthly spending limit for each category to help control expenses.

### Set Budget
**Process**:
1. Choose category from dropdown
2. Set monthly limit (₹)
3. Adjust alert threshold (default: 80%)
4. Click "Set Budget"

**Alert Threshold**:
- System alerts when spending reaches this % of budget
- Default 80% helps catch overspending early
- Adjustable per category

### Budget Tracking
**Status Indicators**:
- **Green (0-79%)**: ✅ On Track
- **Yellow (80-99%)**: ⚠️ Warning
- **Red (100%+)**: 🔴 Exceeded

**Displays**:
- Progress bar showing percentage used
- Actual spending vs limit
- Remaining budget available
- Alert message if threshold exceeded

### Budget Alerts
When you hit the alert threshold:
1. Dashboard shows warning
2. Budget card highlights in yellow/red
3. Notification appears (if enabled)

### Managing Budgets
- **Update**: Click budget card to modify
- **Delete**: Remove budget (stops tracking)
- **Review**: Check monthly to adjust limits

### Budget Best Practices
1. Set realistic limits based on past spending
2. Review actual vs budget monthly
3. Adjust Q1 based on spending patterns
4. Share budget goals with accountability partner

---

## Financial Goals

### Types of Goals
- **Emergency Fund**: 3-6 months expenses
- **Vacation**: Trip fund
- **Investment**: Market investments
- **Education**: Learning & courses
- **Home**: Down payment or renovation
- **Other**: Custom goals

### Create Goal
**Required Fields**:
- Name: e.g., "buy laptop"
- Target Amount: Goal amount (₹)
- Deadline: By when
- Category: Goal type

**Optional Fields**:
- Description: Goal details
- Current Amount: Already saved
- Priority: Low/Medium/High

### Track Progress
**Progress Indicators**:
- Percentage complete (0-100%)
- Amount saved vs target
- Days remaining
- Daily saving requirement
- Status (active/completed)

**Calculation Example**:
```
Goal: ₹100,000
Saved: ₹30,000
Days Left: 90
Daily Required: ₹(100,000-30,000)/90 = ₹777.78
```

### Goal Management
- **Update Progress**: Change current amount anytime
- **Modify Target**: Adjust goal if circumstances change
- **Extend Deadline**: Give yourself more time
- **Complete**: Auto-completes when target reached
- **Delete**: Remove goal (archived as abandoned)

### Goal Tips
1. Set SMART goals (Specific, Measurable, Achievable, Relevant, Time-bound)
2. Create monthly and yearly goals
3. Track progress weekly
4. Celebrate milestones
5. Review goals quarterly

---

## Insights & Analytics

### 1. Financial Overview
**Shows**:
- Total lifetime balance
- Monthly income/expenses
- Savings potential
- All-time statistics

### 2. Spending Trends (6-Month Chart)
**Visualizes**:
- Income trend line
- Expense trend line
- Savings trend line
- Month-by-month comparison

**Use Cases**:
- See if spending increasing/decreasing
- Identify seasonal patterns
- Plan for high-expense months

### 3. AI-Generated Insights
**Three Types**:

#### ✅ Positive Insights
- "Great job! Reduced spending by 15%"
- Positive reinforcement

#### ⚠️ Warning Insights
- "Expenses up 25% vs last month"
- High spending categories
- Budget alerts

#### 💡 Suggestion Insights
- Savings opportunities
- Category recommendations
- Money-saving tips

### 4. Overspending Patterns
**Detection**:
- Week-over-week comparison
- Flags if >25% increase
- Shows exact amounts
- Suggests actions

**Example Alert**:
```
🔴 Food Spending Alert
Last Week: ₹3,500
This Week: ₹5,200
Increase: 48%
```

### 5. Savings Recommendations
**Shows**:
- Current spending per category
- Potential savings (10% reduction)
- Monthly and yearly savings
- Ranked by potential

**Example**:
```
💰 Top Savings Opportunity
Category: Entertainment
Current: ₹5,000/month
Can Save: ₹500/month
Yearly: ₹6,000
```

### Interpretation Tips
1. Red/Yellow alerts → Take action
2. Trends chart → Identify cycles
3. Recommendations → Actionable tasks
4. Patterns → Root cause analysis

---

## Authentication

### Registration
**Required**:
- Name: Your full name
- Email: Valid email address
- Password: Min 6 characters

**On Success**:
- Account created
- Auto-logged in
- Redirected to dashboard

### Login
**Enter**:
- Email: Your registered email
- Password: Your password

**Security**:
- Password hashed (never stored plain)
- Token expires in 7 days
- Clear token on logout

### Profile Management
**Can Update**:
- Display name
- Currency preference
- Timezone
- Theme (light/dark)
- Notification settings

---

## Charts & Visualizations

### Pie Chart (Spending by Category)
- **What**: Shows % of each category
- **When**: Dashboard, Insights
- **Use**: Quickly identify biggest spenders

### Line Chart (Trends)
- **What**: Shows 6 months of income/expense/savings
- **When**: Insights page
- **Use**: Identify patterns and seasonality

### Bar Charts (Category Comparison)
- **What**: Compares amounts across categories
- **When**: Budget & Insights pages
- **Use**: See which categories spend most

### Progress Bars (Budget & Goals)
- **What**: Visual % completed
- **When**: Budget and Goals pages
- **Use**: Quick status check

---

## Advanced Topics

### Budget Alerts System
**How It Works**:
1. Check spending daily against budget
2. If spending ≥ alert threshold (80%)
3. Show warning badge
4. Display alert message
5. Log in audit trail

**Customization**:
- Change threshold per budget
- Set to 70% for earlier warning
- Set to 100% for only-exceeded alert

### Auto-Categorization Logic
**Process**:
1. Extract notes text
2. Convert to lowercase
3. Check against keyword dictionary
4. Return matched category
5. Return 'Other' if no match

**Improvement**:
- Add more keywords
- Train ML model on user patterns
- Learn from manual corrections

### Insight Generation Pipeline
**Steps**:
1. Fetch transactions for period
2. Group by category
3. Calculate totals and percentages
4. Compare with previous period
5. Identify anomalies (>25% change)
6. Generate human-readable insights
7. Rank by severity/opportunity

---

## Error Handling

### Common Errors & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| "Budget already exists" | Category budget duplicate | Delete old, create new |
| "Amount must be positive" | Negative amount entered | Re-enter positive value |
| "Goal not found" | Deleted or ID mismatch | Refresh page, try again |
| "Unauthorized" | Token expired | Re-login |
| "Database connection failed" | MongoDB offline | Start MongoDB service |

---

## Performance Tips

### Frontend
- Transactions load in pages (20 at a time)
- Charts render optimally
- Dark mode reduces eye strain
- Mobile responsive for all devices

### Backend
- Indexed queries on userId, date, category
- Aggregation pipeline for analytics
- Connection pooling for DB
- Caching at application level

### Optimization Tips for Users
1. Archive old transactions monthly
2. Avoid creating 100+ daily transactions
3. Close unused browser tabs
4. Clear cache if slow (browser settings)

---

**Master these features for complete financial control! 💪📊**
