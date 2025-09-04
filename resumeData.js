module.exports = {
  personal: {
    name: "Afton Gauntlett",
    title: "Frontend Engineer",
    email: "hello@aftongauntlett.com",
    phone: "(571) 249-1952",
    location: "Ashburn, VA",
    linkedin: "linkedin.com/in/afton-gauntlett",
    github: "github.com/aftongauntlett",
    website: "aftongauntlett.com",
  },

  summary: `I started as a developer obsessed with pixel-perfect UI and grew into an engineer who can guide migrations, shape design systems, and contribute to team growth through mentoring. With 5+ years of experience, I’ve modernized <b>Angular/Node.js</b> apps into <b>React/Flask</b> platforms, introduced scalable component libraries, and earned Platinum recognition for design quality.`,

  experience: [
    {
      company: "Booz Allen Hamilton",
      positions: [
        {
          title: "Lead Engineer (Promoted)",
          dates: "Mar 2023 – May 2025",
          location: "Hybrid",
          bullets: [
            "Directed frontend architecture across multiple <b>React</b> apps, establishing reusable <b>Storybook</b> components and a multi-theme design system that unified team outputs, streamlined Git workflows, and accelerated onboarding through active mentorship.",
            "Developed a TurboTax-style stepper portal that secured client buy-in, set new UI benchmarks adopted across projects, and earned recognition to represent the team at <b>AWS re:Invent</b>.",
            "Engineered a secure, air-gapped <b>LLM chatbot</b> with custom automation scripts, enabling safe AI assistance within strict client environments while boosting developer efficiency.",
          ],
        },
        {
          title: "Software Engineer",
          dates: "Mar 2022 – Mar 2023",
          location: "Hybrid",
          bullets: [
            "Refactored enterprise applications from <b>Angular/Node.js</b> into a single <b>React/Flask</b> framework, making it easier for new developers to onboard, encouraging modern coding practices, and improving accessibility with reusable components.",
            "Secured <b>Figma</b> adoption, built design templates/workflows and trained teammates to streamline collaboration and ensure <b>WCAG/508</b> compliance.",
          ],
        },
      ],
    },
    {
      company: "Gauntlet Designs",
      title: "Founder & Developer (Freelance)",
      dates: "Jul 2020 – Jan 2025",
      location: "Herndon, VA",
      bullets: [
        "Delivered over 10 production web apps for small businesses and nonprofits, managing projects end-to-end from scope to deployment on <b>Vercel</b> and <b>Firebase</b>.",
        "Developed an employee portal and fundraiser scheduler for Potomac Dining (<b>$300M franchise</b>), still in active use after 5 years.",
        "Built scalable frontends with <b>React</b>, <b>Next.js</b>, and <b>Vue</b>, supported by custom reusable design systems.",
      ],
    },
    {
      company: "IronClad",
      title: "UI Developer",
      dates: "Jan 2022 – Mar 2022",
      location: "Remote",
      bullets: [
        "Created <b>Figma</b> wireframes and UI documentation that shaped the <b>React</b> architecture for Defense Intelligence Agency (DIA).",
        "Partnered with engineers to define component standards and prototyped reusable UI modules for long-term maintainability.",
      ],
    },
    {
      company: "Global Dimensions",
      title: "Front-End Developer",
      dates: "Aug 2021 – Jan 2022",
      location: "Springfield, VA",
      bullets: [
        "Built geospatial interfaces with <b>Vue/Vuetify</b>, including a scroll-driven interactive rocket timeline enhanced with <b>GSAP</b> animations and pixel-perfect motion design.",
        "Integrated animations and UI flows prototyped in <b>Adobe After Effects</b> and <b>XD</b>, adapting them into performant, accessible components within Vuetify’s constraints.",
      ],
    },
  ],

  awards: [
    {
      title: "Platinum Award – Booz Allen Hamilton",
      year: "2022",
      details:
        "Redesigned and rebuilt a high-visibility enterprise app used across multiple client teams, earning recognition from Amazon Developers for design quality. Championed adoption of <b>Figma</b>, securing licenses and improving iteration speed.",
    },
    {
      title: "Gold Award – Booz Allen Hamilton",
      year: "2023",
      details:
        "Drove stakeholder reviews to secure leadership buy-in over a competing proposal, directly influencing a multi-year contract award.",
    },
    {
      title: "Gold Award – Booz Allen Hamilton",
      year: "2024",
      details:
        "Built an internal registration and scheduling platform for the annual convention, enabling 100+ attendees to sign up, coordinate sessions, and access agendas seamlessly.",
    },
  ],

  projects: [
    {
      title: "Potomac Family Dining",
      description:
        "Developed an enterprise web platform for a <b>$300M</b> restaurant franchise using <b>Vue.js</b> and <b>Firebase</b> to support an employee portal, career system, and multi-location directory.",
    },
    {
      title: "React Portfolio",
      description:
        "Built a fully accessible, custom-themed portfolio and reusable component library with <b>React 19</b>, <b>Vite</b>, <b>TypeScript</b>, <b>Tailwind CSS</b>, and <b>Framer Motion</b>, featuring dark/light mode and AI-assisted development workflows.",
      urls: ["https://github.com/aftongauntlett/react-portfolio"],
    },
    {
      title: "JS13k 2025 Game Demo",
      description:
        "Created an official JS13k competition entry under the 13KB size cap — a minimalist browser game with <b>HTML</b>, <b>CSS</b>, <b>Vanilla JS</b>, and <b>Canvas 2D</b>, featuring unique mouse-driven mechanics and optimized visuals.",
      urls: ["https://github.com/aftongauntlett/js13k-demo"],
    },
    {
      title: "MAGFest",
      description:
        "<b>TechOps Manager, Volunteer (2010–2020)</b> Coordinated A/V logistics for a 20k+ attendee gaming festival and contributed to event websites and registration systems with <b>HTML</b>, <b>CSS</b>, and <b>JavaScript</b>.",
    },
  ],

  education: [
    {
      title: "Web Development Certificate",
      details: "George Washington University (2020)",
    },
    { title: "UX Design Certificate", details: "General Assembly (2022)" },
    { title: "Security+ Certification", details: "CompTIA (Active - 2028)" },
  ],

  skills: {
    Frontend: [
      "React.js / Next.js",
      "TypeScript",
      "JavaScript (ES6+)",
      "HTML5",
      "CSS3/SCSS",
      "Tailwind CSS",
    ],
    "UI & Design": [
      "Figma",
      "Adobe XD",
      "Storybook",
      "GSAP",
      "Framer Motion",
      "Three.js",
    ],
    "Quality & Testing": [
      "Section 508",
      "WCAG",
      "ARIA",
      "JAWS",
      "Jest (Unit Testing)",
      "CI/CD (Vercel, Firebase)",
    ],
    "Tooling & Workflows": [
      "Agile / Scrum",
      "Version Control (Git)",
      "Wireframing",
      "API Integration",
      "DX Advocacy",
      "Prompt Engineering",
    ],
  },
};
