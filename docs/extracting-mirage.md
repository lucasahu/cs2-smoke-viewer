# Extracting de_mirage geometry (macOS, Apple Silicon)

CS2 doesn't run on macOS and there's no Source 2 Viewer GUI for Mac, so we
download the game *files* with SteamCMD and use the cross-platform
**Source2Viewer CLI** to export the map to glTF. Everything below runs on the
Mac.

> CLI flags can change between releases — if a flag is rejected, run
> `./Source2Viewer-CLI --help` and adjust. Decompiled Valve assets are fine for
> personal use; don't ship them publicly without checking licensing (don't
> commit the .glb to a public repo).

## 1. Install tools

```bash
brew install --cask steamcmd
npm i -g @gltf-transform/cli      # glTF optimizer/decimator
```

Download the **macOS arm64** Source2Viewer CLI from the releases page and
unblock it (Gatekeeper):

- https://github.com/ValveResourceFormat/ValveResourceFormat/releases
  (grab the `cli-macos-arm64` zip)

```bash
cd ~/Downloads && unzip cli-macos-arm64*.zip -d source2viewer
chmod +x source2viewer/Source2Viewer-CLI
xattr -dr com.apple.quarantine source2viewer/Source2Viewer-CLI
```

## 2. Download CS2 files (Windows depot)

CS2 is free, so any Steam account works. We force the Windows platform because
that depot contains the `.vpk` map files (the macOS depot doesn't exist).
This is a large download (~tens of GB).

```bash
steamcmd \
  +@sSteamCmdForcePlatformType windows \
  +force_install_dir ~/cs2-files \
  +login YOUR_STEAM_USERNAME \
  +app_update 730 validate \
  +quit
```

The map you want ends up at:

```
~/cs2-files/game/csgo/maps/de_mirage.vpk
```

## 3. Export the map to glTF

```bash
~/Downloads/source2viewer/Source2Viewer-CLI \
  -i ~/cs2-files/game/csgo/maps/de_mirage.vpk \
  -o ~/mirage-export \
  -d \
  --gltf_export_format glb \
  --gltf_export_materials
```

`-d` decompiles; the map's world geometry (plus props and textures) is written
under `~/mirage-export/...`. Find the world `.glb` (look under
`~/mirage-export/maps/de_mirage/`):

```bash
find ~/mirage-export -name '*.glb' -size +1M | xargs -I{} ls -lh {}
```

## 4. Optimize / decimate

The raw export is heavy. The map is only a clickable backdrop, so compress hard:

```bash
gltf-transform inspect ~/mirage-export/.../world.glb           # see the damage
gltf-transform optimize  ~/mirage-export/.../world.glb mirage.glb \
  --compress meshopt --texture-compress webp
# still too big? drop triangle count:
gltf-transform simplify mirage.glb mirage.glb --ratio 0.5 --error 0.01
```

## 5. Drop it into the app

```bash
cp mirage.glb <repo>/public/models/mirage.glb
npm run dev
```

The viewer auto-loads `public/models/mirage.glb` (wired in
`src/components/MapModel.tsx`) — no code change needed.

## 6. Expected post-import fixups

- **Scale**: Source units are large; the map may dwarf the camera. Adjust the
  default camera in `src/data/maps/mirage.ts` (`defaultCamera`) and/or add a
  `scale={...}` to the `<primitive>` in `MapModel.tsx`.
- **Orientation**: glTF is Y-up and the exporter converts from Source's Z-up,
  so it should land upright. If it's on its side, rotate the primitive.
- **Recenter**: if the map isn't around the origin, offset the primitive's
  position so `[0,0,0]` sits in a sensible spot for the camera target.

Once it renders, switch on **Author mode** and start capturing real smoke
landing + throw coordinates to replace the placeholders in `mirage.ts`.
