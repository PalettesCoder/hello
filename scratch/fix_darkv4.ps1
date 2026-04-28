$lines = Get-Content "css\styles.css"
# Lines 7079-7102 are 0-indexed as 7078..7101 (1-indexed lines 7079-7102)
$result = $lines[0..7077] + $lines[7102..($lines.Count - 1)]
$result | Set-Content "css\styles.css" -Encoding UTF8
Write-Host "Done. Lines removed: $($lines.Count - $result.Count)"
