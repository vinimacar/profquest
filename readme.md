# ProfQuest - Sistema de Geração de Atividades Pedagógicas

## Sobre o Projeto

O ProfQuest é um sistema que utiliza Inteligência Artificial para ajudar professores a criar atividades pedagógicas de forma rápida e eficiente. O sistema permite gerar provas, exercícios e trabalhos para diversas disciplinas e séries escolares.

## Funcionalidades

- Geração de questões personalizadas usando IA
- Suporte a questões abertas, fechadas e mistas
- Histórico de atividades geradas
- Personalização com logo e nome da escola
- Exportação para PDF
- Temas claro e escuro

## Como Usar

1. Clone este repositório
2. Abra o arquivo `index.html` em seu navegador
3. Configure sua chave da API do OpenAI (ou use o modo de simulação)
4. Comece a criar atividades!

## Segurança da Chave da API

### Importante: Proteção da Chave da API no GitHub

Este projeto utiliza a API do OpenAI (GPT-4) para gerar questões. Para proteger sua chave da API ao usar este projeto no GitHub, siga estas recomendações:

1. **NUNCA comite sua chave da API diretamente no código**
   - A chave foi removida do código e agora é solicitada ao usuário
   - O sistema salva a chave apenas no localStorage do navegador do usuário

2. **Opções para usar o projeto com segurança:**

   a) **Modo de simulação:**
   - Use o botão "Usar Simulação (Sem API)" quando solicitado
   - O sistema usará exemplos pré-definidos em vez de chamar a API

   b) **Uso local:**
   - Clone o repositório e use-o localmente
   - Insira sua chave da API quando solicitado
   - A chave ficará armazenada apenas no seu navegador

   c) **Uso com parâmetro de URL (para testes):**
   - Adicione sua chave como parâmetro de URL: `index.html?apiKey=sua-chave-aqui`
   - A chave será salva no localStorage e removida da URL automaticamente
   - **ATENÇÃO:** Use este método apenas para testes locais, nunca compartilhe URLs com sua chave

3. **Para implementação em produção:**
   - Considere criar um backend simples que armazene a chave da API de forma segura
   - Use serviços como Netlify, Vercel ou Heroku que permitem armazenar variáveis de ambiente
   - Implemente um proxy de API para fazer as chamadas ao OpenAI sem expor a chave no frontend

## Tecnologias Utilizadas

- HTML5, CSS3, JavaScript
- Bootstrap 5
- OpenAI API (GPT-4)
- jsPDF e html2canvas para geração de PDF

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para detalhes.
