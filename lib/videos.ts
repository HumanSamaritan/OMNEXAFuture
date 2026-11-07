export const videos = [
  {
    "slug": "deepavali-human-ai-collaboration",
    "youtubeId": "sIL8hvR5WLI",
    "title": "Deepavali — Human + AI Collaboration",
    "category": "Skills, Jobs & Career Opportunities",
    "uploadDate": "2026-11-07",
    "duration": "PT11S",
    "description": "Explore human and AI collaboration with OMNeXa, connecting education, skills, career pathways and partnership opportunities.",
    "summary": "Students, job seekers, trainers, universities, employers and robotics collaborators can explore OMNeXa’s career and education ecosystem.",
    "productUrl": "https://omnexa-career.omnexagoc.com",
    "instagramUrl": null,
    "facebookUrl": null
  },
  {
    "slug": "everyday-life-challenges",
    "youtubeId": "IOF-natDy8g",
    "title": "Human + Machine Sadhana — Everyday Life Challenges",
    "category": "Human + Machine Sadhana",
    "uploadDate": "2026-09-09",
    "duration": "PT40S",
    "description": "Discover Human + Machine Sadhana (HMS), OMNeXa’s approach to awareness, daily reflection and responsible AI-assisted insights.",
    "summary": "HMS explores daily rhythms, mood, gratitude and reflection for people navigating everyday pressures and building more intentional routines.",
    "productUrl": "https://humanmachinesadhana.omnexagoc.com",
    "instagramUrl": null,
    "facebookUrl": null
  },
  {
    "slug": "conquer-your-inner-ravan",
    "youtubeId": "faabEp-rkIQ",
    "title": "Dussehra — Conquer Your Inner Ravan",
    "category": "Human + Machine Sadhana",
    "uploadDate": "2026-10-21",
    "duration": "PT28S",
    "description": "Inspired by Dussehra, OMNeXa explores facing everyday challenges through awareness, reflection and conscious choices.",
    "summary": "The film introduces the Human + Machine Sadhana theme of recognising personal challenges and taking meaningful action one step at a time.",
    "productUrl": "https://humanmachinesadhana.omnexagoc.com",
    "instagramUrl": null,
    "facebookUrl": null
  },
  {
    "slug": "nexavirama-powered-by-omnexa",
    "youtubeId": "qt3F7o4NO_0",
    "title": "NeXaVirama Powered by OMNeXa",
    "category": "Human + Machine Sadhana",
    "uploadDate": "2026-09-04",
    "duration": "PT1M15S",
    "description": "An introduction to NeXaVirama and the idea of creating a pause between an urge and an automatic action.",
    "summary": "NeXaVirama is designed to support awareness of urges and triggers, helping people reflect before choosing a response.",
    "productUrl": "https://www.omnexagoc.com/work",
    "instagramUrl": null,
    "facebookUrl": null
  },
  {
    "slug": "nexavirama-intelligent-pause",
    "youtubeId": "fFQ3GcCu9Lo",
    "title": "NeXaVirama — The Intelligent Pause",
    "category": "Human + Machine Sadhana",
    "uploadDate": "2026-09-04",
    "duration": "PT2M4S",
    "description": "Explore how NeXaVirama approaches mindful technology and more intentional responses to everyday triggers.",
    "summary": "The intelligent pause creates space to notice a trigger, reflect and make a conscious choice. Explore the product introduction in this video.",
    "productUrl": "https://www.omnexagoc.com/work",
    "instagramUrl": null,
    "facebookUrl": null
  },
  {
    "slug": "nexakriya-daily-commitments",
    "youtubeId": "FfdUY4fouQg",
    "title": "NeXaKriya by OMNeXa",
    "category": "Human + Machine Sadhana",
    "uploadDate": "2026-09-04",
    "duration": "PT2M",
    "description": "Discover NeXaKriya, OMNeXa’s user-controlled commitment and calendar planning application.",
    "summary": "NeXaKriya brings commitments and planning into a user-controlled experience. Optional calendar integration depends on the permissions and mode selected by the user.",
    "productUrl": "https://nexakriya.omnexagoc.com",
    "instagramUrl": null,
    "facebookUrl": null
  }
] as const;
export const videoCategories = ["Skills, Jobs & Career Opportunities", "Human + Machine Sadhana"] as const;

// Published introductions, shared by portfolio links and product pages.
const productVideoSlugs: Record<string, string> = {
  "human-machine-sadhana": "everyday-life-challenges",
  "nexavirama": "nexavirama-intelligent-pause",
  "nexakriya": "nexakriya-daily-commitments"
};
export function getProductVideo(productSlug: string) {
  return videos.find((video) => video.slug === productVideoSlugs[productSlug]);
}
