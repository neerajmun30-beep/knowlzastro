# PowerShell script to extract text from PDF and search for names
# Requires pdftotext or similar tool, or we can use .NET libraries

# Check if PDF exists
if (Test-Path "voter_list_ward.pdf") {
    Write-Host "PDF file found. Attempting to extract text..."
    
    # Try using pdftotext if available (part of poppler or xpdf)
    $pdftotext = Get-Command pdftotext -ErrorAction SilentlyContinue
    
    if ($pdftotext) {
        Write-Host "Using pdftotext to extract text..."
        pdftotext -layout "voter_list_ward.pdf" "voter_list_extracted.txt"
        
        if (Test-Path "voter_list_extracted.txt") {
            Write-Host "Text extracted successfully!"
            Write-Host "Searching for names..."
            
            # Names to search
            $names = @("ठाकर", "मदन", "शीला", "कमलेश", "पायल")
            $wardPatterns = @("वार्ड.*8", "वार्ड.*10", "ward.*8", "ward.*10", "Ward.*8", "Ward.*10")
            
            $content = Get-Content "voter_list_extracted.txt" -Raw -Encoding UTF8
            $lines = Get-Content "voter_list_extracted.txt" -Encoding UTF8
            
            Write-Host "`n=== SEARCH RESULTS ===" -ForegroundColor Green
            
            foreach ($name in $names) {
                Write-Host "`nSearching for: $name" -ForegroundColor Yellow
                $lineNum = 0
                foreach ($line in $lines) {
                    $lineNum++
                    if ($line -match $name) {
                        Write-Host "  Found at line $lineNum : $line" -ForegroundColor Cyan
                    }
                }
            }
            
            # Search for ward information
            Write-Host "`nSearching for Ward 8 and 10 references..." -ForegroundColor Yellow
            foreach ($pattern in $wardPatterns) {
                $lineNum = 0
                foreach ($line in $lines) {
                    $lineNum++
                    if ($line -match $pattern) {
                        Write-Host "  Found at line $lineNum : $line" -ForegroundColor Cyan
                    }
                }
            }
        }
    } else {
        Write-Host "pdftotext not found. Please install poppler-utils or xpdf tools."
        Write-Host "Alternatively, you can use online PDF to text converters."
        Write-Host "`nPDF file location: $(Resolve-Path 'voter_list_ward.pdf')"
    }
} else {
    Write-Host "PDF file not found!"
}







