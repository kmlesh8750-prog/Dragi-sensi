import {
  CalibrationInput,
  CalibrationResult,
  SensitivityValues,
  WeaponBlueprint,
} from '../types/sensi';

export const WEAPON_IMAGES: Record<'m1887' | 'deagle' | 'ump', string> = {
  m1887: '/src/assets/images/weapon_m1887_studio_1795060043006.jpg',
  deagle: '/src/assets/images/weapon_desert_eagle_studio_1795060042851.jpg',
  ump: '/src/assets/images/weapon_ump_studio_1795060042367.jpg',
};

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, Math.round(val)));
}

/**
 * Computes Free Fire OB44+ sensitivity (0 - 200 scale) calibrated specifically
 * for Device Hardware (Touch Sampling Hz, Refresh Rate, Screen Size, Chipset/OS)
 * and active DPI, tuned to maximize Red-Number Headshots on M1887, Desert Eagle, and UMP.
 */
export function calculateCalibration(input: CalibrationInput): CalibrationResult {
  const { device, dpi, grip, dragStyle, weaponFocus } = input;

  // 1. Hardware baseline factor: lower touch sampling & 60Hz devices need higher in-game General
  //    to compensate for slower pixel-per-frame travel; ultra-fast 480Hz+ screens stay slightly tighter
  //    to avoid crosshair flying above the head hitbox.
  const tierBaseGeneral: Record<typeof device.chipsetTier, number> = {
    entry: 196,
    mid: 191,
    upper: 185,
    flagship: 179,
    ios: 186,
  };

  const baseGeneral = tierBaseGeneral[device.chipsetTier];

  // 2. DPI scaling: Free Fire thumb travel per screen degree increases with DPI.
  //    At Stock DPI (~390-411), we keep high in-game General (185-198).
  //    As DPI rises (e.g., 560, 720, 850), we smoothly temper General and Red Dot
  //    so drag locks directly onto the head instead of overshooting into the sky.
  const dpiDelta = (dpi - device.defaultDpi) / device.defaultDpi;
  const dpiMultiplier = Number((dpi / device.defaultDpi).toFixed(2));

  // Non-linear damping so high DPI still feels snappy without sky-recoil
  const generalDpiAdjust =
    dpiDelta >= 0 ? -dpiDelta * 36 : Math.abs(dpiDelta) * 14;
  const redDotDpiAdjust =
    dpiDelta >= 0 ? -dpiDelta * 28 : Math.abs(dpiDelta) * 12;

  // Touch sampling & screen size micro-offset
  const touchCompensation =
    device.touchSamplingHz >= 360
      ? -3
      : device.touchSamplingHz <= 180
      ? 4
      : 0;
  const screenCompensation = device.screenInches >= 7.5 ? -8 : device.screenInches <= 6.2 ? 3 : 0;

  // 3. Grip & Drag Style modifiers
  const gripGeneralDelta =
    grip === '4-finger' ? -4 : grip === '3-finger' ? -2 : 2;
  const gripFireButtonDelta =
    grip === '4-finger' ? -3 : grip === '3-finger' ? -1 : 2;

  const styleDelta =
    dragStyle === 'onetap'
      ? { gen: 5, red: -2, s2: -4, s4: -6, fire: -2 }
      : dragStyle === 'spray'
      ? { gen: -4, red: 6, s2: 8, s4: 5, fire: 3 }
      : { gen: 0, red: 0, s2: 0, s4: 0, fire: 0 };

  // 4. Weapon Focus shift
  const weaponDelta =
    weaponFocus === 'm1887'
      ? { gen: 6, red: -5, s2: -6, s4: -8, fire: 3 }
      : weaponFocus === 'deagle'
      ? { gen: 2, red: 4, s2: -2, s4: -4, fire: -4 }
      : weaponFocus === 'ump'
      ? { gen: -5, red: 9, s2: 11, s4: 6, fire: 1 }
      : { gen: 0, red: 0, s2: 0, s4: 0, fire: 0 };

  const general = clamp(
    baseGeneral +
      generalDpiAdjust +
      touchCompensation +
      screenCompensation +
      gripGeneralDelta +
      styleDelta.gen +
      weaponDelta.gen,
    125,
    200
  );

  // Red Dot controls aim-assist stickiness when crosshair is white->red near chest/head
  const redDot = clamp(
    168 +
      redDotDpiAdjust +
      (device.os === 'ios' ? 6 : 0) +
      styleDelta.red +
      weaponDelta.red,
    115,
    198
  );

  const scope2x = clamp(
    158 - Math.max(0, dpiDelta) * 24 + styleDelta.s2 + weaponDelta.s2,
    105,
    194
  );

  const scope4x = clamp(
    144 - Math.max(0, dpiDelta) * 20 + styleDelta.s4 + weaponDelta.s4,
    95,
    185
  );

  const sniperScope = clamp(
    126 - Math.max(0, dpiDelta) * 16 + (device.refreshRate >= 120 ? 4 : 0),
    80,
    170
  );

  const freeLook = clamp(150 - Math.max(0, dpiDelta) * 18, 90, 190);

  const sensitivity: SensitivityValues = {
    general,
    redDot,
    scope2x,
    scope4x,
    sniperScope,
    freeLook,
  };

  // 5. Fire Button Size (%) — Higher DPI shrinks rendered HUD slightly, so button %
  //    gets a small protective bump on high DPI, while One-Tap favors 43%-49% for snappy upward travel.
  const baseFireButton = device.screenInches >= 7.5 ? 42 : 47;
  const dpiFireAdjust = dpiDelta > 0.25 ? 2 : dpiDelta < -0.05 ? -2 : 0;
  const fireButtonSize = clamp(
    baseFireButton + dpiFireAdjust + gripFireButtonDelta + styleDelta.fire + weaponDelta.fire,
    38,
    58
  );

  // Offset from bottom edge (px guidance for HUD)
  const fireButtonOffsetPx = clamp(118 - (fireButtonSize - 45) * 2, 92, 145);

  const effectiveTouchGain = Number(
    ((general / 180) * dpiMultiplier * (device.touchSamplingHz / 240)).toFixed(2)
  );

  const pointerSpeedAndroid = clamp(5 + (device.chipsetTier === 'entry' ? 2 : 1) - Math.floor(Math.max(0, dpiDelta) * 1.5), 4, 7);
  const iosTrackingSpeed = clamp(85 - Math.floor(Math.max(0, dpiDelta) * 25), 55, 100);

  const stabilityStatus: 'optimal' | 'tight' | 'high-risk' =
    dpi > device.maxSafeDpi
      ? 'high-risk'
      : dpi >= device.defaultDpi * 1.15
      ? 'optimal'
      : 'tight';

  const headLockWindow =
    stabilityStatus === 'high-risk'
      ? '18ms · Over-Drag Risk'
      : stabilityStatus === 'optimal'
      ? '34ms · Locked Red Zone'
      : '26ms · Heavy Drag Needed';

  // 6. Weapon-Specific Red-Number Blueprints (M1887, Desert Eagle, UMP)
  const m1887Fire = clamp(fireButtonSize + 2, 42, 56);
  const deagleFire = clamp(fireButtonSize - 3, 39, 50);
  const umpFire = clamp(fireButtonSize + 1, 42, 54);

  const blueprints: WeaponBlueprint[] = [
    {
      id: 'm1887',
      name: 'M1887',
      categoryHi: 'वन-टैप शॉटगन',
      categoryEn: 'One-Tap Shotgun',
      imagePath: WEAPON_IMAGES.m1887,
      fireButtonSize: m1887Fire,
      recommendedGeneral: clamp(general + (weaponFocus === 'm1887' ? 0 : 5), 140, 200),
      recommendedRedDot: clamp(redDot - 4, 115, 195),
      recommendedScope2x: scope2x,
      dragPathHi: 'सीधा ऊपर तेज़ झटका (Straight Up / J-Drag)',
      dragPathEn: 'Explosive Straight-Up or Tight J-Drag',
      crosshairStartHi: 'दुश्मन के पैरों के नीचे या कंधे से दूर (White Aim)',
      crosshairStartEn: 'Just below enemy feet / beside shoulder (White Aim)',
      effectiveRange: '0–14m',
      headshotTipHi: `${device.name} पर ${dpi} DPI के साथ M1887 के लिए फायर बटन ${m1887Fire}% रखें। एम को छाती पर लॉक होने से पहले सफेद क्रॉसहेयर से तेज ऊपर ड्रैग करें ताकि पैलेट्स सीधे सिर पर लगें।`,
      headshotTipEn: `At ${dpi} DPI on ${device.name}, set Fire Button to ${m1887Fire}%. Flick up before aim-assist clamps onto the chest so shotgun pellets converge on the head hitbox.`,
    },
    {
      id: 'deagle',
      name: 'Desert Eagle',
      categoryHi: 'प्रिसिशन वन-टैप पिस्टल',
      categoryEn: 'Precision One-Tap Pistol',
      imagePath: WEAPON_IMAGES.deagle,
      fireButtonSize: deagleFire,
      recommendedGeneral: clamp(general + (weaponFocus === 'deagle' ? 0 : 2), 135, 200),
      recommendedRedDot: clamp(redDot + 3, 120, 198),
      recommendedScope2x: scope2x,
      dragPathHi: 'शॉर्ट कर्व या रोटेशन ड्रैग (C-Drag / Rotation)',
      dragPathEn: 'Controlled Rotation / C-Drag Flick',
      crosshairStartHi: 'सीने के ठीक बगल या घुटने के स्तर पर (White->Red)',
      crosshairStartEn: 'Beside upper chest or knee level before flick',
      effectiveRange: '8–38m',
      headshotTipHi: `डेजर्ट ईगल की सिंगल बुलेट ${dpi} DPI पर ओवर-ड्रैग हो सकती है। ${deagleFire}% फायर बटन और ${clamp(redDot + 3, 120, 198)} Red Dot से बुलेट सिर के ऊपर नहीं निकलेगी और प्योर रेड नंबर लगेगा।`,
      headshotTipEn: `Desert Eagle single-taps overshoot easily at ${dpi} DPI. Pairing a ${deagleFire}% Fire Button with ${clamp(redDot + 3, 120, 198)} Red Dot stops the crosshair squarely on the head.`,
    },
    {
      id: 'ump',
      name: 'UMP',
      categoryHi: 'रैपिड स्प्रे SMG',
      categoryEn: 'Rapid Spray SMG',
      imagePath: WEAPON_IMAGES.ump,
      fireButtonSize: umpFire,
      recommendedGeneral: clamp(general - (weaponFocus === 'ump' ? 0 : 4), 125, 196),
      recommendedRedDot: clamp(redDot + 7, 130, 200),
      recommendedScope2x: clamp(scope2x + 8, 120, 200),
      dragPathHi: 'धीमा और लगातार ऊपर ड्रैग (Steady Vertical Climb)',
      dragPathEn: 'Steady Vertical Climb + Micro Left/Right Track',
      crosshairStartHi: 'अपर चेस्ट (सीने के ऊपरी हिस्से) से शुरू करें',
      crosshairStartEn: 'Start on upper chest, pull steadily upward',
      effectiveRange: '6–32m',
      headshotTipHi: `UMP में लगातार गोलियां चलने से रिकॉइल बढ़ता है। ${clamp(redDot + 7, 130, 200)} Red Dot और ${clamp(scope2x + 8, 120, 200)} 2x Scope से चेस्ट से सिर पर स्विच होकर रेड नंबर चिपक जाते हैं।`,
      headshotTipEn: `UMP burst recoil climbs fast. Using ${clamp(redDot + 7, 130, 200)} Red Dot and ${clamp(scope2x + 8, 120, 200)} 2x Scope keeps continuous spray locked on red numbers.`,
    },
  ];

  return {
    sensitivity,
    metrics: {
      fireButtonSize,
      fireButtonOffsetPx,
      dpiMultiplier,
      effectiveTouchGain,
      pointerSpeedAndroid,
      iosTrackingSpeed,
      stabilityStatus,
      headLockWindow,
    },
    blueprints,
  };
}
