## Resume Workflow

When working on resume updates, read `resumeData.json` and `build.js` only.
Ignore `docs/writing-guide.md`, `docs/cover-letter-rules.md`, and `coverLetterData.json` - these are cover letter files.

## Cover Letter Workflow

When a job description is pasted into chat:

1. Read `docs/writing-guide.md` for background, stories, and voice.
2. Read `docs/cover-letter-rules.md` for structure, style, and anti-patterns.
3. Read `resumeData.json` for current titles, dates, and technical specifics.
4. Ask me for the company name and do not move forward until I provide it.
5. Draft the cover letter, populate `coverLetterData.json` with the result, and set `orgSlug` so the signature line includes `hire.aftongauntlett.com/for/[org_slug]`.
6. Run `npm run cover-letter` to build the PDF and copy it to Desktop.

Cover letters are private. Do not suggest committing or pushing:

- `docs/writing-guide.md`
- `docs/cover-letter-rules.md`
- `coverLetterData.json`
- `afton-gauntlett-cover-letter.pdf`
- `afton-gauntlett-cover-letter.html`
- `coverLetter.hbs`

- Always overwrite `coverLetterData.json` completely — never append or merge with prior content.
- Never leave `[bracketed]` placeholder text in any field before building.
- `coverLetterData.json` must include an `orgSlug` field (company name, lowercase, underscores for spaces).
- Do not write a generic closing sentence. The final paragraph is the close — write it as one direct, confident sentence.
