/**
 * Pure compute functions for ParameterPlayground components.
 * Each function takes a Record of parameter values and returns chart data.
 */

export interface LineChartData {
  x: number[]
  y: number[]
  xlabel: string
  ylabel: string
}

export interface BarChartData {
  labels: string[]
  values: number[]
  xlabel: string
  ylabel: string
}

export interface GaugeData {
  value: number
  min: number
  max: number
  label: string
  unit: string
}

export type ChartData = LineChartData | BarChartData | GaugeData

/**
 * Learning rate vs loss curve.
 * Simulates how different learning rates affect the training loss trajectory.
 * Too small = slow convergence; too large = divergence; just right = fast convergence.
 */
export function learningRateLoss(params: Record<string, number>): LineChartData {
  const lr = params.learningRate ?? 0.01
  const epochs = params.epochs ?? 50

  const x: number[] = []
  const y: number[] = []

  for (let i = 0; i <= epochs; i++) {
    x.push(i)

    // Simulate loss curve behavior based on learning rate
    if (lr > 0.5) {
      // Too high: loss diverges with oscillations
      const divergence = Math.exp((lr - 0.5) * i * 0.08)
      const oscillation = Math.sin(i * lr * 2) * lr * 0.5
      y.push(Math.min(2.5 + divergence * 0.3 + oscillation, 10))
    } else if (lr > 0.1) {
      // Slightly too high: oscillates but slowly decreases
      const decay = Math.exp(-i * (lr * 0.3))
      const oscillation = Math.sin(i * lr * 3) * 0.3 * decay
      y.push(Math.max(0.1, 2.5 * decay + 0.2 + oscillation))
    } else if (lr > 0.001) {
      // Good range: smooth convergence
      const rate = lr * 8
      const loss = 2.5 * Math.exp(-rate * i * 0.1) + 0.05
      y.push(loss)
    } else {
      // Too small: very slow convergence
      const rate = lr * 80
      const loss = 2.5 * Math.exp(-rate * i * 0.01) + 0.8
      y.push(loss)
    }
  }

  return { x, y, xlabel: 'Epoch', ylabel: 'Loss' }
}

/**
 * Batch size vs throughput and memory tradeoff.
 * Larger batches improve GPU utilization (throughput) but increase memory.
 */
export function batchSizeTradeoff(params: Record<string, number>): BarChartData {
  const batchSize = params.batchSize ?? 32
  const gpuMemoryGB = params.gpuMemory ?? 16

  // Throughput model: increases with batch size, plateaus due to compute limits
  // Memory: scales roughly linearly with batch size
  const maxThroughput = gpuMemoryGB * 60 // samples/sec ceiling based on GPU
  const throughput = maxThroughput * (1 - Math.exp(-batchSize / 64))

  // Memory usage: base model + activations proportional to batch size
  const baseMemoryGB = 2.0 // model weights
  const perSampleMB = 50 // activation memory per sample in batch
  const memoryUsedGB = baseMemoryGB + (batchSize * perSampleMB) / 1024

  // GPU utilization percentage
  const utilization = Math.min(100, (throughput / maxThroughput) * 100)

  // Gradient noise (inversely proportional to sqrt of batch size)
  const gradientNoise = 100 / Math.sqrt(batchSize)

  return {
    labels: ['Throughput\n(samples/s)', 'Memory\n(GB)', 'GPU Util\n(%)', 'Grad Noise\n(relative)'],
    values: [
      Math.round(throughput),
      Math.round(memoryUsedGB * 10) / 10,
      Math.round(utilization),
      Math.round(gradientNoise * 10) / 10,
    ],
    xlabel: 'Metric',
    ylabel: 'Value',
  }
}

/**
 * Pruning ratio vs accuracy and speedup.
 * Shows how aggressively pruning weights affects model accuracy and inference speedup.
 */
