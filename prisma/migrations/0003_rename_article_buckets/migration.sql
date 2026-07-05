UPDATE "Article"
SET "bucket" = CASE "slug"
  WHEN 'compassion-vs-accountability' THEN 'Relationships'
  WHEN 'doing-vs-being' THEN 'Doing/Being'
  WHEN 'enoughness-vs-improvement' THEN 'Doing/Being'
  WHEN 'expertise-vs-beginners-mind' THEN 'Knowing/Not Knowing'
  WHEN 'individual-needs-vs-collective-needs' THEN 'Relationships'
  WHEN 'making-it-happen-vs-letting-it-unfold' THEN 'Doing/Being'
  WHEN 'persistence-vs-release' THEN 'Doing/Being'
  WHEN 'present-moment-vs-future-direction' THEN 'Knowing/Not Knowing'
  WHEN 'prioritizing-vs-staying-open' THEN 'Knowing/Not Knowing'
  WHEN 'seeing-what-is-vs-seeing-what-could-be' THEN 'Knowing/Not Knowing'
  WHEN 'speaking-up-vs-staying-quiet' THEN 'Relationships'
  WHEN 'strength-vs-vulnerability' THEN 'Relationships'
  ELSE "bucket"
END
WHERE "slug" IN (
  'compassion-vs-accountability',
  'doing-vs-being',
  'enoughness-vs-improvement',
  'expertise-vs-beginners-mind',
  'individual-needs-vs-collective-needs',
  'making-it-happen-vs-letting-it-unfold',
  'persistence-vs-release',
  'present-moment-vs-future-direction',
  'prioritizing-vs-staying-open',
  'seeing-what-is-vs-seeing-what-could-be',
  'speaking-up-vs-staying-quiet',
  'strength-vs-vulnerability'
);

UPDATE "Asset"
SET "bucket" = CASE "key"
  WHEN 'bucket-action' THEN 'Doing/Being'
  WHEN 'bucket-perspective' THEN 'Knowing/Not Knowing'
  WHEN 'bucket-relations' THEN 'Relationships'
  ELSE "bucket"
END
WHERE "key" IN ('bucket-action', 'bucket-perspective', 'bucket-relations');

DELETE FROM "Asset"
WHERE "key" = 'bucket-leadership';
