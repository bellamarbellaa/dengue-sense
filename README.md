# DengueSense

**A climate-resilient dengue early warning system for ASEAN.**

Built by **Team Nyamuk Hunter** for ASEAN Data Science Explorers 2026, DengueSense demonstrates how forecasts, geographic risk information, preparedness guidance and community observations can support earlier local action.

**[Explore the live prototype](https://dengue-sense-beryl.vercel.app)** · [Interactive risk map](https://dengue-sense-beryl.vercel.app/#visualize)

## What you can explore

| Capability | Prototype experience |
| --- | --- |
| **PREDICT** | Explore simulated case trends, select an area and adjust the forecast horizon from 1 to 12 weeks. |
| **VISUALIZE** | Navigate a real Jakarta street map, select neighbourhood markers and compare Today, 7-day and 14-day demo scenarios. Switch between risk, rainfall, population density and mosquito suitability layers. |
| **GUIDE** | Browse preparedness resources and track a location-specific checklist. |
| **CONNECT** | Submit sample breeding-site observations, simulate verification and follow-up, and explore community discussions and rewards. |

The app also includes a dashboard, sample alerts, district/resource search, report export and health-officer/community views. Indonesia/Jakarta is the implemented workspace; other ASEAN country connections are pending.

## Data: source snapshots and demo scenarios

The prototype distinguishes two types of information:

- **Source snapshots:** Indonesia and Jakarta surveillance figures and an East Jakarta district comparison, recorded in [data.js](./data.js) with reporting periods, definitions and source links. These are historical snapshots, not a live data feed. Suspected dengue reports and reported DBD cases have different definitions and should not be compared as equivalent counts.
- **Generated demo values:** forecasts, risk scores, environmental conditions, population-density inputs, initial community reports and rewards illustrate the product experience. They are not measured conditions or validated predictions.

The map uses **Leaflet 1.9.4** and **OpenStreetMap** street tiles. Markers represent approximate neighbourhood locations. Coloured circles are illustrative overlays, not administrative boundaries. Internet access is required to load the map.

### How the map scenarios work

Today displays a sample baseline. The 7-day and 14-day views apply a deterministic scenario using temperature, rainfall and population density. Density stays fixed while sample temperature and rainfall change by area.

```text
step = 0 for Today, 1 for 7-day, 2 for 14-day

growth per step = max(temperature − 27, 0) × 0.035
                + rainfall / 100 × 0.065
                + population density / 20,000 × 0.045

projected weekly cases = baseline cases × (1 + step × growth per step)
risk score = min(9.8, baseline score + 5 × step × growth per step)
```

All coefficients and scenario inputs are illustrative. This demonstrates how the interface responds to multiple drivers; it is not a fitted epidemiological model. The method is also accessible through **“How this demo is calculated”** in the map panel.

## Run locally

This is a static HTML, CSS and JavaScript app with no build step.

```bash
git clone https://github.com/bellamarbellaa/dengue-sense.git
cd dengue-sense
python3 -m http.server 8765
```

Open [http://localhost:8765](http://localhost:8765). A local server is recommended; the map also needs an internet connection.

## Project structure

| File | Purpose |
| --- | --- |
| `index.html` | App shell and external map dependencies |
| `app.js` | Shared state, navigation and core interactions |
| `enhance.js`, `dashboard.css` | Dashboard and capability screens |
| `data.js` | Surveillance snapshots, definitions and source links |
| `regional.js`, `regional.css` | Country workspaces and source-data presentation |
| `map.js`, `map.css` | Street map, overlays and demo horizon scenarios |
| `style.css` | Shared styles and responsive layout |
| `vercel.json` | Static deployment configuration |

## Storage and prototype limits

Reports, discussions, alerts and checklist changes remain in the current browser's local storage. Clear site data to reset them. Optional photos are preview-only and are not attached to stored reports. The role selector changes the demo view; it is not authentication. Alerts and submissions do not contact health authorities.

DengueSense is a competition prototype, not an operational health service. Production use would require validated forecasts, reliable data pipelines, authenticated roles, secure reporting, approved guidance and partnerships with responsible authorities.

## Deployment and updates

Hosted on **Vercel**, with this GitHub repository connected to the production project. Pushes to `main` trigger production deployment. The repository root is the app root and output directory; no build command is required.

Before publishing JavaScript changes, check their syntax and test the affected workflow locally:

```bash
node --check app.js
node --check enhance.js
node --check regional.js
node --check map.js
```

## Credits

**Team Nyamuk Hunter** · ASEAN Data Science Explorers 2026

Street-map rendering: [Leaflet](https://leafletjs.com/) · Map data: [OpenStreetMap contributors](https://www.openstreetmap.org/copyright). Surveillance source links and reporting details are included in the app and `data.js`.
