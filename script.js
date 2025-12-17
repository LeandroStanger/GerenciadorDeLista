let registros = JSON.parse(localStorage.getItem('registros')) || [];
let modoEdicao = false;
let indiceEdicao = null;

// ========== INICIALIZAÇÃO DA APLICAÇÃO ==========
function inicializarIBGE() {
    const urlEstados = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome';
    const estadosSelect = document.getElementById('estados');
    const cidadesSelect = document.getElementById('cidades');

    window.addEventListener('DOMContentLoaded', async () => {
        try {
            const response = await fetch(urlEstados);
            if (!response.ok) throw new Error(`Erro HTTP! status: ${response.status}`);
            const estados = await response.json();

            estadosSelect.innerHTML = '<option value="">Selecione um estado</option>';
            estados.forEach(estado => {
                const option = document.createElement('option');
                option.value = estado.sigla;
                option.textContent = estado.nome;
                option.setAttribute('data-id', estado.id);
                estadosSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Erro ao carregar estados:', error);
            estadosSelect.innerHTML = '<option value="">Erro ao carregar estados</option>';
        }
    });

    estadosSelect.addEventListener('change', async function () {
        const siglaEstado = this.value;

        cidadesSelect.innerHTML = '<option value="">Carregando cidades...</option>';
        cidadesSelect.disabled = true;

        if (!siglaEstado) {
            cidadesSelect.innerHTML = '<option value="">Selecione um estado primeiro</option>';
            return;
        }

        try {
            const estadoResponse = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${siglaEstado}`);
            const estadoData = await estadoResponse.json();
            const estadoId = estadoData.id;

            const cidadesResponse = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estadoId}/municipios?orderBy=nome`);
            const cidades = await cidadesResponse.json();

            cidadesSelect.innerHTML = '<option value="">Selecione uma cidade</option>';
            cidades.forEach(cidade => {
                const option = document.createElement('option');
                option.value = cidade.nome;
                option.textContent = cidade.nome;
                option.setAttribute('data-id', cidade.id);
                cidadesSelect.appendChild(option);
            });
            cidadesSelect.disabled = false;
        } catch (error) {
            console.error('Erro ao carregar cidades:', error);
            cidadesSelect.innerHTML = '<option value="">Erro ao carregar cidades</option>';
        }
    });
}

// ========== INTEGRAÇÃO COM VIACEP ==========
function inicializarBuscaCEP() {
    const cepInput = document.getElementById('cep');
    
    // Formatar CEP enquanto digita (99999-999)
    cepInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 5) {
            value = value.substring(0,5) + '-' + value.substring(5,8);
        }
        e.target.value = value;
    });
    
    // Buscar endereço quando o campo perde o foco
    cepInput.addEventListener('blur', async function() {
        const cep = this.value.replace(/\D/g, '');
        
        if (cep.length !== 8) {
            if (cep.length > 0) {
                alert('CEP deve conter 8 dígitos. Formato: 99999-999');
            }
            return;
        }
        
        // Adicionar efeito visual de carregamento
        this.classList.add('cep-buscando');
        
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            if (!response.ok) throw new Error(`Erro HTTP! status: ${response.status}`);
            
            const endereco = await response.json();
            
            if (endereco.erro) {
                throw new Error('CEP não encontrado');
            }
            
            // Preencher campos com os dados da ViaCEP
            document.getElementById('logradouro').value = endereco.logradouro || '';
            document.getElementById('bairro').value = endereco.bairro || '';
            
            // Sincronizar com os selects de estado/cidade
            const estadoSelect = document.getElementById('estados');
            const cidadeSelect = document.getElementById('cidades');
            
            // Encontrar e selecionar o estado
            const opcaoEstado = Array.from(estadoSelect.options).find(
                opt => opt.value === endereco.uf
            );
            
            if (opcaoEstado) {
                estadoSelect.value = endereco.uf;
                
                // Disparar evento para carregar cidades
                estadoSelect.dispatchEvent(new Event('change'));
                
                // Aguardar carregamento das cidades e selecionar a correta
                setTimeout(() => {
                    const opcaoCidade = Array.from(cidadeSelect.options).find(
                        opt => opt.textContent.toUpperCase() === endereco.localidade.toUpperCase()
                    );
                    
                    if (opcaoCidade) {
                        cidadeSelect.value = opcaoCidade.value;
                    } else {
                        // Se a cidade não estiver na lista, permite digitar?
                        console.warn(`Cidade ${endereco.localidade} não encontrada na lista do IBGE para ${endereco.uf}`);
                    }
                }, 800);
            }
            
        } catch (error) {
            console.error('Erro ao buscar CEP:', error);
            alert('Não foi possível encontrar o endereço para este CEP. Verifique se o CEP está correto.');
        } finally {
            // Remover efeito visual de carregamento
            this.classList.remove('cep-buscando');
        }
    });
}

