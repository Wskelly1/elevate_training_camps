#!/usr/bin/env node

/**
 * Error Tracker for Cursor
 *
 * This script helps Cursor track errors and their solutions.
 * It can be used to:
 * - Add new errors and solutions to the database
 * - Search for existing solutions to errors
 * - Update solutions with effectiveness ratings
 *
 * Usage:
 * node error-tracker.js add "Error message" "Solution description" "Solution code"
 * node error-tracker.js search "Error message"
 * node error-tracker.js update "Error message" "Solution description" "high|medium|low"
 */

const fs = require('fs');
const path = require('path');

const SOLUTIONS_FILE = path.join(__dirname, 'error-solutions.json');

// Ensure the solutions file exists
if (!fs.existsSync(SOLUTIONS_FILE)) {
  fs.writeFileSync(SOLUTIONS_FILE, JSON.stringify({
    version: "1.0",
    lastUpdated: new Date().toISOString().split('T')[0],
    errorCategories: {},
    recentErrors: []
  }, null, 2));
}

// Read the solutions file
function readSolutions() {
  try {
    return JSON.parse(fs.readFileSync(SOLUTIONS_FILE, 'utf8'));
  } catch (error) {
    console.error('Error reading solutions file:', error);
    return null;
  }
}

// Write to the solutions file
function writeSolutions(data) {
  try {
    data.lastUpdated = new Date().toISOString().split('T')[0];
    fs.writeFileSync(SOLUTIONS_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing solutions file:', error);
    return false;
  }
}

// Add a new error and solution
function addError(errorMessage, category, subcategory, solutionDescription, solutionCode) {
  const data = readSolutions();
  if (!data) return false;

  // Create category and subcategory if they don't exist
  if (!data.errorCategories[category]) {
    data.errorCategories[category] = {};
  }
  if (!data.errorCategories[category][subcategory]) {
    data.errorCategories[category][subcategory] = [];
  }

  // Check if the error already exists
  const existingErrorIndex = data.errorCategories[category][subcategory].findIndex(
    e => e.error === errorMessage
  );

  if (existingErrorIndex >= 0) {
    // Add the solution if it doesn't already exist
    const existingError = data.errorCategories[category][subcategory][existingErrorIndex];
    const solutionExists = existingError.solutions.some(s => s.description === solutionDescription);

    if (!solutionExists) {
      existingError.solutions.push({
        description: solutionDescription,
        code: solutionCode,
        effectiveness: 'medium', // Default effectiveness
        addedAt: new Date().toISOString()
      });
    }
  } else {
    // Add a new error with the solution
    data.errorCategories[category][subcategory].push({
      error: errorMessage,
      pattern: errorMessage.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), // Escape regex special chars
      solutions: [{
        description: solutionDescription,
        code: solutionCode,
        effectiveness: 'medium', // Default effectiveness
        addedAt: new Date().toISOString()
      }]
    });
  }

  // Add to recent errors
  data.recentErrors.unshift({
    error: errorMessage,
    category,
    subcategory,
    timestamp: new Date().toISOString()
  });

  // Keep only the 20 most recent errors
  data.recentErrors = data.recentErrors.slice(0, 20);

  return writeSolutions(data);
}

// Search for solutions to an error
function searchSolutions(errorMessage) {
  const data = readSolutions();
  if (!data) return null;

  const results = [];

  // Search through all categories and subcategories
  Object.keys(data.errorCategories).forEach(category => {
    Object.keys(data.errorCategories[category]).forEach(subcategory => {
      data.errorCategories[category][subcategory].forEach(error => {
        try {
          const regex = new RegExp(error.pattern, 'i');
          if (regex.test(errorMessage)) {
            results.push({
              category,
              subcategory,
              error: error.error,
              solutions: error.solutions
            });
          }
        } catch (e) {
          // Skip invalid regex patterns
        }
      });
    });
  });

  return results;
}

// Update the effectiveness of a solution
function updateSolutionEffectiveness(errorMessage, solutionDescription, effectiveness) {
  const data = readSolutions();
  if (!data) return false;

  let updated = false;

  // Search through all categories and subcategories
  Object.keys(data.errorCategories).forEach(category => {
    Object.keys(data.errorCategories[category]).forEach(subcategory => {
      data.errorCategories[category][subcategory].forEach(error => {
        if (error.error === errorMessage) {
          error.solutions.forEach(solution => {
            if (solution.description === solutionDescription) {
              solution.effectiveness = effectiveness;
              solution.lastUpdated = new Date().toISOString();
              updated = true;
            }
          });
        }
      });
    });
  });

  if (updated) {
    return writeSolutions(data);
  }
  return false;
}

// Main function
function main() {
  const command = process.argv[2];

  if (!command) {
    console.log('Usage:');
    console.log('  node error-tracker.js add <category> <subcategory> "Error message" "Solution description" "Solution code"');
    console.log('  node error-tracker.js search "Error message"');
    console.log('  node error-tracker.js update "Error message" "Solution description" "high|medium|low"');
    return;
  }

  switch (command) {
    case 'add':
      if (process.argv.length < 8) {
        console.log('Missing arguments for add command');
        return;
      }
      const category = process.argv[3];
      const subcategory = process.argv[4];
      const errorMessage = process.argv[5];
      const solutionDescription = process.argv[6];
      const solutionCode = process.argv[7];

      if (addError(errorMessage, category, subcategory, solutionDescription, solutionCode)) {
        console.log('Error and solution added successfully');
      } else {
        console.log('Failed to add error and solution');
      }
      break;

    case 'search':
      if (process.argv.length < 4) {
        console.log('Missing error message for search command');
        return;
      }
      const searchQuery = process.argv[3];
      const solutions = searchSolutions(searchQuery);

      if (solutions && solutions.length > 0) {
        console.log(`Found ${solutions.length} matching solutions:`);
        solutions.forEach((result, index) => {
          console.log(`\n[${index + 1}] ${result.category} > ${result.subcategory} > ${result.error}`);
          result.solutions.forEach((solution, sIndex) => {
            console.log(`  Solution ${sIndex + 1} (${solution.effectiveness}):`);
            console.log(`  ${solution.description}`);
            console.log(`  Code: ${solution.code.substring(0, 50)}...`);
          });
        });
      } else {
        console.log('No solutions found for the error');
      }
      break;

    case 'update':
      if (process.argv.length < 6) {
        console.log('Missing arguments for update command');
        return;
      }
      const updateErrorMessage = process.argv[3];
      const updateSolutionDescription = process.argv[4];
      const updateEffectiveness = process.argv[5];

      if (!['high', 'medium', 'low'].includes(updateEffectiveness)) {
        console.log('Effectiveness must be one of: high, medium, low');
        return;
      }

      if (updateSolutionEffectiveness(updateErrorMessage, updateSolutionDescription, updateEffectiveness)) {
        console.log('Solution effectiveness updated successfully');
      } else {
        console.log('Failed to update solution effectiveness');
      }
      break;

    default:
      console.log(`Unknown command: ${command}`);
      break;
  }
}

// Run the main function
main();
