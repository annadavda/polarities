UPDATE "SiteContent"
SET "body" = replace(
  "body",
  'Read more at the “about” page.',
  'Read more at the [about](/about) page.'
)
WHERE "key" = 'home_intro';
