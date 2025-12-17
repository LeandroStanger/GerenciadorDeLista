// ========== GERENCIADOR DE REGISTROS - V3 ==========
class GerenciadorRegistros {
    constructor() {
        this.registros = JSON.parse(localStorage.getItem('registros')) || [];
        this.modoEdicao = false;
        this.indiceEdicao = null;
        this.carregandoCidades = false;
        this.filtroAtivo = '';
        this.init();
    }

    // ========== INICIALIZAÇÃO ==========
    async init() {
        document.addEventListener('DOMContentLoaded', async () => {
            await this.inicializarIBGE();
            this.inicializarBuscaCEP();
            this.atualizarLista();
            this.configurarEventos();
            this.configurarBarraBusca();
        });
    }

    // ========== BARRA DE BUSCA ==========
    configurarBarraBusca() {
        const barraBusca = document.createElement('div');
        barraBusca.className = 'barra-busca-container';
        barraBusca.innerHTML = `
            <div class="barra-busca">
                <input type="text" 
                       id="inputBusca" 
                       placeholder="Buscar por nome, email, cidade, estado, telefone..."
                       aria-label="Buscar registros">
                <button id="btnLimparBusca" type="button" title="Limpar busca">
                    ✕
                </button>
            </div>
            <div class="filtros-busca">
                <select id="filtroTipo" aria-label="Tipo de busca">
                    <option value="todos">Todos os campos</option>
                    <option value="nome">Nome</option>
                    <option value="email">E-mail</option>
                    <option value="cidade">Cidade</option>
                    <option value="estado">Estado</option>
                    <option value="telefone">Telefone</option>
                    <option value="genero">Gênero</option>
                    <option value="relacionamento">Relacionamento</option>
                </select>
                <button id="btnAplicarFiltro" class="btn-filtro">
                    🔍 Filtrar
                </button>
                <div class="contador-resultados">
                    <span id="contadorRegistros">${this.registros.length} registros</span>
                </div>
            </div>
        `;

        // Inserir antes da lista
        const listaContainer = document.querySelector('.lista-container');
        const lista = document.getElementById('saida');
        listaContainer.insertBefore(barraBusca, lista);

        // Configurar eventos da barra de busca
        this.configurarEventosBusca();
    }

