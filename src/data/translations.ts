import { Language } from '../types/sensi';

export interface CopyBundle {
  navCalibrator: string;
  navWeapons: string;
  navDragLab: string;
  navSaved: string;
  copyAllSensi: string;
  copiedToast: string;
  heroEyebrow: string;
  heroTitle: string;
  heroDesc: string;
  deviceSectionTitle: string;
  searchDevicePlaceholder: string;
  customDeviceToggle: string;
  customDeviceLabel: string;
  customOsLabel: string;
  customRamLabel: string;
  customHzLabel: string;
  useCatalogDevice: string;
  dpiControlTitle: string;
  dpiHintAndroid: string;
  dpiHintIos: string;
  dpiSafeWarning: string;
  dpiOptimalNote: string;
  dpiTightNote: string;
  gripTitle: string;
  dragStyleTitle: string;
  styleOneTap: string;
  styleBalanced: string;
  styleSpray: string;
  weaponFocusLabel: string;
  focusAll: string;
  sensiMatrixTitle: string;
  sensiMatrixSub: string;
  resetCalibrated: string;
  savePresetBtn: string;
  copyConfigBtn: string;
  presetNamePlaceholder: string;
  fireButtonMetric: string;
  dpiScaleMetric: string;
  touchGainMetric: string;
  pointerSpeedMetric: string;
  iosTrackingMetric: string;
  hudPlacementHint: string;
  weaponsSectionTitle: string;
  weaponsSectionSub: string;
  applyFocusBtn: string;
  activeFocusLabel: string;
  fireBtnLabel: string;
  dragPathLabel: string;
  aimStartLabel: string;
  rangeLabel: string;
  dragLabTitle: string;
  dragLabSub: string;
  dragLabInstruction: string;
  dragLabBtnLabel: string;
  dragLabReset: string;
  dragLabAttempts: string;
  dragLabHeadRate: string;
  dragLabLastVelocity: string;
  verdictIdle: string;
  verdictHead: string;
  verdictChest: string;
  verdictOver: string;
  verdictTipHead: string;
  verdictTipChest: string;
  verdictTipOver: string;
  savedSectionTitle: string;
  savedSectionSub: string;
  savedEmptyTitle: string;
  savedEmptyDesc: string;
  savedEmptyCta: string;
  tabSaved: string;
  tabReference: string;
  colDevice: string;
  colDpi: string;
  colFocus: string;
  colGeneral: string;
  colRedDot: string;
  colFireBtn: string;
  colActions: string;
  loadBtn: string;
  deleteBtn: string;
  sliderNames: {
    general: string;
    redDot: string;
    scope2x: string;
    scope4x: string;
    sniperScope: string;
    freeLook: string;
  };
}

