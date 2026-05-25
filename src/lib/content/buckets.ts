export const BUCKETS = ["Action", "Perspective", "Relations", "Leadership/Workplace"] as const;

export const BUCKET_ASSETS: Record<string, string> = {
  Action: "/generated/bucket-action.png",
  Perspective: "/generated/bucket-perspective.png",
  Relations: "/generated/bucket-relations.png",
  "Leadership/Workplace": "/generated/bucket-leadership.png"
};

export const ASSET_RECORDS = [
  {
    key: "home-hero",
    filePath: "/generated/home-hero.png",
    bucket: null,
    altText: "A luminous shoreline beside a dark textured cliff, evoking tension held in one landscape.",
    prompt:
      "Editorial hero image, warm misty shoreline meeting a monumental dark rock cliff, one small human figure in the distance, reflective and modern, natural light, restrained rust accent, no text, no watermark."
  },
  {
    key: "bucket-action",
    filePath: BUCKET_ASSETS.Action,
    bucket: "Action",
    altText: "Warm stone and directional light suggesting forward movement and grounded agency.",
    prompt:
      "Abstract editorial natural texture for an essay category called Action, warm stone, angled sunlight, subtle path-like lines, modern literary magazine style, no text."
  },
  {
    key: "bucket-perspective",
    filePath: BUCKET_ASSETS.Perspective,
    bucket: "Perspective",
    altText: "Layered dark and pale rock surfaces suggesting reframing and seeing from more than one angle.",
    prompt:
      "Abstract editorial natural texture for Perspective, layered rock faces with light and shadow, contemplative, high-end magazine style, no text."
  },
  {
    key: "bucket-relations",
    filePath: BUCKET_ASSETS.Relations,
    bucket: "Relations",
    altText: "Interlaced warm and cool stone forms suggesting connection, boundary, and care.",
    prompt:
      "Abstract editorial natural texture for Relations, interlaced stone and soft mineral veins, warm neutral and muted green, intimate reflective mood, no text."
  },
  {
    key: "bucket-leadership",
    filePath: BUCKET_ASSETS["Leadership/Workplace"],
    bucket: "Leadership/Workplace",
    altText: "Structured dark slate and warm light suggesting workplace clarity and human judgment.",
    prompt:
      "Abstract editorial natural texture for Leadership and Workplace, structured slate, warm side light, quiet sophistication, no text, no watermark."
  }
] as const;

export function inferBucket(title: string) {
  if (/Making It Happen|Doing vs Being|Persistence|Prioritizing/.test(title)) {
    return "Action";
  }

  if (/Strength|Individual Needs/.test(title)) {
    return "Relations";
  }

  if (/Speaking Up|Compassion/.test(title)) {
    return "Leadership/Workplace";
  }

  return "Perspective";
}

export function heroForBucket(bucket: string) {
  return BUCKET_ASSETS[bucket] ?? BUCKET_ASSETS.Perspective;
}