export function pruningEffect(params: Record<string, number>): LineChartData {
  const structured = params.structured ?? 0 // 0 = unstructured, 1 = structured

  const x: number[] = []
  const y: number[] = []

  // Generate accuracy curve across pruning ratios, highlighting current point
  for (let p = 0; p <= 100; p += 2) {
    x.push(p)

    const ratio = p / 100

    if (structured >= 0.5) {
      // Structured pruning: accuracy drops more but speedup is real
      // Accuracy drops roughly as a logistic curve
      const accuracy = 95 - 5 * ratio - 40 * Math.pow(ratio, 2.5)
      y.push(Math.max(0, accuracy))
    } else {
      // Unstructured pruning: accuracy is more resilient
      const accuracy = 95 - 2 * ratio - 30 * Math.pow(ratio, 3)
      y.push(Math.max(0, accuracy))
    }
  }

  return { x, y, xlabel: 'Pruning %', ylabel: 'Accuracy %' }
}

/**
 * Quantization bits vs model size and accuracy retention.
 * Shows how reducing bit width compresses the model and affects accuracy.
 */
export function quantizationEffect(params: Record<string, number>): BarChartData {
  const bits = params.bits ?? 8
  const modelSizeGB = params.modelSize ?? 7 // Base model size in GB at FP32

  // Model size scales linearly with bit width (relative to 32-bit baseline)
  const compressedSizeGB = modelSizeGB * (bits / 32)

  // Accuracy retention: higher bits = better accuracy
  // FP32: 100%, FP16: ~99.9%, INT8: ~99%, INT4: ~96%, INT2: ~88%
  let accuracyRetention: number
  if (bits >= 16) {
    accuracyRetention = 100 - (32 - bits) * 0.006
  } else if (bits >= 8) {
    accuracyRetention = 99.5 - (16 - bits) * 0.25
  } else if (bits >= 4) {
    accuracyRetention = 97.5 - (8 - bits) * 1.5
  } else {
    accuracyRetention = 91.5 - (4 - bits) * 4
  }
  accuracyRetention = Math.max(50, Math.min(100, accuracyRetention))

  // Inference speedup relative to FP32
  const speedup = 32 / Math.max(bits, 1)

  // Compression ratio
  const compressionRatio = 32 / bits

  return {
    labels: ['Size\n(GB)', 'Accuracy\n(%)', 'Speedup\n(x)', 'Compression\n(x)'],
    values: [
      Math.round(compressedSizeGB * 100) / 100,
      Math.round(accuracyRetention * 10) / 10,
      Math.round(speedup * 10) / 10,
      Math.round(compressionRatio * 10) / 10,
    ],
    xlabel: 'Metric',
    ylabel: 'Value',
  }
}

/**
 * Canary deployment risk: total requests exposed to the canary model.
 */
export function canaryDeploymentRisk(params: Record<string, number>): GaugeData {
  const canaryPercent = params.canaryPercent ?? 5
  const durationHours = params.durationHours ?? 24
  const requestsPerHour = params.requestsPerHour ?? 100 // in thousands

  const exposedRequestsK = (canaryPercent / 100) * requestsPerHour * durationHours

  return {
    value: Math.round(exposedRequestsK),
    min: 0,
    max: Math.round(requestsPerHour * durationHours),
    label: 'Requests exposed to canary (K)',
    unit: 'K requests',
  }
}

/**
 * Grid vs random search: values per dimension with a fixed trial budget.
 */
export function gridVsRandomSearch(params: Record<string, number>): BarChartData {
  const dimensions = params.dimensions ?? 3
  const budget = params.budget ?? 100

  const gridValuesPerDim = Math.floor(Math.pow(budget, 1 / dimensions))
  const gridTotal = Math.pow(gridValuesPerDim, dimensions)
  const randomCoverage = budget // random search uses all trials

  return {
    labels: ['Grid: vals/dim', 'Grid: total', 'Random: trials', 'Random: unique dims'],
    values: [gridValuesPerDim, Math.min(gridTotal, budget), randomCoverage, budget],
    xlabel: 'Search Strategy',
    ylabel: 'Count',
  }
}

/**
 * Labeling cost calculator: random vs active learning.
 */
