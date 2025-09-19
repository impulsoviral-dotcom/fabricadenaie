# 🚀 Guia de Deploy - Fábrica NAIE

## 📋 Pré-requisitos

### 1. Conta no GitHub
- Crie uma conta em [github.com](https://github.com)
- Instale Git no seu computador

### 2. Arquivos Necessários
Certifique-se de ter estes arquivos:
- `fabrica-naie.html`
- `fabrica-naie-script.js`
- `fabrica-naie-styles.css`
- `README.md` (renomeie `fabrica-naie-README.md`)
- `.gitignore` (renomeie `fabrica-naie.gitignore`)
- `netlify.toml` (renomeie `fabrica-naie-netlify.toml`)

## 🔧 Passo a Passo

### Etapa 1: Preparar Arquivos
```bash
# 1. Crie uma pasta para o projeto
mkdir fabrica-naie
cd fabrica-naie

# 2. Copie os arquivos necessários
# - fabrica-naie.html
# - fabrica-naie-script.js
# - fabrica-naie-styles.css

# 3. Renomeie os arquivos de configuração
mv fabrica-naie-README.md README.md
mv fabrica-naie.gitignore .gitignore
mv fabrica-naie-netlify.toml netlify.toml
```

### Etapa 2: Criar Repositório no GitHub
```bash
# 1. Inicializar repositório Git
git init

# 2. Adicionar arquivos
git add .

# 3. Fazer primeiro commit
git commit -m "🎬 Inicial: Fábrica NAIE - Editor de Vídeo Web"

# 4. Criar repositório no GitHub (via interface web)
# - Vá para github.com
# - Clique em "New repository"
# - Nome: "fabrica-naie"
# - Descrição: "Editor de vídeo web com sistema de segmentos"
# - Público ou Privado (sua escolha)
# - NÃO inicialize com README (já temos um)

# 5. Conectar repositório local ao GitHub
git remote add origin https://github.com/SEU_USUARIO/fabrica-naie.git
git branch -M main
git push -u origin main
```

### Etapa 3: Configurar Hospedagem

#### Opção A: GitHub Pages
```bash
# 1. No repositório GitHub, vá em Settings
# 2. Role até "Pages"
# 3. Source: "Deploy from a branch"
# 4. Branch: "main"
# 5. Folder: "/ (root)"
# 6. Clique em "Save"

# URL será: https://SEU_USUARIO.github.io/fabrica-naie/fabrica-naie.html
```

#### Opção B: Netlify (Recomendado)
```bash
# 1. Vá para netlify.com
# 2. Clique em "New site from Git"
# 3. Conecte com GitHub
# 4. Selecione o repositório "fabrica-naie"
# 5. Configurações:
#    - Branch: main
#    - Build command: (deixe vazio)
#    - Publish directory: .
# 6. Clique em "Deploy site"

# URL será: https://NOME-ALEATORIO.netlify.app
# Você pode personalizar o nome nas configurações
```

## 🔄 Atualizações Futuras

### Para fazer mudanças:
```bash
# 1. Edite os arquivos localmente
# 2. Teste localmente
python -m http.server 8000

# 3. Commit e push
git add .
git commit -m "✨ Descrição da mudança"
git push

# 4. Deploy automático (Netlify) ou manual (GitHub Pages)
```

## 🛠️ Otimizações Opcionais

### 1. Minificação (Produção)
- Minifique CSS e JavaScript
- Otimize imagens se houver
- Comprima arquivos

### 2. PWA (Progressive Web App)
- Adicione manifest.json
- Implemente service worker
- Cache offline

### 3. Analytics
- Google Analytics
- Netlify Analytics
- Hotjar para UX

### 4. SEO
- Meta tags otimizadas
- Open Graph tags
- Schema markup

## 🔍 Verificação de Deploy

### Checklist pós-deploy:
- [ ] Site carrega corretamente
- [ ] Todas as funcionalidades funcionam
- [ ] Responsivo em mobile
- [ ] Console sem erros
- [ ] Performance adequada

### Ferramentas de teste:
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [GTmetrix](https://gtmetrix.com/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

## 🆘 Solução de Problemas

### Problemas Comuns:

#### 1. Site não carrega
- Verifique se os arquivos estão no repositório
- Confirme configurações do GitHub Pages/Netlify
- Verifique console do navegador

#### 2. JavaScript não funciona
- Verifique caminhos dos arquivos
- Confirme se não há erros de sintaxe
- Teste localmente primeiro

#### 3. CSS não aplica
- Verifique caminhos dos arquivos CSS
- Confirme se não há conflitos
- Teste em diferentes navegadores

## 📞 Suporte

- **GitHub Issues**: Para bugs e melhorias
- **Documentação**: README.md do projeto
- **Comunidade**: Discussões no GitHub

---

**🎉 Parabéns! Seu app está no ar!**