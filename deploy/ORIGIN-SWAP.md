# Origin swap at deploy

Every absolute URL in the shipped files uses the literal token
`https://PLACEHOLDER_ORIGIN` as its origin. The path part is real, so
`https://PLACEHOLDER_ORIGIN/menu.html` becomes the deployed menu URL
after one substitution. The token appears in:

- `index.html`, `menu.html`, `catering.html`, `about.html`,
  `contact.html`: canonical link, `og:url`, `og:image`,
  `twitter:image`, and every JSON-LD `url` / `image` / `logo` / `@id`
- `sitemap.xml`: every `<loc>`
- `robots.txt`: the `Sitemap:` line

`404.html` carries no absolute URLs by design (it is `noindex` and can
be served from any path).

Asset, stylesheet, script, and nav links are all relative and never
touched by this swap.

## The one command

Replace `PLACEHOLDER_ORIGIN` with the deployed host PLUS any base path,
no scheme (the `https://` is already in the files), no trailing slash.

GitHub Pages project site (this repo):

    sed -i 's|PLACEHOLDER_ORIGIN|luxologygg.github.io/Saffron|g' \
      index.html menu.html catering.html about.html contact.html \
      sitemap.xml robots.txt

Custom domain example:

    sed -i 's|PLACEHOLDER_ORIGIN|saffronandricetorrance.com|g' \
      index.html menu.html catering.html about.html contact.html \
      sitemap.xml robots.txt

macOS/BSD sed needs `sed -i ''` in place of `sed -i`.

## Verify after the swap

    grep -rn "PLACEHOLDER_ORIGIN" *.html sitemap.xml robots.txt

must print nothing.
