import type { Award, Certification, CvLists, Degree, Position, ServiceRole, SkillGroup } from "../types";

export const positions: Position[] = [
  {
    role: "Assistant Professor",
    org: "Daffodil International University",
    dept: "Department of CSE",
    start: "Aug 2024",
    end: "Present",
    current: true,
    academic: true,
  },
  {
    role: "Senior Lecturer",
    org: "Daffodil International University",
    dept: "Department of CSE",
    start: "Jan 2023",
    end: "Jul 2024",
    academic: true,
  },
  {
    role: "Lecturer",
    org: "City University, Bangladesh",
    dept: "Department of CSE",
    start: "Dec 2019",
    end: "Dec 2022",
    academic: true,
  },
  {
    role: "Lecturer & Department Coordinator",
    org: "University of South Asia, Bangladesh",
    dept: "Department of CSE",
    start: "Sep 2018",
    end: "Dec 2019",
    academic: true,
  },
  {
    role: "Software Engineer (Intern)",
    org: "iXora Solution Ltd.",
    start: "Nov 2017",
    end: "Feb 2018",
    academic: false,
  },
  {
    role: "Web Developer (Part-time)",
    org: "Vencerlab",
    start: "Aug 2016",
    end: "Aug 2017",
    academic: false,
  },
  {
    role: "Gentleman Cadet, 74th BMA Long Course",
    org: "Bangladesh Military Academy, Chittagong",
    start: "Jun 2014",
    end: "Sep 2015",
    academic: false,
  },
];

export const education: Degree[] = [
  {
    degree: "PhD",
    field: "Computer Science and Engineering",
    institution: "Jahangirnagar University, Bangladesh",
    year: "Ongoing",
    supervisor:
      "Dr. Mohammad Shorif Uddin, Professor, Dept. of CSE, Jahangirnagar University; Vice-Chancellor, Green University",
  },
  {
    degree: "Diploma in Outcome-Based Education and Academic Quality Assurance",
    institution: "Alison Academy",
    year: "2025",
  },
  {
    degree: "Master of Computer Science",
    field: "Information and Database Management Systems",
    institution: "American International University-Bangladesh (AIUB)",
    year: "2020",
    thesis: "An Analytical Study on Consumers’ Behaviors in Facebook Groups and Pages",
    supervisor: "Md. Manzurul Hasan, Assistant Professor, Dept. of CS, AIUB",
    result: "CGPA 3.83 / 4.00",
    honor: "Cum Laude Distinction",
  },
  {
    degree: "Bachelor in Computer Science",
    institution: "American International University-Bangladesh (AIUB)",
    year: "2018",
    thesis: "Finding Classes from Given Topics or Scenarios Using NLP Tools",
    supervisor: "Md. Sabbir Ahamed, Assistant Professor, Dept. of CS, AIUB",
    result: "CGPA 3.56 / 4.00",
  },
  {
    degree: "Higher Secondary Certificate (Science)",
    institution: "Saint Joseph Higher Secondary School, Dhaka, Bangladesh",
    year: "2012",
    result: "GPA 5.00 / 5.00",
  },
  {
    degree: "Secondary School Certificate (Science)",
    institution: "Govt. Science College Attached High School, Dhaka, Bangladesh",
    year: "2010",
    result: "GPA 5.00 / 5.00",
  },
];

export const awards: Award[] = [
  {
    title: "Excellent Contributor Award",
    by: "5th International Conference on Intelligent Computing & Optimization (ICO 2022)",
    detail: "One of three Excellent Award winners of ICO 2022.",
    year: "2022",
  },
  {
    title: "Academic Honor Award: Cum Laude Distinction",
    by: "American International University-Bangladesh",
    detail: "Bronze medal for academic excellence in the MSc in Computer Science, received at AIUB’s 20th Convocation.",
    year: "2021",
  },
  {
    title: "Commonwealth Scholarship (Coursera)",
    by: "Google Data Analytics Professional Certificate",
    detail: "Scholarship covering the full eight-course professional certificate.",
    year: "",
  },
];

export const certifications: Certification[] = [
  { title: "Google Data Analytics Professional Certificate (8 courses)", by: "Google · Coursera", year: "" },
  { title: "The Fundamentals of Digital Marketing", by: "Google Digital Garage", year: "" },
  { title: "CCNA (75-hour course)", by: "Linux Pathshala", year: "2019" },
  { title: "CISCO IT Essentials v4.0", by: "American International University-Bangladesh", year: "" },
];

export const service: ServiceRole[] = [
  { role: "Co-Convener", body: "OBE and Accreditation Committee, Dept. of CSE, DIU" },
  { role: "Member", body: "Complex Engineering Problem Monitoring Committee, Dept. of CSE, DIU" },
  { role: "Member", body: "Project Committee (Fall 2023 – Fall 2026), Dept. of CSE, DIU" },
  { role: "Member", body: "Department-wise Center of Excellence, Dept. of CSE, DIU" },
  { role: "Department Coordinator", body: "Dept. of CSE, University of South Asia (2018 – 2019)" },
];

const reviewing = [
  "International Conference on Intelligent Computing & Optimization (ICO 2020, 2021, 2022)",
  "Seventh International Conference on Economic and Business Management (FEBM 2022)",
];

const development = [
  "Outcome-Based Curriculum Development, IQAC, University of South Asia",
  "Outcome-Based Education Development, IQAC, City University",
  "Seminar on “Career in IT Sectors”, University of South Asia",
  "CISCO IT Essentials v4.0, American International University-Bangladesh",
  "CCNA: 75-hour course, Linux Pathshala",
];

export const skills: SkillGroup[] = [
  {
    group: "Research",
    items: ["Academic paper writing", "LaTeX", "Data visualization & analysis", "Structural Equation Modeling"],
  },
  {
    group: "Teaching",
    items: ["Outcome-Based Education (OBE)", "Curriculum development", "Integrating AI in teaching"],
  },
  {
    group: "Programming",
    items: ["Python", "Java", "PHP", "JavaScript", "HTML & CSS", "MVC frameworks"],
  },
  {
    group: "Leadership",
    items: ["Vice President, Josephite Debating Club", "Organizer, JDC Debate Festival 2012"],
  },
];

const interests = ["Debating", "Photography", "Cycling", "Former member, AIUB Arts Club"];

export const cvLists: CvLists = { reviewing, development, interests };
