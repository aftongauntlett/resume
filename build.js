const fs = require("fs");
const path = require("path");
const os = require("os");
const Handlebars = require("handlebars");
const PdfPrinter = require("pdfmake");

const DEFAULT_RESUME_DATA_FILE = "resumeData.json";
const DEFAULT_COVER_LETTER_DATA_FILE = "coverLetterData.json";
const RESUME_TEMPLATE_FILE = "resume.hbs";
const COVER_LETTER_TEMPLATE_FILE = "coverLetter.hbs";
const COVER_LETTER_BASE_NAME = "afton-gauntlett-cover-letter";
const GENERATE_HTML_PREVIEW = process.env.GENERATE_HTML_PREVIEW === "1";

Handlebars.registerHelper("tel", (str) => (str || "").replace(/[^\d+]/g, ""));

Handlebars.registerHelper("concatSkills", (skills) => {
  if (!skills || typeof skills !== "object") {
    return "";
  }
  const combined = Object.values(skills).flat().filter(Boolean).join(" • ");
  return combined;
});

const fonts = {
  Inter: {
    normal: path.resolve(__dirname, "fonts/Roboto-Regular.ttf"),
    bold: path.resolve(__dirname, "fonts/Roboto-Bold.ttf"),
    italics: path.resolve(__dirname, "fonts/Roboto-Italic.ttf"),
    bolditalics: path.resolve(__dirname, "fonts/Roboto-Medium.ttf"),
  },
};

const printer = new PdfPrinter(fonts);

