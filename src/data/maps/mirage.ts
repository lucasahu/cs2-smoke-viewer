import type { GameMap } from "../../types/lineup";

/**
 * Mirage — currently backed by the 2D radar overview (real game coordinates).
 *
 * Migration to real 3D geometry later: drop the decompiled `mirage.glb` into
 * public/models/ and set `modelPath: 'mirage.glb'` below. `modelPath` takes
 * priority over `radar`, so that single line flips the map to 3D.
 *
 * Coordinates are in Three.js world space: x = game X, z = -game Y, y = height.
 * On the flat radar, y is ~0; capture proper heights once on 3D geometry.
 * Spot/throw positions below are placeholders — recapture them with author mode.
 */
export const mirage: GameMap = {
  id: "mirage",
  name: "Mirage",
  // modelPath: 'mirage.glb', // <- uncomment after decompiling from the .vpk
  radar: {
    image: "mirage.png",
    // From CS2 overview file (data/radar_info/de_mirage.txt)
    posX: -3230,
    posY: 1713,
    scale: 5.0,
    overviewSizePx: 1024,
  },
  markerScale: 60,
  defaultCamera: {
    // Above the map centre (-670, 847), looking straight down.
    position: [-670, 3500, 847],
    target: [-670, 0, 847],
  },
  spots: [
    {
      id: "window",
      name: "Window",
      grenade: "smoke",
      area: "Mid",
      landingPosition: [-1160, 0, 615],
      lineups: [
        {
          id: "window-from-tspawn",
          side: "T",
          name: "From T spawn stairs",
          throwPosition: [1450, 0, 50],
          technique: "jumpthrow",
          input: "left",
          instructionImage: "mirage/a-ct-from-tramp.jpg",
          instructionText:
            "Stand on T ramp, line your crosshair on the antenna tip, jumpthrow.",
          tags: ["default", "fast"],
        },
        {
          id: "window-instant-1",
          side: "T",
          name: "Instant window smoke #1",
          throwPosition: [1300, 0, 100],
          technique: "W + jumpthrow",
          input: "left",
          instructionImage: "mirage/window-instant-1.png",
          instructionText: "aim as shown, jumpthrow",
          tags: ["instant", "fast"],
        },
      ],
    },
    {
      id: "a-stairs",
      name: "Stairs",
      grenade: "smoke",
      area: "A",
      landingPosition: [-200, 0, 700],
      lineups: [],
    },
    {
      id: "short-molly",
      name: "Short",
      grenade: "molly",
      area: "Mid",
      landingPosition: [-300, 0, 300],
      lineups: [
        {
          id: "short-molly-from-tspawn",
          side: "T",
          name: "From T spawn",
          throwPosition: [900, 0, -200],
          technique: "standing",
          input: "left",
          instructionImage: "mirage/short-molly-from-tspawn.jpg",
          instructionText: "Mock lineup — aim as shown and throw.",
          tags: ["default"],
        },
      ],
    },
    {
      id: "a-flash",
      name: "A Site",
      grenade: "flash",
      area: "A",
      landingPosition: [-700, 0, 900],
      lineups: [
        {
          id: "a-flash-from-ramp",
          side: "T",
          name: "Pop flash from ramp",
          throwPosition: [600, 0, 200],
          technique: "run-jumpthrow",
          input: "left",
          instructionImage: "mirage/a-flash-from-ramp.jpg",
          instructionText: "Mock lineup — run, jumpthrow over the wall.",
          tags: ["default", "fast"],
        },
      ],
    },
    {
      id: "window-he",
      name: "Window",
      grenade: "he",
      area: "Mid",
      landingPosition: [-1100, 0, 650],
      lineups: [
        {
          id: "window-he-from-tspawn",
          side: "T",
          name: "From T spawn",
          throwPosition: [1300, 0, 80],
          technique: "jumpthrow",
          input: "left",
          instructionImage: "mirage/window-he-from-tspawn.jpg",
          instructionText: "Mock lineup — jumpthrow on the marked pixel.",
          tags: ["default"],
        },
      ],
    },
  ],
};
