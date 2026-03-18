# Resume Builder

Single-source resume workflow using `resumeData.json`.

## How this works

- Edit content in `resumeData.json`
- Run `npm run build`
- Builder outputs:
  - `afton-gauntlett-resume.html`
  - `afton-gauntlett-resume.pdf`

## Quick start

```bash
npm install
npm run build
```

`npm run dev` runs the same build command.

## Updating your resume (simple workflow)

### Option A: Edit it yourself

1. Update fields in `resumeData.json`
2. Run `npm run build`
3. Review `afton-gauntlett-resume.pdf`

### Option B: Ask Copilot to do it

Use a prompt like:

"Update `resumeData.json` to [your requested changes], rebuild the resume, and copy the PDF to Desktop."

## ATS / export sanity checks

```bash
pdfinfo afton-gauntlett-resume.pdf
pdftotext afton-gauntlett-resume.pdf -
```

Check for:

- page count stays at 2
- section order is correct
- no ligature breakage (`workflows`, `certification`, etc.)
- no trailing blank page

## Commit workflow

```bash
git status
git add README.md resumeData.json build.js resume.hbs style.css package.json package-lock.json
git add -u
git commit -m "Update resume workflow docs and clean dead code"
```

If you only changed content, commit just `resumeData.json` plus regenerated outputs as needed.
