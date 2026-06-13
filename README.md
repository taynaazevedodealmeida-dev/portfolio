# Portfólio — Tayna Azevedo · Consultora de IA & Produtos

Portfólio web bilíngue (PT/EN) com **demonstrações cinematográficas** de cada projeto,
no espírito do `dita-demo`: o visitante aperta *play* e assiste o produto trabalhar —
a dor, a entrada, a IA pensando e o resultado. **Nenhum dado real é exposto**: todas as
amostras são sintéticas.

> Posicionamento: *Consultora de IA · Especialista em Desenvolvimento de Produtos* —
> Product Manager · Creative AI Engineer · AI Product Builder · No-Code · AI Prototyper.

---

## O que tem aqui

- **1 hub** (`index.html`): hero, método (dor → diagnóstico → protótipo → entrega),
  habilidades, grade filtrável de **17 projetos** e contato.
- **17 demos cinematográficas** (`demos/*.html`): autoplay, trilho de progresso,
  controles (play/pause/anterior/próximo/repetir) e legendas — tudo bilíngue.
- **Motor reutilizável** (`assets/js/demo.js`) que dá a todas as demos o mesmo rigor.

Carros-chefe: **DITA, Synthia CFO, Creaitivity, NexusAI ERP** ·
Linha B2B: **Ana & Lisa, Conta Certa, Dra. Cláusula, Seu Vínculo** ·
IA aplicada: **Fake-News Detector, Smart Triage, Anomaly Detector, RAG Docs, Creative AI Director** ·
No-code (no ar): **AI Audit, Fiscal Flow, Nicho-Bot, Data-Quality Checker**.

## Estrutura

```
portfolio-tayna/
├── index.html              hub do portfólio
├── assets/
│   ├── css/base.css        design system (light editorial premium)
│   ├── css/demo.css        motor de demo + biblioteca de componentes de palco
│   ├── js/i18n.js          alternância PT/EN (persistente)
│   ├── js/demo.js          motor cinematográfico (autoplay, controles, fases)
│   └── js/hub.js           scroll-reveal, nav, filtros de projeto
└── demos/                  17 demonstrações (uma por projeto)
```

Sem build, sem framework, sem dependências instaláveis — só HTML/CSS/JS e fontes do Google.

## Rodar localmente

Dê **duplo clique** em `index.html` (abre em qualquer navegador). As demos abrem a partir
dos cards. Para alternar idioma, use o botão **PT / EN** no topo.

## Publicar no GitHub Pages

1. Crie um repositório novo (ex.: `portfolio`) na sua conta `taynaazevedodealmeida-dev`.
2. Suba **o conteúdo desta pasta** na raiz do repositório:
   ```bash
   cd portfolio-tayna
   git init && git add . && git commit -m "portfolio"
   git branch -M main
   git remote add origin https://github.com/taynaazevedodealmeida-dev/portfolio.git
   git push -u origin main
   ```
3. No GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch**,
   selecione **`main`** e a pasta **`/ (root)`**, salve.
4. Em ~1 minuto o site fica no ar em:
   `https://taynaazevedodealmeida-dev.github.io/portfolio/`

> Como tudo usa caminhos **relativos** (`assets/...`, `demos/...`, `../index.html`),
> funciona tanto no duplo clique quanto no GitHub Pages, em qualquer subpasta.

## Personalizar

- **Cor de um projeto:** cada card no `index.html` e cada demo têm `style="--accent:#xxxxxx"`.
- **Texto bilíngue:** todo texto tem `<span data-pt>…</span><span data-en>…</span>`.
- **Adicionar projeto:** duplique um arquivo em `demos/`, ajuste as cenas (`<section class="scene" data-dur="...">`)
  e crie um card correspondente no `index.html`.
- **Ritmo das cenas:** `data-dur` (ms) em cada `<section class="scene">`.

---

### English (short)

Bilingual (PT/EN) portfolio with a **cinematic auto-playing demo for every project**, in the
spirit of the `dita-demo` reference. No real data — all samples are synthetic. Pure
HTML/CSS/JS, no build. To publish: push this folder to a GitHub repo and enable **Pages**
on `main` / root. Toggle language with the **PT / EN** switch. Edit copy via the
`data-pt` / `data-en` spans and accent colors via the `--accent` CSS variable.
