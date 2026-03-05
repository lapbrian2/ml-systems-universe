import type { Ref } from 'vue'

/* ── Tour step type (mirrors the GuidedTour component's TourStep) ── */
export interface TourStepDefinition {
  title: string
  instruction: string
  target?: string
  hint?: string
  /* check is added at the component level since it references reactive state */
}

/* ── BiasCalculator Tour (Ch 17) ── */
export const biasCalculatorTour: TourStepDefinition[] = [
  {
    title: 'Confusion Matrices',
    instruction:
      'Look at the two confusion matrices. Group A and Group B represent different demographics. Each cell shows true/false positives and negatives.',
    target: '.bias__canvas',
    hint: 'The numbers in each cell are editable -- try clicking one.',
  },
  {
    title: 'Adjust Thresholds',
    instruction:
      'Try adjusting the values for Group B. Change the True Positive or False Positive count and watch how the fairness metrics change on the right.',
    target: '.bias__canvas',
    hint: 'Increase Group B\'s True Positive count to bring it closer to Group A.',
  },
  {
    title: 'Demographic Parity',
    instruction:
      'Can you find values where Demographic Parity (DP) is within 5%? Watch the DP metric -- it compares positive prediction rates across groups.',
    target: '.bias__canvas',
    hint: 'Make both groups have similar ratios of (TP + FP) / total.',
  },
  {
    title: 'Fairness Trade-offs',
    instruction:
      'Notice the trade-off: improving one fairness metric may worsen another. Click different metrics to see their definitions.',
    target: '.bias__canvas',
    hint: 'This is the impossibility theorem in action -- you cannot satisfy all fairness criteria simultaneously.',
  },
  {
    title: 'Overall Fairness Score',
    instruction:
      'The overall fairness score combines all metrics. Try to maximize it by getting all four metrics to PASS status.',
    target: '.bias__canvas',
    hint: 'You need each metric\'s gap under its 10% threshold.',
  },
]

/* ── QuantizationPruning Tour (Ch 10) ── */
export const quantizationPruningTour: TourStepDefinition[] = [
  {
    title: 'Neural Network Layers',
    instruction:
      'This neural network has 6 layers. Each dot is a neuron and each line is a weighted connection between neurons.',
    target: '.quant-prune__canvas',
    hint: 'The brightness and thickness of connections represent weight magnitudes.',
  },
  {
    title: 'Quantization',
    instruction:
      'Move the Quantization slider from FP32 to INT8. Watch the model size shrink in the metrics bar below -- fewer bits means a smaller model.',
    target: '#quant-slider',
    hint: 'Drag the slider left toward INT8 or INT4.',
  },
  {
    title: 'Pruning',
    instruction:
      'Now try pruning: increase the pruning percentage. Connections will disappear as low-magnitude weights are removed.',
    target: '#prune-slider',
    hint: 'Drag the pruning slider to at least 50% to see significant sparsity.',
  },
  {
    title: 'Knowledge Distillation',
    instruction:
      'Toggle Knowledge Distillation ON. See how the student network is smaller but accuracy recovers -- the teacher transfers its knowledge.',
    target: '.quant-prune__controls',
    hint: 'Click the toggle switch next to "Knowledge Distillation".',
  },
  {
    title: 'Compression Challenge',
    instruction:
      'Challenge: Can you get the model under 1MB while keeping accuracy above 90%? Combine all three techniques carefully.',
    target: '.quant-prune__metrics',
    hint: 'Try INT8 quantization + moderate pruning (40-60%) + distillation.',
  },
]

/* ── LossSurface3D Tour (Ch 8) ── */
export const lossSurface3DTour: TourStepDefinition[] = [
  {
    title: 'The Loss Landscape',
    instruction:
      'This 3D surface represents the loss landscape -- the terrain that optimizers must navigate. Lower valleys = better model performance.',
    target: '.loss-surface__canvas',
    hint: 'The colors map from blue (low loss) to red (high loss).',
  },
  {
    title: 'SGD Path',
    instruction:
      'The orange/yellow path shows SGD (Stochastic Gradient Descent). Notice the oscillations -- SGD is noisy because it uses random mini-batches.',
    target: '.loss-surface__legend',
    hint: 'Watch how the SGD ball bounces back and forth as it descends.',
  },
  {
    title: 'Adam Path',
    instruction:
      'The green path shows Adam optimizer. See how it navigates more smoothly toward the minimum using adaptive learning rates.',
    target: '.loss-surface__legend',
    hint: 'Adam adapts its step size per parameter, reducing oscillation.',
  },
  {
    title: 'Local vs Global Minima',
    instruction:
      'The two basins (valleys) represent local minima. The teal dot is the deeper global minimum, the purple dot is a shallower local minimum.',
    target: '.loss-surface__canvas',
    hint: 'Better optimizers are more likely to find the global minimum.',
  },
  {
    title: 'Explore the Landscape',
    instruction:
      'Try rotating the view by clicking and dragging. Zoom with scroll. See the landscape from different angles to understand its topology.',
    target: '.loss-surface__canvas',
    hint: 'Click and drag on the 3D surface to orbit around it.',
  },
]

