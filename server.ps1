$port = 8000
$path = "d:\alvar\Desktop\ProyectoLenguaje"

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()

Write-Host "Servidor iniciado en http://localhost:$port/"
Write-Host "Presiona Ctrl+C para detener"

while ($listener.IsListening) {
    $context = $listener.GetContext()
    $request = $context.Request
    $response = $context.Response

    $localPath = $request.Url.LocalPath
    if ($localPath -eq "/") { $localPath = "/index.html" }
    $filePath = Join-Path $path $localPath.TrimStart("/")

    if (Test-Path $filePath -PathType Leaf) {
        # Determinamos el tipo de contenido según la extensión
        $extension = [System.IO.Path]::GetExtension($filePath).ToLower()
        $response.ContentType = switch ($extension) {
            ".html" { "text/html; charset=utf-8" }
            ".css"  { "text/css" }
            ".js"   { "application/javascript" }
            ".jpg"  { "image/jpeg" }
            ".jpeg" { "image/jpeg" }
            ".png"  { "image/png" }
            ".gif"  { "image/gif" }
            ".svg"  { "image/svg+xml" }
            default { "application/octet-stream" }
        }

        # LEER COMO BYTES (Fundamental para imágenes y archivos binarios)
        $bytes = [System.IO.File]::ReadAllBytes($filePath)
        $response.ContentLength64 = $bytes.Length
        $response.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
        $response.StatusCode = 404
        $buffer = [System.Text.Encoding]::UTF8.GetBytes("<h1>404 Not Found: $localPath</h1>")
        $response.OutputStream.Write($buffer, 0, $buffer.Length)
    }
    $response.OutputStream.Close()
} 