    configurarEventosBusca() {
        const inputBusca = document.getElementById('inputBusca');
        const btnLimparBusca = document.getElementById('btnLimparBusca');
        const filtroTipo = document.getElementById('filtroTipo');
        const btnAplicarFiltro = document.getElementById('btnAplicarFiltro');

        // Busca em tempo real com debounce
        let timeoutBusca;
        inputBusca.addEventListener('input', (e) => {
            clearTimeout(timeoutBusca);
            timeoutBusca = setTimeout(() => {
                this.filtroAtivo = e.target.value;
                this.atualizarLista();
            }, 300);
        });

        // Enter para buscar
        inputBusca.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.filtroAtivo = e.target.value;
                this.atualizarLista();
            }
        });

        // Limpar busca
        btnLimparBusca.addEventListener('click', () => {
            inputBusca.value = '';
            this.filtroAtivo = '';
            this.atualizarLista();
            inputBusca.focus();
        });

        // Filtro por tipo
        btnAplicarFiltro.addEventListener('click', () => {
            this.filtroAtivo = inputBusca.value;
            this.atualizarLista();
        });

        // Atualizar contador quando filtro mudar
        filtroTipo.addEventListener('change', () => {
            if (this.filtroAtivo) {
                this.atualizarLista();
            }
        });
    }

    // ========== FILTRAGEM ==========
    filtrarRegistros() {
        if (!this.filtroAtivo) {
            return this.registros;
        }

        const termo = this.filtroAtivo.toLowerCase().trim();
        const tipoFiltro = document.getElementById('filtroTipo').value;

        return this.registros.filter(registro => {
            // Se o termo estiver vazio, retorna todos
            if (!termo) return true;

            // Busca em todos os campos
            if (tipoFiltro === 'todos') {
                return Object.values(registro).some(valor => {
                    if (typeof valor === 'string') {
                        return valor.toLowerCase().includes(termo);
                    }
                    return false;
                });
            }

            // Busca específica por campo
            const valorCampo = registro[tipoFiltro];
            if (!valorCampo) return false;
            
            return valorCampo.toString().toLowerCase().includes(termo);
        });
    }

    // ========== IBGE - ESTADOS E CIDADES ==========
    async inicializarIBGE() {
        const estadosSelect = document.getElementById('estados');
        
        try {
            const response = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome');
            if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
            
            const estados = await response.json();
            estadosSelect.innerHTML = '<option value="">Selecione um estado</option>';
            
            estados.forEach(estado => {
                const option = document.createElement('option');
                option.value = estado.sigla;
                option.textContent = estado.nome;
                option.dataset.id = estado.id;
                estadosSelect.appendChild(option);
            });
            
            estadosSelect.addEventListener('change', (e) => this.carregarCidades(e.target.value));
        } catch (error) {
            console.error('Erro ao carregar estados:', error);
            estadosSelect.innerHTML = '<option value="">Erro ao carregar estados</option>';
        }
    }

    async carregarCidades(siglaEstado) {
        const cidadesSelect = document.getElementById('cidades');
        
        if (!siglaEstado) {
            cidadesSelect.innerHTML = '<option value="">Selecione um estado primeiro</option>';
            cidadesSelect.disabled = true;
            return;
        }

        if (this.carregandoCidades) return;
        this.carregandoCidades = true;
        
        cidadesSelect.innerHTML = '<option value="">Carregando cidades...</option>';
        cidadesSelect.disabled = true;

        try {
            const estadoResponse = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${siglaEstado}`);
            const estadoData = await estadoResponse.json();
            
            const cidadesResponse = await fetch(
                `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estadoData.id}/municipios?orderBy=nome`
            );
            const cidades = await cidadesResponse.json();
            
            cidadesSelect.innerHTML = '<option value="">Selecione uma cidade</option>';
            cidades.forEach(cidade => {
                const option = document.createElement('option');
                option.value = cidade.nome;
                option.textContent = cidade.nome;
                option.dataset.id = cidade.id;
                cidadesSelect.appendChild(option);
            });
            
            cidadesSelect.disabled = false;
        } catch (error) {
            console.error('Erro ao carregar cidades:', error);
            cidadesSelect.innerHTML = '<option value="">Erro ao carregar cidades</option>';
        } finally {
            this.carregandoCidades = false;
        }
    }

    // ========== VIACEP - BUSCA DE ENDEREÇO ==========
    inicializarBuscaCEP() {
        const cepInput = document.getElementById('cep');
        
        // Formatação dinâmica do CEP
        cepInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 5) {
                value = value.substring(0, 5) + '-' + value.substring(5, 8);
            }
            e.target.value = value;
        });
        
        // Debounce para evitar múltiplas requisições
        let debounceTimer;
        cepInput.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => this.buscarEnderecoPorCEP(), 800);
        });
    }

    async buscarEnderecoPorCEP() {
        const cepInput = document.getElementById('cep');
        const cep = cepInput.value.replace(/\D/g, '');
        
        if (cep.length !== 8) return;
        
        cepInput.classList.add('cep-buscando');
        
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            if (!response.ok) throw new Error('Erro na requisição');
            
            const endereco = await response.json();
            if (endereco.erro) throw new Error('CEP não encontrado');
            
            this.preencherEndereco(endereco);
        } catch (error) {
            this.mostrarNotificacao('CEP não encontrado. Verifique o número.', 'erro');
        } finally {
            cepInput.classList.remove('cep-buscando');
        }
    }

    preencherEndereco(endereco) {
        document.getElementById('logradouro').value = endereco.logradouro || '';
        document.getElementById('bairro').value = endereco.bairro || '';
        
        // Sincronizar com selects
        const estadoSelect = document.getElementById('estados');
        const estadoOption = Array.from(estadoSelect.options).find(
            opt => opt.value === endereco.uf
        );
        
        if (estadoOption) {
            estadoSelect.value = endereco.uf;
            
            // Aguardar carregamento das cidades
            setTimeout(() => {
                const cidadeSelect = document.getElementById('cidades');
                const cidadeOption = Array.from(cidadeSelect.options).find(
                    opt => opt.textContent.toLowerCase() === endereco.localidade.toLowerCase()
                );
                
                if (cidadeOption) cidadeSelect.value = cidadeOption.value;
            }, 600);
        }
    }

    // ========== LISTA DE REGISTROS ==========
    atualizarLista() {
        const lista = document.getElementById('saida');
        lista.innerHTML = '';
        
        const registrosFiltrados = this.filtrarRegistros();
        const totalRegistros = this.registros.length;
        const registrosExibidos = registrosFiltrados.slice(0, 100); // Aumentado para 100
        
        // Atualizar contador
        const contador = document.getElementById('contadorRegistros');
        if (contador) {
            if (this.filtroAtivo && registrosFiltrados.length !== totalRegistros) {
                contador.textContent = `${registrosFiltrados.length} de ${totalRegistros} registros`;
                contador.classList.add('filtro-ativo');
            } else {
                contador.textContent = `${totalRegistros} registros`;
                contador.classList.remove('filtro-ativo');
            }
        }
        
        if (registrosFiltrados.length === 0) {
            const mensagem = this.filtroAtivo 
                ? `Nenhum registro encontrado para "${this.escapeHTML(this.filtroAtivo)}"`
                : 'Nenhum registro cadastrado ainda. Adicione o primeiro!';
            
            lista.innerHTML = `<div class="sem-registros">${mensagem}</div>`;
            return;
        }
        
        registrosExibidos.forEach((registro, index) => {
            // Encontrar índice real no array original
            const indiceReal = this.registros.findIndex(r => 
                r.dataCadastro === registro.dataCadastro && 
                r.nome === registro.nome
            );
            
            const divRegistro = this.criarElementoRegistro(registro, indiceReal);
            lista.appendChild(divRegistro);
        });
        
        if (registrosFiltrados.length > 100) {
            const aviso = document.createElement('div');
            aviso.className = 'aviso-limitacao';
            aviso.innerHTML = `
                Mostrando 100 de ${registrosFiltrados.length} registros.
                ${this.filtroAtivo ? 'Refine sua busca para ver mais resultados.' : ''}
            `;
            lista.appendChild(aviso);
        }
    }

    criarElementoRegistro(registro, index) {
        const divRegistro = document.createElement('div');
        divRegistro.className = 'registro';
        divRegistro.dataset.index = index;
        
        // Destacar termo de busca se houver
        const conteudo = this.destacarTermoBusca(registro);
        
        // Informações
        const divInfo = document.createElement('div');
        divInfo.className = 'registro-info';
        
        divInfo.innerHTML = `
            <div class="registro-nome">${conteudo.nome}</div>
            <div class="registro-detalhes">${conteudo.detalhesPessoais}</div>
            <div class="registro-detalhes">${conteudo.relacionamento}</div>
            <div class="registro-detalhes">${conteudo.contato}</div>
            <div class="registro-endereco">
                <div class="registro-detalhes"><strong>📍 Endereço:</strong></div>
                <div class="registro-detalhes">${conteudo.endereco}</div>
                <div class="registro-detalhes">${conteudo.cidadeEstado}</div>
                ${conteudo.complemento}
            </div>
            <div class="registro-data">Cadastrado em: ${registro.dataCadastro}</div>
        `;
        
        // Ações
        const divAcoes = document.createElement('div');
        divAcoes.className = 'registro-acoes';
        
        const btnEditar = this.criarBotao('✏️ Editar', 'btn-editar', () => this.editarRegistro(index));
        const btnRemover = this.criarBotao('🗑️ Remover', 'btn-remover', () => this.removerRegistro(index));
        
        divAcoes.appendChild(btnEditar);
        divAcoes.appendChild(btnRemover);
        
        divRegistro.appendChild(divInfo);
        divRegistro.appendChild(divAcoes);
        
        return divRegistro;
    }

    destacarTermoBusca(registro) {
        if (!this.filtroAtivo) {
            return {
                nome: this.escapeHTML(registro.nome),
                detalhesPessoais: `Idade: ${registro.idade} anos | Gênero: ${this.escapeHTML(registro.genero)}`,
                relacionamento: `Status: ${this.escapeHTML(registro.relacionamento)}`,
                contato: `E-mail: ${this.escapeHTML(registro.email)} | Telefone: ${registro.telefone}`,
                endereco: `${this.escapeHTML(registro.logradouro)} - N°: ${registro.numberHome}, ${this.escapeHTML(registro.bairro)}`,
                cidadeEstado: `${this.escapeHTML(registro.cidade)} - ${registro.estado}, CEP: ${registro.cep}`,
                complemento: registro.complemento ? 
                    `<div class="registro-detalhes">Complemento: ${this.escapeHTML(registro.complemento)}</div>` : ''
            };
        }
        
        const termo = this.filtroAtivo.toLowerCase();
        const tipoFiltro = document.getElementById('filtroTipo').value;
        
        const destacar = (texto, campo) => {
            if (!texto) return texto;
            if (tipoFiltro !== 'todos' && tipoFiltro !== campo) return this.escapeHTML(texto);
            
            const textoLower = texto.toString().toLowerCase();
            const indice = textoLower.indexOf(termo);
            
            if (indice === -1) return this.escapeHTML(texto);
            
            const antes = texto.substring(0, indice);
            const match = texto.substring(indice, indice + termo.length);
            const depois = texto.substring(indice + termo.length);
            
            return `${this.escapeHTML(antes)}<span class="destaque-busca">${this.escapeHTML(match)}</span>${this.escapeHTML(depois)}`;
        };
        
        return {
            nome: destacar(registro.nome, 'nome'),
            detalhesPessoais: `Idade: ${registro.idade} anos | Gênero: ${destacar(registro.genero, 'genero')}`,
            relacionamento: `Status: ${destacar(registro.relacionamento, 'relacionamento')}`,
            contato: `E-mail: ${destacar(registro.email, 'email')} | Telefone: ${destacar(registro.telefone, 'telefone')}`,
            endereco: `${destacar(registro.logradouro, 'logradouro')} - N°: ${registro.numberHome}, ${destacar(registro.bairro, 'bairro')}`,
            cidadeEstado: `${destacar(registro.cidade, 'cidade')} - ${destacar(registro.estado, 'estado')}, CEP: ${registro.cep}`,
            complemento: registro.complemento ? 
                `<div class="registro-detalhes">Complemento: ${destacar(registro.complemento, 'complemento')}</div>` : ''
        };
    }

    // ========== CRUD OPERAÇÕES ==========
    editarRegistro(index) {
        this.modoEdicao = true;
        this.indiceEdicao = index;
        const registro = this.registros[index];
        
        // Preencher formulário
        const campos = ['nome', 'email', 'idade', 'genero', 'relacionamento', 
                       'telefone', 'cep', 'logradouro', 'numberHome', 'bairro', 'complemento'];
        
        campos.forEach(campo => {
            const element = document.getElementById(campo);
            if (element) element.value = registro[campo] || '';
        });
        
        // Estados e cidades
        if (registro.estado) {
            const estadosSelect = document.getElementById('estados');
            estadosSelect.value = registro.estado;
            
            this.carregarCidades(registro.estado).then(() => {
                const cidadeSelect = document.getElementById('cidades');
                cidadeSelect.value = registro.cidade;
            });
        }
        
        // Atualizar UI
        document.getElementById('addBtn').textContent = 'Atualizar Registro';
        document.getElementById('nome').scrollIntoView({ behavior: 'smooth' });
        
        this.mostrarNotificacao('Modo edição ativado. Atualize os campos e clique em "Atualizar Registro".', 'info');
    }

    removerRegistro(index) {
        if (!confirm('Tem certeza que deseja remover este registro?')) return;
        
        this.registros.splice(index, 1);
        this.salvarLocalStorage();
        this.atualizarLista();
        this.mostrarNotificacao('Registro removido com sucesso!', 'sucesso');
    }

    async salvarRegistro() {
        // Coletar dados
        const dados = this.coletarDadosFormulario();
        
        // Validar
        const validacao = this.validarDados(dados);
        if (!validacao.valido) {
            this.mostrarNotificacao(validacao.mensagem, 'erro');
            return;
        }
        
        // Preparar registro
        const registro = {
            ...dados,
            dataCadastro: new Date().toLocaleString('pt-BR')
        };
        
        // Salvar ou atualizar
        if (this.modoEdicao && this.indiceEdicao !== null) {
            this.registros[this.indiceEdicao] = registro;
            this.mostrarNotificacao('Registro atualizado com sucesso!', 'sucesso');
        } else {
            this.registros.unshift(registro); // Adiciona no início
            this.mostrarNotificacao('Registro adicionado com sucesso!', 'sucesso');
        }
        
        // Persistir e limpar
        this.salvarLocalStorage();
        this.limparFormulario();
        this.atualizarLista();
        this.modoEdicao = false;
        this.indiceEdicao = null;
    }

    // ========== VALIDAÇÃO ==========
    coletarDadosFormulario() {
        return {
            nome: document.getElementById('nome').value.trim(),
            email: document.getElementById('email').value.trim(),
            idade: document.getElementById('idade').value.trim(),
            genero: document.getElementById('genero').value,
            relacionamento: document.getElementById('relacionamento').value,
            telefone: document.getElementById('telefone').value.trim(),
            cep: document.getElementById('cep').value.trim(),
            estado: document.getElementById('estados').value,
            cidade: document.getElementById('cidades').value,
            logradouro: document.getElementById('logradouro').value.trim(),
            numberHome: document.getElementById('numberHome').value.trim(),
            bairro: document.getElementById('bairro').value.trim(),
            complemento: document.getElementById('complemento').value.trim()
        };
    }

    validarDados(dados) {
        // Campos obrigatórios
        const camposObrigatorios = ['nome', 'email', 'idade', 'genero', 'relacionamento', 
                                   'telefone', 'cep', 'estado', 'cidade', 'logradouro', 
                                   'numberHome', 'bairro'];
        
        for (const campo of camposObrigatorios) {
            if (!dados[campo]) {
                return { valido: false, mensagem: `O campo "${campo}" é obrigatório!` };
            }
        }
        
        // Validações específicas
        if (isNaN(dados.idade) || dados.idade < 0 || dados.idade > 120) {
            return { valido: false, mensagem: 'Idade inválida! Deve ser entre 0 e 120 anos.' };
        }
        
        if (!this.validarEmail(dados.email)) {
            return { valido: false, mensagem: 'E-mail inválido!' };
        }
        
        if (!this.validarTelefone(dados.telefone)) {
            return { valido: false, mensagem: 'Telefone inválido! Use o formato (99) 99999-9999.' };
        }
        
        if (!this.validarCEP(dados.cep)) {
            return { valido: false, mensagem: 'CEP inválido! Use o formato 99999-999.' };
        }
        
        return { valido: true, mensagem: '' };
    }

    validarEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    validarTelefone(telefone) {
        const numeros = telefone.replace(/\D/g, '');
        return numeros.length >= 10 && numeros.length <= 11;
    }

    validarCEP(cep) {
        const numeros = cep.replace(/\D/g, '');
        return numeros.length === 8;
    }

    // ========== UTILIDADES ==========
    limparFormulario() {
        const formulario = document.getElementById('nome').form;
        formulario.reset();
        
        document.getElementById('cidades').innerHTML = '<option value="">Selecione um estado primeiro</option>';
        document.getElementById('cidades').disabled = true;
        
        document.getElementById('addBtn').textContent = 'Adicionar Registro';
        this.modoEdicao = false;
        this.indiceEdicao = null;
    }

    salvarLocalStorage() {
        try {
            localStorage.setItem('registros', JSON.stringify(this.registros));
        } catch (error) {
            console.error('Erro ao salvar no LocalStorage:', error);
            this.mostrarNotificacao('Erro ao salvar dados! O LocalStorage pode estar cheio.', 'erro');
            
            // Limpar registros antigos se o localStorage estiver cheio
            if (error.name === 'QuotaExceededError') {
                this.registros = this.registros.slice(0, 100); // Mantém apenas os 100 mais recentes
                localStorage.setItem('registros', JSON.stringify(this.registros));
            }
        }
    }

    mostrarNotificacao(mensagem, tipo = 'info') {
        // Remove notificações antigas
        const notificacoesAntigas = document.querySelectorAll('.notificacao');
        notificacoesAntigas.forEach(n => n.remove());
        
        // Cria nova notificação
        const notificacao = document.createElement('div');
        notificacao.className = `notificacao notificacao-${tipo}`;
        notificacao.textContent = mensagem;
        
        // Estilos inline
        Object.assign(notificacao.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '15px 20px',
            borderRadius: '8px',
            color: 'white',
            fontWeight: 'bold',
            zIndex: '1000',
            animation: 'slideIn 0.3s ease-out',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        });
        
        // Cores por tipo
        const cores = {
            sucesso: '#27ae60',
            erro: '#e74c3c',
            info: '#3498db',
            aviso: '#f39c12'
        };
        
        notificacao.style.backgroundColor = cores[tipo] || '#3498db';
        
        document.body.appendChild(notificacao);
        
        // Remove após 3 segundos
        setTimeout(() => {
            notificacao.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notificacao.remove(), 300);
        }, 3000);
    }

    escapeHTML(texto) {
        const div = document.createElement('div');
        div.textContent = texto;
        return div.innerHTML;
    }

    criarBotao(texto, classe, callback) {
        const botao = document.createElement('button');
        botao.className = classe;
        botao.textContent = texto;
        botao.addEventListener('click', callback);
        return botao;
    }

    // ========== CONFIGURAÇÃO DE EVENTOS ==========
    configurarEventos() {
        // Botão principal
        document.getElementById('addBtn').addEventListener('click', () => this.salvarRegistro());
        
        // Enter para salvar (exceto em complemento)
        document.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && e.target.id !== 'complemento') {
                e.preventDefault();
                this.salvarRegistro();
            }
        });
        
        // Máscara de telefone
        const telefoneInput = document.getElementById('telefone');
        telefoneInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length > 10) {
                value = value.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
            } else if (value.length > 6) {
                value = value.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
            } else if (value.length > 2) {
                value = value.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
            } else if (value.length > 0) {
                value = value.replace(/^(\d*)/, '($1');
            }
            
            e.target.value = value;
        });
        
        // Botão para limpar formulário
        const btnLimpar = document.createElement('button');
        btnLimpar.textContent = 'Limpar Formulário';
        btnLimpar.className = 'btn-limpar';
        btnLimpar.type = 'button';
        btnLimpar.addEventListener('click', () => this.limparFormulario());
        
        document.querySelector('.form-container').appendChild(btnLimpar);
        
        // Botão para exportar dados
        const btnExportar = document.createElement('button');
        btnExportar.textContent = 'Exportar Dados';
        btnExportar.className = 'btn-exportar';
        btnExportar.type = 'button';
        btnExportar.addEventListener('click', () => this.exportarDados());
        
        document.querySelector('.lista-container').insertBefore(
            btnExportar,
            document.querySelector('.lista-container h2').nextSibling
        );
    }
    
    // ========== EXPORTAÇÃO DE DADOS ==========
    exportarDados() {
        if (this.registros.length === 0) {
            this.mostrarNotificacao('Não há dados para exportar!', 'aviso');
            return;
        }
        
        const dataStr = JSON.stringify(this.registros, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `registros_${new Date().toISOString().slice(0,10)}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        
        this.mostrarNotificacao(`Dados exportados com sucesso! ${this.registros.length} registros.`, 'sucesso');
    }
}

// Inicializar a aplicação
const app = new GerenciadorRegistros();