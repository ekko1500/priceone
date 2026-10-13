param([string]$path, [string]$content)
[System.IO.File]::WriteAllText($path, $content, [System.Text.UTF8Encoding]::new($false))