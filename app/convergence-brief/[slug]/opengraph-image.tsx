import { ImageResponse } from "next/og";
import { getConvergenceIssue } from "@/lib/publications";

export const alt = "The Convergence Brief by OMNeXa Pte. Ltd.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function Image({ params }: Props) {
  const { slug } = await params;
  const issue = await getConvergenceIssue(slug);
  const issueLabel = issue?.issue || "The Convergence Brief";
  const title = issue?.title || "Ideas for responsible human-machine transformation";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "linear-gradient(135deg, #07101d 0%, #122437 55%, #1f8f85 140%)",
          color: "#ffffff",
          fontFamily: "Arial, sans-serif"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", fontSize: 26, fontWeight: 700, letterSpacing: 3 }}>OMNeXa</div>
          <div style={{ display: "flex", fontSize: 22, color: "#f7c66b", letterSpacing: 2 }}>{issueLabel}</div>
        </div>
        <div style={{ display: "flex", maxWidth: 990, flexDirection: "column" }}>
          <div style={{ display: "flex", marginBottom: 22, fontSize: 24, color: "#72d3ca" }}>
            THE CONVERGENCE BRIEF
          </div>
          <div style={{ display: "flex", fontSize: 68, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 }}>
            {title}
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, color: "#d8e2eb" }}>
          <span>Dhiraj Kumar · Founder & CEO</span>
          <span>Where Consciousness Meets Intelligence</span>
        </div>
      </div>
    ),
    size
  );
}
