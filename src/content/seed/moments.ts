import type { Moment } from "../types";

/** Milestones from the "Memorable Moments" gallery. Photos live in /public/moments/. */
const img = (...names: string[]) => names.map((n) => `/moments/${n}.jpg`);

export const moments: Moment[] = [
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
