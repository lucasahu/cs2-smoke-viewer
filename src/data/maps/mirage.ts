import type { GameMap } from '../../types/lineup'

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
  id: 'mirage',
  name: 'Mirage',
  // modelPath: 'mirage.glb', // <- uncomment after decompiling from the .vpk
  radar: {
    image: 'mirage.png',
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
      id: 'a-ct',
      name: 'CT',
      area: 'A',
      landingPosition: [-900, 0, 500],
      lineups: [
        {
          id: 'a-ct-from-tramp',
          name: 'From T ramp',
          throwPosition: [-300, 0, 1400],
          technique: 'jumpthrow',
          input: 'left',
          needsBind: true,
          instructionImage: 'mirage/a-ct-from-tramp.jpg',
          instructionText:
            'Stand on T ramp, line your crosshair on the antenna tip, jumpthrow.',
          tags: ['default', 'fast'],
        },
      ],
    },
    {
      id: 'a-stairs',
      name: 'Stairs',
      area: 'A',
      landingPosition: [-200, 0, 700],
      lineups: [],
    },
  ],
}
