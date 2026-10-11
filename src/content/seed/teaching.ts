import type { CourseMaterial, Institution, Philosophy, Semester } from "../types";

export const philosophy: Philosophy = {
  title: "Embracing Growth and Empowering Minds",
  intro:
    "My teaching philosophy centers on fostering an environment that promotes growth, inspires curiosity, and empowers students to become confident, adaptable and lifelong learners. Education is not merely about imparting knowledge. It is about nurturing critical thinking, problem-solving skills and a passion for continuous learning.",
  principles: [
    {
      title: "Student-Centered Approach",
      body: "Every student is unique. I build a supportive, inclusive classroom where students feel valued and motivated to own their learning, and I adapt methods and materials to their backgrounds, interests and learning styles.",
    },
    {
      title: "Active Learning & Collaboration",
      body: "Group discussions, case studies, hands-on projects and real-world applications develop critical thinking, problem solving and teamwork, and let students learn from one another’s experience.",
    },
    {
      title: "Practical Relevance",
      body: "Computer science evolves quickly, so I connect theory to practice through industry case studies and hands-on work, preparing students to succeed professionally.",
    },
    {
      title: "Continuous Improvement",
      body: "I stay current through conferences, workshops and further study, and model a growth mindset that encourages lifelong learning and adaptability to changing technology.",
    },
    {
      title: "Mentorship & Support",
      body: "Beyond the classroom, I offer personalized guidance and constructive feedback, keep communication open, and make time outside scheduled hours to help students reach their academic and career goals.",
    },
  ],
  closing:
    "Through these principles I aim to inspire a love of learning and equip students to thrive in their careers and contribute meaningfully to Computer Science and Engineering.",
};

