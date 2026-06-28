@echo off
chcp 65001 >nul
title =--= 高考志愿填报助手 =--=
color 5F

cd /d "%~dp0"

cls
echo.
echo    ========================================
echo       高考志愿填报助手 - 启动中
echo    ========================================
echo.
echo    [1/3] 正在启动后端服务...
start /b cmd /c "cd /d "%~dp0server" && node index.js"

timeout /t 2 /nobreak >nul

echo    [2/3] 正在启动前端服务...
start /b cmd /c "cd /d "%~dp0" && npm run dev"

echo    [3/3] 等待服务启动...
timeout /t 6 /nobreak >nul

cls
echo.
echo    ========================================
echo       高考志愿填报助手 - 运行中
echo    ========================================
echo.
echo    ?? 前端地址: http://localhost:5173
echo    ?? 后端地址: http://localhost:3000
echo.
echo    浏览器已自动打开，如果没有请手动访问上面的地址
echo.
echo    ========================================
echo.
echo    ?? 关闭此窗口将停止所有服务
echo.
echo    正在打开浏览器...
echo.

start "" "http://localhost:5173"

pause >nul
echo.
echo    正在停止服务...
taskkill /f /im node.exe >nul 2>&1
echo    服务已停止，再见！
timeout /t 1 /nobreak >nul
