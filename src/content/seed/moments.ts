import type { Moment } from "../types";

/** Milestones from the "Memorable Moments" gallery. Photos live in /public/moments/. */
const img = (...names: string[]) => names.map((n) => `/moments/${n}.jpg`);

const range = (name: string, count: number) => img(...Array.from({ length: count }, (_, i) => `${name}-${i + 1}`));

export const moments: Moment[] = [
  {
    year: 2026,
    title: "Workshop on Building Equity",
    caption:
      "Took part in the British Council–funded workshop with Nottingham Trent University on assessing the Extended Inclusive Education Toolkit, 23–24 April, Hotel InterContinental Dhaka.",
    category: "Academic",
    images: range("2026-building-equity", 3),
  },
  {
    year: 2026,
    title: "Book Launch: Teaching with Outcome",
    caption:
      "Inauguration and distribution of my book, “Teaching with Outcome: A Faculty Guide to OBE”, organized by the OBE and Accreditation Committee, Department of CSE, Daffodil International University.",
    category: "Academic",
    images: range("2026-book-launch", 6),
  },
  {
    year: 2025,
    title: "Workshop on the Ethical Use of GenAI",
    caption:
      "Joined the British Council–funded workshop with Nottingham Trent University on co-creating guidelines for the ethical use of generative AI by higher education and TVET students in Bangladesh, 9 December, Hotel InterContinental Dhaka.",
    category: "Academic",
    images: range("2025-genai-workshop", 3),
  },
  {
    year: 2025,
    title: "DIU CyberCon National Capture the Flag",
    caption: "At DIU CyberCon’s National Capture the Flag competition, a national cybersecurity contest held on 18 and 25 October.",
    category: "Teaching",
    images: range("2025-cybercon-ctf", 3),
  },
  {
    year: 2025,
    title: "Prompt Battle: Prize-Giving Ceremony",
    caption:
      "Prize-giving ceremony of “The Skill of Asking: Prompt Battle”, a prompt engineering contest run by DIU’s Computer Programming Club, Summer 2025.",
    category: "Teaching",
    images: img("2025-prompt-battle"),
  },
  {
    year: 2025,
    title: "Effective Module Leadership",
    caption: "Sessions for CSE faculty on OBE-based teaching, assessment and continuous quality improvement (CQI) practice.",
    category: "Teaching",
    images: range("2025-module-leadership", 4),
  },
  {
    year: 2025,
    title: "BAETE Training on Program Evaluation",
    caption:
      "Received a certificate at a training session of the Board of Accreditation for Engineering and Technical Education (BAETE) on program evaluation.",
    category: "Academic",
    images: range("2025-baete-training", 2),
  },
  {
    year: 2025,
    title: "Talks and Sessions at DIU",
    caption: "Speaking at seminars, student sessions and classes at Daffodil International University.",
    category: "Teaching",
    images: range("2025-talks", 6),
  },
  {
    year: 2025,
    title: "Everyday Moments",
    caption: "Sunset at sea, and a quick photo with a colleague.",
    category: "Life",
    images: range("2025-everyday", 2),
  },
  {
    year: 2024,
    title: "ICPC Asia Dhaka Regional Contest 2024",
    caption: "At the ICPC Asia Dhaka Regional Contest 2024.",
    category: "Teaching",
    images: range("2024-icpc-dhaka", 4),
  },
  {
    year: 2024,
    title: "11th Convocation, DIU",
    caption: "At Daffodil International University’s 11th Convocation in 2024, and earlier at its 10th.",
    category: "Academic",
    images: range("2024-convocation", 2),
  },
  {
    year: 2021,
    title: "20th Convocation Ceremony, AIUB",
    caption: "Received the Cum Laude Award for academic excellence from the Honorable Dean, Faculty of Science.",
    category: "Academic",
    images: img("2021-convocation-1", "2021-convocation-2"),
  },
  {
    year: 2021,
    title: "MSc Graduation Day",
    caption: "Master of Computer Science, AIUB.",
    category: "Academic",
    images: img("2021-msc-graduation"),
  },
  {
    year: 2021,
    title: "ICO 2021",
    caption:
      "Presented an accepted paper at the International Conference on Intelligent Computing & Optimization, published in Springer LNNS.",
    category: "Research",
    images: img("2021-ico"),
  },
  {
    year: 2021,
    title: "IC4IR 2021",
    caption:
      "Paper accepted at IC4IR 2021, organized by UGC Bangladesh. Attended with my father, Md. Karam Newaz, and met the Dean of Science and Engineering, Gono Bishwabidyalay.",
    category: "Research",
    images: img("2021-ic4ir-1", "2021-ic4ir-2"),
  },
  {
    year: 2021,
    title: "TEHI 2021",
    caption: "Paper accepted at TEHI 2021, organized by PSIT, India.",
    category: "Research",
    images: img("2021-tehi"),
  },
  {
    year: 2021,
    title: "Bhawal Resort Tour",
    caption: "A trip with my family.",
    category: "Life",
    images: img("2021-bhawal"),
  },
  {
    year: 2019,
    title: "1st Idea Fair",
    caption: "Organized the first Idea Fair with participants and winners at the University of South Asia.",
    category: "Teaching",
    images: img("2019-idea-fair-1", "2019-idea-fair-2", "2019-idea-fair-3"),
  },
  {
    year: 2019,
    title: "Talk on Blockchain Technology",
    caption: "Invited talk at the University of South Asia, Bangladesh.",
    category: "Teaching",
    images: img("2019-blockchain-talk-1", "2019-blockchain-talk-2"),
  },
  {
    year: 2019,
    title: "Speech on Career in CSE",
    caption: "Career guidance session for students, University of South Asia.",
    category: "Teaching",
    images: img("2019-career-talk"),
  },
  {
    year: 2019,
    title: "Academic & Industry Meetings",
    caption: "Met the Vice Principal of Khawja Polytechnic Institute and the Executive Director of Creative IT.",
    category: "Teaching",
    images: img("2019-meeting-1", "2019-meeting-2"),
  },
  {
    year: 2019,
    title: "Intra-University Cricket Competition",
    caption: "Played with the cricket team of the Department of CSE, University of South Asia.",
    category: "Life",
    images: img("2019-cricket"),
  },
  {
    year: 2019,
    title: "Corporate Football Competition",
    caption: "Represented the University of South Asia, Bangladesh.",
    category: "Life",
    images: img("2019-football"),
  },
  {
    year: 2019,
    title: "CISCO Course Completed",
    caption: "Completed a CISCO course at Linux Pathshala.",
    category: "Academic",
    images: img("2019-cisco"),
  },
  {
    year: 2018,
    title: "18th Convocation Ceremony, AIUB",
    caption:
      "Graduated with a Bachelor of Science in Computer Science from American International University-Bangladesh.",
    category: "Academic",
    images: img("2018-convocation-1", "2018-convocation-2"),
  },
  {
    year: 2018,
    title: "Fall Festival",
    caption: "University of South Asia, Bangladesh.",
    category: "Life",
    images: img("2018-fall-festival"),
  },
  {
    year: 2017,
    title: "Software Engineer (Intern), iXora Solution Ltd.",
    caption: "First days in industry; celebrated the company’s 4th anniversary and won 3rd prize in the lucky draw.",
    category: "Industry",
    images: img("2017-ixora-1", "2017-ixora-2", "2017-ixora-3"),
  },
  {
    year: 2017,
    title: "Cycle Tour",
    caption: "On the road with a cycle mate.",
    category: "Life",
    images: img("2017-cycle-tour"),
  },
  {
    year: 2013,
    title: "First Day of University Life",
    caption: "American International University-Bangladesh.",
    category: "Academic",
    images: img("2013-first-day-aiub"),
  },
];
