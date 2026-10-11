import type { Profile, Social } from "../types";

export const profile: Profile = {
  name: "Shahadat Hossain",
  title: "Assistant Professor",
  department: "Department of Computer Science and Engineering",
  university: "Daffodil International University",
  universityShort: "DIU",
  universityUrl: "https://daffodilvarsity.edu.bd",
  location: "Dhaka, Bangladesh",
  photo: "/images/shahadat-hossain-portrait.jpg",
  cv: "/cv/Shahadat_Hossain_CV.pdf",
  motto: "Be the Change",
  email: "shahadat.cse@diu.edu.bd",
  phones: ["+880 1303-097117", "+880 1624-823181"],
  office: {
    room: "Room 317 (1), 3rd Floor",
    building: "Knowledge Tower",
    campus: "Daffodil Smart City",
    city: "Dhaka, Bangladesh",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Knowledge+Tower+Daffodil+Smart+City",
  },
  intro:
    "I teach computer science and study how people behave on digital platforms, using machine learning, behavior analysis and data visualization to explain what drives their decisions.",
  focusAreas: ["Machine Learning", "Human Behavior Analysis", "Information Visualization"],
  bio: [
    "I am an Assistant Professor in the Department of Computer Science and Engineering at Daffodil International University, Dhaka, and a doctoral researcher in Computer Science and Engineering at Jahangirnagar University, supervised by Professor Dr. Mohammad Shorif Uddin.",
    "My research sits where machine learning, human behavior analysis and data visualization meet. I study how people behave on digital platforms (what drives consumer decisions in social commerce, how readers engage with online news, how sentiment forms around public figures) and how data-driven models can explain those patterns and the trade-offs they create for users.",
    "My work has appeared with Springer, IEEE, ACM, Taylor & Francis, IGI Global and AIP, and received the Excellent Contributor Award at the International Conference on Intelligent Computing & Optimization (ICO 2022). Alongside research, I care deeply about outcome-based education, and I am the author of “Teaching with Outcome: A Faculty Guide to OBE”.",
  ],
  authorNames: ["Shahadat Hossain", "S. Hossain"],
  phd: {
    degree: "PhD in Computer Science and Engineering (ongoing)",
    institution: "Jahangirnagar University",
    supervisor: "Prof. Dr. Mohammad Shorif Uddin",
    supervisorRole: "Professor, Dept. of CSE, Jahangirnagar University",
  },
};

export const socials: Social[] = [
  {
    key: "scholar",
    label: "Google Scholar",
    href: "https://scholar.google.com/citations?user=ZdV96HwAAAAJ&hl=en",
  },
  {
    key: "researchgate",
    label: "ResearchGate",
    href: "https://www.researchgate.net/profile/Shahadat-Hossain-34",
  },
  { key: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/shossain1992", handle: "shossain1992" },
  {
    key: "youtube",
    label: "YouTube: Learn with Shaho",
    href: "https://www.youtube.com/@learnwithshaho",
    handle: "@learnwithshaho",
  },
  { key: "facebook", label: "Facebook", href: "https://www.facebook.com/unmadshahadat" },
  { key: "x", label: "X (Twitter)", href: "https://twitter.com/SHOSSAIN92", handle: "@SHOSSAIN92" },
];