// ========== ATUALIZAÇÃO DA LISTA ==========
function atualizarLista() {
    let lista = document.getElementById('saida');
    lista.innerHTML = '';

    if (registros.length === 0) {
        lista.innerHTML = '<div class="sem-registros">Nenhum registro cadastrado ainda. Adicione o primeiro!</div>';
        return;
    }

    registros.forEach((registro, index) => {
        let divRegistro = document.createElement('div');
        divRegistro.className = 'registro';
        divRegistro.setAttribute('data-index', index);

        // Informações do registro
        let divInfo = document.createElement('div');
        divInfo.className = 'registro-info';

        let nome = document.createElement('div');
        nome.className = 'registro-nome';
        nome.textContent = registro.nome;

        // Detalhes pessoais
        let detalhesPessoais = document.createElement('div');
        detalhesPessoais.className = 'registro-detalhes';
        detalhesPessoais.textContent = `Idade: ${registro.idade} anos | Gênero: ${registro.genero}`;

        let detalhesRelacionamento = document.createElement('div');
        detalhesRelacionamento.className = 'registro-detalhes';
        detalhesRelacionamento.textContent = `Status de relacionamento: ${registro.relacionamento}`;

        let detalhesContato = document.createElement('div');
        detalhesContato.className = 'registro-detalhes';
        detalhesContato.textContent = `E-mail: ${registro.email} | Telefone: ${registro.telefone}`;

        // Seção de endereço
        let divEndereco = document.createElement('div');
        divEndereco.className = 'registro-endereco';
        
        let enderecoTitulo = document.createElement('div');
        enderecoTitulo.className = 'registro-detalhes';
        enderecoTitulo.innerHTML = `<strong>📍 Endereço:</strong>`;
        
        let enderecoDetalhes = document.createElement('div');
        enderecoDetalhes.className = 'registro-detalhes';
        enderecoDetalhes.textContent = `${registro.logradouro} - N°: ${registro.numberHome}, ${registro.bairro}`;
        
        let enderecoCidade = document.createElement('div');
        enderecoCidade.className = 'registro-detalhes';
        enderecoCidade.textContent = `${registro.cidade} - ${registro.estado}, CEP: ${registro.cep}`;
        
        if (registro.complemento) {
            let enderecoComplemento = document.createElement('div');
            enderecoComplemento.className = 'registro-detalhes';
            enderecoComplemento.textContent = `Complemento: ${registro.complemento}`;
            divEndereco.appendChild(enderecoComplemento);
        }
        
        divEndereco.appendChild(enderecoTitulo);
        divEndereco.appendChild(enderecoDetalhes);
        divEndereco.appendChild(enderecoCidade);

        // Data de cadastro
        let dataCadastro = document.createElement('div');
        dataCadastro.className = 'registro-detalhes';
        dataCadastro.style.fontSize = '0.85rem';
        dataCadastro.style.color = '#95a5a6';
        dataCadastro.style.marginTop = '10px';
        dataCadastro.textContent = `Cadastrado em: ${registro.dataCadastro}`;

        // Montar informações
        divInfo.appendChild(nome);
        divInfo.appendChild(detalhesPessoais);
        divInfo.appendChild(detalhesRelacionamento);
        divInfo.appendChild(detalhesContato);
        divInfo.appendChild(divEndereco);
        divInfo.appendChild(dataCadastro);

        // Botões de ação
        let divAcoes = document.createElement('div');
        divAcoes.className = 'registro-acoes';

        let btnEditar = document.createElement('button');
        btnEditar.className = 'btn-editar';
        btnEditar.textContent = '✏️ Editar';
        btnEditar.addEventListener('click', () => editarRegistro(index));

        let btnRemover = document.createElement('button');
        btnRemover.className = 'btn-remover';
        btnRemover.textContent = '🗑️ Remover';
        btnRemover.addEventListener('click', () => removerRegistro(index));

        divAcoes.appendChild(btnEditar);
        divAcoes.appendChild(btnRemover);

        // Montar registro completo
        divRegistro.appendChild(divInfo);
        divRegistro.appendChild(divAcoes);

        lista.appendChild(divRegistro);
    });
}

// ========== EDIÇÃO DE REGISTRO ==========
function editarRegistro(index) {
    modoEdicao = true;
    indiceEdicao = index;
    let registro = registros[index];

    // Preencher campos do formulário
    document.getElementById('nome').value = registro.nome;
    document.getElementById('email').value = registro.email;
    document.getElementById('idade').value = registro.idade;
    document.getElementById('genero').value = registro.genero;
    document.getElementById('relacionamento').value = registro.relacionamento;
    document.getElementById('telefone').value = registro.telefone;
    
    // Preencher campos de endereço
    document.getElementById('cep').value = registro.cep;
    document.getElementById('logradouro').value = registro.logradouro;
    document.getElementById('numberHome').value = registro.numberHome;
    document.getElementById('bairro').value = registro.bairro;
    document.getElementById('complemento').value = registro.complemento || '';

    // Sincronizar estado/cidade
    if (registro.estado) {
        const estadosSelect = document.getElementById('estados');
        const estadoOption = Array.from(estadosSelect.options).find(
            opt => opt.value === registro.estado
        );
        
        if (estadoOption) {
            estadosSelect.value = registro.estado;
            estadosSelect.dispatchEvent(new Event('change'));

            setTimeout(() => {
                const cidadesSelect = document.getElementById('cidades');
                const cidadeOption = Array.from(cidadesSelect.options).find(
                    opt => opt.value === registro.cidade
                );
                
                if (cidadeOption) {
                    cidadesSelect.value = registro.cidade;
                }
            }, 500);
        }
    }

    // Alterar botão para modo edição
    document.getElementById('addBtn').textContent = 'Atualizar Registro';
    document.getElementById('nome').scrollIntoView({ behavior: 'smooth' });
}