export const COPY: Record<Language, CopyBundle> = {
  hi: {
    navCalibrator: 'कैलिब्रेटर',
    navWeapons: 'हथियार',
    navDragLab: 'ड्रैग लैब',
    navSaved: 'सेव्ड',
    copyAllSensi: 'सेन्सी कॉपी करें',
    copiedToast: 'पूरी Free Fire सेन्सी क्लिपबोर्ड पर कॉपी हो गई!',
    heroEyebrow: 'डिवाइस और DPI आधारित फ्री फायर हेडशॉट कैलिब्रेशन',
    heroTitle: 'अपने फोन और DPI के हिसाब से प्योर रेड नंबर सेन्सी बनाएं',
    heroDesc:
      'अपना मोबाइल मॉडल और DPI चुनें — Dragi Sensi टच सैंपलिंग, रिफ्रेश रेट और स्क्रीन साइज के हिसाब से M1887, Desert Eagle और UMP की सटीक 0–200 सेन्सी तैयार करता है।',
    deviceSectionTitle: 'डिवाइस चुनें',
    searchDevicePlaceholder: 'फोन का नाम खोजें (जैसे iQOO, Poco, Redmi, iPhone)...',
    customDeviceToggle: 'मेरा फोन लिस्ट में नहीं है (कस्टम डालें)',
    customDeviceLabel: 'अपने फोन का नाम लिखें',
    customOsLabel: 'सिस्टम',
    customRamLabel: 'RAM',
    customHzLabel: 'स्क्रीन रिफ्रेश रेट',
    useCatalogDevice: 'लिस्ट से चुनें',
    dpiControlTitle: 'DPI (Smallest Width)',
    dpiHintAndroid: 'Android Developer Options → Smallest Width से मैच करें',
    dpiHintIos: 'iPhone/iPad में DPI की जगह Tracking Speed सेट होती है',
    dpiSafeWarning: 'चेतावनी: यह DPI आपके फोन की सेफ लिमिट से ज्यादा है, डिस्प्ले स्केलिंग या ओवर-ड्रैग हो सकता है।',
    dpiOptimalNote: 'परफेक्ट ज़ोन: रेड नंबर हेडशॉट के लिए सबसे संतुलित DPI।',
    dpiTightNote: 'स्टॉक ज़ोन: स्मूथ कंट्रोल, तेज ऊपर ड्रैग की जरूरत होगी।',
    gripTitle: 'फिंगर ग्रिप',
    dragStyleTitle: 'खेलने का स्टाइल',
    styleOneTap: 'वन-टैप',
    styleBalanced: 'बैलेंस्ड',
    styleSpray: 'स्प्रे हेड',
    weaponFocusLabel: 'हथियार फोकस',
    focusAll: 'ऑल-राउंडर',
    sensiMatrixTitle: 'Free Fire सेन्सी सेटिंग्स (0–200 स्केल)',
    sensiMatrixSub: 'गेम के Sensitivity टैब में ये नंबर डालें, या नीचे स्लाइडर से फाइन-ट्यून करें।',
    resetCalibrated: 'ऑटो पर रीसेट',
    savePresetBtn: 'प्रोफाइल सेव करें',
    copyConfigBtn: 'कॉन्फ़िग कॉपी',
    presetNamePlaceholder: 'प्रोफाइल नाम (वैकल्पिक)...',
    fireButtonMetric: 'फायर बटन साइज',
    dpiScaleMetric: 'DPI मल्टीप्लायर',
    touchGainMetric: 'टच रिस्पॉन्स गेन',
    pointerSpeedMetric: 'Android पॉइंटर स्पीड',
    iosTrackingMetric: 'iOS ट्रैकिंग स्पीड',
    hudPlacementHint: 'नीचे से दूरी',
    weaponsSectionTitle: 'M1887, Desert Eagle और UMP रेड-नंबर ब्लूप्रिंट',
    weaponsSectionSub: 'आपके चुने हुए फोन और DPI के अनुसार हर गन का फायर बटन, एम पोजिशन और ड्रैग पैटर्न।',
    applyFocusBtn: 'इस गन पर ट्यून करें',
    activeFocusLabel: 'एक्टिव फोकस',
    fireBtnLabel: 'फायर बटन',
    dragPathLabel: 'ड्रैग तरीका',
    aimStartLabel: 'क्रॉसहेयर पोजिशन',
    rangeLabel: 'बेस्ट रेंज',
    dragLabTitle: 'लाइव ड्रैग व हेडशॉट टेस्ट लैब',
    dragLabSub: 'फायर बटन को ऊपर की ओर ड्रैग करके चेक करें कि आपकी सेन्सी से रेड नंबर लग रहा है या ओवर-ड्रैग हो रहा है।',
    dragLabInstruction: 'नीचे लाल फायर बटन को दबाकर तेजी से ऊपर ड्रैग करें',
    dragLabBtnLabel: 'ऊपर ड्रैग करें',
    dragLabReset: 'स्कोर रीसेट',
    dragLabAttempts: 'कुल शॉट्स',
    dragLabHeadRate: 'रेड नंबर रेट',
    dragLabLastVelocity: 'ड्रैग स्पीड',
    verdictIdle: 'फायर बटन से ऊपर की ओर ड्रैग करके टेस्ट शुरू करें',
    verdictHead: 'RED NUMBER HEADSHOT! क्रॉसहेयर ठीक सिर पर लॉक हुआ।',
    verdictChest: 'YELLOW BODY SHOT — थोड़ा और तेज ऊपर ड्रैग करें या General +4 बढ़ाएं।',
    verdictOver: 'OVER-DRAG (सिर के ऊपर गया) — थोड़ा छोटा फ्लिक करें या General -4 कम करें।',
    verdictTipHead: 'यह ड्रैग स्पीड और आपकी कैलिब्रेटेड सेन्सी परफेक्ट मैच हो रही है।',
    verdictTipChest: 'फायर बटन से J-Drag करें और झटका थोड़ा तेज रखें।',
    verdictTipOver: 'DPI ज्यादा होने पर अंगूठे का फ्लिक छोटा रखें ताकि एम सिर के ऊपर न जाए।',
    savedSectionTitle: 'सेव की गई प्रोफाइल और रेफरेंस चार्ट',
    savedSectionSub: 'अपने अलग-अलग DPI व डिवाइस सेटअप सेव करें या प्रो रेफरेंस लोड करें।',
    savedEmptyTitle: 'अभी कोई कस्टम प्रोफाइल सेव नहीं है',
    savedEmptyDesc: 'ऊपर "प्रोफाइल सेव करें" बटन दबाकर अपना डिवाइस और DPI सेटअप यहां स्टोर करें।',
    savedEmptyCta: 'मौजूदा सेटअप सेव करें',
    tabSaved: 'मेरी सेव्ड प्रोफाइल',
    tabReference: 'पॉपुलर डिवाइस रेफरेंस',
    colDevice: 'डिवाइस',
    colDpi: 'DPI',
    colFocus: 'फोकस',
    colGeneral: 'General',
    colRedDot: 'Red Dot',
    colFireBtn: 'फायर बटन',
    colActions: 'एक्शन',
    loadBtn: 'लोड करें',
    deleteBtn: 'हटाएं',
    sliderNames: {
      general: 'General',
      redDot: 'Red Dot',
      scope2x: '2x Scope',
      scope4x: '4x Scope',
      sniperScope: 'Sniper Scope',
      freeLook: 'Free Look',
    },
  },
  en: {
    navCalibrator: 'Calibrator',
    navWeapons: 'Weapons',
    navDragLab: 'Drag Lab',
    navSaved: 'Saved',
    copyAllSensi: 'Copy Sensi',
    copiedToast: 'Full Free Fire sensitivity copied to clipboard!',
    heroEyebrow: 'Device & DPI Calibrated Free Fire Headshot Engine',
    heroTitle: 'Dial in Red-Number Headshot Sensitivity for Your Device & DPI',
    heroDesc:
      'Select your smartphone and DPI — Dragi Sensi factors in touch sampling rate, refresh rate, and display width to calibrate 0–200 sliders for M1887, Desert Eagle, and UMP.',
    deviceSectionTitle: 'Select Device',
    searchDevicePlaceholder: 'Search model (e.g. iQOO, Poco, Redmi, iPhone)...',
    customDeviceToggle: 'Device not listed? Enter custom name',
    customDeviceLabel: 'Custom Device Name',
    customOsLabel: 'OS',
    customRamLabel: 'RAM',
    customHzLabel: 'Refresh Rate',
    useCatalogDevice: 'Back to device list',
    dpiControlTitle: 'DPI (Smallest Width)',
    dpiHintAndroid: 'Match with Android Developer Options → Smallest Width',
    dpiHintIos: 'iOS devices use Tracking Speed instead of Android DPI',
    dpiSafeWarning: 'Advisory: DPI exceeds safe display threshold; expect sharp UI scaling or over-drag.',
    dpiOptimalNote: 'Sweet Spot: Balanced angular speed for consistent red numbers.',
    dpiTightNote: 'Stock Zone: Stable tracking; requires quicker upward thumb flick.',
    gripTitle: 'Finger Grip',
    dragStyleTitle: 'Drag Style',
    styleOneTap: 'One-Tap',
    styleBalanced: 'Balanced',
    styleSpray: 'Spray Head',
    weaponFocusLabel: 'Weapon Focus',
    focusAll: 'All-Rounder',
    sensiMatrixTitle: 'Free Fire Sensitivity Matrix (0–200 Scale)',
    sensiMatrixSub: 'Enter these values in your Free Fire Sensitivity tab, or fine-tune with the sliders.',
    resetCalibrated: 'Reset Auto',
    savePresetBtn: 'Save Preset',
    copyConfigBtn: 'Copy Config',
    presetNamePlaceholder: 'Preset label (optional)...',
    fireButtonMetric: 'Fire Button Size',
    dpiScaleMetric: 'DPI Multiplier',
    touchGainMetric: 'Touch Response Gain',
    pointerSpeedMetric: 'Android Pointer Speed',
    iosTrackingMetric: 'iOS Tracking Speed',
    hudPlacementHint: 'Bottom offset',
    weaponsSectionTitle: 'M1887, Desert Eagle & UMP Red-Number Blueprints',
    weaponsSectionSub: 'Per-weapon Fire Button sizing, crosshair anchor, and drag geometry for your active device and DPI.',
    applyFocusBtn: 'Tune for Weapon',
    activeFocusLabel: 'Active Focus',
    fireBtnLabel: 'Fire Button',
    dragPathLabel: 'Drag Pattern',
    aimStartLabel: 'Crosshair Start',
    rangeLabel: 'Optimal Range',
    dragLabTitle: 'Interactive Drag & Headshot Calibration Lab',
    dragLabSub: 'Flick upward from the fire button to verify whether your calibrated sensitivity lands cleanly in the red head zone.',
    dragLabInstruction: 'Press and flick upward from the red fire button below',
    dragLabBtnLabel: 'Drag Up',
    dragLabReset: 'Reset Stats',
    dragLabAttempts: 'Attempts',
    dragLabHeadRate: 'Red-Number Rate',
    dragLabLastVelocity: 'Flick Speed',
    verdictIdle: 'Flick upward from the fire button to test your drag curve',
    verdictHead: 'RED NUMBER HEADSHOT! Crosshair locked squarely on the head hitbox.',
    verdictChest: 'YELLOW BODY LOCK — Flick slightly faster upward or raise General by +4.',
    verdictOver: 'OVER-DRAG (Flew Over Head) — Shorten your upward flick or lower General by -4.',
    verdictTipHead: 'Your flick velocity aligns cleanly with your current DPI & General ratio.',
    verdictTipChest: 'Start with white crosshair below shoulders and pull a crisp J-drag.',
    verdictTipOver: 'Higher DPI amplifies vertical travel—keep thumb flicks compact.',
    savedSectionTitle: 'Saved Presets & Device Reference Table',
    savedSectionSub: 'Store multiple device/DPI configurations locally or load proven hardware baselines.',
    savedEmptyTitle: 'No custom presets saved yet',
    savedEmptyDesc: 'Click "Save Preset" above to store your current device, DPI, and tweaked sliders.',
    savedEmptyCta: 'Save Current Setup',
    tabSaved: 'My Saved Presets',
    tabReference: 'Popular Reference Setups',
    colDevice: 'Device',
    colDpi: 'DPI',
    colFocus: 'Focus',
    colGeneral: 'General',
    colRedDot: 'Red Dot',
    colFireBtn: 'Fire Btn',
    colActions: 'Actions',
    loadBtn: 'Load',
    deleteBtn: 'Delete',
    sliderNames: {
      general: 'General',
      redDot: 'Red Dot',
      scope2x: '2x Scope',
      scope4x: '4x Scope',
      sniperScope: 'Sniper Scope',
      freeLook: 'Free Look',
    },
  },
};
