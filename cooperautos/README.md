# Cooperautos — landing pages e materiais

Site estático (HTML + CSS, sem build) da Cooperautos, cooperativa de consumo do setor automotivo, e os materiais de marketing em Markdown.

## Páginas
| Página | Arquivo |
|---|---|
| Hub (início) | `index.html` |
| Bem-estar e Saúde | `saude/index.html` |
| Seguros (auto, vida, residencial) | `seguros/index.html` |
| Proteção Veicular (leves e caminhões) | `protecao-veicular/index.html` |
| Linha Automotiva (peças, pneus, abastecimento) | `automotivo/index.html` |
| Migração de proteção + saúde (protótipo) | `migracao/index.html` |

Cabeçalho, rodapé, contatos e o envio dos formulários ficam em `assets/layout.js`. Cores e estilos em `assets/style.css`.

Os formulários não têm servidor: ao enviar, abrem o e-mail do visitante já preenchido para contato@cooperautos.com.br. Para capturar leads direto, troque por um serviço de formulário ou CRM.

## Materiais
| Arquivo | Conteúdo |
|---|---|
| `materiais/00-marca-e-tom-de-voz.md` | Público, tom de voz, cores, avisos legais |
| `materiais/01-institucional.md` | Dados, quem somos, como funciona, pitch |
| `materiais/02-saude.md` | Produtos, argumentos e objeções de saúde |
| `materiais/03-seguros.md` | Seguros auto, vida, residencial, empresarial |
| `materiais/04-protecao-veicular.md` | Tabelas de planos, PowerTrain, caminhões |
| `materiais/05-automotivo.md` | Pneus, lubrificantes, peças, abastecimento, oficinas |
| `materiais/06-redes-sociais.md` | 14 posts prontos por linha |
| `materiais/07-scripts-whatsapp.md` | Scripts de atendimento por linha |
| `materiais/pendencias.md` | O que falta confirmar |

Fonte dos dados: site atual https://cooperautos-hub-connect.lovable.app

## Ver localmente
Abra `index.html` no navegador, ou rode `python3 -m http.server` na pasta e acesse http://localhost:8000.

## Publicar no GitHub Pages
Settings → Pages → Source: *Deploy from a branch* → `main` / `(root)`.
