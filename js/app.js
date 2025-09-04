document.addEventListener('DOMContentLoaded', function() {
    // Salvar a chave da API fornecida
    const apiKeyFornecida = "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";
    localStorage.setItem('profquest_apiKey', apiKeyFornecida);
    
    // Mostrar notificação após um pequeno delay para garantir que os elementos da página foram carregados
    setTimeout(() => {
        mostrarNotificacao('Chave da API do GPT-4 salva com sucesso!', 'success');
        console.log("Chave da API salva no localStorage");
        
        // Atualizar o campo de API Key na interface se estiver visível
        const apiKeyInput = document.getElementById('apiKey');
        if (apiKeyInput) {
            apiKeyInput.value = apiKeyFornecida;
        }
    }, 1000);
    // Elementos da interface
    const menuNovaAtividade = document.getElementById('menuNovaAtividade');
    const menuHistorico = document.getElementById('menuHistorico');
    const menuConfiguracoes = document.getElementById('menuConfiguracoes');
    
    const secaoNovaAtividade = document.getElementById('secaoNovaAtividade');
    const secaoHistorico = document.getElementById('secaoHistorico');
    const secaoConfiguracoes = document.getElementById('secaoConfiguracoes');
    const secaoQuestoesGeradas = document.getElementById('secaoQuestoesGeradas');
    const secaoConfiguracaoAtividade = document.getElementById('secaoConfiguracaoAtividade');
    
    const formNovaAtividade = document.getElementById('formNovaAtividade');
    const btnAjuda = document.getElementById('btnAjuda');
    const btnVoltar = document.getElementById('btnVoltar');
    const btnVoltarQuestoes = document.getElementById('btnVoltarQuestoes');
    const btnCriarAtividade = document.getElementById('btnCriarAtividade');
    const btnSelecionarTodas = document.getElementById('btnSelecionarTodas');
    const btnGerarMais = document.getElementById('btnGerarMais');
    const btnSalvarPerfil = document.getElementById('btnSalvarPerfil');
    const logoEscola = document.getElementById('logoEscola');
    const previewLogo = document.getElementById('previewLogo');
    const formConfiguracaoAtividade = document.getElementById('formConfiguracaoAtividade');
    const formConfiguracoes = document.getElementById('formConfiguracoes');
    const temaClaro = document.getElementById('temaClaro');
    const temaEscuro = document.getElementById('temaEscuro');
    
    // Variáveis globais
    let questoesGeradas = [];
    let questoesSelecionadas = [];
    let logoEscolaBase64 = '';
    let dadosAtividade = {};
    
    // Inicialização
    carregarConfiguracoesDoLocalStorage();
    carregarHistoricoDoLocalStorage();
    
    // Event Listeners para navegação
    menuNovaAtividade.addEventListener('click', function(e) {
        e.preventDefault();
        mostrarSecao(secaoNovaAtividade);
        atualizarMenuAtivo(menuNovaAtividade);
    });
    
    menuHistorico.addEventListener('click', function(e) {
        e.preventDefault();
        mostrarSecao(secaoHistorico);
        atualizarMenuAtivo(menuHistorico);
        carregarHistoricoDoLocalStorage();
    });
    
    menuConfiguracoes.addEventListener('click', function(e) {
        e.preventDefault();
        mostrarSecao(secaoConfiguracoes);
        atualizarMenuAtivo(menuConfiguracoes);
    });
    
    // Event Listener para o botão de ajuda
    btnAjuda.addEventListener('click', function() {
        const modalAjuda = new bootstrap.Modal(document.getElementById('modalAjuda'));
        modalAjuda.show();
    });
    
    // Event Listener para o formulário de nova atividade
    formNovaAtividade.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Capturar dados do formulário
        const tipoAtividade = document.getElementById('tipoAtividade').value;
        const disciplina = document.getElementById('disciplina').value;
        const serieAno = document.getElementById('serieAno').value;
        const tipoQuestoes = document.getElementById('tipoQuestoes').value;
        const habilidades = document.getElementById('habilidades').value;
        const qtdQuestoes = document.getElementById('qtdQuestoes').value;
        
        // Salvar dados para uso posterior
        dadosAtividade = {
            tipoAtividade,
            disciplina,
            serieAno,
            tipoQuestoes,
            habilidades,
            qtdQuestoes
        };
        
        // Mostrar preloader
        mostrarPreloader();
        
        // Chamar a API para gerar questões
        gerarQuestoes(dadosAtividade)
            .then(questoes => {
                questoesGeradas = questoes;
                renderizarQuestoes(questoes);
                secaoQuestoesGeradas.classList.remove('d-none');
                ocultarPreloader();
                
                // Scroll para as questões geradas
                secaoQuestoesGeradas.scrollIntoView({ behavior: 'smooth' });
            })
            .catch(error => {
                ocultarPreloader();
                mostrarNotificacao('Erro ao gerar questões: ' + error.message, 'error');
            });
    });
    
    // Event Listener para o botão Voltar
    btnVoltar.addEventListener('click', function() {
        secaoQuestoesGeradas.classList.add('d-none');
    });
    
    // Event Listener para o botão Voltar Questões
    btnVoltarQuestoes.addEventListener('click', function() {
        secaoConfiguracaoAtividade.classList.add('d-none');
        secaoQuestoesGeradas.classList.remove('d-none');
    });
    
    // Event Listener para o botão Criar Atividade
    btnCriarAtividade.addEventListener('click', function() {
        // Verificar se há questões selecionadas
        questoesSelecionadas = questoesGeradas.filter(q => q.selecionada);
        
        if (questoesSelecionadas.length === 0) {
            mostrarNotificacao('Selecione pelo menos uma questão para criar a atividade', 'error');
            return;
        }
        
        // Mostrar seção de configuração da atividade
        secaoQuestoesGeradas.classList.add('d-none');
        secaoConfiguracaoAtividade.classList.remove('d-none');
        
        // Preencher o título sugerido
        const disciplinaNome = document.getElementById('disciplina').options[document.getElementById('disciplina').selectedIndex].text;
        const tipoAtividadeNome = document.getElementById('tipoAtividade').options[document.getElementById('tipoAtividade').selectedIndex].text;
        document.getElementById('tituloAtividade').value = `${tipoAtividadeNome} de ${disciplinaNome}`;
        
        // Definir a data atual
        const dataAtual = new Date().toISOString().split('T')[0];
        document.getElementById('dataAtividade').value = dataAtual;
    });
    
    // Event Listener para o botão Selecionar Todas
    btnSelecionarTodas.addEventListener('click', function() {
        const checkboxes = document.querySelectorAll('.questao-checkbox');
        const todasSelecionadas = Array.from(checkboxes).every(cb => cb.checked);
        
        checkboxes.forEach(checkbox => {
            checkbox.checked = !todasSelecionadas;
            const questaoId = checkbox.getAttribute('data-questao-id');
            const questaoItem = document.getElementById(`questao-${questaoId}`);
            
            if (!todasSelecionadas) {
                questaoItem.classList.add('selecionada');
                questoesGeradas[questaoId].selecionada = true;
            } else {
                questaoItem.classList.remove('selecionada');
                questoesGeradas[questaoId].selecionada = false;
            }
        });
        
        // Atualizar texto do botão
        btnSelecionarTodas.innerHTML = todasSelecionadas ? 
            '<i class="fas fa-check-square me-1"></i> Selecionar Todas' : 
            '<i class="fas fa-square me-1"></i> Desmarcar Todas';
    });
    
    // Event Listener para o botão Gerar Mais
    btnGerarMais.addEventListener('click', function() {
        // Mostrar preloader
        mostrarPreloader();
        
        // Chamar a API para gerar mais questões
        gerarQuestoes(dadosAtividade)
            .then(questoes => {
                // Adicionar novas questões ao array existente
                const novasQuestoes = questoes;
                questoesGeradas = [...questoesGeradas, ...novasQuestoes];
                
                // Renderizar todas as questões
                renderizarQuestoes(questoesGeradas);
                ocultarPreloader();
            })
            .catch(error => {
                ocultarPreloader();
                mostrarNotificacao('Erro ao gerar mais questões: ' + error.message, 'error');
            });
    });
    
    // Event Listener para o formulário de configuração da atividade
    formConfiguracaoAtividade.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Capturar dados do formulário
        const tituloAtividade = document.getElementById('tituloAtividade').value;
        const dataAtividade = document.getElementById('dataAtividade').value;
        const instrucoes = document.getElementById('instrucoes').value;
        const incluirCabecalho = document.getElementById('incluirCabecalho').checked;
        const incluirGabarito = document.getElementById('incluirGabarito').checked;
        
        // Dados completos da atividade
        const atividadeCompleta = {
            ...dadosAtividade,
            titulo: tituloAtividade,
            data: dataAtividade,
            instrucoes,
            incluirCabecalho,
            incluirGabarito,
            questoes: questoesSelecionadas,
            logoEscola: logoEscolaBase64,
            nomeEscola: document.getElementById('nomeEscola').value
        };
        
        // Gerar PDF
        gerarPDF(atividadeCompleta)
            .then(() => {
                // Salvar no histórico
                salvarAtividadeNoHistorico(atividadeCompleta);
                
                // Mostrar modal de visualização
                const modalPDF = new bootstrap.Modal(document.getElementById('modalPDF'));
                modalPDF.show();
            })
            .catch(error => {
                mostrarNotificacao('Erro ao gerar PDF: ' + error.message, 'error');
            });
    });
    
    // Event Listener para o upload do logo da escola
    logoEscola.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                logoEscolaBase64 = e.target.result;
                document.querySelector('#previewLogo img').src = logoEscolaBase64;
                previewLogo.classList.remove('d-none');
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Event Listener para salvar perfil
    btnSalvarPerfil.addEventListener('click', function() {
        const nomeEscola = document.getElementById('nomeEscola').value;
        
        // Salvar no localStorage
        localStorage.setItem('profquest_nomeEscola', nomeEscola);
        localStorage.setItem('profquest_logoEscola', logoEscolaBase64);
        
        mostrarNotificacao('Perfil escolar salvo com sucesso!', 'success');
    });
    
    // Event Listener para salvar configurações
    formConfiguracoes.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const apiKey = document.getElementById('apiKey').value;
        const modeloIA = document.getElementById('modeloIA').value;
        const tema = document.querySelector('input[name="tema"]:checked').value;
        
        // Salvar no localStorage
        localStorage.setItem('profquest_apiKey', apiKey);
        localStorage.setItem('profquest_modeloIA', modeloIA);
        localStorage.setItem('profquest_tema', tema);
        
        // Aplicar tema
        aplicarTema(tema);
        
        mostrarNotificacao('Configurações salvas com sucesso!', 'success');
    });
    
    // Event Listeners para alternar tema
    temaClaro.addEventListener('change', function() {
        if (this.checked) {
            aplicarTema('claro');
        }
    });
    
    temaEscuro.addEventListener('change', function() {
        if (this.checked) {
            aplicarTema('escuro');
        }
    });
    
    // Funções auxiliares
    function mostrarSecao(secao) {
        // Ocultar todas as seções
        secaoNovaAtividade.classList.add('d-none');
        secaoHistorico.classList.add('d-none');
        secaoConfiguracoes.classList.add('d-none');
        secaoQuestoesGeradas.classList.add('d-none');
        secaoConfiguracaoAtividade.classList.add('d-none');
        
        // Mostrar a seção desejada
        secao.classList.remove('d-none');
    }
    
    function atualizarMenuAtivo(menuItem) {
        // Remover classe ativa de todos os itens do menu
        menuNovaAtividade.classList.remove('active');
        menuHistorico.classList.remove('active');
        menuConfiguracoes.classList.remove('active');
        
        // Adicionar classe ativa ao item selecionado
        menuItem.classList.add('active');
    }
    
    function mostrarPreloader() {
        // Criar e mostrar preloader
        const preloader = document.createElement('div');
        preloader.className = 'preloader';
        preloader.innerHTML = '<div class="spinner"></div><p class="mt-3">Gerando questões com IA...</p>';
        preloader.id = 'preloader';
        
        document.querySelector('main').appendChild(preloader);
    }
    
    function ocultarPreloader() {
        // Remover preloader
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.remove();
        }
    }
    
    function mostrarNotificacao(mensagem, tipo) {
        // Criar notificação
        const notificacao = document.createElement('div');
        notificacao.className = `notification ${tipo}`;
        notificacao.innerHTML = mensagem;
        
        // Adicionar ao corpo do documento
        document.body.appendChild(notificacao);
        
        // Remover após 3 segundos
        setTimeout(() => {
            notificacao.style.animation = 'slideOut 0.3s ease-in forwards';
            setTimeout(() => {
                notificacao.remove();
            }, 300);
        }, 3000);
    }
    
    function renderizarQuestoes(questoes) {
        const listaQuestoes = document.getElementById('listaQuestoes');
        listaQuestoes.innerHTML = '';
        
        questoes.forEach((questao, index) => {
            const questaoElement = document.createElement('div');
            questaoElement.className = `questao-item ${questao.selecionada ? 'selecionada' : ''}`;
            questaoElement.id = `questao-${index}`;
            
            let alternativasHTML = '';
            if (questao.tipo === 'fechada' || questao.tipo === 'mista') {
                alternativasHTML = questao.alternativas.map((alt, i) => {
                    const letra = String.fromCharCode(97 + i); // a, b, c, d, e...
                    return `
                        <div class="alternativa ${alt.correta ? 'correta' : ''}">
                            <strong>${letra})</strong> ${alt.texto}
                        </div>
                    `;
                }).join('');
            }
            
            questaoElement.innerHTML = `
                <div class="questao-header">
                    <div class="questao-titulo">Questão ${index + 1}</div>
                    <div class="questao-acoes">
                        <div class="form-check">
                            <input class="form-check-input questao-checkbox" type="checkbox" 
                                id="checkbox-${index}" data-questao-id="${index}" 
                                ${questao.selecionada ? 'checked' : ''}>
                            <label class="form-check-label" for="checkbox-${index}">
                                Selecionar
                            </label>
                        </div>
                    </div>
                </div>
                <div class="questao-conteudo">
                    <p>${questao.enunciado}</p>
                    ${alternativasHTML}
                    ${questao.tipo === 'aberta' || questao.tipo === 'mista' ? 
                        `<div class="mt-2"><strong>Resposta esperada:</strong> <p>${questao.respostaEsperada || 'Resposta dissertativa'}</p></div>` : ''}
                </div>
            `;
            
            listaQuestoes.appendChild(questaoElement);
            
            // Adicionar event listener para o checkbox
            document.getElementById(`checkbox-${index}`).addEventListener('change', function() {
                const questaoItem = document.getElementById(`questao-${index}`);
                if (this.checked) {
                    questaoItem.classList.add('selecionada');
                    questoesGeradas[index].selecionada = true;
                } else {
                    questaoItem.classList.remove('selecionada');
                    questoesGeradas[index].selecionada = false;
                }
            });
        });
    }
    
    function gerarQuestoes(dados) {
        // Obter a chave da API do localStorage
        const apiKey = localStorage.getItem('profquest_apiKey');
        const modeloIA = localStorage.getItem('profquest_modeloIA') || 'gpt-4';
        
        // Verificar se a chave da API está disponível
        if (!apiKey) {
            mostrarNotificacao('Chave da API não configurada. Usando simulação.', 'warning');
            return simulacaoGerarQuestoes(dados);
        }
        
        // Construir o prompt para a API
        const prompt = `
            Gere ${dados.qtdQuestoes} questões ${dados.tipoQuestoes} para uma ${dados.tipoAtividade} 
            de ${dados.disciplina} para ${dados.serieAno.replace('-', ' ')}. 
            As questões devem avaliar as seguintes habilidades: ${dados.habilidades}.
            
            Formato da resposta: JSON com array de objetos, cada objeto representando uma questão com os campos:
            - enunciado: texto da questão
            - tipo: "fechada", "aberta" ou "mista"
            - alternativas: array de objetos com campos "texto" e "correta" (boolean) [apenas para questões fechadas ou mistas]
            - respostaEsperada: texto com a resposta esperada [apenas para questões abertas ou mistas]
            
            Responda APENAS com o JSON, sem texto adicional.
        `;
        
        // Implementação real da chamada à API
        return fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: modeloIA,
                messages: [{
                    role: "user",
                    content: prompt
                }],
                temperature: 0.7,
                response_format: { type: "json_object" }
            })
        })
        .then(response => {
            if (!response.ok) {
                // Se houver erro na API, usar simulação como fallback
                mostrarNotificacao(`Erro na API: ${response.status}. Usando simulação.`, 'warning');
                return simulacaoGerarQuestoes(dados);
            }
            return response.json();
        })
        .then(data => {
            try {
                // Extrair e parsear o JSON da resposta
                const content = data.choices[0].message.content;
                let questoes;
                
                try {
                    questoes = JSON.parse(content);
                    
                    // Verificar se questoes é um array
                    if (!Array.isArray(questoes)) {
                        // Se não for um array, verificar se há uma propriedade que contém o array
                        if (questoes.questoes && Array.isArray(questoes.questoes)) {
                            questoes = questoes.questoes;
                        } else {
                            throw new Error('Formato de resposta inválido');
                        }
                    }
                } catch (parseError) {
                    console.error('Erro ao parsear JSON:', parseError);
                    console.log('Conteúdo recebido:', content);
                    throw new Error('Erro ao processar resposta da API');
                }
                
                // Adicionar campo selecionada como false por padrão
                return questoes.map(q => ({ ...q, selecionada: false }));
            } catch (error) {
                console.error('Erro ao processar resposta:', error);
                mostrarNotificacao('Erro ao processar resposta da API. Usando simulação.', 'error');
                return simulacaoGerarQuestoes(dados);
            }
        })
        .catch(error => {
            console.error('Erro na chamada da API:', error);
            mostrarNotificacao('Erro na chamada da API. Usando simulação.', 'error');
            return simulacaoGerarQuestoes(dados);
        });
    }
    
    function simulacaoGerarQuestoes(dados) {
        // Função para simular a geração de questões durante o desenvolvimento
        return new Promise((resolve) => {
            setTimeout(() => {
                // Exemplos de questões baseadas nos dados fornecidos
                let questoes = [];
                
                // Mapear disciplinas para gerar questões mais específicas
                const questoesPorDisciplina = {
                    matematica: gerarQuestoesMatematica,
                    portugues: gerarQuestoesPortugues,
                    ciencias: gerarQuestoesCiencias,
                    historia: gerarQuestoesHistoria,
                    geografia: gerarQuestoesGeografia,
                    // Adicionar mais disciplinas conforme necessário
                };
                
                // Verificar se existe uma função específica para a disciplina
                if (questoesPorDisciplina[dados.disciplina]) {
                    questoes = questoesPorDisciplina[dados.disciplina](dados);
                } else {
                    // Questões genéricas se não houver função específica
                    for (let i = 0; i < dados.qtdQuestoes; i++) {
                        if (dados.tipoQuestoes === 'fechada') {
                            questoes.push({
                                enunciado: `Questão de exemplo ${i+1} para ${dados.disciplina}. Baseada nas habilidades: ${dados.habilidades}.`,
                                tipo: 'fechada',
                                alternativas: [
                                    { texto: 'Alternativa A', correta: i % 5 === 0 },
                                    { texto: 'Alternativa B', correta: i % 5 === 1 },
                                    { texto: 'Alternativa C', correta: i % 5 === 2 },
                                    { texto: 'Alternativa D', correta: i % 5 === 3 },
                                    { texto: 'Alternativa E', correta: i % 5 === 4 }
                                ],
                                selecionada: false
                            });
                        } else if (dados.tipoQuestoes === 'aberta') {
                            questoes.push({
                                enunciado: `Questão dissertativa ${i+1} para ${dados.disciplina}. Baseada nas habilidades: ${dados.habilidades}.`,
                                tipo: 'aberta',
                                respostaEsperada: `Resposta esperada para a questão ${i+1}.`,
                                selecionada: false
                            });
                        } else { // mista
                            if (i % 2 === 0) {
                                questoes.push({
                                    enunciado: `Questão de múltipla escolha ${i+1} para ${dados.disciplina}. Baseada nas habilidades: ${dados.habilidades}.`,
                                    tipo: 'fechada',
                                    alternativas: [
                                        { texto: 'Alternativa A', correta: i % 5 === 0 },
                                        { texto: 'Alternativa B', correta: i % 5 === 1 },
                                        { texto: 'Alternativa C', correta: i % 5 === 2 },
                                        { texto: 'Alternativa D', correta: i % 5 === 3 },
                                        { texto: 'Alternativa E', correta: i % 5 === 4 }
                                    ],
                                    selecionada: false
                                });
                            } else {
                                questoes.push({
                                    enunciado: `Questão dissertativa ${i+1} para ${dados.disciplina}. Baseada nas habilidades: ${dados.habilidades}.`,
                                    tipo: 'aberta',
                                    respostaEsperada: `Resposta esperada para a questão ${i+1}.`,
                                    selecionada: false
                                });
                            }
                        }
                    }
                }
                
                resolve(questoes);
            }, 2000); // Simular delay de 2 segundos
        });
    }
    
    // Funções para gerar questões específicas por disciplina
    function gerarQuestoesMatematica(dados) {
        const questoes = [];
        const serieAno = dados.serieAno;
        
        // Questões de matemática baseadas na série/ano
        if (serieAno.includes('ef')) { // Ensino Fundamental
            const ano = parseInt(serieAno.split('-')[0]);
            
            if (ano <= 5) { // 1º ao 5º ano
                for (let i = 0; i < dados.qtdQuestoes; i++) {
                    if (dados.tipoQuestoes === 'fechada' || (dados.tipoQuestoes === 'mista' && i % 2 === 0)) {
                        questoes.push({
                            enunciado: `Maria tem ${5 + i} maçãs e João tem ${3 + i} maçãs. Quantas maçãs eles têm juntos?`,
                            tipo: 'fechada',
                            alternativas: [
                                { texto: `${8 + i * 2}`, correta: false },
                                { texto: `${8 + i}`, correta: true },
                                { texto: `${7 + i}`, correta: false },
                                { texto: `${9 + i}`, correta: false }
                            ],
                            selecionada: false
                        });
                    } else {
                        questoes.push({
                            enunciado: `Resolva a seguinte adição e explique o processo: ${10 + i * 5} + ${15 + i * 3} = ?`,
                            tipo: 'aberta',
                            respostaEsperada: `${(10 + i * 5) + (15 + i * 3)}. Para resolver esta adição, somamos as unidades e depois as dezenas.`,
                            selecionada: false
                        });
                    }
                }
            } else { // 6º ao 9º ano
                for (let i = 0; i < dados.qtdQuestoes; i++) {
                    if (dados.tipoQuestoes === 'fechada' || (dados.tipoQuestoes === 'mista' && i % 2 === 0)) {
                        questoes.push({
                            enunciado: `Resolva a equação: ${i+2}x + ${i*3} = ${i*5 + 10}`,
                            tipo: 'fechada',
                            alternativas: [
                                { texto: `x = ${(i*5 + 10 - i*3) / (i+2)}`, correta: true },
                                { texto: `x = ${((i*5 + 10 - i*3) / (i+2)) + 1}`, correta: false },
                                { texto: `x = ${((i*5 + 10 - i*3) / (i+2)) - 1}`, correta: false },
                                { texto: `x = ${((i*5 + 10 - i*3) / (i+2)) * 2}`, correta: false }
                            ],
                            selecionada: false
                        });
                    } else {
                        questoes.push({
                            enunciado: `Calcule a área de um triângulo com base ${5 + i} cm e altura ${8 + i} cm.`,
                            tipo: 'aberta',
                            respostaEsperada: `A área do triângulo é ${((5 + i) * (8 + i)) / 2} cm². Utilizamos a fórmula A = (b × h) ÷ 2, onde b é a base e h é a altura.`,
                            selecionada: false
                        });
                    }
                }
            }
        } else { // Ensino Médio
            for (let i = 0; i < dados.qtdQuestoes; i++) {
                if (dados.tipoQuestoes === 'fechada' || (dados.tipoQuestoes === 'mista' && i % 2 === 0)) {
                    questoes.push({
                        enunciado: `Calcule os zeros da função f(x) = x² + ${i-3}x + ${i-6}`,
                        tipo: 'fechada',
                        alternativas: [
                            { texto: `x' = ${(3-i) / 2 + Math.sqrt(Math.pow((i-3)/2, 2) - (i-6))}, x'' = ${(3-i) / 2 - Math.sqrt(Math.pow((i-3)/2, 2) - (i-6))}`, correta: true },
                            { texto: `x' = ${(3-i) / 2 + Math.sqrt(Math.pow((i-3)/2, 2) - (i-6)) + 1}, x'' = ${(3-i) / 2 - Math.sqrt(Math.pow((i-3)/2, 2) - (i-6)) + 1}`, correta: false },
                            { texto: `x' = ${(3-i) / 2 + Math.sqrt(Math.pow((i-3)/2, 2) - (i-6)) - 1}, x'' = ${(3-i) / 2 - Math.sqrt(Math.pow((i-3)/2, 2) - (i-6)) - 1}`, correta: false },
                            { texto: `x' = ${(3-i) / 2 + Math.sqrt(Math.pow((i-3)/2, 2) - (i-6)) * 2}, x'' = ${(3-i) / 2 - Math.sqrt(Math.pow((i-3)/2, 2) - (i-6)) * 2}`, correta: false }
                        ],
                        selecionada: false
                    });
                } else {
                    questoes.push({
                        enunciado: `Calcule a derivada da função f(x) = ${i+2}x³ + ${i}x² - ${i*2}x + ${i-1}`,
                        tipo: 'aberta',
                        respostaEsperada: `f'(x) = ${(i+2)*3}x² + ${i*2}x - ${i*2}. Aplicamos a regra da derivada termo a termo.`,
                        selecionada: false
                    });
                }
            }
        }
        
        return questoes;
    }
    
    function gerarQuestoesPortugues(dados) {
        const questoes = [];
        const serieAno = dados.serieAno;
        
        // Textos para interpretação
        const textos = [
            "A raposa marrom rápida pula sobre o cachorro preguiçoso.",
            "No meio do caminho tinha uma pedra, tinha uma pedra no meio do caminho.",
            "Tudo vale a pena quando a alma não é pequena.",
            "A vida é uma jornada, não um destino."
        ];
        
        for (let i = 0; i < dados.qtdQuestoes; i++) {
            const textoIndex = i % textos.length;
            
            if (dados.tipoQuestoes === 'fechada' || (dados.tipoQuestoes === 'mista' && i % 2 === 0)) {
                questoes.push({
                    enunciado: `Leia o texto: "${textos[textoIndex]}" Qual é o sujeito da oração principal?`,
                    tipo: 'fechada',
                    alternativas: [
                        { texto: 'A raposa', correta: textoIndex === 0 },
                        { texto: 'Uma pedra', correta: textoIndex === 1 },
                        { texto: 'Tudo', correta: textoIndex === 2 },
                        { texto: 'A vida', correta: textoIndex === 3 }
                    ],
                    selecionada: false
                });
            } else {
                questoes.push({
                    enunciado: `Analise o texto: "${textos[textoIndex]}" Faça uma análise sintática da oração principal.`,
                    tipo: 'aberta',
                    respostaEsperada: `No texto "${textos[textoIndex]}", a análise sintática da oração principal revela: sujeito, verbo e complementos...`,
                    selecionada: false
                });
            }
        }
        
        return questoes;
    }
    
    function gerarQuestoesCiencias(dados) {
        const questoes = [];
        
        const temas = [
            { tema: "Sistema Solar", pergunta: "Qual é o planeta mais próximo do Sol?", respostas: ["Mercúrio", "Vênus", "Terra", "Marte"], correta: 0 },
            { tema: "Corpo Humano", pergunta: "Qual órgão é responsável por bombear sangue para todo o corpo?", respostas: ["Cérebro", "Pulmão", "Coração", "Fígado"], correta: 2 },
            { tema: "Ecologia", pergunta: "O que é fotossíntese?", respostas: ["Processo de respiração animal", "Processo pelo qual plantas produzem alimento usando luz solar", "Decomposição de matéria orgânica", "Reprodução de bactérias"], correta: 1 },
            { tema: "Química", pergunta: "Qual é o símbolo químico do oxigênio?", respostas: ["O", "Ox", "O2", "Oz"], correta: 0 }
        ];
        
        for (let i = 0; i < dados.qtdQuestoes; i++) {
            const temaIndex = i % temas.length;
            
            if (dados.tipoQuestoes === 'fechada' || (dados.tipoQuestoes === 'mista' && i % 2 === 0)) {
                questoes.push({
                    enunciado: `[${temas[temaIndex].tema}] ${temas[temaIndex].pergunta}`,
                    tipo: 'fechada',
                    alternativas: temas[temaIndex].respostas.map((resp, idx) => ({
                        texto: resp,
                        correta: idx === temas[temaIndex].correta
                    })),
                    selecionada: false
                });
            } else {
                questoes.push({
                    enunciado: `[${temas[temaIndex].tema}] Explique em detalhes: ${temas[temaIndex].pergunta}`,
                    tipo: 'aberta',
                    respostaEsperada: `A resposta esperada deve abordar ${temas[temaIndex].respostas[temas[temaIndex].correta]} e explicar o conceito em detalhes...`,
                    selecionada: false
                });
            }
        }
        
        return questoes;
    }
    
    function gerarQuestoesHistoria(dados) {
        const questoes = [];
        
        const eventos = [
            { evento: "Independência do Brasil", ano: 1822, pergunta: "Em que ano ocorreu a Independência do Brasil?", detalhes: "A Independência do Brasil ocorreu em 7 de setembro de 1822, quando Dom Pedro I declarou o Brasil independente de Portugal às margens do Rio Ipiranga." },
            { evento: "Primeira Guerra Mundial", ano: 1914, pergunta: "Quando começou a Primeira Guerra Mundial?", detalhes: "A Primeira Guerra Mundial começou em 28 de julho de 1914, após o assassinato do arquiduque Franz Ferdinand, e terminou em 11 de novembro de 1918." },
            { evento: "Revolução Francesa", ano: 1789, pergunta: "Em que ano iniciou a Revolução Francesa?", detalhes: "A Revolução Francesa começou em 1789 com a Queda da Bastilha em 14 de julho, marcando o início de profundas mudanças políticas e sociais na França." },
            { evento: "Descobrimento do Brasil", ano: 1500, pergunta: "Quem liderou a expedição que chegou ao Brasil em 1500?", detalhes: "Pedro Álvares Cabral liderou a expedição portuguesa que chegou ao Brasil em 22 de abril de 1500." }
        ];
        
        for (let i = 0; i < dados.qtdQuestoes; i++) {
            const eventoIndex = i % eventos.length;
            
            if (dados.tipoQuestoes === 'fechada' || (dados.tipoQuestoes === 'mista' && i % 2 === 0)) {
                const opcoes = [eventos[eventoIndex].ano];
                while (opcoes.length < 4) {
                    const anoAleatorio = eventos[eventoIndex].ano + Math.floor(Math.random() * 20) - 10;
                    if (!opcoes.includes(anoAleatorio)) {
                        opcoes.push(anoAleatorio);
                    }
                }
                opcoes.sort((a, b) => a - b);
                
                questoes.push({
                    enunciado: eventos[eventoIndex].pergunta,
                    tipo: 'fechada',
                    alternativas: opcoes.map(ano => ({
                        texto: String(ano),
                        correta: ano === eventos[eventoIndex].ano
                    })),
                    selecionada: false
                });
            } else {
                questoes.push({
                    enunciado: `Descreva o contexto histórico e a importância do seguinte evento: ${eventos[eventoIndex].evento}`,
                    tipo: 'aberta',
                    respostaEsperada: eventos[eventoIndex].detalhes,
                    selecionada: false
                });
            }
        }
        
        return questoes;
    }
    
    function gerarQuestoesGeografia(dados) {
        const questoes = [];
        
        const temas = [
            { tema: "Capitais", pergunta: "Qual é a capital do Brasil?", respostas: ["Rio de Janeiro", "São Paulo", "Brasília", "Salvador"], correta: 2 },
            { tema: "Clima", pergunta: "Qual é o clima predominante na Amazônia?", respostas: ["Equatorial", "Tropical", "Temperado", "Semiárido"], correta: 0 },
            { tema: "Relevo", pergunta: "Qual é o ponto mais alto do Brasil?", respostas: ["Pico da Neblina", "Pico da Bandeira", "Monte Roraima", "Pico Paraná"], correta: 0 },
            { tema: "Hidrografia", pergunta: "Qual é o maior rio do mundo em volume de água?", respostas: ["Nilo", "Amazonas", "Mississipi", "Yangtzé"], correta: 1 }
        ];
        
        for (let i = 0; i < dados.qtdQuestoes; i++) {
            const temaIndex = i % temas.length;
            
            if (dados.tipoQuestoes === 'fechada' || (dados.tipoQuestoes === 'mista' && i % 2 === 0)) {
                questoes.push({
                    enunciado: `[${temas[temaIndex].tema}] ${temas[temaIndex].pergunta}`,
                    tipo: 'fechada',
                    alternativas: temas[temaIndex].respostas.map((resp, idx) => ({
                        texto: resp,
                        correta: idx === temas[temaIndex].correta
                    })),
                    selecionada: false
                });
            } else {
                questoes.push({
                    enunciado: `[${temas[temaIndex].tema}] Explique detalhadamente: ${temas[temaIndex].pergunta}`,
                    tipo: 'aberta',
                    respostaEsperada: `A resposta correta é ${temas[temaIndex].respostas[temas[temaIndex].correta]}. Uma explicação detalhada incluiria...`,
                    selecionada: false
                });
            }
        }
        
        return questoes;
    }
    
    function gerarPDF(atividade) {
        return new Promise((resolve) => {
            // Simulação de geração de PDF
            setTimeout(() => {
                // Em uma implementação real, aqui seria gerado o PDF usando jsPDF
                // Por enquanto, apenas simulamos a geração
                
                // Criar um iframe para simular a visualização do PDF
                const pdfViewer = document.getElementById('pdfViewer');
                pdfViewer.innerHTML = `
                    <div class="bg-white p-4" style="min-height: 500px;">
                        <div class="text-center mb-4">
                            ${atividade.logoEscola ? `<img src="${atividade.logoEscola}" alt="Logo da Escola" style="max-height: 80px; margin-bottom: 15px;"><br>` : ''}
                            ${atividade.nomeEscola ? `<h4>${atividade.nomeEscola}</h4>` : ''}
                            <h2>${atividade.titulo}</h2>
                            <p>Data: ${formatarData(atividade.data)}</p>
                        </div>
                        
                        ${atividade.incluirCabecalho ? `
                            <div class="mb-4">
                                <p>Nome: _______________________________________________</p>
                                <p>Turma: ______________ Data: ____/____/________</p>
                            </div>
                        ` : ''}
                        
                        ${atividade.instrucoes ? `
                            <div class="mb-4">
                                <h5>Instruções:</h5>
                                <p>${atividade.instrucoes}</p>
                            </div>
                        ` : ''}
                        
                        <div>
                            ${atividade.questoes.map((q, i) => `
                                <div class="mb-4">
                                    <p><strong>${i+1}.</strong> ${q.enunciado}</p>
                                    ${q.tipo === 'fechada' || q.tipo === 'mista' ? `
                                        <div class="ms-4">
                                            ${q.alternativas.map((alt, j) => `
                                                <p>${String.fromCharCode(97 + j)}) ${alt.texto}</p>
                                            `).join('')}
                                        </div>
                                    ` : `
                                        <div class="ms-4">
                                            <p>_______________________________________________________</p>
                                            <p>_______________________________________________________</p>
                                            <p>_______________________________________________________</p>
                                        </div>
                                    `}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
                
                // Simular botão de download
                document.getElementById('btnDownloadPDF').onclick = function() {
                    mostrarNotificacao('Download iniciado!', 'success');
                };
                
                resolve();
            }, 1500);
        });
    }
    
    function formatarData(dataString) {
        const data = new Date(dataString);
        return data.toLocaleDateString('pt-BR');
    }
    
    function salvarAtividadeNoHistorico(atividade) {
        // Obter histórico existente ou criar um novo array
        const historico = JSON.parse(localStorage.getItem('profquest_historico') || '[]');
        
        // Adicionar nova atividade ao histórico
        historico.push({
            id: Date.now(),
            data: atividade.data,
            titulo: atividade.titulo,
            tipo: atividade.tipoAtividade,
            disciplina: atividade.disciplina,
            questoes: atividade.questoes.length
        });
        
        // Salvar histórico atualizado
        localStorage.setItem('profquest_historico', JSON.stringify(historico));
    }
    
    function carregarHistoricoDoLocalStorage() {
        const historico = JSON.parse(localStorage.getItem('profquest_historico') || '[]');
        const tabelaHistorico = document.getElementById('tabelaHistorico');
        
        if (historico.length === 0) {
            tabelaHistorico.innerHTML = '<tr><td colspan="5" class="text-center">Nenhuma atividade no histórico</td></tr>';
            return;
        }
        
        // Ordenar histórico por data (mais recente primeiro)
        historico.sort((a, b) => new Date(b.data) - new Date(a.data));
        
        // Renderizar tabela
        tabelaHistorico.innerHTML = historico.map(item => `
            <tr>
                <td>${formatarData(item.data)}</td>
                <td>${item.titulo}</td>
                <td>${traduzirTipoAtividade(item.tipo)}</td>
                <td>${traduzirDisciplina(item.disciplina)}</td>
                <td>
                    <button class="btn btn-sm btn-primary me-1" onclick="visualizarAtividade(${item.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="excluirAtividade(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }
    
    function traduzirTipoAtividade(tipo) {
        const tipos = {
            'prova': 'Prova',
            'exercicio': 'Exercício',
            'trabalho': 'Trabalho'
        };
        return tipos[tipo] || tipo;
    }
    
    function traduzirDisciplina(disciplina) {
        const disciplinas = {
            'matematica': 'Matemática',
            'portugues': 'Português',
            'ciencias': 'Ciências',
            'historia': 'História',
            'geografia': 'Geografia',
            'ingles': 'Inglês',
            'fisica': 'Física',
            'quimica': 'Química',
            'biologia': 'Biologia',
            'filosofia': 'Filosofia',
            'sociologia': 'Sociologia',
            'artes': 'Artes',
            'educacaofisica': 'Educação Física'
        };
        return disciplinas[disciplina] || disciplina;
    }
    
    function carregarConfiguracoesDoLocalStorage() {
        // Carregar configurações
        const apiKey = localStorage.getItem('profquest_apiKey') || '';
        const modeloIA = localStorage.getItem('profquest_modeloIA') || 'gpt-4';
        const tema = localStorage.getItem('profquest_tema') || 'claro';
        
        // Aplicar configurações
        document.getElementById('apiKey').value = apiKey;
        document.getElementById('modeloIA').value = modeloIA;
        
        if (tema === 'claro') {
            document.getElementById('temaClaro').checked = true;
        } else {
            document.getElementById('temaEscuro').checked = true;
        }
        
        aplicarTema(tema);
        
        // Carregar perfil escolar
        const nomeEscola = localStorage.getItem('profquest_nomeEscola') || '';
        const logoEscola = localStorage.getItem('profquest_logoEscola') || '';
        
        document.getElementById('nomeEscola').value = nomeEscola;
        
        if (logoEscola) {
            logoEscolaBase64 = logoEscola;
            document.querySelector('#previewLogo img').src = logoEscola;
            previewLogo.classList.remove('d-none');
        }
    }
    
    function aplicarTema(tema) {
        if (tema === 'escuro') {
            document.body.classList.add('tema-escuro');
        } else {
            document.body.classList.remove('tema-escuro');
        }
    }
    
    // Funções globais para o histórico
    window.visualizarAtividade = function(id) {
        const historico = JSON.parse(localStorage.getItem('profquest_historico') || '[]');
        const atividade = historico.find(item => item.id === id);
        
        if (atividade) {
            // Em uma implementação real, aqui seria carregado o PDF da atividade
            // Por enquanto, apenas mostramos uma mensagem
            mostrarNotificacao(`Visualizando: ${atividade.titulo}`, 'info');
            
            // Mostrar modal de visualização com uma simulação
            const pdfViewer = document.getElementById('pdfViewer');
            pdfViewer.innerHTML = `
                <div class="bg-white p-4" style="min-height: 500px;">
                    <div class="text-center mb-4">
                        <h2>${atividade.titulo}</h2>
                        <p>Data: ${formatarData(atividade.data)}</p>
                        <p>Tipo: ${traduzirTipoAtividade(atividade.tipo)}</p>
                        <p>Disciplina: ${traduzirDisciplina(atividade.disciplina)}</p>
                        <p>Número de questões: ${atividade.questoes}</p>
                    </div>
                    <div class="text-center">
                        <p>Visualização da atividade salva no histórico</p>
                    </div>
                </div>
            `;
            
            const modalPDF = new bootstrap.Modal(document.getElementById('modalPDF'));
            modalPDF.show();
        }
    };
    
    window.excluirAtividade = function(id) {
        if (confirm('Tem certeza que deseja excluir esta atividade do histórico?')) {
            const historico = JSON.parse(localStorage.getItem('profquest_historico') || '[]');
            const novoHistorico = historico.filter(item => item.id !== id);
            localStorage.setItem('profquest_historico', JSON.stringify(novoHistorico));
            carregarHistoricoDoLocalStorage();
            mostrarNotificacao('Atividade excluída com sucesso!', 'success');
        }
    };
});