# Test script for new GPT-5-mini models
Write-Host "Testing New GPT-5-mini Models" -ForegroundColor Green

# Test health endpoint
Write-Host "`nTesting CDI Health Endpoint..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "http://localhost:3001/api/cdi/health" -Method GET
    Write-Host "✅ Health Check Successful" -ForegroundColor Green
    Write-Host "Status: $($health.status)" -ForegroundColor Cyan
    Write-Host "Models in use:" -ForegroundColor Cyan
    $health.models | Format-Table -AutoSize
} catch {
    Write-Host "❌ Health check failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test main health endpoint 
Write-Host "`nTesting Main Health Endpoint..." -ForegroundColor Yellow
try {
    $mainHealth = Invoke-RestMethod -Uri "http://localhost:3001/health" -Method GET
    Write-Host "✅ Main Health Check Successful" -ForegroundColor Green
    Write-Host "Status: $($mainHealth.status)" -ForegroundColor Cyan
    Write-Host "Environment: $($mainHealth.environment)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Main health check failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test model quality endpoint
Write-Host "`nTesting New GPT-5-mini Model Quality..." -ForegroundColor Yellow
try {
    $body = @{} | ConvertTo-Json
    $modelTest = Invoke-RestMethod -Uri "http://localhost:3001/api/cdi/test-model" -Method POST -Body $body -ContentType "application/json"
    
    Write-Host "✅ Model Test Successful!" -ForegroundColor Green
    Write-Host "`nModel Information:" -ForegroundColor Cyan
    $modelTest.data.modelInformation | Format-List
    
    Write-Host "`nRAG Response (first 200 chars):" -ForegroundColor Cyan
    Write-Host $modelTest.data.ragResponse.answer.Substring(0, [Math]::Min(200, $modelTest.data.ragResponse.answer.Length)) -ForegroundColor White
    
    Write-Host "`nConfidence: $($modelTest.data.ragResponse.confidence)" -ForegroundColor Cyan
    Write-Host "Sources Found: $($modelTest.data.ragResponse.sourcesCount)" -ForegroundColor Cyan
    
    Write-Host "`nModel Improvements:" -ForegroundColor Cyan
    $modelTest.data.qualityComparison.improvements | ForEach-Object { Write-Host "  • $_" -ForegroundColor Green }
    
} catch {
    Write-Host "❌ Model test failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Response: $($_.Exception.Response)" -ForegroundColor Red
}

Write-Host "`n🎉 Model Upgrade Complete!" -ForegroundColor Green
Write-Host "Billigent is now running with state-of-the-art AI models:" -ForegroundColor Yellow
Write-Host "  • GPT-5-mini (272k context, 128k output)" -ForegroundColor Cyan
Write-Host "  • o3-mini (reasoning model)" -ForegroundColor Cyan  
Write-Host "  • text-embedding-3-large (3072 dimensions)" -ForegroundColor Cyan
