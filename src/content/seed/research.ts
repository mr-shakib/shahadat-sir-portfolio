import type { ResearchLists, ResearchTheme } from "../types";

export const themes: ResearchTheme[] = [
  {
    key: "behavior",
    label: "Human behavior",
    icon: "users",
    title: "Human Behavior Analysis",
    short: "How people decide, read, react and share on digital platforms.",
    summary:
      "The core of my work is understanding human behavior on digital platforms: the factors that drive consumer decisions in Facebook-based commerce (F-commerce), how readers engage with online news, how sentiment and personality cues form around public figures on Twitter, and how users protect or expose themselves on social networks.",
    questions: [
      "Which factors most influence consumer behavior in social commerce?",
      "What reading patterns characterize online news audiences?",
      "How do sentiment and personality traits surface in social media discourse?",
    ],
  },
  {
    key: "data",
    label: "Data science & viz",
    icon: "chart",
    title: "Data Science & Information Visualization",
    short: "Exploratory analytics and visual storytelling with real-world data.",
    summary:
      "I use exploratory data analysis, clustering and visualization to make large, noisy socio-economic datasets legible, from the World Crime Index and the Corruption Perception Index to stock-market sectors during COVID-19 and big-data storage practice. The aim is insight that decision-makers can read at a glance.",
    questions: [
      "What structure hides in global indices once we cluster and visualize them?",
      "How can big data analytics capabilities be measured and communicated?",
    ],
  },
  {
    key: "ml",
    label: "Machine learning",
    icon: "brain",
    title: "Machine Learning & Deep Learning",
    short: "Predictive models that explain behavior, not only predict it.",
    summary:
      "I apply supervised and unsupervised learning (ANN, Random Forest, KNN, DBSCAN, PCA, CNN and transformer-based NLP) to behavioral and applied problems, including fake-news detection, Bangla voice assistance, crop disease detection and personalized recommender systems for music therapy.",
    questions: [
      "Can learning models reliably flag fake news and hostile text, including in Bangla?",
      "How can recommender systems personalize care-oriented services?",
    ],
  },
  {
    key: "systems",
    label: "Systems & security",
    icon: "shield",
    title: "Information Systems, Security & SEM",
    short: "Trustworthy systems, and structural models of how users adopt them.",
    summary:
      "Complementing the analytical work, I study secure and practical information systems (blockchain land administration, cryptographic wireless networks, banking-network security, database choices for MIS) and use Structural Equation Modeling (SEM) to test how users perceive and adopt technology.",
    questions: [
      "What security trade-offs do users accept in everyday digital services?",
      "Which latent constructs explain technology adoption in emerging economies?",
    ],
  },
];

const methods = [
  "Artificial Neural Networks",
  "Random Forest",
  "K-Nearest Neighbors",
  "DBSCAN Clustering",
  "Linear Regression",
  "Principal Component Analysis",
  "Convolutional Neural Networks",
  "Sentiment & Polarity Analysis",
  "BERT / SVM",
  "Structural Equation Modeling",
  "Exploratory Data Analysis",
  "Recommender Systems",
  "Blockchain",
  "Ant-Colony Optimization",
];

const interests = [
  "Data Science",
  "Big Data Analytics Capabilities",
  "Information Visualization",
  "Human Behavior Analysis",
  "Machine Learning",
  "Structural Equation Modeling",
];

export const research: ResearchLists = {
  interests,
  methods,
  publishers: ["Springer", "IEEE", "ACM", "Taylor & Francis", "IGI Global", "AIP"],
};
