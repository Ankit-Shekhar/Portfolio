$ErrorActionPreference = 'Stop'

$BaseUrl = if ($env:API_BASE_URL) { $env:API_BASE_URL } else { 'http://localhost:8000' }
$AdminKey = $env:ADMIN_API_KEY
if (-not $AdminKey -and (Test-Path '.env')) {
    $AdminKey = (Get-Content .env | Where-Object { $_ -match '^ADMIN_API_KEY\s*=' } | ForEach-Object { ($_ -split '=',2)[1].Trim() } | Select-Object -First 1)
}
if (-not $AdminKey) {
    throw 'ADMIN_API_KEY must be set in environment or .env'
}

function Assert-True([bool]$Condition, [string]$Message) {
    if (-not $Condition) {
        throw $Message
    }
}

function Invoke-Json {
    param(
        [string]$Method,
        [string]$Path,
        [hashtable]$Headers,
        [object]$Body
    )

    $params = @{
        Method = $Method
        Uri = "$BaseUrl$Path"
    }

    if ($Headers) {
        $params.Headers = $Headers
    }

    if ($Body -ne $null) {
        $params.ContentType = 'application/json'
        $params.Body = ($Body | ConvertTo-Json -Depth 20)
    }

    return Invoke-RestMethod @params
}

try {
    $health = Invoke-Json -Method 'Get' -Path '/api/v1/health'
    Assert-True ($health.success -eq $true) 'Health check failed'

    $readiness = Invoke-Json -Method 'Get' -Path '/api/v1/readiness'
    Assert-True ($readiness.success -eq $true) 'Readiness failed'
    Assert-True ($readiness.services.mongo -eq $true) 'Mongo not ready'

    $seed = Invoke-Json -Method 'Post' -Path '/api/v1/ai-agent/seed-data' -Body @{}
    Assert-True ($seed.success -eq $true) 'Seed data failed'

    $index = Invoke-Json -Method 'Post' -Path '/api/v1/ai-agent/index-knowledge' -Body @{
        repositoryDocuments = @(
            @{
                id = 'assert-repo-ps'
                title = 'assertion repo ps'
                url = 'https://github.com/Ankit-Shekhar/Portfolio'
                content = 'Assertion test repository content for indexing'
            }
        )
    }
    Assert-True ($index.success -eq $true) 'Index knowledge failed'
    Assert-True ($index.data.embeddingResult.knowledgeChunksIndexed -gt 0) 'No embedding chunks indexed'

    $query = Invoke-Json -Method 'Post' -Path '/api/v1/ai-agent/query' -Body @{ query = 'backend architecture summary' }
    Assert-True ($query.success -eq $true) 'AI query failed'
    Assert-True (-not [string]::IsNullOrWhiteSpace($query.data.answer)) 'AI answer empty'

    $adminHeaders = @{ 'x-admin-key' = $AdminKey }

    $pipelineEvents = Invoke-Json -Method 'Get' -Path '/api/v1/ai-agent/pipeline-events?limit=3' -Headers $adminHeaders
    Assert-True ($pipelineEvents.success -eq $true) 'Pipeline events admin fetch failed'

    $pipelineDiag = Invoke-Json -Method 'Get' -Path '/api/v1/ai-agent/pipeline-diagnostics?limit=20' -Headers $adminHeaders
    Assert-True ($pipelineDiag.success -eq $true) 'Pipeline diagnostics admin fetch failed'

    $githubStatus = Invoke-Json -Method 'Get' -Path '/api/v1/ai-agent/index-github/status' -Headers $adminHeaders
    Assert-True ($githubStatus.success -eq $true) 'GitHub index status admin fetch failed'

    $githubProfile = Invoke-Json -Method 'Get' -Path '/api/v1/github/profile?username=Ankit-Shekhar'
    Assert-True ($githubProfile.success -eq $true) 'GitHub profile failed'

    $analyticsTrack = Invoke-Json -Method 'Post' -Path '/api/v1/analytics/events' -Body @{
        eventType = 'assertion_event_ps'
        projectId = 'ai-portfolio-os'
        sessionId = "assert-ps-$([DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds())"
        metadata = @{ source = 'assertions-ps' }
    }
    Assert-True ($analyticsTrack.success -eq $true) 'Analytics track failed'

    $analyticsSummary = Invoke-Json -Method 'Get' -Path '/api/v1/analytics/summary' -Headers $adminHeaders
    Assert-True ($analyticsSummary.success -eq $true) 'Analytics summary admin failed'

    [pscustomobject]@{
        success = $true
        message = 'Backend API assertions passed (PowerShell)'
        checks = @{
            health = $true
            readiness = $true
            indexing = $true
            aiQuery = $true
            telemetry = $true
            github = $true
            analytics = $true
            adminAuth = $true
        }
    } | ConvertTo-Json -Depth 10
}
catch {
    [pscustomobject]@{
        success = $false
        message = $_.Exception.Message
    } | ConvertTo-Json -Depth 10
    exit 1
}