export function labelingCostCalculator(params: Record<string, number>): BarChartData {
  const datasetSize = params.datasetSize ?? 100000
  const costPerLabel = params.costPerLabel ?? 0.50
  const activeLearningRatio = params.activeLearningRatio ?? 4

  const randomCost = datasetSize * costPerLabel
  const activeCost = (datasetSize / activeLearningRatio) * costPerLabel
  const savings = randomCost - activeCost

  return {
    labels: ['Random ($)', 'Active ($)', 'Savings ($)', 'Labels needed'],
    values: [
      Math.round(randomCost),
      Math.round(activeCost),
      Math.round(savings),
      Math.round(datasetSize / activeLearningRatio),
    ],
    xlabel: 'Strategy',
    ylabel: 'Value',
  }
}

/**
 * MCU memory budget: flash and SRAM usage.
 */
export function mcuMemoryBudget(params: Record<string, number>): GaugeData {
  const modelParams = params.modelParams ?? 50 // in thousands
  const bitsPerWeight = params.bitsPerWeight ?? 8
  const flashKB = params.flashKB ?? 1024

  const modelSizeKB = (modelParams * 1000 * bitsPerWeight) / 8 / 1024
  const flashUsagePct = (modelSizeKB / flashKB) * 100

  return {
    value: Math.round(flashUsagePct * 10) / 10,
    min: 0,
    max: 100,
    label: `Model: ${Math.round(modelSizeKB)} KB / ${flashKB} KB flash`,
    unit: '% flash used',
  }
}

/**
 * Optimization pipeline: combined speedup from multiple techniques.
 */
export function optimizationPipeline(params: Record<string, number>): GaugeData {
  const distill = params.distillSpeedup ?? 1.5
  const prune = params.pruneSpeedup ?? 1.3
  const quant = params.quantSpeedup ?? 2.0
  const fusion = params.fusionSpeedup ?? 1.5

  // Apply a 15% discount for interaction effects
  const theoretical = distill * prune * quant * fusion
  const practical = theoretical * 0.85

  return {
    value: Math.round(practical * 10) / 10,
    min: 1,
    max: 50,
    label: `Theoretical: ${theoretical.toFixed(1)}x, Practical: ${practical.toFixed(1)}x`,
    unit: 'x speedup',
  }
}

/**
 * Compound scaling explorer for EfficientNet.
 */
export function compoundScaling(params: Record<string, number>): LineChartData {
  const alpha = params.alpha ?? 1.2
  const beta = params.beta ?? 1.1

  const x: number[] = []
  const y: number[] = []

  for (let phi = 0; phi <= 7; phi++) {
    x.push(phi)
    const depth = Math.pow(alpha, phi)
    const width = Math.pow(beta, phi)
    const flopsMultiplier = depth * width * width // alpha * beta^2 * gamma^2 ≈ 2^phi
    y.push(Math.round(flopsMultiplier * 10) / 10)
  }

  return { x, y, xlabel: 'Compound Coefficient (φ)', ylabel: 'FLOPs Multiplier' }
}

/**
 * Communication overhead calculator for distributed training.
 */
export function communicationOverhead(params: Record<string, number>): GaugeData {
  const paramsB = params.paramsB ?? 7
  const bandwidthGbps = params.bandwidthGbps ?? 100
  const compression = params.compression ?? 1

  // FP32: 4 bytes per param, convert to bits for bandwidth calculation
  const dataBits = (paramsB * 1e9 * 4 * 8) / compression
  const timeSeconds = dataBits / (bandwidthGbps * 1e9)

  return {
    value: Math.round(timeSeconds * 100) / 100,
    min: 0,
    max: Math.max(10, Math.round(timeSeconds * 2)),
    label: `${(paramsB * 4 / compression).toFixed(1)} GB gradient data over ${bandwidthGbps} Gbps`,
    unit: 'seconds',
  }
}

/** Registry of compute functions by name */
export const computeRegistry: Record<string, (params: Record<string, number>) => ChartData> = {
  learningRateLoss,
  batchSizeTradeoff,
  pruningEffect,
  quantizationEffect,
  canaryDeploymentRisk,
  gridVsRandomSearch,
  labelingCostCalculator,
  mcuMemoryBudget,
  optimizationPipeline,
  compoundScaling,
  communicationOverhead,
}
