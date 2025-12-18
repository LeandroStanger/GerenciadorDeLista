# Gerenciador de Registros - v3

Uma aplicação web moderna e completa para gerenciamento de registros com endereço completo, busca avançada e sistema de notificações. Permite adicionar, editar, remover e filtrar registros com uma interface intuitiva e responsiva.

**Acesso Online:** [https://leandrostanger.github.io/GerenciadorDeLista/](https://leandrostanger.github.io/GerenciadorDeLista/)

## ✨ Funcionalidades Principais

### 🆕 Novidades na Versão 3
- **🔍 Busca Avançada**: Sistema de busca em tempo real com filtros por campo
- **📊 Sistema de Notificações**: Feedback visual elegante substituindo alerts nativos
- **📥 Exportação de Dados**: Exporte seus registros para JSON com um clique
- **🎨 Interface Moderna**: Design redesenhado com animações suaves e gradientes
- **🛡️ Validações Aprimoradas**: Validação em tempo real de email, telefone e CEP
- **📱 Responsividade Total**: Experiência otimizada para mobile e desktop
- **🔒 Sanitização de Dados**: Prevenção contra XSS com escape de HTML
- **📈 Paginação Inteligente**: Exibição otimizada para grandes volumes de dados

### 🏗️ Funcionalidades Existentes Aprimoradas
- **Endereço Completo**: Campos para CEP, logradouro, bairro, complemento, cidade e estado
- **Busca Automática por CEP**: Integração com API ViaCEP para preenchimento automático
- **Formatação Inteligente**: Máscaras para CEP (99999-999) e telefone ((99) 99999-9999)
- **Sincronização IBGE/ViaCEP**: Estados e cidades sincronizados com dados do CEP
- **CRUD Completo**: Create, Read, Update, Delete com persistência local
- **Armazenamento Seguro**: Dados persistidos no LocalStorage com tratamento de erros

## 🛠️ Tecnologias Utilizadas

### Frontend
- **HTML5**: Estrutura semântica com atributos ARIA para acessibilidade
- **CSS3**: Estilos modernos com variáveis CSS, Flexbox, Grid e animações
- **JavaScript ES6+**: Programação orientada a objetos com classes e módulos

### APIs e Integrações
- **ViaCEP API**: Para busca de endereços por CEP (gratuita)
- **IBGE API**: Para listas de estados e cidades brasileiras
- **Local Storage API**: Para persistência de dados no navegador

### Ferramentas de Desenvolvimento
- **GitHub Pages**: Hospedagem estática gratuita
- **Modern JavaScript**: Async/await, debounce, sanitização
- **CSS Variables**: Sistema de design consistente e personalizável

## 🚀 Começando

### Pré-requisitos
- Navegador web moderno (Chrome 90+, Firefox 88+, Edge 90+, Safari 14+)
- Git instalado (opcional, para clonar o repositório)
- Conexão com internet (para APIs de CEP e IBGE)

### Instalação Local

1. **Clone o repositório**
   ```bash
   git clone https://github.com/LeandroStanger/GerenciadorDeLista.git
   cd GerenciadorDeLista
   ```

2. **Execute a aplicação**
   - Abra o arquivo `index.html` diretamente no navegador
   - Ou utilize um servidor local:
     ```bash
     # Com Python 3
     python3 -m http.server 8000
     
     # Com Node.js e http-server
     npx http-server
     
     # Com PHP
     php -S localhost:8000
     ```

3. **Acesse a aplicação**
   - Abra `http://localhost:8000` no seu navegador
   - Ou `http://localhost:8000` se estiver usando um servidor local

## 📁 Estrutura do Projeto

```
GerenciadorDeLista/
├── index.html          # Página principal com formulário semântico
├── style.css           # Estilos completos com design system
├── script.js           # Lógica principal em classe ES6
├── README.md           # Documentação do projeto
└── (assets/)           # Diretório para recursos estáticos
```

### Arquitetura do Código
- **script.js**: Classe `GerenciadorRegistros` com métodos organizados
- **style.css**: Sistema de design com variáveis CSS e componentes reutilizáveis
- **index.html**: Estrutura HTML5 semântica com atributos ARIA

## 🎯 Como Usar

### 1. Adicionar um Novo Registro
   - Preencha todos os campos obrigatórios (*)
   - Digite o CEP para preenchimento automático do endereço
   - Clique em "Adicionar Registro" ou pressione Enter
   - Receba confirmação visual com notificação

### 2. Buscar Registros
   - Digite na barra de busca (busca em tempo real)
   - Selecione o tipo de busca (todos os campos ou específico)
   - Veja os termos destacados nos resultados
   - Use o botão × para limpar a busca

### 3. Editar um Registro
   - Clique em "✏️ Editar" ao lado do registro
   - Os dados serão carregados no formulário
   - Modifique os campos necessários
   - Clique em "Atualizar Registro"
   - Receba confirmação de atualização

### 4. Remover um Registro
   - Clique em "🗑️ Remover" ao lado do item
   - Confirme a ação no diálogo de confirmação
   - Receba notificação de sucesso

### 5. Exportar Dados
   - Clique em "Exportar Dados" acima da lista
   - Um arquivo JSON será baixado automaticamente
   - Contém todos os registros no formato estruturado

## 🔧 APIs Utilizadas

### ViaCEP API
- **Endpoint**: `https://viacep.com.br/ws/{CEP}/json/`
- **Uso**: Preenchimento automático de endereços
- **Limitações**: Rate limit de 10 requisições por segundo

### IBGE API
- **Estados**: `https://servicodados.ibge.gov.br/api/v1/localidades/estados`
- **Cidades**: `https://servicodados.ibge.gov.br/api/v1/localidades/estados/{UF}/municipios`
- **Uso**: Listas dinâmicas de estados e cidades

## 🎨 Sistema de Design

### Cores Principais
```css
--cor-primaria: #3498db;     /* Azul principal */
--cor-secundaria: #2c3e50;   /* Azul escuro */
--cor-sucesso: #27ae60;      /* Verde */
--cor-erro: #e74c3c;         /* Vermelho */
--cor-aviso: #f39c12;        /* Laranja */
```

### Componentes
- **Formulário**: Grid responsivo com validação visual
- **Registros**: Cards com gradiente lateral e animações
- **Notificações**: Sistema de toast notifications
- **Barra de Busca**: Com filtros e contador de resultados

## 📱 Responsividade

A aplicação é totalmente responsiva com os seguintes breakpoints:

- **Desktop**: ≥ 992px (layout completo com 3+ colunas)
- **Tablet**: 768px - 991px (2 colunas, ajustes de espaçamento)
- **Mobile**: ≤ 767px (1 coluna, elementos empilhados)

## 🔒 Segurança

### Medidas Implementadas
- **Sanitização de HTML**: Prevenção contra ataques XSS
- **Validação de Entrada**: Validação em frontend de todos os campos
- **Escape de Dados**: Escape automático ao exibir conteúdo
- **LocalStorage Seguro**: Tratamento de erros de quota

### Validações
- **Email**: Regex para formato válido
- **Telefone**: Mínimo 10 dígitos, máximo 11
- **CEP**: 8 dígitos numéricos
- **Idade**: 0-120 anos
- **Campos Obrigatórios**: Todos marcados com *

## ⚡ Performance

### Otimizações
- **Debounce na Busca**: 300ms para evitar chamadas excessivas
- **Limite de Exibição**: 100 registros por vez para performance
- **Cache de Requisições**: Estados e cidades carregados uma vez
- **CSS Otimizado**: Uso eficiente de seletores e animações GPU

### Métricas
- **Tempo de Carregamento**: < 2s em conexão 3G
- **Tamanho Total**: < 100KB (HTML + CSS + JS)
- **Requisições HTTP**: 2 APIs externas (IBGE e ViaCEP)

## 🐛 Solução de Problemas

### Problemas Comuns

1. **CEP não encontrado**
   - Verifique se o CEP está correto
   - Tente sem o hífen (99999999)
   - Alguns CEPs rurais podem não estar na base

2. **Estados/cidades não carregam**
   - Verifique sua conexão com a internet
   - Recarregue a página
   - As APIs do IBGE podem estar temporariamente indisponíveis

3. **Dados não salvam**
   - Verifique se há espaço no LocalStorage
   - Tente exportar seus dados como backup
   - Limpe o LocalStorage do navegador se necessário

### Limitações Conhecidas
1. **Dependência de Internet**: Requer conexão para APIs externas
2. **LocalStorage Limitado**: Máximo ~5MB por domínio
3. **ViaCEP Rate Limit**: Máximo 10 requisições por segundo

## 🔄 Manutenção

### Backup de Dados
1. Exporte regularmente seus dados usando o botão "Exportar Dados"
2. Mantenha cópias do arquivo JSON em local seguro
3. Para restaurar, importe manualmente para o LocalStorage

### Atualização do Código
```bash
# Para atualizar do repositório
git pull origin main

# Para contribuir com melhorias
git checkout -b minha-melhoria
# Faça suas alterações
git commit -m "Descrição das alterações"
git push origin minha-melhoria
```

### Melhorias Planejadas
- Upload de foto do perfil
- Exportação para CSV e PDF
- Sistema de tags e categorias
- Histórico de alterações
- Backup automático em nuvem

## 🤝 Contribuindo

Contribuições são bem-vindas! Siga estes passos:

1. **Fork o projeto**
2. **Crie uma branch** (`git checkout -b feature/nova-funcionalidade`)
3. **Commit suas mudanças** (`git commit -m 'Adiciona nova funcionalidade'`)
4. **Push para a branch** (`git push origin feature/nova-funcionalidade`)
5. **Abra um Pull Request**

### Diretrizes de Contribuição
- Siga o padrão de código existente
- Adicione testes para novas funcionalidades
- Documente novas APIs ou mudanças
- Mantenha a compatibilidade com versões anteriores

## 📄 Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 👥 Autores

- **Leandro Stanger** - Desenvolvimento inicial e manutenção
- **Contribuidores** - Lista de todos os [contribuidores](https://github.com/LeandroStanger/GerenciadorDeLista/graphs/contributors)

## 🙏 Agradecimentos

- Equipe do **IBGE** pela API pública de localidades
- Equipe do **ViaCEP** pelo serviço gratuito de CEP
- Comunidade **GitHub** pelo suporte e ferramentas

## 📞 Suporte

Para suporte, reporte issues ou sugira melhorias:

- **GitHub Issues**: [Reportar Problema](https://github.com/LeandroStanger/GerenciadorDeLista/issues)
- **Email**: [seu-email@exemplo.com]
- **Discord**: [Link do servidor](https://discord.gg/seu-link)

---

**⭐ Se este projeto foi útil para você, considere dar uma estrela no GitHub!**

Desenvolvido com ❤️ por [Leandro Stanger](https://github.com/LeandroStanger)