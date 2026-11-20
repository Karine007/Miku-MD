# Style test: soft pastel 3D (10 options)

Ten stills in the soft, matte, pastel 3D look of the reference true-story video: slim mannequin people with simple faces, clean pastel rooms, gradient skies, word-by-word captions with a highlight box, dark name cards and white keyword pills. The test story is Elizabeth Holmes / Theranos.

Each picture shows a different scene, and each one also changes one thing about the look:

| # | Scene | Style change |
|---|---|---|
| 1 | Founder's office | Soft matte (baseline) |
| 2 | Lab, the Edison machine | Smooth satin shading |
| 3 | Suburban street | Cel bands (3-step toon shading) |
| 4 | Kitchen, checker floor | Faceted low-poly |
| 5 | Courtroom | Ink outline on people |
| 6 | Keynote stage | Paper grain overlay |
| 7 | Reporter at desk | Chunky, rounder figures |
| 8 | Night, police at the house | Golden film (warm grade, grain, vignette) |
| 9 | TV interview | Taller mannequin figures |
| 10 | Indictment close-up | High-key pastel (brighter) |

Re-render: serve the folder that holds `node_modules/three` and `style/` on port 8765, then `node shoot.js 1 2 ... 10`.
