import type { ChapterSection, GlossaryTerm } from '~/types/chapter';

export const sections: ChapterSection[] = [
  {
    id: 'ch10-s1',
    heading: 'Quantization',
    body: 'Quantization reduces the numerical precision of model weights and activations from floating-point (typically FP32) to lower-bit representations (INT8, INT4, or even binary). This directly reduces model size, memory bandwidth requirements, and computational cost, while leveraging integer arithmetic units that are faster and more energy-efficient on most hardware.\n\nPost-training quantization (PTQ) converts a pre-trained FP32 model to lower precision without retraining. The simplest approach uniformly maps the FP32 value range to the target precision. More sophisticated methods like per-channel quantization and dynamic range adjustment minimize the accuracy impact. PTQ is attractive because it requires no additional training, but it can struggle with models that have wide activation ranges.\n\nQuantization-aware training (QAT) simulates quantization during training, allowing the model to adapt its weights to the constraints of lower precision. During training, fake quantization nodes insert quantization and dequantization operations in the forward pass while using straight-through estimators for gradients. QAT typically achieves better accuracy than PTQ, especially at very low bit widths.\n\nRecent advances in quantization for large language models have pushed the boundaries to 4-bit and even 2-bit precision. Techniques like GPTQ, AWQ, and SqueezeLLM use sophisticated calibration methods to maintain quality at extreme compression ratios. These methods have made it possible to run large language models on consumer hardware, democratizing access to powerful AI capabilities.',
    blocks: [
      {
        type: 'paragraph',
        text: 'Quantization reduces the numerical precision of model weights and activations from floating-point (typically FP32) to lower-bit representations (INT8, INT4, or even binary). This directly reduces model size, memory bandwidth requirements, and computational cost, while leveraging integer arithmetic units that are faster and more energy-efficient on most hardware.',
      },
      {
        type: 'definition',
        term: 'Quantization',
        definition: 'The process of mapping continuous or high-precision floating-point values to a discrete set of lower-precision values. For neural networks, this means converting FP32 weights and activations to INT8, INT4, or other reduced formats. The quantization function maps a real value x to an integer q via: q = round(x / scale) + zero_point.',
      },
      {
        type: 'equation',
        latex: 'q = \\text{round}\\left(\\frac{x}{s}\\right) + z, \\quad \\hat{x} = s \\cdot (q - z)',
        label: 'Equation 10.1: Uniform quantization maps real value x to integer q via scale s and zero-point z. Dequantization recovers approximate value x-hat.',
      },
      {
        type: 'interactive-equation',
        latex: '\\text{Quantization Error} = \\frac{\\text{range}}{2^{ {{bits}} } - 1}, \\quad \\text{Levels} = 2^{ {{bits}} } = {{levels}}',
        variables: [
          { name: 'bits', label: 'Bit width', min: 1, max: 32, step: 1, default: 8, unit: 'bits' },
        ],
        computeResult: '1.0 / (Math.pow(2, bits) - 1)',
        resultLabel: 'Max quantization step (normalized)',
      },
      {
        type: 'figure',
        src: '',
        alt: 'Chart comparing quantization levels (FP32, FP16, INT8, INT4, binary) across dimensions of model size, inference speed, accuracy retention, and hardware support, illustrating the trade-offs at each precision level.',
        caption: 'Figure 10.1: Quantization Trade-offs',
        component: 'QuantizationTradeoff',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Post-Training Quantization (PTQ)',
      },
      {
        type: 'paragraph',
        text: 'Post-training quantization converts a pre-trained FP32 model to lower precision without retraining. The simplest approach uniformly maps the FP32 value range to the target precision. More sophisticated methods like per-channel quantization and dynamic range adjustment minimize the accuracy impact. PTQ is attractive because it requires no additional training, but it can struggle with models that have wide activation ranges.',
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Start with PTQ',
        text: 'Always try post-training quantization first. INT8 PTQ with per-channel weight quantization typically loses less than 1% accuracy on classification models and requires only a small calibration dataset (100-1000 samples). If PTQ results are unsatisfactory, then invest in quantization-aware training.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Quantization-Aware Training (QAT)',
      },
      {
        type: 'paragraph',
        text: 'Quantization-aware training simulates quantization during training, allowing the model to adapt its weights to the constraints of lower precision. During training, fake quantization nodes insert quantization and dequantization operations in the forward pass while using straight-through estimators for gradients. QAT typically achieves better accuracy than PTQ, especially at very low bit widths.',
      },
      {
        type: 'callout',
        variant: 'note',
        title: 'The Straight-Through Estimator',
        text: 'Quantization is a step function with zero gradients almost everywhere, which would prevent backpropagation. The straight-through estimator (STE) solves this by passing gradients through the quantization step unchanged during the backward pass, as if the quantization were an identity function. This approximation works surprisingly well in practice.',
      },
      {
        type: 'table',
        headers: ['Method', 'Accuracy Impact', 'Required Effort', 'Best For'],
        rows: [
          ['PTQ (INT8, per-tensor)', 'Moderate (1-3% drop)', 'Minutes (calibration only)', 'Quick deployment with acceptable accuracy'],
          ['PTQ (INT8, per-channel)', 'Low (<1% drop)', 'Minutes (calibration only)', 'Most models, recommended default'],
          ['QAT (INT8)', 'Very low (<0.5% drop)', 'Full training cycle', 'When PTQ accuracy is insufficient'],
          ['QAT (INT4)', 'Low-moderate (1-2% drop)', 'Full training cycle', 'Mobile/edge with strict size constraints'],
          ['GPTQ (4-bit LLM)', 'Low (perplexity +0.1-0.5)', 'Hours (calibration)', 'Running LLMs on consumer GPUs'],
        ],
        caption: 'Table 10.1: Comparison of quantization approaches.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'LLM Quantization: GPTQ, AWQ, and Beyond',
      },
      {
        type: 'paragraph',
        text: 'Recent advances in quantization for large language models have pushed the boundaries to 4-bit and even 2-bit precision. Techniques like GPTQ, AWQ, and SqueezeLLM use sophisticated calibration methods to maintain quality at extreme compression ratios. These methods have made it possible to run large language models on consumer hardware, democratizing access to powerful AI capabilities.',
      },
      {
        type: 'callout',
        variant: 'example',
        title: 'Running LLaMA on Consumer Hardware',
        text: 'LLaMA-2 70B in FP16 requires 140 GB of memory — far beyond any consumer GPU. With 4-bit GPTQ quantization, it fits in 35 GB and can run on two RTX 4090 GPUs (24 GB each). With 4-bit AWQ and offloading, it can even run on a single GPU with system RAM spillover. Quality loss is minimal: perplexity increases by only ~0.3 points.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Quantization Is Not Free',
        text: 'While INT8 quantization is nearly lossless for most models, aggressive quantization (INT4, INT2) can cause significant accuracy degradation, especially for small models and tasks requiring fine-grained numerical precision. Always evaluate quantized model accuracy on your specific task before deploying — aggregate metrics can hide task-specific failures.',
      },
      {
        type: 'playground',
        title: 'Quantization Explorer',
        description: 'Adjust the bit width and base model size to see how quantization affects model size, accuracy retention, inference speedup, and compression ratio. Lower bits mean smaller models but risk accuracy loss.',
        parameters: [
          { name: 'bits', label: 'Bit Width', min: 2, max: 32, step: 1, default: 8, unit: 'bits' },
          { name: 'modelSize', label: 'Base Model Size (FP32)', min: 0.5, max: 140, step: 0.5, default: 7, unit: 'GB' },
        ],
        computeFn: 'quantizationEffect',
        chartType: 'bar',
      },
    ],
    order: 0,
    keyConcepts: [
      { term: 'Quantization', definition: 'The process of reducing the numerical precision of model parameters and activations to lower bit widths, reducing model size and improving inference speed.' },
      { term: 'Quantization-Aware Training', definition: 'A training procedure that simulates quantization during training, enabling the model to learn representations that are robust to lower precision.' },
    ],
  },
  {
    id: 'ch10-s2',
    heading: 'Pruning',
    body: 'Pruning removes unnecessary parameters from neural networks, creating sparse models that require less computation and memory. The key insight is that neural networks are typically over-parameterized, and many weights contribute little to the output. Identifying and removing these redundant parameters can yield significant efficiency gains.\n\nUnstructured pruning removes individual weights based on magnitude or other criteria, creating irregular sparsity patterns. While this can achieve high compression ratios, the irregular memory access patterns make it difficult to accelerate on standard hardware. Specialized sparse computation libraries and hardware are needed to realize the theoretical speedups.\n\nStructured pruning removes entire neurons, channels, or attention heads, producing models that maintain dense computation patterns. This is more hardware-friendly because standard dense matrix operations can be used on the smaller model. Channel pruning for CNNs and head pruning for Transformers are the most common structured pruning approaches.\n\nThe Lottery Ticket Hypothesis, proposed by Frankle and Carlin, suggests that dense networks contain sparse subnetworks (winning tickets) that can achieve comparable accuracy when trained in isolation. This finding has profound implications for understanding why neural networks work and has inspired new approaches to training efficient models from the start.',
    blocks: [
      {
        type: 'paragraph',
        text: 'Pruning removes unnecessary parameters from neural networks, creating sparse models that require less computation and memory. The key insight is that neural networks are typically over-parameterized, and many weights contribute little to the output. Identifying and removing these redundant parameters can yield significant efficiency gains.',
      },
      {
        type: 'definition',
        term: 'Pruning',
        definition: 'The systematic removal of neural network parameters (weights, neurons, channels, or attention heads) that contribute least to model output. Pruning creates sparser, smaller models that require less computation and memory while preserving most of the original model\'s accuracy.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Unstructured Pruning',
      },
      {
        type: 'paragraph',
        text: 'Unstructured pruning removes individual weights based on magnitude or other criteria, creating irregular sparsity patterns. While this can achieve high compression ratios, the irregular memory access patterns make it difficult to accelerate on standard hardware. Specialized sparse computation libraries and hardware are needed to realize the theoretical speedups.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'The Hardware Gap for Unstructured Sparsity',
        text: 'A model pruned to 90% sparsity has 10x fewer nonzero weights, suggesting a 10x speedup. In practice, on standard GPUs, the speedup is often 0x — the sparse matrix is stored in a compressed format, but the irregular access pattern prevents the GPU from achieving good utilization. Only specialized hardware (NVIDIA A100\'s sparse tensor cores support 2:4 structured sparsity) or software (sparse BLAS libraries) can exploit unstructured sparsity.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Structured Pruning',
      },
      {
        type: 'paragraph',
        text: 'Structured pruning removes entire neurons, channels, or attention heads, producing models that maintain dense computation patterns. This is more hardware-friendly because standard dense matrix operations can be used on the smaller model. Channel pruning for CNNs and head pruning for Transformers are the most common structured pruning approaches.',
      },
      {
        type: 'table',
        headers: ['Pruning Type', 'Granularity', 'Compression Ratio', 'Hardware Acceleration', 'Accuracy Impact'],
        rows: [
          ['Weight (unstructured)', 'Individual weights', 'High (10-100x)', 'Requires sparse hardware', 'Low at moderate sparsity'],
          ['Channel (CNN)', 'Entire conv filters', 'Moderate (2-5x)', 'Standard dense ops', 'Low-moderate'],
          ['Head (Transformer)', 'Attention heads', 'Moderate (1.5-3x)', 'Standard dense ops', 'Low for redundant heads'],
          ['Layer (depth)', 'Entire layers', 'Proportional to removed layers', 'Standard dense ops', 'Moderate-high'],
          ['2:4 Structured', 'Two of every four weights', '2x', 'NVIDIA Ampere+ tensor cores', 'Very low'],
        ],
        caption: 'Table 10.2: Pruning types ranked by hardware friendliness.',
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Prefer Structured Pruning for Deployment',
        text: 'Unless you have access to sparse hardware, prefer structured pruning (channel or head pruning) for deployment. A 3x speedup from structured pruning on standard hardware is more valuable than a theoretical 10x from unstructured pruning that requires special support. NVIDIA\'s 2:4 sparsity pattern is a good middle ground — it achieves 2x speedup on Ampere GPUs with minimal accuracy loss.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'The Lottery Ticket Hypothesis',
      },
      {
        type: 'paragraph',
        text: 'The Lottery Ticket Hypothesis, proposed by Frankle and Carlin, suggests that dense networks contain sparse subnetworks (winning tickets) that can achieve comparable accuracy when trained in isolation. This finding has profound implications for understanding why neural networks work and has inspired new approaches to training efficient models from the start.',
      },
      {
        type: 'quote',
        text: 'A randomly-initialized, dense neural network contains a subnetwork that is initialized such that — when trained in isolation — it can match the test accuracy of the original network after training for at most the same number of iterations.',
        attribution: 'Jonathan Frankle and Michael Carlin, "The Lottery Ticket Hypothesis," ICLR 2019',
      },
      {
        type: 'callout',
        variant: 'note',
        title: 'Practical Implications of the Lottery Ticket Hypothesis',
        text: 'While finding winning tickets requires training the full dense network first (making it impractical as a direct efficiency technique), the hypothesis has inspired methods that prune early in training or at initialization. Techniques like early-bird tickets, SNIP, and GraSP attempt to identify important weights before or very early in training, potentially enabling efficient models from the start.',
      },
      {
        type: 'inline-check',
        question: 'Why does unstructured pruning often fail to deliver real speedups on standard GPUs?',
        options: [
          'GPUs cannot represent sparse matrices at all',
          'The irregular sparsity pattern prevents efficient memory access, negating the theoretical benefit of fewer operations',
          'Unstructured pruning always removes too many important weights',
          'GPU drivers do not support pruned models',
        ],
        correctIndex: 1,
        explanation: 'While unstructured pruning removes individual weights (creating high compression ratios on paper), the resulting irregular sparsity pattern leads to scattered memory accesses that GPUs handle poorly. Standard GPUs are optimized for dense, regular computation. Only specialized sparse hardware (like NVIDIA A100\'s 2:4 structured sparsity) or sparse computation libraries can exploit unstructured sparsity effectively.',
      },
      {
        type: 'aha',
        highlight: 'A model pruned to 90% sparsity has 10x fewer weights, but on a standard GPU the speedup is often 0x.',
        explanation: 'This counter-intuitive result reveals a fundamental lesson about hardware-software co-design. The theoretical compute savings from removing 90% of weights are real, but modern GPUs are designed around dense matrix multiplication with regular, predictable memory access patterns. Sparse matrices stored in compressed formats (CSR, COO) require indirect indexing that destroys GPU memory coalescence. The overhead of irregular memory access can completely negate the benefit of doing fewer multiplications.',
        analogy: 'Imagine a library where you remove 90% of the books to "speed up" finding information. If the remaining 10% are scattered randomly across all shelves with no updated index, you still have to walk every aisle looking for them. A smaller, reorganized library with contiguous shelving (structured pruning) is far faster to navigate.',
      },
    ],
    order: 1,
    keyConcepts: [
      { term: 'Pruning', definition: 'The removal of unnecessary neural network parameters to create smaller, faster models while maintaining accuracy.' },
      { term: 'Lottery Ticket Hypothesis', definition: 'The theory that dense neural networks contain sparse subnetworks that, when trained in isolation from random initialization, can match the accuracy of the full network.' },
    ],
  },
  {
    id: 'ch10-s3',
    heading: 'Knowledge Distillation',
    body: 'Knowledge distillation transfers the learned representations from a large, complex teacher model to a smaller, more efficient student model. Rather than training the student directly on hard labels, distillation trains it to match the soft probability distributions produced by the teacher, which contain richer information about class relationships.\n\nThe standard distillation loss combines the student\'s cross-entropy loss on ground truth labels with a KL divergence loss between the teacher\'s and student\'s softened output distributions. The temperature parameter controls the softness of the distributions: higher temperatures produce softer distributions that transfer more information but may introduce noise.\n\nFeature-based distillation extends the concept by matching intermediate representations rather than just outputs. The student is trained to mimic the teacher\'s internal feature maps at selected layers. Attention transfer, which matches attention maps between teacher and student, is another popular variant for Transformer models.\n\nDistillation has become a critical technique in the large language model era. Models like DistilBERT achieve 97% of BERT\'s performance with 40% fewer parameters by distilling during pre-training. For deployment on resource-constrained devices, distillation provides a principled way to compress knowledge from models that are too large to serve directly.',
    blocks: [
      {
        type: 'paragraph',
        text: 'Knowledge distillation transfers the learned representations from a large, complex teacher model to a smaller, more efficient student model. Rather than training the student directly on hard labels, distillation trains it to match the soft probability distributions produced by the teacher, which contain richer information about class relationships.',
      },
      {
        type: 'definition',
        term: 'Knowledge Distillation',
        definition: 'A model compression technique where a smaller "student" model is trained to mimic the behavior of a larger "teacher" model. The student learns from the teacher\'s soft probability distributions, which encode richer information than hard labels (e.g., "this cat image is 0.8 cat, 0.15 tiger, 0.05 dog" reveals class similarity structure).',
      },
      {
        type: 'heading',
        level: 3,
        text: 'The Distillation Loss',
      },
      {
        type: 'paragraph',
        text: 'The standard distillation loss combines the student\'s cross-entropy loss on ground truth labels with a KL divergence loss between the teacher\'s and student\'s softened output distributions. The temperature parameter controls the softness of the distributions: higher temperatures produce softer distributions that transfer more information but may introduce noise.',
      },
      {
        type: 'equation',
        latex: '\\mathcal{L} = \\alpha \\cdot \\text{CE}(y, \\sigma(z_s)) + (1 - \\alpha) \\cdot T^2 \\cdot \\text{KL}\\left(\\sigma\\left(\\frac{z_t}{T}\\right), \\sigma\\left(\\frac{z_s}{T}\\right)\\right)',
        label: 'Equation 10.2: Distillation loss combines cross-entropy on true labels with KL divergence between teacher and student softened outputs. T is temperature, alpha balances the two terms.',
      },
      {
        type: 'callout',
        variant: 'note',
        title: 'Why Soft Labels Work',
        text: 'A hard label says "this is a cat" (one-hot: [1, 0, 0]). The teacher\'s soft prediction says "this is 80% cat, 15% tiger, 5% dog." The soft label reveals that cats and tigers are visually similar while dogs are more different. This relational information helps the student learn a better feature space than hard labels alone, especially when training data is limited.',
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Choosing the Temperature',
        text: 'Temperature T controls how "soft" the probability distributions are. T=1 gives the standard softmax. T=3-5 is a common starting point for distillation. Higher T spreads probability mass more evenly, transferring more information about class relationships. Too high T makes the distribution nearly uniform and uninformative. Tune T on a validation set.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Feature-Based and Attention Distillation',
      },
      {
        type: 'paragraph',
        text: 'Feature-based distillation extends the concept by matching intermediate representations rather than just outputs. The student is trained to mimic the teacher\'s internal feature maps at selected layers. Attention transfer, which matches attention maps between teacher and student, is another popular variant for Transformer models.',
      },
      {
        type: 'table',
        headers: ['Distillation Variant', 'What Is Matched', 'Best For'],
        rows: [
          ['Output (logit) distillation', 'Final class probabilities', 'Classification tasks, simplest to implement'],
          ['Feature distillation', 'Intermediate layer activations', 'Dense prediction (detection, segmentation)'],
          ['Attention distillation', 'Attention weight matrices', 'Transformer models (BERT, GPT)'],
          ['Relation distillation', 'Pairwise sample similarities', 'Metric learning, embeddings'],
          ['Self-distillation', 'Earlier checkpoints of same model', 'No teacher needed, regularization effect'],
        ],
        caption: 'Table 10.3: Knowledge distillation variants and their applications.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Distillation for Large Language Models',
      },
      {
        type: 'paragraph',
        text: 'Distillation has become a critical technique in the large language model era. Models like DistilBERT achieve 97% of BERT\'s performance with 40% fewer parameters by distilling during pre-training. For deployment on resource-constrained devices, distillation provides a principled way to compress knowledge from models that are too large to serve directly.',
      },
      {
        type: 'callout',
        variant: 'example',
        title: 'DistilBERT: A Distillation Success Story',
        text: 'DistilBERT was created by distilling BERT-base (110M params) into a 66M parameter student during the pre-training phase. The result retains 97% of BERT\'s language understanding (as measured on GLUE benchmarks) while being 60% smaller and 60% faster. This demonstrates that much of a large model\'s capacity is redundant and can be transferred to a significantly smaller model.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Distillation Limitations',
        text: 'Distillation is not a silver bullet. The student can never exceed the teacher\'s accuracy (it can only approach it). For tasks where the teacher itself performs poorly, distillation won\'t help. Additionally, distillation requires running inference on the teacher for all training data, which can be expensive for very large teacher models.',
      },
      {
        type: 'interactive-equation',
        latex: '\\text{Student Size} = \\frac{ {{teacherParams}} \\text{M params}}{{{compressionRatio}}} = {{studentSize}} \\text{M params}, \\quad \\text{Expected Quality} \\approx {{quality}}\\%',
        variables: [
          { name: 'teacherParams', label: 'Teacher params (M)', min: 10, max: 1000, step: 10, default: 110, unit: 'M' },
          { name: 'compressionRatio', label: 'Compression ratio', min: 1.5, max: 10, step: 0.5, default: 1.7, unit: 'x' },
        ],
        computeResult: '100 - (compressionRatio - 1) * 3',
        resultLabel: 'Approximate quality retention (%)',
      },
      {
        type: 'inline-check',
        question: 'What advantage do soft labels from the teacher provide over hard (one-hot) labels during distillation?',
        options: [
          'Soft labels are faster to compute during training',
          'Soft labels encode class similarity relationships (e.g., cat is similar to tiger)',
          'Soft labels guarantee higher accuracy than hard labels',
          'Soft labels use less memory during training',
        ],
        correctIndex: 1,
        explanation: 'A hard label says "this is a cat" (one-hot: [1, 0, 0]). The teacher\'s soft prediction says "80% cat, 15% tiger, 5% dog." This reveals that cats and tigers are visually similar while dogs are more different. This relational information helps the student learn a richer feature space than training on hard labels alone, which is the key mechanism behind distillation\'s effectiveness.',
      },
      {
        type: 'stat',
        value: 97,
        suffix: '%',
        label: 'of BERT\'s accuracy retained by DistilBERT with 40% fewer parameters — the power of knowledge distillation',
      },
    ],
    order: 2,
    keyConcepts: [
      { term: 'Knowledge Distillation', definition: 'A model compression technique that trains a smaller student model to mimic the behavior of a larger teacher model, transferring learned representations.' },
      { term: 'Temperature Scaling', definition: 'A parameter in distillation that controls the softness of probability distributions, with higher temperatures revealing more information about class relationships.' },
    ],
  },
  {
    id: 'ch10-s4',
    heading: 'Operator Fusion and Graph Optimization',
    body: 'Operator fusion combines multiple sequential operations into a single fused kernel, reducing memory traffic and kernel launch overhead. For example, fusing a convolution, batch normalization, and ReLU activation into a single operation avoids writing and reading intermediate results from memory, significantly improving performance.\n\nGraph-level optimizations analyze the computational graph to identify fusion opportunities, eliminate redundant operations, and optimize memory allocation. Common optimizations include constant folding (pre-computing operations with known inputs), dead code elimination (removing unused computations), and layout transformations (converting data layouts for optimal hardware utilization).\n\nML compilers like TensorRT, Apache TVM, and XLA automate these optimizations for specific hardware targets. TensorRT, for example, can automatically fuse operations, select optimal kernel implementations, and apply quantization for NVIDIA GPUs. These compilers can achieve 2-5x speedup over naive framework execution.\n\nCustom kernel development using CUDA, Triton, or other low-level languages enables optimizations that are impossible at the graph level. Flash Attention is a prominent example: by rewriting attention as a single fused kernel that is aware of the GPU memory hierarchy, it achieves both lower memory usage and faster execution than the standard multi-operation implementation.',
    blocks: [
      {
        type: 'paragraph',
        text: 'Operator fusion combines multiple sequential operations into a single fused kernel, reducing memory traffic and kernel launch overhead. For example, fusing a convolution, batch normalization, and ReLU activation into a single operation avoids writing and reading intermediate results from memory, significantly improving performance.',
      },
      {
        type: 'definition',
        term: 'Operator Fusion',
        definition: 'A compiler optimization that merges multiple sequential operations (e.g., convolution + batch normalization + ReLU) into a single kernel execution. This eliminates intermediate memory reads and writes, reducing memory bandwidth consumption and kernel launch overhead. Fusion is the single most impactful graph-level optimization for inference.',
      },
      {
        type: 'callout',
        variant: 'example',
        title: 'Conv-BN-ReLU Fusion',
        text: 'Without fusion: Conv writes output to memory (1 write), BN reads it (1 read), BN writes result (1 write), ReLU reads it (1 read), ReLU writes final output (1 write) = 5 memory transfers. With fusion: Conv-BN-ReLU runs as one kernel, reading input once and writing output once = 2 memory transfers. For memory-bound operations, this alone can yield a 2-3x speedup.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Graph-Level Optimizations',
      },
      {
        type: 'paragraph',
        text: 'Graph-level optimizations analyze the computational graph to identify fusion opportunities, eliminate redundant operations, and optimize memory allocation.',
      },
      {
        type: 'list',
        ordered: false,
        items: [
          'Constant folding — Pre-compute operations whose inputs are all known at compile time (e.g., shape calculations).',
          'Dead code elimination — Remove computations whose outputs are never used downstream.',
          'Layout transformation — Convert tensor memory layouts (NCHW vs. NHWC) to match hardware preferences.',
          'Common subexpression elimination — Detect and share identical computations to avoid redundant work.',
          'Memory planning — Schedule tensor lifetimes to reuse memory, reducing peak memory consumption.',
        ],
      },
      {
        type: 'heading',
        level: 3,
        text: 'ML Compilers',
      },
      {
        type: 'paragraph',
        text: 'ML compilers like TensorRT, Apache TVM, and XLA automate these optimizations for specific hardware targets. TensorRT, for example, can automatically fuse operations, select optimal kernel implementations, and apply quantization for NVIDIA GPUs. These compilers can achieve 2-5x speedup over naive framework execution.',
      },
      {
        type: 'table',
        headers: ['Compiler', 'Developer', 'Target Hardware', 'Key Strengths'],
        rows: [
          ['TensorRT', 'NVIDIA', 'NVIDIA GPUs', 'Best GPU optimization, INT8 quantization, layer fusion'],
          ['Apache TVM', 'Apache Foundation', 'CPUs, GPUs, accelerators', 'Hardware-agnostic, auto-tuning, broad target support'],
          ['XLA', 'Google', 'TPUs, GPUs, CPUs', 'Whole-program optimization, JAX/TF integration'],
          ['ONNX Runtime', 'Microsoft', 'Cross-platform', 'Cross-framework, execution provider architecture'],
          ['OpenVINO', 'Intel', 'Intel CPUs, GPUs, VPUs', 'Best Intel hardware optimization'],
        ],
        caption: 'Table 10.4: Major ML inference compilers and their target platforms.',
      },
      {
        type: 'callout',
        variant: 'note',
        title: 'Compiler Speedups Are Hardware-Specific',
        text: 'The speedup from an ML compiler depends heavily on the target hardware. TensorRT achieves its best speedups on NVIDIA GPUs because it has deep knowledge of GPU architecture. The same model compiled with TVM for an ARM CPU may see a different speedup profile. Always benchmark on the actual deployment hardware.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Custom Kernels',
      },
      {
        type: 'paragraph',
        text: 'Custom kernel development using CUDA, Triton, or other low-level languages enables optimizations that are impossible at the graph level. Flash Attention is a prominent example: by rewriting attention as a single fused kernel that is aware of the GPU memory hierarchy, it achieves both lower memory usage and faster execution than the standard multi-operation implementation.',
      },
      {
        type: 'code',
        language: 'python',
        code: '# Triton: custom fused add + ReLU kernel\n@triton.jit\ndef fused_add_relu_kernel(x_ptr, y_ptr, out_ptr, n,\n                          BLOCK: tl.constexpr):\n    pid = tl.program_id(0)\n    offsets = pid * BLOCK + tl.arange(0, BLOCK)\n    mask = offsets < n\n    x = tl.load(x_ptr + offsets, mask=mask)\n    y = tl.load(y_ptr + offsets, mask=mask)\n    result = tl.maximum(x + y, 0.0)  # Fused add + ReLU\n    tl.store(out_ptr + offsets, result, mask=mask)',
        caption: 'Triton enables writing custom fused GPU kernels in Python-like syntax, avoiding separate kernels for add and ReLU.',
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'When to Write Custom Kernels',
        text: 'Custom kernel development is high-effort and hardware-specific. Reserve it for operations that dominate your model\'s runtime and cannot be adequately optimized by existing compilers. Profile first, identify the top bottleneck operations, and check whether a compiler (TensorRT, TVM) already handles them before investing in custom kernel development.',
      },
    ],
    order: 3,
    keyConcepts: [
      { term: 'Operator Fusion', definition: 'The combination of multiple sequential neural network operations into a single computation kernel, reducing memory traffic and overhead.' },
      { term: 'TensorRT', definition: 'NVIDIA\'s deep learning inference optimizer and runtime that automatically applies graph optimizations, quantization, and kernel selection for GPU deployment.' },
    ],
  },
  {
    id: 'ch10-s5',
    heading: 'Combined Optimization Strategies',
    body: 'In practice, the most effective optimization pipelines combine multiple techniques rather than relying on a single approach. A typical pipeline might start with architecture-level efficiency (choosing an efficient base architecture), apply knowledge distillation during training, follow with quantization-aware training, and finish with operator fusion during deployment.\n\nThe order of optimization matters because techniques interact. Pruning before quantization is generally better than the reverse because pruning can remove parameters that would have caused quantization errors. Similarly, distillation-then-quantization typically outperforms quantization-then-distillation because the distilled model starts from a stronger quality baseline.\n\nMeasuring the compound effect of optimizations requires careful benchmarking on the target hardware. Theoretical speedup predictions (e.g., "4x from INT8 quantization") rarely match real-world measurements due to memory bottlenecks, kernel launch overhead, and data loading constraints. End-to-end profiling on the target device is essential.\n\nThe choice of optimization strategy depends on the deployment scenario. For cloud serving with GPU access, operator fusion and FP16/INT8 quantization are usually sufficient. For mobile deployment, aggressive quantization and pruning may be needed. For microcontrollers, extreme optimization including binary quantization and specialized architectures may be necessary to meet the harsh resource constraints.',
    blocks: [
      {
        type: 'paragraph',
        text: 'In practice, the most effective optimization pipelines combine multiple techniques rather than relying on a single approach. A typical pipeline might start with architecture-level efficiency (choosing an efficient base architecture), apply knowledge distillation during training, follow with quantization-aware training, and finish with operator fusion during deployment.',
      },
      {
        type: 'definition',
        term: 'Optimization Pipeline',
        definition: 'A systematic sequence of complementary model optimization techniques applied in a deliberate order to maximize cumulative efficiency gains. The pipeline typically flows from architecture design through training-time optimizations (distillation, QAT) to deployment-time optimizations (pruning, quantization, fusion).',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Order of Operations Matters',
      },
      {
        type: 'paragraph',
        text: 'The order of optimization matters because techniques interact. Pruning before quantization is generally better than the reverse because pruning can remove parameters that would have caused quantization errors. Similarly, distillation-then-quantization typically outperforms quantization-then-distillation because the distilled model starts from a stronger quality baseline.',
      },
      {
        type: 'list',
        ordered: true,
        items: [
          'Architecture design — Choose an efficient base architecture (MobileNet, EfficientNet) or use NAS.',
          'Knowledge distillation — Train a smaller student from a larger teacher model.',
          'Pruning — Remove redundant parameters (structured pruning preferred for hardware compatibility).',
          'Quantization-aware training — Fine-tune with simulated quantization for the target bit width.',
          'Post-training quantization — Apply final quantization calibration if QAT was not used.',
          'Operator fusion and graph optimization — Use an ML compiler (TensorRT, TVM) for the target hardware.',
        ],
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Interaction Effects',
        text: 'Optimization techniques do not compose linearly. If quantization gives 4x speedup alone and pruning gives 2x alone, the combination does not guarantee 8x. Pruning may create weight distributions that are harder to quantize, or both may target the same bottleneck (memory bandwidth), yielding diminishing returns when combined. Always measure the combined effect empirically.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Benchmarking on Target Hardware',
      },
      {
        type: 'paragraph',
        text: 'Measuring the compound effect of optimizations requires careful benchmarking on the target hardware. Theoretical speedup predictions (e.g., "4x from INT8 quantization") rarely match real-world measurements due to memory bottlenecks, kernel launch overhead, and data loading constraints. End-to-end profiling on the target device is essential.',
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'End-to-End Profiling Checklist',
        text: 'When benchmarking: (1) Always warm up the model with a few inferences before measuring. (2) Measure end-to-end latency including preprocessing and postprocessing. (3) Test with realistic input sizes and batch sizes. (4) Report both median and p99 latency. (5) Monitor GPU/CPU utilization to identify bottlenecks. (6) Test under realistic concurrency loads if the model will serve multiple requests.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Deployment-Specific Strategies',
      },
      {
        type: 'table',
        headers: ['Deployment Target', 'Recommended Pipeline', 'Typical Speedup'],
        rows: [
          ['Cloud GPU', 'FP16 + operator fusion (TensorRT)', '2-4x over naive PyTorch'],
          ['Cloud GPU (cost-sensitive)', 'INT8 quantization + fusion', '3-6x'],
          ['Mobile (Android/iOS)', 'Distillation + INT8 QAT + TFLite', '5-20x vs. original model'],
          ['Edge (Jetson, Coral)', 'INT8 PTQ + TensorRT / Edge TPU compiler', '4-10x'],
          ['Microcontroller (TinyML)', 'NAS + INT4/binary + hand-tuned kernels', '10-100x (required to fit)'],
        ],
        caption: 'Table 10.5: Recommended optimization pipelines for different deployment targets.',
      },
      {
        type: 'callout',
        variant: 'example',
        title: 'Full Pipeline in Practice',
        text: 'Deploying a BERT model for real-time search ranking: Start with DistilBERT (distillation: 66M params, ~1.5x faster). Apply structured head pruning to remove 4 of 12 attention heads (~1.3x faster). Use INT8 QAT with TensorRT (~2x faster). Final result: 4x total speedup, 3x memory reduction, <1% quality loss on the ranking task. Latency drops from 12ms to 3ms on an A10 GPU.',
      },
      {
        type: 'inline-check',
        question: 'Why is the order of optimization techniques important (e.g., pruning before quantization)?',
        options: [
          'Some tools only accept models in a specific format',
          'Pruning removes parameters that would have caused quantization errors, and distillation starts from a stronger quality baseline',
          'Quantization must always be applied last due to hardware constraints',
          'The order does not matter — all combinations yield the same result',
        ],
        correctIndex: 1,
        explanation: 'Optimization techniques interact with each other. Pruning first removes outlier weights that would have caused large quantization errors, making subsequent quantization more effective. Distillation first ensures the model starts from the highest quality possible before lossy compression steps. The compound effect of optimizations is not simply multiplicative, so empirical measurement of the combined pipeline is essential.',
      },
      {
        type: 'playground',
        title: 'Optimization Pipeline Estimator',
        description: 'Estimate the combined speedup and size reduction from applying multiple optimization techniques in sequence.',
        parameters: [
          { name: 'distillSpeedup', label: 'Distillation speedup', min: 1, max: 5, step: 0.1, default: 1.5, unit: 'x' },
          { name: 'pruneSpeedup', label: 'Pruning speedup', min: 1, max: 5, step: 0.1, default: 1.3, unit: 'x' },
          { name: 'quantSpeedup', label: 'Quantization speedup', min: 1, max: 8, step: 0.1, default: 2.0, unit: 'x' },
          { name: 'fusionSpeedup', label: 'Operator fusion speedup', min: 1, max: 4, step: 0.1, default: 1.5, unit: 'x' },
        ],
        computeFn: 'optimizationPipeline',
        chartType: 'gauge',
      },
    ],
    order: 4,
    keyConcepts: [
      { term: 'Optimization Pipeline', definition: 'A systematic sequence of complementary model optimization techniques applied in a specific order to maximize cumulative efficiency gains.' },
      { term: 'End-to-End Profiling', definition: 'Measuring the complete inference time on target hardware, including all preprocessing, computation, and postprocessing, to accurately assess optimization impact.' },
    ],
  },
];

