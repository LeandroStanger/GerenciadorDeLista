# Gerenciador de Lista - v2.5

Uma aplicação web moderna para gerenciamento de registros com endereço completo, permitindo adicionar, editar e remover registros com uma interface intuitiva.

**Acesso Online:** [https://leandrostanger.github.io/GerenciadorDeLista/](https://leandrostanger.github.io/GerenciadorDeLista/)

## ✨ Novas Funcionalidades (v2.5)

- **Endereço Completo**: Campos para CEP, logradouro (rua), bairro, complemento
- **Busca Automática por CEP**: Integração com API ViaCEP para preenchimento automático
- **Formatação de CEP**: Máscara automática (99999-999)
- **Sincronização IBGE/ViaCEP**: Estados e cidades sincronizados com dados do CEP
- **Exibição Aprimorada**: Seção dedicada para endereço nos registros

## 🛠️ Funcionalidades Existentes

- **Adição de Registros**: Insira novos itens na lista através de um formulário completo
- **Edição em Tempo Real**: Modifique registros existentes diretamente na lista
- **Exclusão de Itens**: Remova registros individualmente com confirmação
- **Interface Responsiva**: Design adaptável para diferentes tamanhos de tela
- **Armazenamento Local**: Os dados são persistidos no navegador do usuário
- **Feedback Visual**: Notificações visuais para ações realizadas
- **Integração com IBGE**: Listas de estados e cidades do Brasil atualizadas

## 🗺️ APIs Utilizadas

- **ViaCEP API**: Para busca de endereços por CEP (gratuita)
- **IBGE API**: Para listas de estados e cidades brasileiras
- **Local Storage API**: Para persistência de dados no navegador

## 🛠️ Tecnologias Utilizadas

- **HTML5**: Estrutura semântica da aplicação
- **CSS3**: Estilização moderna com Flexbox/Grid
- **JavaScript (ES6+)**: Lógica de interação e manipulação de dados
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

2. **Execute a aplicação**
   - Abra o arquivo `index.html` diretamente no navegador
   - Ou utilize um servidor local:
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
├── script.js           # Lógica da aplicação (IBGE + ViaCEP)
├── README.md           # Este arquivo
└── (assets/)           # Recursos estáticos (se houver)
```

## 🚀 Como Usar

### 1. Adicionar um novo registro:
   - Preencha todos os campos do formulário
   - Para endereço, digite o CEP e os demais campos serão preenchidos automaticamente
   - Clique em "Adicionar Registro" ou pressione Enter

### 2. Busca automática por CEP:
   - Digite um CEP válido (ex: 01001-000) no campo CEP
   - Mude para outro campo (perca o foco) ou aguarde
   - Os campos de rua, bairro, cidade e estado serão preenchidos automaticamente

### 3. Editar um registro existente:
   - Clique no botão "✏️ Editar" ao lado do registro
   - Modifique os dados no formulário
   - Clique em "Atualizar Registro"

### 4. Remover um registro:
   - Clique no botão "🗑️ Remover" ao lado do item
   - Confirme a ação se solicitado

## 🔧 Desenvolvimento

### Personalização

Para modificar a aplicação:

1. **Estilos**: Edite `style.css` para alterar cores, fontes e layout
2. **Comportamento**: Modifique `script.js` para adicionar novas funcionalidades
3. **Estrutura**: Ajuste `index.html` para mudar a organização dos elementos

### Recursos Adicionais Sugeridos

- **Validação Avançada**: Implementar validação em tempo real nos campos
- **Busca/Filtro**: Adicionar funcionalidade de busca na lista de registros
- **Exportação**: Permitir exportar registros para CSV ou PDF
- **Backup**: Sistema de backup dos dados no LocalStorage

## ⚠️ Limitações Conhecidas

1. **Dependência de Internet**: Requer conexão para carregar estados/cidades e buscar CEPs
2. **ViaCEP Limitações**: Alguns CEPs novos ou rurais podem não retornar dados completos
3. **IBGE Sincronização**: A sincronização entre ViaCEP e IBGE pode falhar para cidades com nomes diferentes

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
```