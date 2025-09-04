const fs = require("fs");
const path = require("path");
const Handlebars = require("handlebars");
const puppeteer = require("puppeteer");
const { PDFDocument } = require("pdf-lib");

const resumeData = require("./resumeData");

Handlebars.registerHelper("tel", (str) => (str || "").replace(/[^\d+]/g, ""));

(async () => {
  try {
    // 1. Compile template
    const template = fs.readFileSync("resume.hbs", "utf8");
    const compile = Handlebars.compile(template, { noEscape: false });
    const html = compile(resumeData);

    // 2. Define file names
    const baseName = "afton-gauntlett-resume";
    const htmlFile = `${baseName}.html`;
    const pdfFile = `${baseName}.pdf`;

    // 3. Write HTML for preview/debug
    fs.writeFileSync(htmlFile, html);
    console.log(`✅ ${htmlFile} generated`);

    // 4. Generate PDF with Puppeteer
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    const fileUrl = "file://" + path.resolve(htmlFile);

    await page.goto(fileUrl, {
      waitUntil: ["load", "domcontentloaded", "networkidle0"],
    });
    await page.evaluateHandle("document.fonts.ready");

    await page.pdf({
      path: pdfFile,
      format: "Letter",
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: "0.5in", bottom: "0.5in", left: "0.5in", right: "0.5in" },
    });

    await browser.close();
    console.log(`✅ ${pdfFile} generated with Puppeteer`);

    // 5. Add metadata with pdf-lib
    const pdfBytes = fs.readFileSync(pdfFile);
    const pdfDoc = await PDFDocument.load(pdfBytes);

    pdfDoc.setTitle("Afton Gauntlett – Frontend Engineer");
    pdfDoc.setAuthor("Afton Gauntlett");
    pdfDoc.setSubject("Frontend Engineer Resume 2025");
    pdfDoc.setKeywords([
      "Frontend Engineer",
      "React",
      "TypeScript",
      "Accessibility",
      "Design Systems",
      "Resume",
      "Afton Gauntlett",
    ]);

    const finalPdf = await pdfDoc.save();
    fs.writeFileSync(pdfFile, finalPdf);
    console.log(`✅ ${pdfFile} updated with metadata`);
  } catch (err) {
    console.error("❌ Error building resume:", err);
    process.exit(1);
  }
})();
