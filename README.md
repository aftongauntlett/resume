# Resume Builder

Single-source resume workflow using `resumeData.json`.

## How this works

- Edit content in `resumeData.json`
- Run `npm run build`
- Builder outputs:
  - `afton-gauntlett-resume.pdf`
  - HTML preview files are disabled by default. Set `GENERATE_HTML_PREVIEW=1` when running a build if you explicitly want HTML output.
  - The PDF is built directly by pdfmake inside build.js.

## Quick start

```bash
npm install
npm run build
```

`npm run dev` runs the same build command.

## Cover letter workflow

- Update `coverLetterData.json` with your drafted letter content.
- `orgSlug` is required and must be explicitly set before building.
- Run `npm run cover-letter`
- Builder outputs:
  - `afton-gauntlett-cover-letter.pdf`
  - The PDF is copied to `~/Desktop/afton-gauntlett-cover-letter.pdf`

If `orgSlug` is missing or still set to a placeholder, the cover letter build stops with an error and does not proceed.

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
- pdftotext output is the source of truth for what ATS scanners will read — not the visual PDF in a browser
- no trailing blank page

## Commit workflow

```bash
git status
git add README.md resumeData.json build.js resume.hbs style.css package.json package-lock.json
git add -u
git commit -m "Update resume workflow docs and clean dead code"
```

If you only changed content, commit just `resumeData.json` plus regenerated outputs as needed.
