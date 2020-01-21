import { pitches_t } from '../Api/pitches';

type x_movement = number;
type y_movement = number;
type speed_ratio = number;
type rotation_angle = number;
type rpm = number;

const helper: {
    pitchDefinitions: Record<pitches_t, [x_movement, y_movement, speed_ratio, rotation_angle, rpm]>;
    selectRandomPitch(): pitches_t;
} = {
    /**
     * Each number array contains the following 5 numbers:
     *
     * - x movement
     * - y movement
     * - speed ratio
     * - rotation angle, from 0 to 360 where 180 is a fastball's backspin and 90 is a slider's, 0 for curveball
     *   in the direction (CW for righty), CCW for lefty.
     * - RPM from RHP perspective where left is smaller X
     */
    pitchDefinitions: {
        // fastball, kinda
        '4-seam': [0, 0, 1, 180, 1000],
        '2-seam': [20, -20, 0.9, -45, 1200],
        cutter: [-25, -20, 0.95, 75, 1200],
        sinker: [15, -30, 0.95, -45, 1500],

        // breaking ball
        slider: [-50, -35, 0.88, 80, 2000],
        fork: [0, -70, 0.87, 20, 500],
        curve: [0, -110, 0.82, 10, 2500],

        // change-up
        change: [0, -10, 0.86, -15, 1000]
    },
    selectRandomPitch() {
        return ([
            '4-seam',
            '2-seam',
            'cutter',
            'sinker',
            'slider',
            'fork',
            'curve',
            'change'
        ] as pitches_t[])[Math.floor(Math.random() * 8)];
    }
};

export { helper };