export const glossary: GlossaryTerm[] = [
  { term: 'Quantization', definition: 'Reducing numerical precision of model parameters to lower bit widths (e.g., FP32 to INT8) to decrease size and increase speed.' },
  { term: 'Pruning', definition: 'Removing unnecessary neural network parameters to create sparse, more efficient models.' },
  { term: 'Knowledge Distillation', definition: 'Training a smaller student model to replicate the behavior of a larger teacher model.' },
  { term: 'Operator Fusion', definition: 'Combining multiple sequential operations into a single kernel to reduce memory traffic and overhead.' },
  { term: 'Post-Training Quantization', definition: 'Applying quantization to an already-trained model without additional training, a simple but potentially less accurate approach.' },
  { term: 'Structured Pruning', definition: 'Removing entire groups of parameters (channels, heads) rather than individual weights, maintaining hardware-friendly dense computations.' },
  { term: 'GPTQ', definition: 'A quantization method for large language models that uses approximate second-order information for optimal weight rounding.' },
];

export const keyTakeaways: string[] = [
  'Quantization to INT8 can achieve near-lossless compression with 4x size reduction and significant speedup on hardware with integer units.',
  'Structured pruning is more hardware-friendly than unstructured pruning, though unstructured pruning achieves higher compression ratios.',
  'Knowledge distillation transfers rich information through soft probability distributions, not just hard label predictions.',
  'Operator fusion can provide 2-5x speedups by reducing memory traffic between sequential operations.',
  'Combined optimization pipelines achieve better results than any single technique, but the order of application matters.',
  'Always benchmark optimizations end-to-end on target hardware, as theoretical speedups rarely match real-world measurements.',
];

export const learningObjectives: string[] = [
  'Compare post-training quantization and quantization-aware training in terms of accuracy and deployment effort',
  'Explain structured vs. unstructured pruning and their implications for hardware acceleration',
  'Implement a knowledge distillation pipeline to compress a large teacher model into a smaller student',
  'Analyze how operator fusion reduces memory traffic and improves inference throughput',
  'Design a combined optimization pipeline that sequences quantization, pruning, and distillation effectively',
];
