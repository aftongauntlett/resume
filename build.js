const fs = require("fs");
const path = require("path");
const Handlebars = require("handlebars");
const PdfPrinter = require("pdfmake");

const inputFile = process.argv[2] || "resumeData.json";
const resumeData = require(`./${inputFile}`);
const inputBase = path.basename(inputFile, path.extname(inputFile));
const baseName = inputBase.startsWith("resumeData")
  ? inputBase.replace("resumeData", "afton-gauntlett-resume")
  : `afton-gauntlett-resume-${inputBase}`;
const pdfFile = `${baseName}.pdf`;
const htmlFile = `${baseName}.html`;

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
        margin: [0, 1, 0, 8],
      },
    ],
    margin: [0, 0, 0, 0],
  };
}

function buildPdfDefinition(data) {
  const { personal, summary, skills, experience, education, projects, awards } =
    data;

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
  content.push({ text: summary, style: "summary", margin: [0, 0, 0, 12] });

  content.push(sectionHeader("TECHNICAL SKILLS"));
  const combinedSkills = Object.values(skills)
    .flat()
    .filter(Boolean)
    .join(" • ");
  content.push({
    text: combinedSkills,
    style: "skillInline",
    margin: [0, 0, 0, 8],
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
          margin: [18, 0, 0, 7],
          style: "bulletList",
        });
      });
    } else {
      content.push({
        columns: [
          {
            width: "*",
            text: `${entry.company}, ${entry.title}`,
            style: "company",
          },
          { width: "auto", text: entry.dates, style: "date" },
        ],
        margin: [0, 0, 0, 2],
      });
      content.push({
        ul: entry.bullets,
        margin: [8, 0, 0, 7],
        style: "bulletList",
      });
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
        margin: [0, 0, 0, 8],
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
      margin: [0, 0, 0, 7],
    });
  });

  if (projects && projects.length) {
    content.push(sectionHeader("PROJECTS & VOLUNTEER WORK"));
    projects.forEach((project, projectIndex) => {
      const isLastProject = projectIndex === projects.length - 1;
      const url =
        Array.isArray(project.urls) && project.urls.length
          ? project.urls[0]
          : null;
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
        margin: [0, 0, 0, isLastProject ? 0 : 6],
      });
    });
  }

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
    defaultStyle: {
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
    },
    styles: {
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
    },
    content,
  };
}

async function generatePdf(data) {
  const safeData = JSON.parse(JSON.stringify(data));
  const docDefinition = buildPdfDefinition(safeData);
  const pdfDoc = printer.createPdfKitDocument(docDefinition);
  const writeStream = fs.createWriteStream(pdfFile);

  pdfDoc.pipe(writeStream);
  pdfDoc.end();

  await new Promise((resolve, reject) => {
    writeStream.on("finish", resolve);
    writeStream.on("error", reject);
  });
}

function generateHtml(data) {
  const template = fs.readFileSync("resume.hbs", "utf8");
  const compile = Handlebars.compile(template, { noEscape: false });
  const html = compile(data);
  fs.writeFileSync(htmlFile, html);
}

(async () => {
  try {
    generateHtml(resumeData);
    console.log(`✅ ${htmlFile} generated for preview`);

    await generatePdf(resumeData);
    console.log(`✅ ${pdfFile} generated with pdfmake`);
  } catch (err) {
    console.error("❌ Error building resume:", err);
    process.exit(1);
  }
})();
