# Engine Deltas — artist-stage

---

## Delta 001
### Date
2026-04-18
### Type
capability
### Area
ui-shell / xr-session / runtime
### Problem
Потрібно було інтегрувати XR не як окрему технодемку, а як route всередині ARTIST STAGE.
### Context
ARTIST STAGE має premium website shell, collector flow і окремий immersive route.
### Local Fix
Створено окремі immersive routes і fullscreen XR entry всередині сайту.
### Why It Worked
XR почав працювати як підсилюючий шар практики, а не сторонній модуль.
### Repeat Potential
high
### Promotion Candidate
extension-candidate
### Promotion Reason
Pattern корисний для інших сайт-інтегрованих XR-кейсів, але поки ще треба перевірити в ще одному проєкті.
### Affected Files
- src/pages/immersive.astro
- src/pages/immersive/experience.astro
- src/xr-experiences/artist-stage/...
### Follow-up
Перевірити аналогічну route integration в ще одному WhisperXR-проєкті.

---

## Delta 002
### Date
2026-04-18
### Type
bug
### Area
input / locomotion / camera
### Problem
Desktop XR preview спочатку не мав нормального first-person navigation; рух був некомфортний, мишка поводилась не як стандартний walkthrough.
### Context
Desktop preview route для authored XR сцени.
### Local Fix
Переведено navigation на pointer lock + mouse look + FPS-style movement, окремо від старого orbit/parallax feel.
### Why It Worked
Камера перестала "крутитися по осі", сцена стала доступною для нормального просторового walkthrough.
### Repeat Potential
high
### Promotion Candidate
core-candidate
### Promotion Reason
Universal input normalization і base locomotion є типовою engine-level зоною.
### Affected Files
- src/xr-core/runtime/XRRootThree.jsx
### Follow-up
Порівняти з ще одним XR-кейсом і вирішити, що саме йде в core, а що в preset.

---

## Delta 003
### Date
2026-04-18
### Type
workaround
### Area
camera / authored behavior
### Problem
Реакція сцени через opacity core image викликала неприємне мерехтіння й псувала читабельність роботи.
### Context
Manifestation core у центрі chamber.
### Local Fix
Видимість core image зроблена стабільною; interaction перенесена в glow / residue / signals / secondary anchors.
### Why It Worked
Сцена зберегла авторську реактивність, але сам твір перестав блимати.
### Repeat Potential
medium
### Promotion Candidate
preset-candidate
### Promotion Reason
Це радше правило для authored visual profile, ніж універсальна engine-логіка.
### Affected Files
- src/xr-core/runtime/XRRootThree.jsx
### Follow-up
Перевірити в іншому image-based XR-проєкті.

---

## Delta 004
### Date
2026-04-18
### Type
capability
### Area
audio
### Problem
Сцені бракувало живої тиші; без звуку поле виглядало надто порожнім.
### Context
XR chamber для Meta-Bodies.
### Local Fix
Додано restrained ambient hum із sound toggle.
### Why It Worked
З'явилося відчуття presence field без перетворення сцени на soundtrack-driven experience.
### Repeat Potential
medium
### Promotion Candidate
preset-candidate
### Promotion Reason
Audio mood profile схожий на reusable preset, але не як core behavior.
### Affected Files
- src/pages/immersive/experience.astro
- src/xr-core/runtime/XRRootThree.jsx
### Follow-up
Перевірити sound mood profiles на ще 1–2 XR-кейсах.

---

## Delta 005
### Date
2026-04-18
### Type
capability
### Area
manifest / scene composition
### Problem
Один центральний anchor робив сцену занадто порожньою й ближчою до демонстрації одного image surface.
### Context
ARTIST STAGE XR мав вийти за межі one-anchor room.
### Local Fix
Додано multi-anchor world expansion: primary core, side anchors, far residue echoes.
### Why It Worked
Сцена стала читатися як поле станів, а не як один об'єкт у центрі.
### Repeat Potential
high
### Promotion Candidate
extension-candidate
### Promotion Reason
Multi-anchor composition виглядає перспективно, але ще потребує перевірки в іншому authored XR-case.
### Affected Files
- src/xr-core/runtime/XRRootThree.jsx
- src/xr-experiences/artist-stage/buildArtistStageManifest.js
### Follow-up
Перевірити anchor-role model у наступному WhisperXR-проєкті.

---

## Delta 006
### Date
2026-04-18
### Type
observation
### Area
manifest / media
### Problem
Secondary anchors були дублем primary artwork, через що world expansion втрачав цінність.
### Context
Multi-anchor authored world.
### Local Fix
Manifest builder оновлено так, щоб side anchors використовували інші роботи.
### Why It Worked
Secondary anchors стали окремими станами поля, а не повтором центрального образу.
### Repeat Potential
high
### Promotion Candidate
core-candidate
### Promotion Reason
Manifest role expansion і media assignment strategy виглядають як сильний кандидат у reusable manifest shape.
### Affected Files
- src/xr-experiences/artist-stage/buildArtistStageManifest.js
- src/xr-core/runtime/XRRootThree.jsx
### Follow-up
Подивитись, чи така role-based manifest model збережеться в ще одному XR-проєкті.

---

## Delta 007
### Date
2026-04-18
### Type
observation
### Area
ui-shell / authored cueing
### Problem
Технічні підказки ламали атмосферу authored field.
### Context
Footer / cue layer у XR route.
### Local Fix
Технічний footer збережено мінімально, але cue layer переписано в authored-формулювання.
### Why It Worked
Інтерфейс перестав вибивати з атмосфери.
### Repeat Potential
medium
### Promotion Candidate
preset-candidate
### Promotion Reason
Hint style / cue shell — це радше reusable authored preset, а не core.
### Affected Files
- src/pages/immersive/experience.astro
### Follow-up
Зібрати 2–3 cue styles на інших XR-кейсах.
