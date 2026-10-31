# SeriesHeat

Explore TV shows through heatmaps of average IMDb episode ratings.

## Using the app

Search for a TV show and select a result to visualize its episodes. Before a
show is selected, a welcome panel explains how to get started and offers example
shows; it disappears as soon as you select a show.

- Choose a color scheme to change how ratings are displayed.
- Use **Flip** to switch seasons between columns and rows.
- Hover over an episode for details, or click a cell to open its IMDb page.
- Share the URL to preserve the selected show, color scheme, and orientation.

## Local development

Install Node.js and npm, then run:

```sh
npm ci
npm start
```

Open http://localhost:3000.

The frontend uses React, TypeScript, Chakra UI, D3, and webpack. By default it
fetches search results and ratings from the hosted SeriesHeat API. To use a
different API, set its base URL when starting the app:

```sh
API_BASE_URL=http://localhost:8787/api npm start
```

The API backend is not included in this repository. It must provide
`GET /search?q=...` and `GET /series/:id`; see
`src/utils/dataUtils.ts` and `src/types.ts` for the expected response data.

## Production build

```sh
npm run build
```

Built assets are written to `dist/`. `npm run deploy` builds the app and publishes
that directory to GitHub Pages using `gh-pages` (requires repository write access).

## Credits

Created by Jim Vallandingham. Ratings come from IMDb datasets. See the app's
information dialog for data attribution and the original heatmap inspiration.
