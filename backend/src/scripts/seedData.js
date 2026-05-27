import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Transaction from '../models/Transaction.js';
import Budget from '../models/Budget.js';
import Goal from '../models/Goal.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/money-management');
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Transaction.deleteMany({});
    await Budget.deleteMany({});
    await Goal.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create sample user
    const user = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      currency: '₹'
    });
    console.log('✅ Created sample user:', user.email);

    // Create sample transactions
    const now = new Date();
    const transactions = [
      {
        userId: user._id,
        amount: 50000,
        category: 'Salary',
        type: 'income',
        date: new Date(now.getFullYear(), now.getMonth(), 1),
        notes: 'Monthly salary'
      },
      {
        userId: user._id,
        amount: 3500,
        category: 'Food',
        type: 'expense',
        date: new Date(now.getFullYear(), now.getMonth(), 5),
        notes: 'Grocery shopping'
      },
      {
        userId: user._id,
        amount: 1200,
        category: 'Transport',
        type: 'expense',
        date: new Date(now.getFullYear(), now.getMonth(), 6),
        notes: 'Uber rides'
      },
      {
        userId: user._id,
        amount: 2000,
        category: 'Entertainment',
        type: 'expense',
        date: new Date(now.getFullYear(), now.getMonth(), 10),
        notes: 'Movie tickets and dining'
      },
      {
        userId: user._id,
        amount: 1500,
        category: 'Shopping',
        type: 'expense',
        date: new Date(now.getFullYear(), now.getMonth(), 12),
        notes: 'Clothing purchase'
      },
      {
        userId: user._id,
        amount: 800,
        category: 'Utilities',
        type: 'expense',
        date: new Date(now.getFullYear(), now.getMonth(), 15),
        notes: 'Electricity and internet bills'
      },
      {
        userId: user._id,
        amount: 600,
        category: 'Health',
        type: 'expense',
        date: new Date(now.getFullYear(), now.getMonth(), 18),
        notes: 'Gym membership and meds'
      },
      {
        userId: user._id,
        amount: 2500,
        category: 'Food',
        type: 'expense',
        date: new Date(now.getFullYear(), now.getMonth(), 20),
        notes: 'Restaurant dinners'
      },
      {
        userId: user._id,
        amount: 5000,
        category: 'Freelance',
        type: 'income',
        date: new Date(now.getFullYear(), now.getMonth(), 22),
        notes: 'Freelance project payment'
      },
      {
        userId: user._id,
        amount: 400,
        category: 'Education',
        type: 'expense',
        date: new Date(now.getFullYear(), now.getMonth(), 25),
        notes: 'Online course'
      }
    ];

    await Transaction.insertMany(transactions);
    console.log('✅ Created 10 sample transactions');

    // Create sample budgets
    const budgets = [
      {
        userId: user._id,
        category: 'Food',
        limit: 5000,
        period: 'monthly',
        alertThreshold: 80,
        isActive: true
      },
      {
        userId: user._id,
        category: 'Transport',
        limit: 2000,
        period: 'monthly',
        alertThreshold: 80,
        isActive: true
      },
      {
        userId: user._id,
        category: 'Entertainment',
        limit: 3000,
        period: 'monthly',
        alertThreshold: 80,
        isActive: true
      },
      {
        userId: user._id,
        category: 'Shopping',
        limit: 2500,
        period: 'monthly',
        alertThreshold: 80,
        isActive: true
      },
      {
        userId: user._id,
        category: 'Health',
        limit: 1500,
        period: 'monthly',
        alertThreshold: 80,
        isActive: true
      }
    ];

    await Budget.insertMany(budgets);
    console.log('✅ Created 5 sample budgets');

    // Create sample goals
    const goals = [
      {
        userId: user._id,
        name: 'Emergency Fund',
        description: 'Save 6 months of expenses',
        category: 'Emergency Fund',
        targetAmount: 100000,
        currentAmount: 35000,
        deadline: new Date(now.getFullYear() + 1, now.getMonth(), now.getDate()),
        priority: 'high',
        status: 'active'
      },
      {
        userId: user._id,
        name: 'Vacation to Europe',
        description: 'Summer trip planned',
        category: 'Vacation',
        targetAmount: 150000,
        currentAmount: 45000,
        deadline: new Date(now.getFullYear(), 6, 1),
        priority: 'medium',
        status: 'active'
      },
      {
        userId: user._id,
        name: 'New Laptop',
        description: 'Upgrade work equipment',
        category: 'Other',
        targetAmount: 80000,
        currentAmount: 20000,
        deadline: new Date(now.getFullYear(), now.getMonth() + 3, now.getDate()),
        priority: 'low',
        status: 'active'
      },
      {
        userId: user._id,
        name: 'Stock Investment',
        description: 'Building investment portfolio',
        category: 'Investment',
        targetAmount: 200000,
        currentAmount: 80000,
        deadline: new Date(now.getFullYear() + 2, now.getMonth(), now.getDate()),
        priority: 'high',
        status: 'active'
      }
    ];

    await Goal.insertMany(goals);
    console.log('✅ Created 4 sample goals');

    console.log('\n🎉 Database seeded successfully!');
    console.log('Sample user credentials:');
    console.log('Email: john@example.com');
    console.log('Password: password123');
    console.log('\nYou can now login to the application!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
