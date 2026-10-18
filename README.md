# Fundzy

**Scholarship information, minus the overwhelm.**

Fundzy is an independent student information project for students in Uttar Pradesh and across India. It helps students discover scholarship programmes, understand eligibility pointers, prepare documents and find the official application portal.

## Features
- Search scholarship guides and filter by study level, state/coverage, category and listed application status.
- Read eligibility pointers, document-preparation checklists, source dates and official links.
- Redirect to the official provider to complete the real application.
- Track personal preparation and application status in the current browser.
- Export/import tracker data as JSON.
- Responsive layout for phones and desktops.
- Mobile navigation menu with accessible open/close controls.
- Light/dark theme toggle that remembers the choice in the current browser.

## Tech stack
- HTML5 (`index.html`)
- CSS3 (`styles.css`)
- Vanilla JavaScript (`app.js`)
- Scholarship data records (`data.js`)
- Browser `localStorage` for the local tracker
- JSON for tracker backup/export

## Run locally
1. Extract the project.
2. Open `index.html` in a modern browser.
3. If needed, run `python -m http.server 8000` in this directory and visit `http://localhost:8000`.

## Data accuracy
The catalogue is a manually maintained snapshot, not a live API and not a complete list of all scholarships. It was reviewed against official listings on 18 October 2026. NSP listings include several AY 2026–27 programmes with a student application deadline of 31 October 2026; Reliance Foundation 2026–27 UG/PG opportunities were announced, but a deadline was not confirmed in the reviewed announcement. These dates may change. Verify eligibility, deadlines, documents and live availability on the official portal before applying.

## Privacy
The prototype has no user accounts or document uploads. Tracker data is stored in the current browser and is not synced across devices. Do not enter Aadhaar numbers, bank details, passwords, OTPs or other sensitive information.

## Disclaimer
Fundzy is an independent information project and is not affiliated with or endorsed by a government department or scholarship authority. Actual applications, identity checks, document uploads and award decisions remain with the official provider.

## Copyright
Copyright © 2026 Fundzy. All rights reserved. No open-source license is granted.

## Official resources
- National Scholarship Portal: https://scholarships.gov.in/All-Scholarships
- Uttar Pradesh Scholarship Portal: https://scholarship.up.gov.in/
- PIB notice on NMMSS deadline extension for 2026–27: https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2317657&lang=1&reg=3
- Reliance Foundation Scholarships 2026–27 announcement: https://www.reliancefoundation.org/media/media-release/Reliance_Foundation_Scholarships_2026-27


## India-wide coverage and state portals
The main catalogue includes national programmes and selected state-specific guides. The state filter shows national programmes for the selected state, plus matching state/region-specific guides already in the catalogue. The state portal section provides verified starting links for NSP, Delhi, Maharashtra, Bihar, Odisha and Uttar Pradesh. It is not yet a complete catalogue of every state scheme; students should verify local schemes with the relevant official state department.

## Adding the four team photos
1. Create a folder named `images` next to `index.html`.
2. Save your four images as `member-1.jpg`, `member-2.jpg`, `member-3.jpg` and `member-4.jpg`.
3. In `index.html`, find the `Meet our little team` section.
4. Replace each `.team-photo-placeholder` block with an image, for example:
   `<img class="team-photo" src="images/member-1.jpg" alt="Member One">`
5. Update each member's name, course/branch and project role in the same section.
