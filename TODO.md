# TODO for Inventory Project Testing and Fixes

## Completed Tasks
- [x] Install dependencies (npm install)
- [x] Check for dependency conflicts (npm audit) - Found 1 high severity vulnerability in xlsx package (no fix available)
- [x] Fix lint errors:
  - Installed missing react-native-reanimated
  - Fixed React Hook useEffect missing dependency in ReportsScreen.js by using useCallback
- [x] Fix test errors:
  - Updated jest.config.js to transform ES modules in @react-navigation and react-native-reanimated
- [x] Downgraded react-native-vision-camera to v3 for compatibility with vision-camera-code-scanner
- [x] Android build in progress (cd android && ./gradlew build)

## Pending Tasks
- [ ] Complete Android build and verify success
- [ ] Build iOS (cd ios && pod install, then xcodebuild)
- [ ] Run Android app (npm run android) and test functionality
- [ ] Run iOS app (npm run ios) and test functionality
- [ ] Manually test all app features:
  - Navigation between screens (Main, CheckIn, CheckOut, Inventory, Reports)
  - Database operations (initDB, getLogs)
  - Barcode scanning functionality
  - Report generation and export (Excel, PDF)
  - Camera permissions
- [ ] Address remaining lint warnings (inline styles)
- [ ] Consider alternatives for xlsx package due to security vulnerability

## Notes
- Project uses React Native 0.81.4 with various libraries for inventory management
- VisionCamera v3 with code scanner plugin for barcode functionality
- SQLite for local database
- Reports export to Excel (xlsx) and PDF