const history: (Institution & { semesters: Omit<Semester, "institution">[] })[] = [
  {
    name: "Daffodil International University",
    short: "DIU",
    role: "Assistant Professor · Senior Lecturer",
    period: "2023 – present",
    semesters: [
      {
        term: "Fall 2024",
        courses: [
          "CSE221 Object Oriented Programming II",
          "CSE222 Object Oriented Programming II Lab",
          "CSE315 Introduction to Data Science",
          "CSE226 Software Project III",
        ],
      },
      {
        term: "Spring 2024",
        courses: [
          "CSE221 Object Oriented Programming II",
          "CSE222 Object Oriented Programming II Lab",
          "CSE315 Introduction to Data Science",
        ],
      },
      {
        term: "Fall 2023",
        courses: ["CSE211 Numerical Methods", "CSE112 Computer Fundamentals", "CSE226 Software Project III"],
      },
      {
        term: "Spring 2023",
        courses: ["CSE235 Numerical Methods", "CSE112 Computer Fundamentals", "CSE225 Data Communication"],
      },
    ],
  },
  {
    name: "City University, Bangladesh",
    short: "CityU",
    role: "Lecturer",
    period: "2019 – 2022",
    semesters: [
      {
        term: "Fall 2022",
        courses: [
          "SE401 Computer Simulation & Modeling",
          "SE403 Software Quality Assurance",
          "CSE113 Structured Programming Language",
          "CSE114 Structured Programming Language Lab",
          "CSE115 Object-Oriented Programming Language",
          "ENG116 Object-Oriented Programming Language Lab",
        ],
      },
      {
        term: "Summer 2022",
        courses: [
          "CSE415 Software Engineering",
          "CSE416 Software Engineering Lab",
          "CSE215 Algorithm",
          "CSE216 Algorithm Lab",
          "CSE101 Computer Fundamentals",
          "ENG106 Computer Fundamentals",
        ],
      },
      {
        term: "Spring 2022",
        courses: [
          "CSE415 Software Engineering",
          "CSE416 Software Engineering Lab",
          "CSE325 System Analysis & Design",
          "CSE326 System Analysis & Design Lab",
          "CSE111 Computer Fundamentals & Programming Techniques",
          "SE401 Computer Simulation & Modeling",
        ],
      },
      {
        term: "Fall 2021",
        courses: [
          "SE413 Internet & Internet Technology",
          "SE401 Computer Simulation & Modeling",
          "CSE325 System Analysis & Design",
          "CSE111 Computer Fundamentals & Programming Techniques",
          "CSE112 Computer Fundamentals & Programming Techniques Lab",
        ],
      },
      {
        term: "Summer 2021",
        courses: [
          "CSE317 Computer Networks",
          "CSE318 Computer Networks Lab",
          "SE401 Computer Simulation & Modeling",
          "CSE319 Theory of Computing",
        ],
      },
      {
        term: "Spring 2021",
        courses: [
          "CSE317 Computer Networks",
          "CSE318 Computer Networks Lab",
          "SE401 Computer Simulation & Modeling",
          "CSE319 Theory of Computing",
        ],
      },
      {
        term: "Fall 2020",
        courses: [
          "CSE415 Software Engineering",
          "CSE416 Software Engineering Lab",
          "SE401 Computer Simulation & Modeling",
          "CSE323 Compiler Design",
          "CSE413 Computer Architecture",
        ],
      },
      {
        term: "Summer 2020",
        courses: [
          "CSE317 Computer Networks",
          "CSE318 Computer Networks Lab",
          "SE401 Computer Simulation & Modeling",
          "CSE323 Compiler Design",
          "CSE315 Operating System",
        ],
      },
      {
        term: "Spring 2020",
        courses: [
          "CSE113 Structured Programming Language",
          "SE401 Computer Simulation & Modeling",
          "CSE415 Software Engineering",
          "CSE416 Software Engineering Lab",
        ],
      },
      {
        term: "Fall 2019",
        courses: [
          "CSE113 Structured Programming Language",
          "CSE114 Structured Programming Language Lab",
          "SE403 Software Quality Assurance",
          "SE401 Computer Simulation & Modeling",
          "CSE124 Computer Fundamentals and Programming Language Lab",
        ],
      },
    ],
  },
  {
    name: "University of South Asia, Bangladesh",
    short: "UniSA",
    role: "Lecturer & Department Coordinator",
    period: "2018 – 2019",
    semesters: [
      {
        term: "Summer 2019",
        courses: [
          "CSE111 Computer Fundamentals & Programming Techniques",
          "CSE112 Computer Fundamentals & Programming Techniques Sessional",
          "CSE323 Computer Network",
          "CSE324 Computer Network Sessional",
          "CSE331 Pattern Recognition",
          "CSE317 Theory of Computing",
        ],
      },
      {
        term: "Spring 2019",
        courses: [
          "CSE111 Computer Fundamentals & Programming Techniques",
          "CSE112 Computer Fundamentals & Programming Techniques Sessional",
          "CSE323 Computer Network",
          "CSE324 Computer Network Sessional",
          "CSE331 Pattern Recognition",
          "CSE317 Theory of Computing",
        ],
      },
      {
        term: "Fall 2018",
        courses: [
          "CSI342 Artificial Intelligence",
          "CSE233 Computer Organization and Architecture",
          "CSE234 Computer Organization and Architecture Sessional",
          "CSE329 Mathematical Analysis for Computer Science",
          "CSE423 Simulation and Modeling",
          "CSE424 Simulation and Modeling Sessional",
        ],
      },
      {
        term: "Summer 2018",
        courses: [
          "CSE231 Operating System Concepts",
          "CSE232 Operating System Concepts Sessional",
          "CSE317 Theory of Computing",
          "CSE321 Software Engineering",
          "CSE322 Software Engineering Sessional",
        ],
      },
    ],
  },
];

export const institutions: Institution[] = history.map(({ semesters, ...institution }) => institution);

export const semesters: Semester[] = history.flatMap((i) => i.semesters.map((s) => ({ institution: i.name, ...s })));

export const courses: CourseMaterial[] = [
  {
    title: "Object-Oriented Programming with Java",
    slug: "oop-with-java",
    summary: "From objects and classes to methods, overloading and recursion.",
  },
  {
    title: "Algorithms",
    slug: "algorithms",
    summary: "Complexity, graph theory, greedy methods and dynamic programming.",
  },
  {
    title: "Simulation and Modeling",
    slug: "simulation-and-modeling",
    summary: "Monte-Carlo methods, queuing, reliability and inventory systems.",
  },
  {
    title: "Software Quality Assurance",
    slug: "software-quality-assurance",
    summary: "Review techniques, SQA concepts and software testing strategies.",
  },
  {
    title: "Object-Oriented Programming with Python",
    slug: "oop-with-python",
    summary: "Getting set up and diving into OOP the Pythonic way.",
  },
];
