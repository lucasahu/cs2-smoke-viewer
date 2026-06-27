# CS2 Smoke Viewer

A fast 3D smoke-lineup viewer for Counter-Strike 2. Pull up a map, click a
smoke landing spot, pick a throw position, and get an image + text walkthrough
of the lineup.

## Stack

- **Vite + React + TypeScript**
- **React Three Fiber** + **@react-three/drei** for the 3D scene
- **Zustand** for app state
- Lineup data lives in typed modules under `src/data/maps/`

## Getting started

```bash
npm install
npm run dev
```

The app runs immediately against a placeholder grid — no game assets required
to develop the UI and data model.

## Project shape

```
src/
  types/lineup.ts        # data model (the spine): GameMap > SmokeSpot > Lineup
  data/maps/             # one typed module per map (mirage.ts), registered in index.ts
  state/store.ts         # Zustand store: selection + author mode
  components/            # MapScene, MapModel, markers, InstructionPanel
  authoring/             # AuthorPanel (capture coordinates by clicking the scene)
public/
  models/                # optimized .glb map geometry (git-ignored raw sources)
  instructions/          # lineup screenshots, e.g. mirage/a-ct-from-tramp.jpg
```

## Asset pipeline (decompiled geometry)

The map geometry is **not** in the repo. To add a real map:

1. Extract the map's compiled assets from CS2's `.vpk` files with
   [Source2Viewer / VRF](https://valveresourceformat.github.io/).
2. Export the world geometry to **glTF/GLB**.
3. **Decimate hard** — the map is only a clickable backdrop, not a walkthrough,
   so low-poly is fine and keeps downloads/clicks fast. Compress with
   Draco/meshopt.
4. Drop the result at `public/models/<map>.glb` and set `modelPath` in the
   map's data module.
5. In `src/components/MapModel.tsx`, swap the placeholder grid for the
   `useGLTF` load (instructions are in the file).

> Decompiled Valve assets are fine for personal/non-commercial use; check
> licensing before shipping anything public.

## Authoring lineups

1. `npm run dev`, toggle **Author mode** in the top bar.
2. Click the map surface to capture a world coordinate (click the captured
   value to copy it).
3. Paste it into the relevant map module in `src/data/maps/` as a
   `landingPosition` (smoke spot) or `throwPosition` (lineup), then fill in the
   instruction image + text.

Coordinates are stored in the viewer's world space (Three.js, Y-up), already
converted from Source 2 units at export time.