// ========== REMOÇÃO DE REGISTRO ==========
function removerRegistro(index) {
    let confirmacao = confirm('Tem certeza que deseja remover este registro?');

    if (confirmacao) {
        registros.splice(index, 1);
        localStorage.setItem('registros', JSON.stringify(registros));
        atualizarLista();
        alert('✅ Registro removido com sucesso!');
    }
}

// ========== SALVAR REGISTRO ==========
function salvarRegistro() {
    // Obter valores dos campos
    let nome = document.getElementById('nome').value.trim();
    let email = document.getElementById('email').value.trim();
    let idade = document.getElementById('idade').value.trim();
    let genero = document.getElementById('genero').value;
    let relacionamento = document.getElementById('relacionamento').value;
    let telefone = document.getElementById('telefone').value.trim();
    let cep = document.getElementById('cep').value.trim();
    let estado = document.getElementById('estados').value;
    let cidade = document.getElementById('cidades').value;
    let logradouro = document.getElementById('logradouro').value.trim();
    let numberHome = document.getElementById('numberHome').value.trim();
    let bairro = document.getElementById('bairro').value.trim();
    let complemento = document.getElementById('complemento').value.trim();

    // Validações
    if (!nome || !email || !idade || !genero || !relacionamento || !telefone || 
        !cep || !estado || !cidade || !logradouro || !numberHome || !bairro) {
        alert('⚠️ Por favor, preencha todos os campos obrigatórios!');
        return;
    }

    if (isNaN(idade) || idade < 0 || idade > 120) {
        alert('⚠️ Por favor, insira uma idade válida (0-120)!');
        return;
    }

    // Validar formato do CEP
    const cepNumerico = cep.replace(/\D/g, '');
    if (cepNumerico.length !== 8) {
        alert('⚠️ Por favor, insira um CEP válido com 8 dígitos!');
        return;
    }

    // Criar objeto do registro
    const registro = {
        nome: nome,
        email: email,
        idade: idade,
        genero: genero,
        relacionamento: relacionamento,
        telefone: telefone,
        cep: cep,
        estado: estado,
        cidade: cidade,
        logradouro: logradouro,
        numberHome: numberHome,
        bairro: bairro,
        complemento: complemento,
        dataCadastro: new Date().toLocaleString('pt-BR')
    };

    // Salvar ou atualizar
    if (modoEdicao && indiceEdicao !== null) {
        registros[indiceEdicao] = registro;
        alert('✅ Registro atualizado com sucesso!');
    } else {
        registros.push(registro);
        alert('✅ Registro adicionado com sucesso!');
    }

    // Salvar no LocalStorage e atualizar interface
    localStorage.setItem('registros', JSON.stringify(registros));
    limparFormulario();
    atualizarLista();
    modoEdicao = false;
    indiceEdicao = null;
}

// ========== LIMPAR FORMULÁRIO ==========
function limparFormulario() {
    document.getElementById('nome').value = '';
    document.getElementById('email').value = '';
    document.getElementById('idade').value = '';
    document.getElementById('genero').selectedIndex = 0;
    document.getElementById('relacionamento').selectedIndex = 0;
    document.getElementById('telefone').value = '';
    document.getElementById('cep').value = '';
    document.getElementById('estados').selectedIndex = 0;
    document.getElementById('cidades').innerHTML = '<option value="">Selecione um estado primeiro</option>';
    document.getElementById('cidades').disabled = true;
    document.getElementById('logradouro').value = '';
    document.getElementById('numberHome').value = '';
    document.getElementById('bairro').value = '';
    document.getElementById('complemento').value = '';
    
    document.getElementById('addBtn').textContent = 'Adicionar Registro';
    modoEdicao = false;
    indiceEdicao = null;
}

// ========== INICIALIZAÇÃO DA APLICAÇÃO ==========
document.addEventListener('DOMContentLoaded', function () {
    // Inicializar todas as funcionalidades
    inicializarIBGE();
    inicializarBuscaCEP();
    atualizarLista();
    
    // Configurar botão de adicionar/atualizar
    document.getElementById('addBtn').addEventListener('click', salvarRegistro);
    
    // Permitir salvar com Enter em qualquer campo
    document.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            // Evitar submissão se estiver em campo de complemento (opcional)
            if (e.target.id !== 'complemento') {
                salvarRegistro();
            }
        }
    });
    
    // Adicionar máscara para telefone (opcional)
    const telefoneInput = document.getElementById('telefone');
    telefoneInput.addEventListener('input', function(e) {
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
});