# Script para inicializar repositório GitHub - Fábrica de Naiê
# Execute este script no PowerShell para configurar o repositório

Write-Host "🎬 Inicializando repositório GitHub - Fábrica de Naiê" -ForegroundColor Green

# Verificar se Git está instalado
if (!(Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Git não está instalado. Instale o Git primeiro: https://git-scm.com/" -ForegroundColor Red
    exit 1
}

# Inicializar repositório Git
Write-Host "📁 Inicializando repositório Git..." -ForegroundColor Yellow
git init

# Configurar arquivos principais
Write-Host "📝 Configurando arquivos..." -ForegroundColor Yellow

# Renomear arquivos para estrutura padrão
if (Test-Path "fabrica-naie.html") {
    Copy-Item "fabrica-naie.html" "index.html"
    Write-Host "✅ index.html criado" -ForegroundColor Green
}

if (Test-Path "fabrica-naie-README.md") {
    Copy-Item "fabrica-naie-README.md" "README.md"
    Write-Host "✅ README.md criado" -ForegroundColor Green
}

if (Test-Path "fabrica-naie.gitignore") {
    Copy-Item "fabrica-naie.gitignore" ".gitignore"
    Write-Host "✅ .gitignore criado" -ForegroundColor Green
}

if (Test-Path "fabrica-naie-netlify.toml") {
    Copy-Item "fabrica-naie-netlify.toml" "netlify.toml"
    Write-Host "✅ netlify.toml criado" -ForegroundColor Green
}

if (Test-Path "fabrica-naie-manifest.json") {
    Copy-Item "fabrica-naie-manifest.json" "manifest.json"
    Write-Host "✅ manifest.json criado" -ForegroundColor Green
}

# Adicionar todos os arquivos
Write-Host "📦 Adicionando arquivos ao Git..." -ForegroundColor Yellow
git add .

# Fazer commit inicial
Write-Host "💾 Fazendo commit inicial..." -ForegroundColor Yellow
git commit -m "🎬 Initial commit: Fábrica de Naiê - Editor de Vídeos

✨ Features:
- Sistema de segmentos avançado
- Seleção de partes do vídeo (máx 4min)
- Múltiplos layouts (split, picture-in-picture)
- Interface responsiva
- PWA ready
- Otimizado para produção

🚀 Ready for deployment!"

Write-Host "✅ Repositório inicializado com sucesso!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Próximos passos:" -ForegroundColor Cyan
Write-Host "1. Crie um repositório no GitHub: https://github.com/new" -ForegroundColor White
Write-Host "2. Execute: git remote add origin https://github.com/SEU_USUARIO/fabrica-naie.git" -ForegroundColor White
Write-Host "3. Execute: git branch -M main" -ForegroundColor White
Write-Host "4. Execute: git push -u origin main" -ForegroundColor White
Write-Host ""
Write-Host "🌐 Para deploy automático:" -ForegroundColor Cyan
Write-Host "- GitHub Pages: Vá em Settings > Pages > Source: Deploy from branch" -ForegroundColor White
Write-Host "- Netlify: Conecte seu repositório em https://netlify.com" -ForegroundColor White
Write-Host ""
Write-Host "🎉 Seu app estará online em poucos minutos!" -ForegroundColor Green