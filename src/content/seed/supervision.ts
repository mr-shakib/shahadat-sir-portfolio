import type { SupervisedWork } from "../types";

type Group = { institution: string; term?: string; items: Omit<SupervisedWork, "institution" | "term">[] };

const groups: Group[] = [
  {
    institution: "Daffodil International University",
    term: "Spring 2024",
    items: [
      {
        title: "An IoT-Based Air Pollution Detector Using ESP8266 NodeMCU Microcontroller",
        kind: "Project",
        domain: "IoT",
      },
      {
        title: "AI-Driven Bone Fracture Detection: Leveraging Image Processing and Machine Learning on X-Ray Images",
        kind: "Project",
        domain: "Computer Vision",
      },
      {
        title: "Early Parkinson’s Disease Detection with Feature Extraction Using Machine Learning",
        kind: "Project",
        domain: "AI / ML",
      },
      { title: "Polarity Detection of Top IPL Players’ Tweets Using BERT and SVM", kind: "Project", domain: "NLP" },
      { title: "Corn Leaf Disease Classification Using Deep Learning", kind: "Project", domain: "Computer Vision" },
      { title: "Multilabel Hostility Classification Using Bangla Text", kind: "Project", domain: "NLP" },
      { title: "Scrapwala: Online Scrap Management Service", kind: "Project", domain: "Web & Software" },
      { title: "Tutionex: A Web-Based Tuition System", kind: "Project", domain: "Web & Software" },
      {
        title: "Boi Bari: A Web-Based E-Commerce Platform for Buying and Selling Books",
        kind: "Project",
        domain: "Web & Software",
      },
      {
        title: "ByteBazaar: Unveiling the Future of Computer Retail with a Web-Based E-Commerce Platform",
        kind: "Project",
        domain: "Web & Software",
      },
    ],
  },
  {
    institution: "Daffodil International University",
    term: "Fall 2023",
    items: [
      {
        title: "Sentiment Analysis of Twitter Data on the Top 20 FIFA Players Using Machine Learning and NLP",
        kind: "Project",
        domain: "NLP",
      },
      {
        title: "Dust Detection for Emission at Daffodil Smart City Using the YOLOv8 Algorithm",
        kind: "Project",
        domain: "Computer Vision",
      },
      { title: "UniHub: A Web-Based Private University Information Hub", kind: "Project", domain: "Web & Software" },
      { title: "EventZone: One-Stop Solution App for Event Management", kind: "Project", domain: "Web & Software" },
    ],
  },
  {
    institution: "City University, Bangladesh",
    items: [
      {
        title: "Comparative Analysis on Performance of NoSQL over RDBMS in MIS",
        kind: "Thesis",
        domain: "Data & Systems",
        outcome: "Published at ICO 2022 (Springer LNNS)",
      },
      {
        title: "A Heuristic Approach to Detect False Smut Disease in Paddy Using CNN",
        kind: "Thesis",
        domain: "Computer Vision",
        outcome: "Published at MIET 2022 (Springer LNICST)",
      },
      { title: "An Analytical Study on Online Gamers’ Mental Health", kind: "Thesis", domain: "AI / ML" },
      {
        title: "JudgeChain: A Blockchain-Based Secured Judiciary Management System",
        kind: "Thesis",
        domain: "Blockchain",
      },
      { title: "IoT-Based Baby Incubator Monitoring System", kind: "Project", domain: "IoT" },
      { title: "A Smart Blind Stick with Voice Alert and Location Tracking", kind: "Project", domain: "IoT" },
      { title: "Automatic Fire Notification Management System for Rapid Fire Defense", kind: "Project", domain: "IoT" },
      { title: "IoT-Based Irrigation System", kind: "Project", domain: "IoT" },
      { title: "Indenting Business Management System (IMS)", kind: "Project", domain: "Web & Software" },
      { title: "OCR-Based Online Examination System", kind: "Project", domain: "Web & Software" },
      { title: "Online Voting System", kind: "Project", domain: "Web & Software" },
      { title: "Smart Laundry Management System", kind: "Project", domain: "Web & Software" },
      { title: "Online Tutor Finder", kind: "Project", domain: "Web & Software" },
    ],
  },
];

export const supervision: SupervisedWork[] = groups.flatMap(({ institution, term, items }) =>
  items.map((item) => ({ ...item, institution, ...(term && { term }) })),
);
