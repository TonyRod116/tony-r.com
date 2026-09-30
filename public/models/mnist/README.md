# MNIST pretrained artifact

Source: https://github.com/DFin/Neural-Network-Visualisation/blob/main/exports/mlp_weights/014_dataset-1x.json
Downloaded: 2026-09-30. Format: float16 tensors, 784 → 128 → 64 → 10.
Original LICENSE.txt and NOTICE.txt accompany this unmodified artifact (Apache-2.0).
Normalization (mean 0.1307, std 0.3081) verified in the original training/mlp_train.py.
The checkpoint payload carries no normalization metadata; the frontend explicitly
uses the verified training normalization. No original performance metrics are
claimed. Example sketches are local drawings, not an evaluation dataset.

This site implements its own inference, interaction and vector layer projection.
It does not train this model or attribute its original training to Tony.
