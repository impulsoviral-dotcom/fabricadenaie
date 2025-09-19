# 🎬 Fábrica NAIE - Editor de Vídeo Web

Um editor de vídeo web avançado para criação de conteúdo com múltiplos vídeos, sistema de segmentos e seleção de partes específicas.

## ✨ Funcionalidades

### 🎥 Edição de Vídeo
- **Múltiplos Layouts**: Split vertical, horizontal e picture-in-picture
- **Seleção de Partes**: Escolha partes específicas dos vídeos (máx. 4 min)
- **Sistema de Segmentos**: Divida e exclua partes dos vídeos
- **Preview em Tempo Real**: Visualize mudanças instantaneamente

### 🎨 Personalização
- **Overlay de Texto**: Adicione textos personalizados
- **Controles de Posição**: Top, center, bottom
- **Cores Customizáveis**: Texto e fundo
- **Tamanhos de Fonte**: Ajustáveis

### ⚙️ Controles Avançados
- **Timeline Interativa**: Navegue pelo tempo do vídeo
- **Gerenciamento de Segmentos**: Adicione, edite e remova segmentos
- **Validação Automática**: Limites de tempo e duração
- **Interface Intuitiva**: Fácil de usar

## 🚀 Como Usar

### 1. Configuração Inicial
1. Abra o arquivo `fabrica-naie.html` no navegador
2. Configure os layouts desejados
3. Adicione textos se necessário

### 2. Seleção de Vídeo
1. Use os controles "Seleção de Parte do Vídeo"
2. Defina início e fim (máx. 4 minutos)
3. Clique em "Aplicar Seleção"

### 3. Gerenciamento de Segmentos
1. Use a timeline para navegar
2. Clique em "Adicionar Segmento" para criar
3. Edite segmentos clicando neles
4. Configure vídeo ativo/inativo

### 4. Personalização
1. Adicione texto no overlay
2. Escolha posição e cores
3. Ajuste tamanho da fonte
4. Visualize em tempo real

## 📁 Estrutura do Projeto

```
fabrica-naie/
├── fabrica-naie.html          # Página principal
├── fabrica-naie-script.js     # Lógica da aplicação
├── fabrica-naie-styles.css    # Estilos CSS
└── README.md                  # Documentação
```

## 🛠️ Tecnologias

- **HTML5**: Estrutura da aplicação
- **CSS3**: Estilos e animações
- **JavaScript ES6+**: Lógica e interatividade
- **Canvas API**: Renderização de vídeo
- **Web APIs**: Manipulação de mídia

## 🌐 Hospedagem

### GitHub Pages
1. Faça upload dos arquivos para um repositório
2. Ative GitHub Pages nas configurações
3. Acesse via URL do GitHub Pages

### Netlify
1. Conecte o repositório ao Netlify
2. Configure build settings (se necessário)
3. Deploy automático a cada commit

### Servidor Local
```bash
# Python
python -m http.server 8000

# Node.js
npx serve .

# PHP
php -S localhost:8000
```

## 📋 Requisitos

- Navegador moderno com suporte a:
  - HTML5 Canvas
  - ES6+ JavaScript
  - CSS3 Flexbox/Grid
  - Web APIs

## 🔧 Desenvolvimento

### Estrutura do Código
- **FabricaNaie Class**: Classe principal da aplicação
- **Sistema de Segmentos**: Gerenciamento de partes do vídeo
- **Sistema de Seleção**: Limitação de duração (4 min)
- **Renderização**: Canvas para preview em tempo real

### Principais Métodos
- `renderFrame()`: Renderiza frame atual
- `addSegment()`: Adiciona novo segmento
- `shouldShowVideo()`: Determina visibilidade do vídeo
- `applyVideoSelection()`: Aplica seleção de tempo

## 📝 Licença

Este projeto é de código aberto. Sinta-se livre para usar, modificar e distribuir.

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📞 Suporte

Para dúvidas ou problemas:
- Abra uma issue no GitHub
- Consulte a documentação
- Verifique os exemplos de uso

---

**Desenvolvido com ❤️ para criadores de conteúdo**