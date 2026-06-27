import type { GameMap } from '../../types/lineup'

/**
 * Stub data for Mirage.
 *
 * Coordinates are placeholders — capture the real ones with author mode
 * (click in the 3D scene) once the decompiled mirage.glb is in place.
 */
export const mirage: GameMap = {
  id: 'mirage',
  name: 'Mirage',
  modelPath: 'mirage.glb',
  defaultCamera: {
    position: [0, 40, 40],
    target: [0, 0, 0],
  },
  spots: [
    {
      id: 'a-ct',
      name: 'CT',
      area: 'A',
      landingPosition: [12, 0, -8],
      lineups: [
        {
          id: 'a-ct-from-tramp',
          name: 'From T ramp',
          throwPosition: [-18, 0, 22],
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
      landingPosition: [20, 0, 4],
      lineups: [],
    },
  ],
}
