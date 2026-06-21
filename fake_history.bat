@echo off

set file=test.html

for /L %%i in (1,1,15) do (
    echo Update %%i >> %file%

    git add .

    git commit --date="2026-06-21T12:%%i:00" -m "<p>update</> %%i"
)

git push origin main

pause