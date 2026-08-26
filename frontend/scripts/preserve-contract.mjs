import { readFile, writeFile } from 'node:fs/promises'

const file = new URL('../dist/index.html', import.meta.url)
const html = await readFile(file, 'utf8')
const contract = '<!-- THESIS: FarmFleet is a field ledger, not a generic dashboard; the run sheet owns the first glance. OWN-WORLD: warm paper, deep ink, fixed-cell data rhythm, and harvest orange for decisions. STORY: the team sees what is moving, reviews what changed, and sends the next job into the field. FIRST VIEWPORT: a compact operations pulse leads to today\'s run sheet, with the primary new-booking action anchored in the top right. FORM: a field-console ledger, built from direction seed f53705ae and raised with split-flap status rhythm. FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance -->'
await writeFile(file, html.replace('<body>\n', `<body>\n    ${contract}\n`), 'utf8')