/* ── AdversarialPlayground Tour (Ch 15) ── */
export const adversarialPlaygroundTour: TourStepDefinition[] = [
  {
    title: 'Original Image',
    instruction:
      'The left grid shows the original image pixels. Each square is a pixel with a brightness value. The classifier correctly identifies it as a cat.',
    target: '.adversarial__canvas',
    hint: 'The bars below show classification confidence for each label.',
  },
  {
    title: 'Choose an Attack',
    instruction:
      'Choose an attack type: FGSM is fast but crude, PGD is iterative and stronger, Random is baseline noise.',
    target: '.adversarial__noise-buttons',
    hint: 'Try PGD for the most effective attack.',
  },
  {
    title: 'Adjust Epsilon',
    instruction:
      'Adjust the epsilon slider -- this controls how much noise is added to each pixel. Higher epsilon = more visible perturbation.',
    target: '#adv-epsilon',
    hint: 'Start low and gradually increase to see the effect.',
  },
  {
    title: 'Difference Overlay',
    instruction:
      'Watch the difference overlay on the perturbed image -- red highlights show which pixels changed the most. These are the adversarial perturbations.',
    target: '.adversarial__canvas',
    hint: 'The reddest pixels had the largest change in value.',
  },
  {
    title: 'Stealth Attack Challenge',
    instruction:
      'Can you fool the classifier with epsilon under 0.1? That would be nearly invisible noise -- a true adversarial example.',
    target: '#adv-epsilon',
    hint: 'Use PGD attack type -- it is the most effective at low epsilon values.',
  },
]

/* ── CarbonCalculator Tour (Ch 18) ── */
export const carbonCalculatorTour: TourStepDefinition[] = [
  {
    title: 'Carbon Footprint',
    instruction:
      'This calculator estimates the carbon footprint of training an ML model. The three cards show energy consumed, CO2 emissions, and carbon intensity.',
    target: '.carbon__canvas',
    hint: 'Notice how everything is connected: GPU power x hours x grid intensity = emissions.',
  },
  {
    title: 'GPU Selection',
    instruction:
      'Try changing the GPU type. More powerful GPUs (like H100) are faster but use more energy. The TPU v4 offers an interesting efficiency trade-off.',
    target: '#carbon-gpu',
    hint: 'Select different GPUs and watch the Energy Consumed card update.',
  },
  {
    title: 'Training Duration',
    instruction:
      'Adjust the training hours. Notice the dramatic impact on CO2 -- doubling training time roughly doubles emissions.',
    target: '#carbon-hours',
    hint: 'Drag the slider and watch the CO2 counter change in real time.',
  },
  {
    title: 'Location Matters',
    instruction:
      'Change the data center region. Carbon intensity varies enormously: Nordic grids (20 gCO2/kWh) vs. India (630 gCO2/kWh) -- a 30x difference!',
    target: '#carbon-location',
    hint: 'The bar chart shows CO2 for the same workload across all regions.',
  },
  {
    title: 'Sustainability Challenge',
    instruction:
      'Challenge: Find a configuration that trains in under 24 hours with less than 50kg CO2. Consider efficient GPUs, clean regions, and smaller models.',
    target: '.carbon__controls',
    hint: 'Try TPU v4 + EU Nordic + small model + fewer GPUs.',
  },
]

/* ── Export all tours indexed by chapter ID ── */
export const TOUR_DATA: Record<string, { tourId: string; steps: TourStepDefinition[]; color: string }> = {
  ch17: { tourId: 'bias-calculator', steps: biasCalculatorTour, color: '#ef4444' },
  ch10: { tourId: 'quantization-pruning', steps: quantizationPruningTour, color: '#14b8a6' },
  ch08: { tourId: 'loss-surface', steps: lossSurface3DTour, color: '#f0a500' },
  ch15: { tourId: 'adversarial-playground', steps: adversarialPlaygroundTour, color: '#ff6b6b' },
  ch18: { tourId: 'carbon-calculator', steps: carbonCalculatorTour, color: '#22c55e' },
}
