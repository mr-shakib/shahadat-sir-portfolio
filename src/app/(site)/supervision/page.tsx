import type { Metadata } from "next";
import { PageHeader, StatRow } from "@/components/PageHeader";
import { SupervisionBrowser } from "@/components/SupervisionBrowser";
import { countWord, supervisionStats } from "@/content/derive";
import { getContent } from "@/content/store";

export const metadata: Metadata = {
  title: "Thesis & Project Supervision",
  description:
    "Undergraduate theses and capstone projects supervised by Shahadat Hossain at Daffodil International University and City University, Bangladesh.",
};

export default async function SupervisionPage() {
  const { supervision, institutions } = await getContent();
  const stats = supervisionStats(supervision);

  return (
    <>
      <PageHeader
        title="Thesis and project supervision"
        description={`I supervise undergraduate theses and capstone projects in machine learning, NLP, computer vision, IoT, blockchain and software engineering.${
          stats.published === 1
            ? " One has led to a peer-reviewed publication."
            : stats.published > 1
              ? ` ${countWord(stats.published)} have led to peer-reviewed publications.`
              : ""
        }`}
      >
        <StatRow
          stats={[
            { value: stats.total, label: "Supervised in total" },
            { value: stats.theses, label: "Undergraduate theses" },
            { value: stats.projects, label: "Capstone projects" },
            { value: stats.published, label: "Led to publications" },
          ]}
        />
      </PageHeader>
      <section className="container-page pt-12">
        <SupervisionBrowser items={supervision} institutions={institutions} />
      </section>
    </>
  );
}
