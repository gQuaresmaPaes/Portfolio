document.addEventListener('DOMContentLoaded', function() {
    // Estado inicial
    const state = {
        custos: [
            { id: 1, descricao: "Financiamento (48x)", valor: 2329.83 },
            { id: 2, descricao: "Seguro", valor: 227.90 },
            { id: 3, descricao: "IPVA", valor: 162.24 },
            { id: 4, descricao: "Revisão", valor: 195.25 }
        ],
        operacao: {
            diasPorSemana: 5,
            receitaDia: 350,
            combustivelDia: 121.80
        }
    };

    // Elementos DOM
    const elementos = {
        custosContainer: document.getElementById('custos-container'),
        addCustoBtn: document.getElementById('add-custo'),
        exportBtn: document.getElementById('export-excel'),
        nextBtn: document.getElementById('next-to-operacao'),
        tabBtns: document.querySelectorAll('.tab-btn'),
        tabContents: document.querySelectorAll('.tab-content'),
        modeloCarro: document.getElementById('modelo-carro'),
        diasSemana: document.getElementById('dias-semana'),
        receitaDia: document.getElementById('receita-dia'),
        combustivelDia: document.getElementById('combustivel-dia')
    };

    // Renderizar custos
    function renderCustos() {
        elementos.custosContainer.innerHTML = state.custos.map(custo => `
            <div class="custo-item" data-id="${custo.id}">
                <input type="text" value="${custo.descricao}" class="custo-descricao">
                <input type="number" value="${custo.valor.toFixed(2)}" class="custo-valor" step="0.01">
                <button class="remove-custo">❌</button>
            </div>
        `).join('');

        // Adicionar event listeners
        document.querySelectorAll('.custo-descricao').forEach(input => {
            input.addEventListener('change', function() {
                const id = parseInt(this.closest('.custo-item').dataset.id);
                const custo = state.custos.find(c => c.id === id);
                if (custo) custo.descricao = this.value;
            });
        });

        document.querySelectorAll('.custo-valor').forEach(input => {
            input.addEventListener('change', function() {
                const id = parseInt(this.closest('.custo-item').dataset.id);
                const custo = state.custos.find(c => c.id === id);
                if (custo) custo.valor = parseFloat(this.value);
            });
        });

        document.querySelectorAll('.remove-custo').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.closest('.custo-item').dataset.id);
                state.custos = state.custos.filter(c => c.id !== id);
                renderCustos();
            });
        });
    }

    // Sistema de abas
    function setupTabs() {
        elementos.tabBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const tabId = this.dataset.tab;
                
                // Atualizar botões
                elementos.tabBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                // Atualizar conteúdos
                elementos.tabContents.forEach(content => {
                    content.classList.remove('active');
                    if (content.id === tabId) {
                        content.classList.add('active');
                    }
                });
            });
        });
    }

    // Adicionar novo custo
    function setupAddCusto() {
        elementos.addCustoBtn.addEventListener('click', function() {
            const newId = state.custos.length > 0 
                ? Math.max(...state.custos.map(c => c.id)) + 1 
                : 1;
            state.custos.push({ 
                id: newId, 
                descricao: "Novo Custo", 
                valor: 0 
            });
            renderCustos();
        });
    }

    // Botão avançar para operação
    function setupNextButton() {
        elementos.nextBtn.addEventListener('click', function() {
            document.querySelector('.tab-btn[data-tab="operacao"]').click();
        });
    }

    // Gerar Excel
    async function gerarPlanilha() {
        // Mostrar loading
        const loading = document.createElement('div');
        loading.className = 'loading';
        loading.innerHTML = '<div class="loading-spinner"></div>';
        document.body.appendChild(loading);

        // Atualizar dados
        state.operacao = {
            diasPorSemana: parseInt(elementos.diasSemana.value),
            receitaDia: parseFloat(elementos.receitaDia.value),
            combustivelDia: parseFloat(elementos.combustivelDia.value)
        };

        // Criar workbook
        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'Gerador de Planilha para Motoristas';
        const modelo = elementos.modeloCarro.value || "Veículo";
        
        // Estilos
        const styles = {
            header: {
                font: { bold: true, color: { argb: 'FFFFFFFF' } },
                fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2C3E50' } },
                border: {
                    top: { style: 'thin', color: { argb: 'FF000000' } },
                    bottom: { style: 'thin', color: { argb: 'FF000000' } },
                    left: { style: 'thin', color: { argb: 'FF000000' } },
                    right: { style: 'thin', color: { argb: 'FF000000' } }
                },
                alignment: { vertical: 'middle', horizontal: 'center' }
            },
            title: {
                font: { bold: true, size: 16, color: { argb: 'FFFFFFFF' } },
                fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF3498DB' } },
                alignment: { vertical: 'middle', horizontal: 'center' },
                border: {
                    top: { style: 'thin', color: { argb: 'FF000000' } },
                    bottom: { style: 'thin', color: { argb: 'FF000000' } },
                    left: { style: 'thin', color: { argb: 'FF000000' } },
                    right: { style: 'thin', color: { argb: 'FF000000' } }
                }
            },
            money: {
                numFmt: '"R$"#,##0.00',
                fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF5F7FA' } },
                alignment: { vertical: 'middle', horizontal: 'center' },
                border: {
                    top: { style: 'thin', color: { argb: 'FF000000' } },
                    bottom: { style: 'thin', color: { argb: 'FF000000' } },
                    left: { style: 'thin', color: { argb: 'FF000000' } },
                    right: { style: 'thin', color: { argb: 'FF000000' } }
                }
            },
            total: {
                font: { bold: true },
                fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2ECC71' } },
                numFmt: '"R$"#,##0.00',
                alignment: { vertical: 'middle', horizontal: 'center' },
                border: {
                    top: { style: 'thin', color: { argb: 'FF000000' } },
                    bottom: { style: 'thin', color: { argb: 'FF000000' } },
                    left: { style: 'thin', color: { argb: 'FF000000' } },
                    right: { style: 'thin', color: { argb: 'FF000000' } }
                }
            },
            profit: {
                font: { bold: true, color: { argb: 'FFFFFFFF' } },
                fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF27AE60' } },
                numFmt: '"R$"#,##0.00',
                alignment: { vertical: 'middle', horizontal: 'center' },
                border: {
                    top: { style: 'thin', color: { argb: 'FF000000' } },
                    bottom: { style: 'thin', color: { argb: 'FF000000' } },
                    left: { style: 'thin', color: { argb: 'FF000000' } },
                    right: { style: 'thin', color: { argb: 'FF000000' } }
                }
            },
            defaultCell: {
                alignment: { vertical: 'middle', horizontal: 'center' },
                border: {
                    top: { style: 'thin', color: { argb: 'FF000000' } },
                    bottom: { style: 'thin', color: { argb: 'FF000000' } },
                    left: { style: 'thin', color: { argb: 'FF000000' } },
                    right: { style: 'thin', color: { argb: 'FF000000' } }
                }
            }
        };

        // Função para aplicar estilo padrão
        function applyDefaultStyle(worksheet) {
            worksheet.eachRow({ includeEmpty: true }, function(row, rowNumber) {
                row.eachCell({ includeEmpty: true }, function(cell, colNumber) {
                    if (!cell.style) {
                        cell.style = styles.defaultCell;
                    } else {
                        cell.style = {
                            ...cell.style,
                            alignment: styles.defaultCell.alignment,
                            border: styles.defaultCell.border
                        };
                    }
                });
            });
        }

        // ========== PLANILHA 1: CUSTOS FIXOS ==========
        const custosWS = workbook.addWorksheet("Custos Fixos");
        
        // Título
        custosWS.mergeCells('A1:D1');
        custosWS.getCell('A1').value = `CUSTOS FIXOS - ${modelo.toUpperCase()}`;
        custosWS.getCell('A1').style = styles.title;
        
        // Data de geração
        custosWS.getCell('D2').value = new Date();
        custosWS.getCell('D2').numFmt = 'dd/mm/yyyy';
        custosWS.getCell('D2').style = styles.defaultCell;
        
        // Cabeçalhos
        custosWS.getRow(4).values = ["DESCRIÇÃO", "VALOR MENSAL (R$)", "OBSERVAÇÕES", "CATEGORIA"];
        custosWS.getRow(4).eachCell(cell => { cell.style = styles.header; });
        
        // Dados dos custos
        state.custos.forEach((custo, index) => {
            const row = custosWS.getRow(5 + index);
            row.values = [custo.descricao, custo.valor, "", "Fixo"];
            row.getCell(1).style = styles.defaultCell;
            row.getCell(2).style = styles.money;
            row.getCell(3).style = styles.defaultCell;
            row.getCell(4).style = styles.defaultCell;
        });
        
        // Total geral
        const totalRow = 5 + state.custos.length;
        custosWS.getCell(`B${totalRow}`).value = {
            formula: `SUM(B5:B${totalRow - 1})`,
            result: state.custos.reduce((sum, c) => sum + c.valor, 0)
        };
        custosWS.getCell(`B${totalRow}`).style = styles.total;
        custosWS.getCell(`A${totalRow}`).value = "TOTAL GERAL";
        custosWS.getCell(`A${totalRow}`).style = {
            font: { bold: true },
            alignment: styles.defaultCell.alignment,
            border: styles.defaultCell.border
        };
        
        // Ajustar largura das colunas
        custosWS.columns = [
            { width: 30 }, { width: 15 }, { width: 25 }, { width: 15 }
        ];

        // Aplicar estilo padrão
        applyDefaultStyle(custosWS);

        // ========== PLANILHA 2: CUSTO TOTAL 48 MESES ==========
        const projecaoWS = workbook.addWorksheet("Custo Total 48 Meses");
        
        // Título
        projecaoWS.mergeCells('A1:D1');
        projecaoWS.getCell('A1').value = `CUSTO TOTAL DO VEÍCULO - 48 MESES (${modelo})`;
        projecaoWS.getCell('A1').style = { 
            ...styles.title,
            fill: { ...styles.title.fill, fgColor: { argb: 'FF9B59B6' } }
        };
        
        // Cabeçalhos
        projecaoWS.getRow(3).values = ["Mês", "Parcela Financiamento", "Gasto com Combustível", "Custo Acumulado"];
        projecaoWS.getRow(3).eachCell(cell => { cell.style = styles.header; });
        
        // Pegar valores
        const parcelaMensal = state.custos.find(c => c.descricao.includes("Financiamento"))?.valor || 0;
        const gastoCombustivelMensal = state.operacao.combustivelDia * state.operacao.diasPorSemana * 4;
        let custoAcumulado = 0;
        
        // Preencher dados
        for (let i = 0; i < 48; i++) {
            const row = projecaoWS.getRow(4 + i);
            custoAcumulado += parcelaMensal + gastoCombustivelMensal;
            
            row.values = [
                i + 1,
                parcelaMensal,
                gastoCombustivelMensal,
                custoAcumulado
            ];
            
            // Formatar como moeda
            row.getCell(1).style = styles.defaultCell;
            row.getCell(2).style = styles.money;
            row.getCell(3).style = styles.money;
            row.getCell(4).style = styles.money;
            
            // Linhas alternadas
            if (i % 2 === 0) {
                row.eachCell(cell => {
                    cell.style = {
                        ...cell.style,
                        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } }
                    };
                });
            } else {
                row.eachCell(cell => {
                    cell.style = {
                        ...cell.style,
                        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF5F7FA' } }
                    };
                });
            }
        }
        
        // Linha de TOTAL FINAL
        const finalRow = projecaoWS.getRow(52);
        finalRow.values = [
            "TOTAL", 
            parcelaMensal * 48,
            gastoCombustivelMensal * 48,
            custoAcumulado
        ];
        finalRow.eachCell(cell => { 
            cell.style = { 
                ...styles.total,
                font: { ...styles.total.font, color: { argb: 'FFFFFFFF' } }
            };
        });
        
        // Ajustar largura das colunas
        projecaoWS.columns = [
            { width: 8 },  // Mês
            { width: 20 }, // Financiamento
            { width: 20 }, // Combustível
            { width: 20 }  // Acumulado
        ];

        // Aplicar estilo padrão
        applyDefaultStyle(projecaoWS);

 // ========== ANÁLISE FINANCEIRA (REFORMULADA) ==========
        const analiseWS = workbook.addWorksheet("Lucro do Motorista");
        
        // Título
        analiseWS.mergeCells('A1:D1');
        analiseWS.getCell('A1').value = `CONTROLE FINANCEIRO MENSAL - ${modelo.toUpperCase()}`;
        analiseWS.getCell('A1').style = { 
            ...styles.title,
            fill: { ...styles.title.fill, fgColor: { argb: 'FF3498DB' } }
        };
        
        // Legenda explicativa
        analiseWS.getCell('A2').value = "Esta planilha mostra seu lucro real após todas as despesas";
        analiseWS.mergeCells('A2:D2');
        
        // Cabeçalhos
        analiseWS.getRow(4).values = ["Descrição", "Semanal", "Mensal", "Observações"];
        analiseWS.getRow(4).eachCell(cell => { cell.style = styles.header; });

        // Calcular valores
        const receitaSemanal = state.operacao.receitaDia * state.operacao.diasPorSemana;
        const receitaMensal = receitaSemanal * 4;
        
        const custosFixosMensal = state.custos.reduce((sum, c) => sum + c.valor, 0);
        const custosFixosSemanal = custosFixosMensal / 4;
        
        const combustivelSemanal = state.operacao.combustivelDia * state.operacao.diasPorSemana;
        const combustivelMensal = combustivelSemanal * 4;
        
        const lucroSemanal = receitaSemanal - combustivelSemanal - custosFixosSemanal;
        const lucroMensal = receitaMensal - combustivelMensal - custosFixosMensal;

        // Dados da análise
        const dados = [
            ["👉 RECEITA BRUTA", receitaSemanal, receitaMensal, `Média de R$ ${state.operacao.receitaDia}/dia`],
            ["", "", "", ""],
            ["🚗 CUSTO COM COMBUSTÍVEL", combustivelSemanal, combustivelMensal, `Média de R$ ${state.operacao.combustivelDia}/dia`],
            ["💳 CUSTOS FIXOS", custosFixosSemanal, custosFixosMensal, "Inclui financiamento, seguro, etc"],
            ["", "", "", ""],
            ["✅ LUCRO LÍQUIDO", lucroSemanal, lucroMensal, "Valor que realmente sobra pra você"],
            ["", "", "", ""],
            ["📊 MÉDIA DIÁRIA LIQUIDA", lucroSemanal/state.operacao.diasPorSemana, "", "Quanto você ganha por dia trabalhado"]
        ];

        // Adicionar dados
        dados.forEach((rowData, index) => {
            const row = analiseWS.getRow(5 + index);
            row.values = rowData;
            
            // Formatar valores monetários
            if ([0,2,3,5,7].includes(index)) {
                row.getCell(2).style = styles.money;
                row.getCell(3).style = styles.money;
            }
            
            // Destacar linha de lucro
            if (index === 5) {
                row.eachCell(cell => {
                    cell.style = {
                        ...styles.profit,
                        font: { size: 12, bold: true }
                    };
                });
            }
            
            // Linhas vazias
            if ([1,3,6].includes(index)) {
                row.eachCell(cell => {
                    cell.style = {
                        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF5F7FA' } }
                    };
                });
            }
        });

        // Ajustes finais
        analiseWS.columns = [
            { width: 25 }, // Descrição
            { width: 15 }, // Semanal
            { width: 15 }, // Mensal
            { width: 30 }  // Observações
        ];
        
        // Ajustar largura das colunas
        analiseWS.columns = [
            { width: 25 }, { width: 18 }, { width: 18 }, { width: 30 }
        ];

        // Aplicar estilo padrão
        applyDefaultStyle(analiseWS);

        // ========== GERAR ARQUIVO ==========
        try {
            const buffer = await workbook.xlsx.writeBuffer();
            saveAs(new Blob([buffer]), `Relatorio_Financeiro_${modelo.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`);
        } catch (error) {
            console.error("Erro ao gerar Excel:", error);
            alert("Ocorreu um erro ao gerar o arquivo.");
        } finally {
            document.body.removeChild(loading);
        }
    }

    // Configurar eventos
    function setupEventListeners() {
        elementos.exportBtn.addEventListener('click', gerarPlanilha);
        setupAddCusto();
        setupTabs();
        setupNextButton();
    }

    // Inicialização
    function init() {
        renderCustos();
        setupEventListeners();
    }

    init();
});