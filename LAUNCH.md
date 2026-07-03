# Launch Checklist

This is the plain-English launch path for The Polarities.

## What Is Ready

- The public website runs in Docker.
- The online launch setup can run database updates.
- The first online launch can load the starting articles.
- Later launches skip reseeding articles if articles already exist, so edits are not overwritten.
- Search engines get a sitemap.
- Search engines are told not to index `/admin`.
- The public pages have basic preview text and image data for links shared online.

## What Anna Needs To Decide

1. The final Fly app name.
   - Current placeholder: `polarities`
   - This affects the temporary address, like `https://polarities.fly.dev`.

2. The final public web address.
   - Example: `https://thepolarities.com`
   - Once chosen, set `NEXT_PUBLIC_SITE_URL` to that address.

3. Whether the online Admin editor should be available at launch.
   - Recommended for first public launch: keep it locked.
   - Next step if online editing is needed: add real login before enabling Admin online.

4. Which articles should be published.
   - Use the local Admin editor to mark articles published or unpublished.

5. Whether placeholder notes should stay.
   - Search for notes like `[improve the examples here]` before launch.

## Online Settings Needed

These values need to exist on Fly before launch:

- `DATABASE_URL`
- `NEXT_PUBLIC_SITE_URL`

Do not set this online unless you knowingly want the Admin editor open without login:

- `ALLOW_UNAUTHENTICATED_ADMIN`

## Suggested Launch Order

1. Choose the Fly app name.
2. Create or connect an online Postgres database.
3. Set `DATABASE_URL`.
4. Set `NEXT_PUBLIC_SITE_URL`.
5. Deploy the app.
6. Open the temporary Fly URL and check the public site.
7. Connect the real domain.
8. Check homepage, About, article pages, mobile layout, and link previews.
9. Add real Admin login before doing online editing.
