#!/usr/bin/env node

/**
 * Script to help format Firebase private key for environment variables
 * Usage: node scripts/format-private-key.js
 */

const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('🔧 Firebase Private Key Formatter');
console.log('=====================================');
console.log('');
console.log('This script will help you format your Firebase private key for the .env file.');
console.log('');
console.log('Steps:');
console.log('1. Open your Firebase service account JSON file');
console.log('2. Copy the "private_key" value (including the quotes)');
console.log('3. Paste it below when prompted');
console.log('4. The script will format it correctly for your .env file');
console.log('');

rl.question('Paste your private_key value here: ', (input) => {
    try {
        // Remove outer quotes if present
        let privateKey = input.trim();
        if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
            privateKey = privateKey.slice(1, -1);
        }

        // Replace \n with actual newlines
        const formattedKey = privateKey.replace(/\\n/g, '\n');

        console.log('');
        console.log('✅ Formatted private key:');
        console.log('=====================================');
        console.log('FIREBASE_PRIVATE_KEY="' + formattedKey + '"');
        console.log('');
        console.log('📝 Copy the above line to your .env file');
        console.log('');
        console.log('⚠️  Important: Make sure to wrap the entire value in quotes!');

    } catch (error) {
        console.error('❌ Error formatting private key:', error.message);
        console.log('');
        console.log('Please make sure you copied the private_key value correctly from your JSON file.');
    }

    rl.close();
});
