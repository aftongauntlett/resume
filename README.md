# Resume

[![Last Commit](https://img.shields.io/github/last-commit/aftongauntlett/resume)](https://github.com/aftongauntlett/resume/commits/main)
[![Commit Activity](https://img.shields.io/github/commit-activity/m/aftongauntlett/resume)](https://github.com/aftongauntlett/resume/graphs/commit-activity)
[![Repository Size](https://img.shields.io/github/repo-size/aftongauntlett/resume)](https://github.com/aftongauntlett/resume)

Professional resume built with modern web technologies and optimized for both ATS systems and human reviewers.

## Technical Implementation

### Built With

- **HTML5 & CSS3** with custom design system
- **Chrome Headless** for automated PDF generation
- **Roboto Typography** for modern, readable design
- **CSS Grid & Flexbox** for precise layout control
- **ATS-optimized** structure and formatting

### Files Structure

```
├── index.html                      # Portfolio landing page
├── afton-gauntlett-resume.pdf      # ATS-optimized resume (PDF)
├── afton-gauntlett-resume.html     # Resume source (HTML/CSS)
├── build.js                 # Puppeteer PDF generation script
├── package.json                    # Node.js dependencies
└── .gitignore                      # Git ignore rules
```

## PDF Generation Process

The resume PDF is generated programmatically from HTML/CSS source using Puppeteer for clean, professional output without browser artifacts:

```bash
# Install dependencies
npm install

# Generate clean PDF (no headers/footers)
node build.js
```

### Alternative Method (Chrome Headless)

```bash
# Direct Chrome headless (may include browser headers)
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
  --headless \
  --disable-gpu \
  --print-to-pdf=afton-gauntlett-resume.pdf \
  --print-to-pdf-no-header \
  file://$(pwd)/afton-gauntlett-resume.html
```

## Design Philosophy

- **Modern & Clean**: Minimal black and white design with strategic typography and spacing
- **ATS Compatible**: Structured markup and formatting optimized for automated parsing
- **Print Ready**: Precise margins, page breaks, and font sizing for professional printing
- **Developer Focused**: Version-controlled source with programmatic generation workflow

## ATS Optimization Features

- Clean text extraction verified with `pdftotext`
- Standard section headers and consistent formatting
- Strategic keyword placement for frontend engineering roles
- Unicode-free contact information and bullet points
- Quantified achievements and technical skill categorization

## Verification

Test ATS readability:

```bash
# Extract text content for ATS verification
pdftotext afton-gauntlett-resume.pdf -
```

## Development Workflow

1. **Edit Content**: Modify `afton-gauntlett-resume.html`
2. **Preview Changes**: Open HTML in browser or run local server
3. **Generate PDF**: Run `node generate-pdf.js`
4. **Verify Output**: Use `pdftotext` to check ATS compatibility

---

**Contact**: [hello@aftongauntlett.com](mailto:hello@aftongauntlett.com) | [Portfolio](https://aftongauntlett.com) | [LinkedIn](https://linkedin.com/in/afton-gauntlett)
