#!/bin/bash
# --- Step 1: Run the build command ---
echo "Running React build..."
npm run build
# --- Step 3: Transfer files to the remote server via SCP ---
echo "Transferring build files to the remote server via SCP..."
scp -r ./build/* reactbi@10.0.150.36:/var/www/react_app_test_bi/build
