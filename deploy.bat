@echo off
REM ==============================
REM Hugo + docs/ 一键部署脚本
REM ==============================

REM 1. 生成静态文件
echo [1/4] 生成静态文件...
hugo --minify
IF %ERRORLEVEL% NEQ 0 (
    echo Hugo 构建失败，请检查错误。
    pause
    exit /b %ERRORLEVEL%
)

REM 2. 创建 docs 目录并复制 public
echo [2/4] 复制文件到 docs/...
if not exist docs mkdir docs
robocopy public docs /E /MIR

REM 3. 创建 .nojekyll 文件
echo [3/4] 创建 .nojekyll 文件...
type NUL > docs\.nojekyll

REM 4. Git 提交并推送
echo [4/4] 提交并推送到 main 分支...
git add -A

git commit -m "deploy: update site"
git push origin main

echo 部署完成！
pause
