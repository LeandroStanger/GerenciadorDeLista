 let registros = JSON.parse(localStorage.getItem('registros')) || [];
        let modoEdicao = false;
        let indiceEdicao = null;

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

            estadosSelect.addEventListener('change', async function() {
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
                
                let divInfo = document.createElement('div');
                divInfo.className = 'registro-info';
                
                let nome = document.createElement('div');
                nome.className = 'registro-nome';
                nome.textContent = registro.nome;
                
                let detalhes = document.createElement('div');
                detalhes.className = 'registro-detalhes';
                detalhes.textContent = `📧 ${registro.email} | 🎂 ${registro.idade} anos | 👫 ${registro.genero} | 👩‍❤️‍💋‍👨 ${registro.relacionamento} | 📍 ${registro.estado} - ${registro.cidade} | 📞 ${registro.telefone}`;
                
                divInfo.appendChild(nome);
                divInfo.appendChild(detalhes);
                
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
                
                divRegistro.appendChild(divInfo);
                divRegistro.appendChild(divAcoes);
                
                lista.appendChild(divRegistro);
            });
        }

        function editarRegistro(index) {
            modoEdicao = true;
            indiceEdicao = index;
            let registro = registros[index];
            
            document.getElementById('nome').value = registro.nome;
            document.getElementById('email').value = registro.email;
            document.getElementById('idade').value = registro.idade;
            document.getElementById('genero').value = registro.genero;
            document.getElementById('relacionamento').value = registro.relacionamento;
            document.getElementById('telefone').value = registro.telefone;
            
            if (registro.estado) {
                const estadosSelect = document.getElementById('estados');
                const estadoOption = Array.from(estadosSelect.options).find(opt => opt.value === registro.estado);
                if (estadoOption) {
                    estadosSelect.value = registro.estado;
                    estadosSelect.dispatchEvent(new Event('change'));
                    
                    setTimeout(() => {
                        const cidadesSelect = document.getElementById('cidades');
                        const cidadeOption = Array.from(cidadesSelect.options).find(opt => opt.value === registro.cidade);
                        if (cidadeOption) {
                            cidadesSelect.value = registro.cidade;
                        }
                    }, 500);
                }
            }
            
            document.getElementById('addBtn').textContent = 'Atualizar Registro';
            
            document.getElementById('nome').scrollIntoView({ behavior: 'smooth' });
        }

        function removerRegistro(index) {
            let confirmacao = confirm('Tem certeza que deseja remover este registro?');
            
            if (confirmacao) {
                registros.splice(index, 1);
                localStorage.setItem('registros', JSON.stringify(registros));
                atualizarLista();
                alert('✅ Registro removido com sucesso!');
            }
        }

        function salvarRegistro() {
            let nome = document.getElementById('nome').value.trim();
            let email = document.getElementById('email').value.trim();
            let idade = document.getElementById('idade').value.trim();
            let genero = document.getElementById('genero').value;
            let relacionamento = document.getElementById('relacionamento').value;
            let telefone = document.getElementById('telefone').value.trim();
            let estadoSelect = document.getElementById('estados');
            let cidadeSelect = document.getElementById('cidades');
            
            let estado = estadoSelect.value;
            let cidade = cidadeSelect.value;
            
            if (!nome || !email || !idade || !genero || !relacionamento || !telefone || !estado || !cidade) {
                alert('⚠️ Por favor, preencha todos os campos!');
                return;
            }
            
            if (isNaN(idade) || idade < 0 || idade > 120) {
                alert('⚠️ Por favor, insira uma idade válida (0-120)!');
                return;
            }
            
            const registro = {
                nome: nome,
                email: email,
                idade: idade,
                genero: genero,
                relacionamento: relacionamento,
                estado: estado,
                cidade: cidade,
                telefone: telefone,
                dataCadastro: new Date().toLocaleString('pt-BR')
            };
            
            if (modoEdicao && indiceEdicao !== null) {
                registros[indiceEdicao] = registro;
                alert('✅ Registro atualizado com sucesso!');
            } else {
                registros.push(registro);
                alert('✅ Registro adicionado com sucesso!');
            }
            
            localStorage.setItem('registros', JSON.stringify(registros));
            limparFormulario();
            atualizarLista();
            modoEdicao = false;
            indiceEdicao = null;
        }

        function limparFormulario() {
            document.getElementById('nome').value = '';
            document.getElementById('email').value = '';
            document.getElementById('idade').value = '';
            document.getElementById('genero').value = '';
            document.getElementById('relacionamento').value = '';
            document.getElementById('telefone').value = '';
            document.getElementById('estados').selectedIndex = 0;
            document.getElementById('cidades').innerHTML = '<option value="">Selecione um estado primeiro</option>';
            document.getElementById('cidades').disabled = true;
            document.getElementById('addBtn').textContent = 'Adicionar Registro';
        }

        document.addEventListener('DOMContentLoaded', function() {
            inicializarIBGE();
            atualizarLista();
            document.getElementById('addBtn').addEventListener('click', salvarRegistro);
            
            document.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    salvarRegistro();
                }
            });
        });