# 🤖 Robô de Busca de Vagas Tech (White-Label)

Uma aplicação web inteligente e *white-label* projetada para revolucionar a recolocação profissional de desenvolvedores. Desenvolvida como uma plataforma SaaS voltada para bootcamps, instituições de ensino e empresas de HR Tech, o sistema analisa currículos em PDF, extrai habilidades e experiências, e utiliza um algoritmo de *matching* para recomendar as vagas mais adequadas ao perfil do candidato.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-4A4A55?style=for-the-badge&logo=react&logoColor=white)

---

## ✨ Funcionalidades Principais

*   **Leitura e Análise de PDF:** Upload de currículos (Drag & Drop) com processamento direto no navegador, simulando a extração de *skills* e nível de senioridade.
*   **Algoritmo de Matching Avançado:** Cruza os dados do perfil do candidato com uma base de +2000 vagas, gerando um "Match Score" (%) baseado em compatibilidade técnica e nível de experiência.
*   **Dashboard Interativo:** Visualização das vagas recomendadas, filtros por modalidade (Remoto, Híbrido, Presencial) e busca textual.
*   **Insights de Perfil:** Exibição clara das *skills* identificadas e *gaps* (habilidades faltantes) para cada vaga, ajudando o candidato a direcionar seus estudos.
*   **Design White-Label:** Painel de configurações para customização instantânea da marca (nome da plataforma e cor principal), com persistência local via `Zustand`.
*   **UI/UX Premium:** Interface moderna com suporte nativo a *Dark Mode*, animações fluidas com `Framer Motion` e *Glassmorphism*.

---

## 🛠️ Tecnologias Utilizadas

O projeto foi construído com foco em performance, escalabilidade e experiência do usuário, adotando as melhores práticas do mercado:

*   **Frontend:** React 18, TypeScript, Vite
*   **Estilização:** Tailwind CSS v4
*   **Gerenciamento de Estado:** Zustand (com middleware de persistência)
*   **Roteamento:** React Router DOM
*   **Animações:** Framer Motion
*   **Processamento de PDF:** pdf-lib (Leitura otimizada no lado do cliente)
*   **Ícones:** Lucide React

---

## 🚀 Como Executar o Projeto

Siga as instruções abaixo para rodar a aplicação no seu ambiente local.

### Pré-requisitos

*   Node.js (versão 18 ou superior recomendada)
*   NPM ou Yarn

### Instalação

1. Clone o repositório ou navegue até a pasta do projeto:
   ```bash
   cd Rob-de-Busca-de-Vagas-Tech
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

4. Acesse a aplicação no seu navegador (geralmente em `http://localhost:5173` ou `http://localhost:5174`).

---

## 📁 Estrutura do Projeto

A arquitetura do projeto foi desenhada seguindo o padrão *feature-based* para facilitar a manutenção e escalabilidade:

```text
src/
├── assets/          # Imagens e ícones estáticos
├── components/      # Componentes reutilizáveis de UI (Layout, etc)
├── data/            # Mock de dados (base de vagas gerada via script)
├── pages/           # Páginas da aplicação (Home, Dashboard, Settings)
├── store/           # Configuração de estado global (Zustand)
├── types/           # Definições de tipagem do TypeScript
└── utils/           # Funções utilitárias (Parsers, Algoritmo de Match)
    ├── jobMatcher.ts     # Lógica de cálculo de pontuação das vagas
    ├── pdfParser.ts      # Leitura do arquivo PDF
    └── resumeAnalyzer.ts # Extração semântica de skills e senioridade
```

---

## 🔧 Scripts Úteis

O projeto inclui um script Node.js para gerar uma base massiva de vagas *mockadas* para testes de carga e demonstração do algoritmo.

Para recriar a base de vagas (gera `src/data/jobs.json` com 2000 vagas aleatórias):
```bash
node scripts/generate-jobs.js
```

---

## 📄 Notas de Desenvolvimento

*   **Processamento de PDF:** O sistema foi projetado para rodar inteiramente no cliente (*Client-side*). Como a extração de texto puro de PDFs no navegador é frágil, a solução atual utiliza `pdf-lib` para validação do arquivo e simula o processamento heurístico. Em um ambiente de produção real, recomenda-se conectar o envio do arquivo a uma API backend (Node.js com `pdf-parse` ou Python).
*   **White-label:** Todas as configurações de tema e marca são salvas no `localStorage`, garantindo que as preferências de branding sejam mantidas entre sessões.

---
*Desenvolvido com foco na melhor experiência de HR Tech e Educação.*
