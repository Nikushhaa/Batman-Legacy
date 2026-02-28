@echo off

set file=index.html

for /L %%i in (1,1,30) do (
    if %%i lss 5 (
        echo ^<h1^>Update %%i^</h1^> >> %file%
    ) else if %%i lss 10 (
        echo ^<h2^>Update %%i^</h2^> >> %file%
    ) else (
        echo ^<p^>Update %%i^</p^> >> %file%
    )

    git add .

    git commit --date="2026-03-07T12:%%i:25" -m "update %%i"
)

git push origin main

pause