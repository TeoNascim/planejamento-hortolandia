
# Planejamento Mensal - Hortolândia

Sistema de planejamento pedagógico para professores da rede municipal de Hortolândia, com suporte a sugestões via Inteligência Artificial (Gemini).

## Funcionalidades

- Editor de planejamento mensal com campos da BNCC.
- Sugestões automáticas de habilidades, estratégias e avaliação via IA.
- Layout de impressão otimizado para PDF (A4 Paisagem).
- Interface responsiva e moderna.

## Tecnologias

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Google Gemini API

## Como rodar localmente

1. Clone o repositório.
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Configure a variável de ambiente `GEMINI_API_KEY` no arquivo `.env`.
4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

## Deploy

O projeto está pronto para ser deployado em plataformas como Vercel, Netlify ou GitHub Pages.
Para gerar a build de produção:
```bash
npm run build
```
O conteúdo da pasta `dist` será gerado e estará pronto para publicação.
