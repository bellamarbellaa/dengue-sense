# DengueSense interactive prototype

An interactive prototype for Team Nyamuk Hunter. Open `index.html` in a browser, or serve this folder locally. No build step is required. The street map uses Leaflet and online OpenStreetMap tiles.

## Included

- PREDICT: simulated case trend with 4-, 8-, and 12-week windows and location selection.
- VISUALIZE: interactive street map and simulated risk layers, connected to the forecast selection.
- GUIDE: location-specific demo checklist with browser-local persistence.
- CONNECT: report submission, simulated verification and follow-up, plus a community view.
- Red and navy visual direction derived from the supplied storyboard.
- Responsive layouts, keyboard focus, and a persistent prototype disclosure.

## Data and scope

All forecasts, conditions, risk levels, and initial reports are simulated. Map circles are simulated overlays and do not represent administrative boundaries. This is not a live health service or a trained forecasting system. Reports and checklists are not sent externally. Checklist and report changes are stored in browser local storage. Clear site data to remove them.

Production work would require authenticated roles, real geographic boundaries and licensed data, validated forecasts, approved guidance, secure reporting, and partnerships with the relevant authorities.

## Screenshot-aligned dashboard revision

Includes Dashboard, Forecasts with layer controls and horizon slider, Risk Map with simulated layers and demo alerts, Resources with filterable guides, and Community with optional local photo preview, demo rewards, reporting, and discussions. Search and plain-text report export work locally. Photos are preview-only and are not transmitted or attached to stored reports. The risk explorer uses real street geography with simulated risk overlays. No serotype, vaccination matching, prediction-confidence, or response-time claim is presented as measured evidence.


## Regional scope and data
Country selection supports ASEAN workspaces; Indonesia/Jakarta is implemented. Other country connections remain pending. Official Indonesia and Jakarta surveillance snapshots are defined in data.js with dates, case definitions and source URLs. Forecasts, map scores and environmental inputs are sample data, explained in the Prototype/Help dialog. User actions stay in browser storage.

## Street map upgrade

The risk explorer now uses Leaflet 1.9.4 with OpenStreetMap street tiles and visible attribution. It requires an internet connection. Markers are positioned at approximate neighbourhood locations; coloured circles are simulated overlays, not administrative boundaries or live risk data. Layers, area selection, pan/zoom and reset controls are interactive. No user reports or health information are sent to the map provider.

## Published app

- Production: https://dengue-sense-beryl.vercel.app
- Source: https://github.com/bellamarbellaa/dengue-sense (private)
- Vercel project: https://vercel.com/finto-payment-app/dengue-sense

Vercel is connected to GitHub; pushes to main deploy production. No build step; project root and output directory are the repository root. Run `node --check` on changed JavaScript before pushing. Reports, alerts and checklist state remain browser-local.

Today, 7-day and 14-day map views use a deterministic demo scenario with sample temperature, rainfall and population-density inputs. The method is available inside the map panel; values are illustrative, not validated forecasts.
