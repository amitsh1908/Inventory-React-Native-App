# Inventory Management App

A React Native mobile application for managing inventory using barcode scanning. Track product check-ins, check-outs, view inventory levels, and generate reports with charts and PDF exports.

## Features

- **Barcode Scanning**: Scan product barcodes for quick check-in and check-out
- **Product Management**: Add and update products with name, price, and quantity
- **Inventory Tracking**: Real-time inventory levels and history
- **Reports & Analytics**: View logs, generate charts, and export PDF reports
- **Local Database**: SQLite storage for offline functionality
- **Cross-Platform**: Works on Android and iOS

## Project Structure

- `src/screens/`: Main app screens (Main, CheckIn, CheckOut, Inventory, Reports)
- `src/components/`: Reusable components (BarcodeScanner)
- `src/db.js`: Database operations and schema
- `android/`: Android-specific configuration
- `ios/`: iOS-specific configuration

## Installation

1. **Prerequisites**:
   - Node.js >= 20
   - React Native development environment set up
   - Android Studio (for Android) or Xcode (for iOS)

2. **Clone and Install**:
   git clone <repository-url>
   cd inventory
   npm install
   

3. **iOS Setup** (if targeting iOS):
   cd ios
   bundle install
   bundle exec pod install
   cd ..
   

## Getting Started

### Start Metro Server

npm start

### Run on Android
npm run android

### Run on iOS
npm run ios

## Usage

1. **Main Screen**: Navigate to different sections
2. **Check-In**: Scan barcode and enter product details to add stock
3. **Check-Out**: Scan barcode to remove items from inventory
4. **Inventory**: View all products and current stock levels
5. **Reports**: Analyze transaction logs with charts and export to PDF

## Technologies Used

- React Native
- SQLite (react-native-sqlite-storage)
- Barcode Scanning (react-native-vision-camera)
- Navigation (React Navigation)
- Charts (react-native-chart-kit)
- PDF Generation (react-native-html-to-pdf)
- UI Components (react-native-paper)

