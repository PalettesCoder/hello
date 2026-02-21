$content = Get-Content 'css/styles.css'
$startLines = @(64, 556, 852, 1246, 1454, 1667, 1996, 2566, 2897, 3109, 3467, 3571, 3857, 4237, 5103, 5344, 5393, 6070, 6375, 6550, 6645, 7146)
$linesToRemove = New-Object System.Collections.Generic.HashSet[int]

foreach ($start in $startLines) {
    for ($i = $start; $i -le ($start + 30); $i++) {
        $null = $linesToRemove.Add($i)
    }
}

$newContent = New-Object System.Collections.Generic.List[string]
for ($i = 1; $i -le $content.Count; $i++) {
    if (-not $linesToRemove.Contains($i)) {
        $newContent.Add($content[$i-1])
    }
}

$newContent | Set-Content 'css/styles.css'
