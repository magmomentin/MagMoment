
# Hybrid AR Engine – Tuned (Stage-2 + Stage-3)

This version includes:
- Tuned confidence thresholds
- Smooth fade-in / fade-out timings
- Reduced jitter and flicker

## Tuned Parameters
- ACTIVE: confidence >= 0.85
- LOCKED: confidence >= 0.55
- LOST: confidence < 0.55 for 600ms
- Fade duration: 450ms
