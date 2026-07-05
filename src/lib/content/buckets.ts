export const BUCKETS = ["Doing/Being", "Knowing/Not Knowing", "Relationships"] as const;

export const BUCKET_ASSETS: Record<string, string> = {
  "Doing/Being": "/generated/bucket-action.png",
  "Knowing/Not Knowing": "/generated/bucket-perspective.png",
  Relationships: "/generated/bucket-relations.png"
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
    filePath: BUCKET_ASSETS["Doing/Being"],
    bucket: "Doing/Being",
    altText: "Warm stone and directional light suggesting forward movement and grounded agency.",
    prompt:
      "Abstract editorial natural texture for an essay category called Doing/Being, warm stone, angled sunlight, subtle path-like lines, modern literary magazine style, no text."
  },
  {
    key: "bucket-perspective",
    filePath: BUCKET_ASSETS["Knowing/Not Knowing"],
    bucket: "Knowing/Not Knowing",
    altText: "Layered dark and pale rock surfaces suggesting reframing and seeing from more than one angle.",
    prompt:
      "Abstract editorial natural texture for Knowing/Not Knowing, layered rock faces with light and shadow, contemplative, high-end magazine style, no text."
  },
  {
    key: "bucket-relations",
    filePath: BUCKET_ASSETS.Relationships,
    bucket: "Relationships",
    altText: "Interlaced warm and cool stone forms suggesting connection, boundary, and care.",
    prompt:
      "Abstract editorial natural texture for Relationships, interlaced stone and soft mineral veins, warm neutral and muted green, intimate reflective mood, no text."
  }
] as const;

export function inferBucket(title: string) {
  if (/Doing vs Being|Enoughness|Making It Happen|Persistence/.test(title)) {
    return "Doing/Being";
  }

  if (/Compassion|Individual Needs|Speaking Up|Strength/.test(title)) {
    return "Relationships";
  }

  return "Knowing/Not Knowing";
}

export function heroForBucket(bucket: string) {
  return BUCKET_ASSETS[bucket] ?? BUCKET_ASSETS["Knowing/Not Knowing"];
}