function loadJson(fileName) {
  const filePath = path.resolve(__dirname, fileName);
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function sectionHeader(text) {
  return {
    stack: [
      { text, style: "sectionTitle" },
      {
        canvas: [
          {
            type: "line",
            x1: 0,
            y1: 0,
            x2: 528,
            y2: 0,
            lineWidth: 1.6,
            lineColor: "#2e2e2e",
          },
        ],
        margin: [0, 2, 0, 10],
      },
    ],
    margin: [0, 10, 0, 0],
  };
}

function buildContactComponents(personal) {
  const primaryContactComponents = [];
  const secondaryContactComponents = [];

  if (personal.location) {
    primaryContactComponents.push({
      text: personal.location,
      color: "#333333",
    });
  }
  if (personal.phone) {
    if (primaryContactComponents.length)
      primaryContactComponents.push({ text: "  |  ", color: "#333333" });
    primaryContactComponents.push({
      text: personal.phone,
      link: `tel:${personal.phone.replace(/[^\d+]/g, "")}`,
      color: "#333333",
      decoration: "underline",
    });
  }
  if (personal.email) {
    if (primaryContactComponents.length)
      primaryContactComponents.push({ text: "  |  ", color: "#333333" });
    primaryContactComponents.push({
      text: personal.email,
      link: `mailto:${personal.email}`,
      color: "#333333",
      decoration: "underline",
    });
  }
  if (personal.website) {
    if (secondaryContactComponents.length)
      secondaryContactComponents.push({ text: "  |  ", color: "#333333" });
    const websiteUrl = personal.website.match(/^https?:\/\//)
      ? personal.website
      : `https://${personal.website}`;
    secondaryContactComponents.push({
      text: `Portfolio (${websiteUrl})`,
      link: websiteUrl,
      color: "#333333",
      decoration: "underline",
    });
  }

  if (personal.linkedin) {
    if (secondaryContactComponents.length)
      secondaryContactComponents.push({ text: "  |  ", color: "#333333" });
    const linkedinUrl = personal.linkedin.match(/^https?:\/\//)
      ? personal.linkedin
      : `https://${personal.linkedin}`;
    secondaryContactComponents.push({
      text: `LinkedIn (${linkedinUrl})`,
      link: linkedinUrl,
      color: "#333333",
      decoration: "underline",
    });
  }

  if (personal.github) {
    if (secondaryContactComponents.length)
      secondaryContactComponents.push({ text: "  |  ", color: "#333333" });
    const githubUrl = personal.github.match(/^https?:\/\//)
      ? personal.github
      : `https://${personal.github}`;
    secondaryContactComponents.push({
      text: `GitHub (${githubUrl})`,
      link: githubUrl,
      color: "#333333",
      decoration: "underline",
    });
  }

  return { primaryContactComponents, secondaryContactComponents };
}

function normalizeOrgSlug(value) {
  return String(value || "")
    .replace(/[\[\]]/g, "")
    .replace(/\s+/g, "_")
    .toLowerCase()
    .trim();
}

function getCoverLetterOrgSlug(coverLetterData) {
  const orgSlug = normalizeOrgSlug(coverLetterData.orgSlug);
  if (!orgSlug || /^org_slug$/i.test(orgSlug)) {
    throw new Error(
      "Missing required orgSlug in coverLetterData.json. Ask for the company name, set coverLetterData.orgSlug (lowercase with underscores), then run npm run cover-letter.",
    );
  }
  return orgSlug;
}

function normalizeCompanyName(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim();
}

function getCoverLetterCompanyName(coverLetterData, orgSlug) {
  const explicitCompanyName = normalizeCompanyName(coverLetterData.companyName);
  return explicitCompanyName || orgSlugToCompanyName(orgSlug);
}

function getCoverLetterRecipientLabel(coverLetterData, orgSlug) {
  const companyName = getCoverLetterCompanyName(coverLetterData, orgSlug);
  return `Dear ${companyName} hiring team,`;
}

function buildHireProfileUrl(orgSlug) {
  return `https://hire.aftongauntlett.com/for/${encodeURIComponent(orgSlug)}`;
}

function normalizeWebUrl(url) {
  const value = String(url || "").trim();
  if (!value) return "";
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

function orgSlugToCompanyName(orgSlug) {
  return String(orgSlug || "")
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function toPlainLinkText(url) {
  return String(url || "")
    .replace(/^https?:\/\//i, "")
    .replace(/^www\./i, "")
    .replace(/\/$/, "");
}

function buildCoverLetterHeaderContactComponents(personal) {
  const headerContactComponents = [];
  const websiteDisplay = toPlainLinkText(personal.website);
  const websiteUrl = normalizeWebUrl(personal.website);

  if (personal.location) {
    headerContactComponents.push({
      text: personal.location,
      color: "#333333",
    });
  }

  if (personal.phone) {
    if (headerContactComponents.length)
      headerContactComponents.push({ text: "  |  ", color: "#333333" });
    headerContactComponents.push({
      text: personal.phone,
      color: "#333333",
    });
  }

  if (personal.email) {
    if (headerContactComponents.length)
      headerContactComponents.push({ text: "  |  ", color: "#333333" });
    headerContactComponents.push({
      text: personal.email,
      link: `mailto:${personal.email}`,
      color: "#333333",
    });
  }

  if (websiteDisplay && websiteUrl) {
    if (headerContactComponents.length)
      headerContactComponents.push({ text: "  |  ", color: "#333333" });
    headerContactComponents.push({
      text: websiteDisplay,
      link: websiteUrl,
      color: "#333333",
    });
  }

  return headerContactComponents;
}

function buildCoverLetterSignature(personal, orgSlug) {
  const hireProfileDisplay = `hire.aftongauntlett.com/for/${orgSlug}`;
  const linkedinDisplay = toPlainLinkText(personal.linkedin);
  const linkedinUrl = normalizeWebUrl(personal.linkedin);
  const githubDisplay = toPlainLinkText(personal.github);
  const githubUrl = normalizeWebUrl(personal.github);
  const hireProfileUrl = buildHireProfileUrl(orgSlug);

  const signatureLines = [
    { text: "Thanks,", style: "coverLetterBody" },
    { text: personal.name || "", style: "signatureName" },
  ];

  if (linkedinDisplay && linkedinUrl) {
    signatureLines.push({
      text: linkedinDisplay,
      link: linkedinUrl,
      style: "coverLetterBody",
    });
  }
  if (githubDisplay && githubUrl) {
    signatureLines.push({
      text: githubDisplay,
      link: githubUrl,
      style: "coverLetterBody",
    });
  }
  signatureLines.push({
    text: hireProfileDisplay,
    link: hireProfileUrl,
    style: "coverLetterBody",
  });

  return {
    hireProfileUrl,
    hireProfileDisplay,
    signatureLines,
  };
}

function getSharedStyles() {
  return {
    name: { fontSize: 18.5, bold: true, color: "#111111" },
    title: { fontSize: 11, bold: false, color: "#444444" },
    contact: { fontSize: 9, color: "#333333" },
    sectionTitle: {
      fontSize: 11.5,
      bold: true,
      color: "#111111",
    },
    summary: { fontSize: 10, color: "#222222", lineHeight: 1.6 },
    company: { fontSize: 10.5, bold: true, color: "#111111" },
    role: { fontSize: 10.25, bold: true, color: "#111111" },
    date: { fontSize: 8.8, color: "#666666" },
    bulletList: { fontSize: 9.5, color: "#222222", lineHeight: 1.45 },
    entryText: { fontSize: 9.5, color: "#222222", lineHeight: 1.45 },
    skillHeading: { fontSize: 10, bold: true, color: "#111111" },
    skillInline: { fontSize: 9.3, color: "#222222", lineHeight: 1.35 },
    coverLetterBody: { fontSize: 10, color: "#222222", lineHeight: 1.6 },
    signatureName: {
      fontSize: 10,
      bold: true,
      color: "#222222",
      lineHeight: 1.6,
    },
  };
}

function getSharedDefaultStyle() {
  return {
    font: "Inter",
    fontSize: 9,
    lineHeight: 1.2,
    color: "#1a1a1a",
    fontFeatures: {
      liga: false,
      clig: false,
      dlig: false,
      hlig: false,
      calt: false,
      kern: true,
    },
  };
}

function buildResumePdfDefinition(data) {
  const { personal, summary, skills, experience, education, projects, awards } =
    data;

  const { primaryContactComponents, secondaryContactComponents } =
    buildContactComponents(personal);

  const content = [];

  content.push({
    text: [
      { text: personal.name, style: "name" },
      { text: ",  ", style: "name" },
      { text: personal.title, style: "title" },
    ],
    margin: [0, 0, 0, 0],
  });
  if (primaryContactComponents.length) {
    content.push({
      text: primaryContactComponents,
      style: "contact",
      margin: [0, 0, 0, 3],
    });
  }

  if (secondaryContactComponents.length) {
    content.push({
      text: secondaryContactComponents,
      style: "contact",
      margin: [0, 0, 0, 14],
    });
  }

  content.push(sectionHeader("PROFESSIONAL SUMMARY"));
  content.push({ text: summary, style: "summary", margin: [0, 0, 0, 14] });

  content.push(sectionHeader("TECHNICAL SKILLS"));
  const combinedSkills = Object.values(skills || {})
    .flat()
    .filter(Boolean)
    .join(" • ");
  content.push({
    text: combinedSkills,
    style: "skillInline",
    margin: [0, 0, 0, 12],
  });

  content.push(sectionHeader("EXPERIENCE"));
  experience.forEach((entry) => {
    if (entry.positions && entry.positions.length) {
      content.push({
        text: entry.company,
        style: "company",
        margin: [0, 0, 0, 2],
      });
      entry.positions.forEach((position) => {
        content.push({
          columns: [
            { width: "*", text: position.title, style: "role" },
            { width: "auto", text: position.dates, style: "date" },
          ],
          margin: [10, 0, 0, 2],
        });
        content.push({
          ul: position.bullets,
          margin: [18, 0, 0, 10],
          style: "bulletList",
        });
      });
    } else {
      const companyTitleNode = entry.link
        ? {
            text: `${entry.company}, ${entry.title}`,
            style: "company",
            link: entry.link,
            decoration: "underline",
            color: "#111111",
          }
        : { text: `${entry.company}, ${entry.title}`, style: "company" };
      const entryNode = {
        stack: [
          {
            columns: [
              { width: "*", ...companyTitleNode },
              { width: "auto", text: entry.dates, style: "date" },
            ],
            margin: [0, 0, 0, 2],
          },
          {
            ul: entry.bullets,
            margin: [8, 0, 0, 10],
            style: "bulletList",
          },
        ],
      };
      if (entry.pageBreakBefore) entryNode.pageBreak = "before";
      content.push(entryNode);
    }
  });

  if (awards && awards.length) {
    content.push(sectionHeader("AWARDS & RECOGNITION"));
    awards.forEach((award) => {
      content.push({
        columns: [
          { width: "*", text: award.title, style: "company" },
          { width: "auto", text: award.year || "", style: "date" },
        ],
        margin: [0, 0, 0, 2],
      });
      content.push({
        text: award.details,
        style: "entryText",
        margin: [0, 0, 0, 12],
      });
    });
  }

  if (projects && projects.length) {
    content.push(sectionHeader("PROJECTS & VOLUNTEER WORK"));
    projects.forEach((project, projectIndex) => {
      const isLastProject = projectIndex === projects.length - 1;
      const url = project.link || null;
      const displayUrl = url
        ? url.replace(/^https?:\/\//, "").replace(/^www\./, "")
        : "";
      content.push({
        columns: [
          { width: "*", text: project.title, style: "company" },
          url
            ? {
                width: "auto",
                text: displayUrl,
                style: "date",
                link: url,
                color: "#555555",
                decoration: "underline",
              }
            : {},
        ],
        margin: [0, 0, 0, 2],
      });
      content.push({
        text: project.description,
        style: "entryText",
        margin: [0, 0, 0, isLastProject ? 0 : 9],
      });
    });
  }

  content.push(sectionHeader("EDUCATION & CERTIFICATIONS"));
  education.forEach((item) => {
    const detailsText = [{ text: item.details, style: "date" }];
    if (item.url) {
      detailsText.push({ text: " ", style: "date" });
      detailsText.push({
        text: "(Active)",
        style: "date",
        link: item.url,
        decoration: "underline",
        color: "#555555",
      });
    }

    content.push({
      columns: [
        { width: "*", text: item.title, style: "company" },
        { width: "auto", text: detailsText },
      ],
      margin: [0, 0, 0, 9],
    });
  });

  return {
    info: {
      title: `${personal.name} – ${personal.title}`,
      author: personal.name,
      subject: `${personal.title} Resume 2026`,
      keywords:
        "Frontend Developer, React, TypeScript, Accessibility, Design Systems, Resume",
      creator: "pdfmake",
      producer: "pdfmake",
    },
    pageSize: "LETTER",
    pageMargins: [32, 24, 32, 24],
    defaultStyle: getSharedDefaultStyle(),
    styles: getSharedStyles(),
    content,
  };
}

function buildCoverLetterPdfDefinition(personal, coverLetterData) {
  const orgSlug = getCoverLetterOrgSlug(coverLetterData);
  const recipientLabel = getCoverLetterRecipientLabel(coverLetterData, orgSlug);
  const headerContactComponents =
    buildCoverLetterHeaderContactComponents(personal);
  const { signatureLines } = buildCoverLetterSignature(personal, orgSlug);
  const { paragraphs } = coverLetterData;

  const content = [];

  content.push({
    text: [
      { text: personal.name, style: "name" },
      { text: ",  ", style: "name" },
      { text: personal.title, style: "title" },
    ],
    margin: [0, 0, 0, 0],
  });

  if (headerContactComponents.length) {
    content.push({
      text: headerContactComponents,
      style: "contact",
      margin: [0, 0, 0, 16],
    });
  }

  if (recipientLabel) {
    content.push({
      text: recipientLabel,
      style: "entryText",
      margin: [0, 0, 0, 12],
    });
  }

  (Array.isArray(paragraphs) ? paragraphs : []).forEach(
    (paragraph, index, arr) => {
      if (!paragraph) return;
      content.push({
        text: paragraph,
        style: "coverLetterBody",
        margin: [0, 0, 0, index === arr.length - 1 ? 0 : 10],
      });
    },
  );

  content.push({
    stack: signatureLines,
    margin: [0, 18, 0, 0],
  });

  return {
    info: {
      title: `${personal.name} – Cover Letter`,
      author: personal.name,
      subject: `${personal.title} Cover Letter 2026`,
      keywords: "Cover Letter, Frontend Engineer",
      creator: "pdfmake",
      producer: "pdfmake",
    },
    pageSize: "LETTER",
    pageMargins: [32, 24, 32, 24],
    defaultStyle: getSharedDefaultStyle(),
    styles: getSharedStyles(),
    content,
  };
}

async function generatePdf(docDefinition, outputFile) {
  const pdfDoc = printer.createPdfKitDocument(docDefinition);
  const outputPath = path.resolve(__dirname, outputFile);
  const writeStream = fs.createWriteStream(outputPath);

  pdfDoc.pipe(writeStream);
  pdfDoc.end();

  await new Promise((resolve, reject) => {
    writeStream.on("finish", resolve);
    writeStream.on("error", reject);
  });
}

function generateHtml(templateFile, data, outputFile) {
  const templatePath = path.resolve(__dirname, templateFile);
  const outputPath = path.resolve(__dirname, outputFile);
  const template = fs.readFileSync(templatePath, "utf8");
  const compile = Handlebars.compile(template, { noEscape: false });
  const html = compile(data);
  fs.writeFileSync(outputPath, html);
}

function removeFileIfExists(fileName) {
  const filePath = path.resolve(__dirname, fileName);
  if (fs.existsSync(filePath)) {
    fs.rmSync(filePath);
  }
}

function getResumeBaseName(inputFile) {
  const inputBase = path.basename(inputFile, path.extname(inputFile));
  return inputBase.startsWith("resumeData")
    ? inputBase.replace("resumeData", "afton-gauntlett-resume")
    : `afton-gauntlett-resume-${inputBase}`;
}

async function buildResume(inputFile = DEFAULT_RESUME_DATA_FILE) {
  const resumeData = loadJson(inputFile);
  const safeData = JSON.parse(JSON.stringify(resumeData));
  const baseName = getResumeBaseName(inputFile);
  const htmlFile = `${baseName}.html`;
  const pdfFile = `${baseName}.pdf`;

  if (GENERATE_HTML_PREVIEW) {
    generateHtml(RESUME_TEMPLATE_FILE, resumeData, htmlFile);
    console.log(`✅ ${htmlFile} generated for preview`);
  } else {
    removeFileIfExists(htmlFile);
  }

  const docDefinition = buildResumePdfDefinition(safeData);
  await generatePdf(docDefinition, pdfFile);
  console.log(`✅ ${pdfFile} generated with pdfmake`);
}

async function buildCoverLetter() {
  const resumeData = loadJson(DEFAULT_RESUME_DATA_FILE);
  const coverLetterData = loadJson(DEFAULT_COVER_LETTER_DATA_FILE);
  const orgSlug = getCoverLetterOrgSlug(coverLetterData);
  const recipientLabel = getCoverLetterRecipientLabel(coverLetterData, orgSlug);
  const { hireProfileUrl, hireProfileDisplay } = buildCoverLetterSignature(
    resumeData.personal,
    orgSlug,
  );
  const htmlFile = `${COVER_LETTER_BASE_NAME}.html`;
  const pdfFile = `${COVER_LETTER_BASE_NAME}.pdf`;

  if (GENERATE_HTML_PREVIEW) {
    generateHtml(
      COVER_LETTER_TEMPLATE_FILE,
      {
        personal: resumeData.personal,
        orgSlug,
        hireProfileUrl,
        hireProfileDisplay,
        recipientLabel,
        paragraphs: Array.isArray(coverLetterData.paragraphs)
          ? coverLetterData.paragraphs
          : [],
      },
      htmlFile,
    );
    console.log(`✅ ${htmlFile} generated for preview`);
  } else {
    removeFileIfExists(htmlFile);
  }

  const docDefinition = buildCoverLetterPdfDefinition(
    resumeData.personal,
    coverLetterData,
  );
  await generatePdf(docDefinition, pdfFile);
  console.log(`✅ ${pdfFile} generated with pdfmake`);

  const desktopPath = path.join(os.homedir(), "Desktop", pdfFile);
  fs.copyFileSync(path.resolve(__dirname, pdfFile), desktopPath);
  console.log(`✅ Copied ${pdfFile} to ${desktopPath}`);
}

async function main() {
  const modeArg = process.argv[2];

  if (modeArg === "cover-letter") {
    await buildCoverLetter();
    return;
  }

  const inputFile = modeArg || DEFAULT_RESUME_DATA_FILE;
  await buildResume(inputFile);
}

main().catch((err) => {
  const message = err instanceof Error ? err.message : String(err);
  if (process.argv[2] === "cover-letter") {
    console.error(`❌ Error building cover letter: ${message}`);
  } else {
    console.error(`❌ Error building resume: ${message}`);
  }
  process.exit(1);
});
