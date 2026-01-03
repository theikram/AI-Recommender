@echo off
REM This script creates the .env file with your credentials

echo Creating .env file...

(
echo # MongoDB Configuration
echo MONGODB_URI=mongodb+srv://3angelica_db_user:BBcuGb8UjKRzgCaA@cluster0.sqlnzo1.mongodb.net/?appName=Cluster0
echo.
echo # Google AI API Key
echo GOOGLE_AI_API_KEY=AIzaSyCr35hxFrpVsbNWgqOwU6PwmkpwLmO2dJA
echo.
echo # Backend Configuration
echo BACKEND_PORT=5000
echo.
echo # Python AI Service Configuration
echo PYTHON_SERVICE_PORT=8000
) > .env

echo .env file created successfully!
echo.
echo Your credentials are now configured.
pause
