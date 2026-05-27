/**
 * Auto-Categorization Utility
 * Uses keyword matching to automatically categorize transactions
 * Can be extended with ML models for better accuracy
 */

const categoryKeywords = {
  'Food': [
    'restaurant', 'cafe', 'coffee', 'pizza', 'burger', 'food', 'dining',
    'swiggy', 'zomato', 'uber eats', 'delivery', 'mcdonalds', 'subway',
    'bakery', 'grocery', 'supermarket', 'vegetables', 'eggs', 'milk',
    'fruit', 'chicken', 'meat', 'fish', 'biryani', 'tandoor'
  ],
  'Transport': [
    'uber', 'ola', 'taxi', 'bus', 'train', 'flight', 'petrol', 'gas',
    'parking', 'tolls', 'metro', 'auto', 'cab', 'travel', 'transport',
    'bike', 'vehicle', 'car', 'fuel', 'charges', 'ticket', 'railway'
  ],
  'Entertainment': [
    'movie', 'cinema', 'theatre', 'netflix', 'spotify', 'prime', 'gaming',
    'game', 'playstation', 'xbox', 'concert', 'music', 'show', 'party',
    'club', 'bar', 'beer', 'wine', 'event', 'ticket', 'entertainment'
  ],
  'Utilities': [
    'electricity', 'water', 'internet', 'mobile', 'phone', 'bill', 'utility',
    'gas', 'rent', 'landlord', 'property', 'maintenance', 'repair',
    'wifi', 'wifi charges', 'dth', 'broadband', 'electricity bill'
  ],
  'Shopping': [
    'amazon', 'flipkart', 'mall', 'shop', 'clothes', 'dress', 'shirt',
    'pants', 'shoes', 'fashion', 'apparel', 'store', 'retail', 'purchase',
    'buy', 'shopping', 'outfit', 'jacket', 'shoes'
  ],
  'Health': [
    'doctor', 'hospital', 'medicine', 'pharmacy', 'medical', 'health',
    'gym', 'fitness', 'health', 'insurance', 'clinic', 'vaccination',
    'dental', 'teeth', 'wellness', 'supplement', 'therapy'
  ],
  'Education': [
    'school', 'college', 'university', 'course', 'training', 'education',
    'tuition', 'fees', 'book', 'stationery', 'exam', 'coaching', 'class',
    'workshop', 'certificate', 'learning', 'udemy', 'coursera'
  ],
  'Salary': [
    'salary', 'paycheck', 'payment', 'wages', 'income', 'compensation',
    'bonus', 'paid by', 'remuneration'
  ],
  'Freelance': [
    'freelance', 'project', 'gig', 'work', 'payment received', 'earned',
    'contract', 'invoice', 'consulting', 'fee'
  ]
};

/**
 * Predict category based on transaction notes/description
 * @param {string} description - Transaction description/notes
 * @returns {string} - Predicted category
 */
export const autoCategorizTransaction = (description = '') => {
  if (!description) return 'Other';
  
  const lowerDesc = description.toLowerCase().trim();
  
  // Check each category's keywords
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    for (const keyword of keywords) {
      if (lowerDesc.includes(keyword)) {
        return category;
      }
    }
  }
  
  return 'Other';
};

/**
 * Get confidence score for category prediction
 * Higher score = better match
 * @param {string} description - Transaction description
 * @param {string} category - Category to check
 * @returns {number} - Confidence score (0-100)
 */
export const getCategoryConfidence = (description = '', category = '') => {
  if (!description || !categoryKeywords[category]) return 0;
  
  const lowerDesc = description.toLowerCase();
  const keywords = categoryKeywords[category];
  const foundKeywords = keywords.filter(kw => lowerDesc.includes(kw));
  
  return Math.round((foundKeywords.length / keywords.length) * 100);
};

/**
 * Get all available categories
 */
export const getAvailableCategories = () => {
  return Object.keys(categoryKeywords);
};
