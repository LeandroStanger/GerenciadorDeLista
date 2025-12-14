# Gerenciador de Lista - v2

Uma aplicação web moderna para gerenciamento de listas, permitindo adicionar, editar e remover registros com uma interface intuitiva.

**Acesso Online:** [https://leandrostanger.github.io/GerenciadorDeLista/](https://leandrostanger.github.io/GerenciadorDeLista/)

## ✨ Funcionalidades

- **Adição de Registros**: Insira novos itens na lista através de um formulário simples
- **Edição em Tempo Real**: Modifique registros existentes diretamente na lista
- **Exclusão de Itens**: Remova registros individualmente com confirmação
- **Interface Responsiva**: Design adaptável para diferentes tamanhos de tela
- **Armazenamento Local**: Os dados são persistidos no navegador do usuário
- **Feedback Visual**: Notificações visuais para ações realizadas

## 🛠️ Tecnologias Utilizadas

- **HTML5**: Estrutura semântica da aplicação
- **CSS3**: Estilização moderna com Flexbox/Grid
- **JavaScript (ES6+)**: Lógica de interação e manipulação de dados
- **Local Storage API**: Persistência de dados no navegador
- **GitHub Pages**: Hospedagem estática

## 📦 Instalação e Execução Local

### Pré-requisitos
- Navegador web moderno (Chrome, Firefox, Edge, etc.)
- Git instalado (opcional, para clonar o repositório)

### Passos para Execução

1. **Clone o repositório** (ou baixe os arquivos)
   ```bash
   git clone https://github.com/LeandroStanger/GerenciadorDeLista.git
   cd GerenciadorDeLista
   ```

2. **Acesse a branch v2**
   ```bash
   git checkout v2
   ```

3. **Abra o arquivo principal**
   - Navegue até a pasta do projeto
   - Abra o arquivo `index.html` em seu navegador
   - Ou utilize um servidor local como:
     ```bash
     # Com Python
     python -m http.server 8000
     
     # Com Node.js e http-server
     npx http-server
     ```

## 📁 Estrutura do Projeto

```
GerenciadorDeLista/
├── index.html          # Página principal da aplicação
├── style.css           # Estilos principais
├── script.js           # Lógica da aplicação
├── assets/             # Recursos estáticos (imagens, ícones)
│   ├── images/
│   └── icons/
├── README.md           # Este arquivo
└── .gitignore          # Arquivos ignorados pelo Git
```

## 🚀 Como Usar

1. **Adicionar um novo registro**:
   - Digite o texto no campo "Adicionar Novo Registro"
   - Clique no botão "Adicionar" ou pressione Enter

2. **Editar um registro existente**:
   - Clique no ícone de edição ao lado do item
   - Modifique o texto diretamente
   - Salve as alterações

3. **Remover um registro**:
   - Clique no ícone de exclusão ao lado do item
   - Confirme a ação se solicitado

4. **Filtrar registros** (se disponível):
   - Use o campo de busca para encontrar itens específicos

## 🔧 Desenvolvimento

### Personalização

Para modificar a aplicação:

1. **Estilos**: Edite `style.css` para alterar cores, fontes e layout
2. **Comportamento**: Modifique `script.js` para adicionar novas funcionalidades
3. **Estrutura**: Ajuste `index.html` para mudar a organização dos elementos

### Recursos Adicionais

- **Ícones**: Considere usar Font Awesome ou Material Icons
- **Animações**: Adicione transições CSS para melhorar a experiência
- **Validação**: Implemente validação de entrada no formulário

## 📄 Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para detalhes.

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📞 Suporte

Para suporte, reporte issues no [GitHub Issues](https://github.com/LeandroStanger/GerenciadorDeLista/issues) ou entre em contato através do perfil do desenvolvedor.

---

Desenvolvido por [Leandro Stanger](https://github.com/LeandroStanger)
