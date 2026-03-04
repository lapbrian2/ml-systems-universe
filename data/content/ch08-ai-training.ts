import type { ChapterSection, GlossaryTerm } from '~/types/chapter';

export const sections: ChapterSection[] = [
  {
    id: 'ch08-s1',
    heading: 'Distributed Training Fundamentals',
    body: 'As models grow larger and datasets expand, training on a single accelerator becomes impractical. Distributed training splits the workload across multiple devices, potentially across multiple machines, to reduce training time from weeks to hours. Understanding distributed training is essential for any engineer working with modern large-scale ML systems.\n\nThe fundamental challenge of distributed training is maintaining the mathematical equivalence of optimization while dividing work across devices. Communication overhead between devices, synchronization strategies, and fault tolerance all add complexity that does not exist in single-device training.\n\nDistributed training introduces new failure modes that single-device training does not have. Network partitions, device failures, stragglers (slow devices), and communication deadlocks can all disrupt training. Production distributed training systems must handle these failures gracefully, typically through checkpointing and automatic restart mechanisms.\n\nThe choice of distribution strategy depends on model size, data volume, hardware topology, and network bandwidth. Data parallelism is the simplest and most common approach, but larger models may require model parallelism, pipeline parallelism, or hybrid strategies. Understanding when to use each approach is a critical skill for ML systems engineers.',
    blocks: [
      {
        type: 'paragraph',
        text: 'As models grow larger and datasets expand, training on a single accelerator becomes impractical. Distributed training splits the workload across multiple devices, potentially across multiple machines, to reduce training time from weeks to hours. Understanding distributed training is essential for any engineer working with modern large-scale ML systems.',
      },
      {
        type: 'definition',
        term: 'Distributed Training',
        definition: 'The practice of splitting a model training workload across multiple accelerators (GPUs/TPUs) and potentially multiple machines, coordinating computation and communication to reduce total training time while maintaining mathematical correctness.',
      },
      {
        type: 'paragraph',
        text: 'The fundamental challenge of distributed training is maintaining the mathematical equivalence of optimization while dividing work across devices. Communication overhead between devices, synchronization strategies, and fault tolerance all add complexity that does not exist in single-device training.',
      },
      {
        type: 'callout',
        variant: 'note',
        title: 'Why Distribution Is Necessary',
        text: 'Training GPT-3 (175B parameters) on a single NVIDIA A100 GPU would take approximately 355 years. With 1,024 A100 GPUs using efficient distributed training, it takes roughly 34 days. Without distribution strategies, the largest foundation models would simply be impossible to train in any practical timeframe.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Failure Modes in Distributed Systems',
      },
      {
        type: 'paragraph',
        text: 'Distributed training introduces new failure modes that single-device training does not have. Network partitions, device failures, stragglers (slow devices), and communication deadlocks can all disrupt training. Production distributed training systems must handle these failures gracefully, typically through checkpointing and automatic restart mechanisms.',
      },
      {
        type: 'list',
        ordered: false,
        items: [
          'Network partitions — Devices lose connectivity, causing communication operations to hang or timeout.',
          'Device failures — A GPU may crash or produce incorrect results due to hardware faults.',
          'Stragglers — One slow device forces all others to wait during synchronization barriers.',
          'Communication deadlocks — Incorrect ordering of collective operations blocks all progress.',
          'Checkpoint corruption — Failed writes during checkpointing can corrupt the saved state.',
        ],
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'The Straggler Problem',
        text: 'In synchronous distributed training, all devices must wait for the slowest device before proceeding to the next step. A single device running 20% slower (due to thermal throttling, background processes, or hardware degradation) slows the entire cluster by 20%. At scale, straggler mitigation through redundant computation or asynchronous methods becomes essential.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Choosing a Distribution Strategy',
      },
      {
        type: 'table',
        headers: ['Strategy', 'When to Use', 'Key Requirement'],
        rows: [
          ['Data Parallelism', 'Model fits in one device\'s memory', 'High inter-device bandwidth for gradient sync'],
          ['Model Parallelism', 'Model too large for one device', 'Very high bandwidth (NVLink within a node)'],
          ['Pipeline Parallelism', 'Model too large, many sequential layers', 'Moderate bandwidth across nodes'],
          ['Hybrid (3D Parallelism)', 'Largest models (100B+ params)', 'Multi-level network topology awareness'],
        ],
        caption: 'Table 8.1: Choosing a distribution strategy based on model size and hardware.',
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Start Simple',
        text: 'Always start with data parallelism. It is the simplest approach and sufficient for most models. Only move to model parallelism or pipeline parallelism when the model genuinely does not fit in a single device\'s memory. Premature complexity in distribution strategy is a common source of bugs and wasted engineering effort.',
      },
    ],
    order: 0,
    keyConcepts: [
      { term: 'Distributed Training', definition: 'Training a model across multiple accelerators or machines to reduce total training time by parallelizing computation.' },
      { term: 'Straggler Problem', definition: 'The performance degradation caused by the slowest device in a distributed training setup, which forces all other devices to wait during synchronization.' },
    ],
  },
  {
    id: 'ch08-s2',
    heading: 'Data Parallelism',
    body: 'Data parallelism is the most common distributed training strategy, where each device holds a complete copy of the model and processes a different subset of the training data. After computing local gradients, devices synchronize by aggregating (typically averaging) their gradients before updating model parameters.\n\nSynchronous data parallelism uses an all-reduce operation to aggregate gradients from all devices before any device updates its parameters. This maintains mathematical equivalence with single-device training (up to floating-point precision) and is the default approach in most frameworks. The all-reduce operation can be implemented using ring all-reduce, which achieves optimal bandwidth utilization.\n\nAsynchronous data parallelism allows devices to update parameters independently without waiting for all gradients to arrive. This eliminates the synchronization bottleneck but introduces gradient staleness, where devices may use slightly outdated parameters. Asynchronous methods converge faster in wall-clock time for some problems but can be less stable and harder to reproduce.\n\nScaling data parallelism effectively requires careful attention to the relationship between batch size and learning rate. The linear scaling rule suggests increasing the learning rate proportionally to the number of devices, but this breaks down at very large batch sizes. Techniques like learning rate warmup and LARS/LAMB optimizers enable stable training with very large effective batch sizes across hundreds of devices.',
    blocks: [
      {
        type: 'paragraph',
        text: 'Data parallelism is the most common distributed training strategy, where each device holds a complete copy of the model and processes a different subset of the training data. After computing local gradients, devices synchronize by aggregating (typically averaging) their gradients before updating model parameters.',
      },
      {
        type: 'definition',
        term: 'Data Parallelism',
        definition: 'A distributed training strategy where every device maintains a complete copy of the model. The training dataset is partitioned across devices, each computes gradients on its partition, and gradients are aggregated (averaged) across all devices before updating the shared model parameters.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Synchronous Data Parallelism',
      },
      {
        type: 'paragraph',
        text: 'Synchronous data parallelism uses an all-reduce operation to aggregate gradients from all devices before any device updates its parameters. This maintains mathematical equivalence with single-device training (up to floating-point precision) and is the default approach in most frameworks. The all-reduce operation can be implemented using ring all-reduce, which achieves optimal bandwidth utilization.',
      },
      {
        type: 'equation',
        latex: 'g_{\\text{global}} = \\frac{1}{N} \\sum_{i=1}^{N} g_i',
        label: 'Equation 8.1: In synchronous data parallelism, the global gradient is the average of local gradients from N devices.',
      },
      {
        type: 'callout',
        variant: 'note',
        title: 'Ring All-Reduce',
        text: 'Ring all-reduce arranges N devices in a logical ring. Each device sends a chunk of its gradient to the next device in the ring while receiving from the previous. After 2(N-1) communication steps, all devices have the fully reduced gradient. This achieves optimal bandwidth utilization: each device sends and receives exactly 2(N-1)/N of the total gradient data, approaching the theoretical minimum as N grows.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Asynchronous Data Parallelism',
      },
      {
        type: 'paragraph',
        text: 'Asynchronous data parallelism allows devices to update parameters independently without waiting for all gradients to arrive. This eliminates the synchronization bottleneck but introduces gradient staleness, where devices may use slightly outdated parameters. Asynchronous methods converge faster in wall-clock time for some problems but can be less stable and harder to reproduce.',
      },
      {
        type: 'table',
        headers: ['Property', 'Synchronous', 'Asynchronous'],
        rows: [
          ['Mathematical equivalence', 'Preserved (up to FP precision)', 'Approximate (stale gradients)'],
          ['Straggler sensitivity', 'High (all wait for slowest)', 'Low (no synchronization barrier)'],
          ['Convergence stability', 'Deterministic', 'Less stable, harder to reproduce'],
          ['Implementation complexity', 'Moderate (all-reduce)', 'Higher (parameter servers, staleness)'],
          ['Preferred for', 'Most use cases, default choice', 'Very large clusters with heterogeneous devices'],
        ],
        caption: 'Table 8.2: Synchronous vs. asynchronous data parallelism.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Scaling: Batch Size and Learning Rate',
      },
      {
        type: 'paragraph',
        text: 'Scaling data parallelism effectively requires careful attention to the relationship between batch size and learning rate. The linear scaling rule suggests increasing the learning rate proportionally to the number of devices, but this breaks down at very large batch sizes.',
      },
      {
        type: 'equation',
        latex: '\\eta_{\\text{scaled}} = \\eta_{\\text{base}} \\times N',
        label: 'Equation 8.2: Linear scaling rule — multiply the base learning rate by the number of devices N.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Linear Scaling Breaks Down',
        text: 'The linear scaling rule works well up to a point, but beyond a critical batch size, training becomes unstable or model quality degrades. The LARS (Layer-wise Adaptive Rate Scaling) and LAMB (Layer-wise Adaptive Moments) optimizers address this by adapting learning rates per layer based on the ratio of weight norms to gradient norms, enabling stable training with batch sizes of 32K or more.',
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Learning Rate Warmup',
        text: 'When scaling to many devices, always use a learning rate warmup period. Start with a small learning rate and linearly increase it over the first few hundred or thousand steps. This prevents the large initial gradients (from randomly initialized or not-yet-adapted weights) from destabilizing training when multiplied by a large scaled learning rate.',
      },
    ],
    order: 1,
    keyConcepts: [
      { term: 'Data Parallelism', definition: 'A distributed training strategy where each device holds a full model copy and processes different data subsets, synchronizing gradients across devices.' },
      { term: 'All-Reduce', definition: 'A collective communication operation that aggregates values from all devices and distributes the result back to all devices, commonly used for gradient synchronization.' },
    ],
  },
  {
    id: 'ch08-s3',
    heading: 'Model Parallelism and Pipeline Parallelism',
    body: 'When a model is too large to fit in a single device\'s memory, model parallelism distributes different parts of the model across devices. Tensor parallelism splits individual layers across devices, while pipeline parallelism assigns different layers to different devices. Both approaches are essential for training the largest foundation models.\n\nTensor parallelism partitions weight matrices across devices and uses collective communication to combine partial results. For Transformer models, the attention and feed-forward layers can be split across devices along specific dimensions. Megatron-LM popularized efficient tensor parallelism strategies for large language models.\n\nPipeline parallelism assigns sequential groups of layers to different devices, creating a pipeline where micro-batches flow through devices in sequence. GPipe and PipeDream introduced techniques to reduce the "pipeline bubble" (idle time when devices wait for data), including micro-batch interleaving and asynchronous scheduling.\n\nIn practice, the largest models use a combination of all three parallelism strategies. A typical setup might use tensor parallelism within a node (where NVLink provides high bandwidth), pipeline parallelism across nodes, and data parallelism across groups of nodes. Frameworks like Megatron-LM, DeepSpeed, and FSDP (Fully Sharded Data Parallel) implement these hybrid strategies.',
    blocks: [
      {
        type: 'paragraph',
        text: 'When a model is too large to fit in a single device\'s memory, model parallelism distributes different parts of the model across devices. Tensor parallelism splits individual layers across devices, while pipeline parallelism assigns different layers to different devices. Both approaches are essential for training the largest foundation models.',
      },
      {
        type: 'definition',
        term: 'Model Parallelism',
        definition: 'A distributed training strategy that partitions the model itself across multiple devices, with each device responsible for a subset of the model\'s parameters and computation. Required when a model\'s memory footprint exceeds the capacity of a single accelerator.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Tensor Parallelism',
      },
      {
        type: 'paragraph',
        text: 'Tensor parallelism partitions weight matrices across devices and uses collective communication to combine partial results. For Transformer models, the attention and feed-forward layers can be split across devices along specific dimensions. Megatron-LM popularized efficient tensor parallelism strategies for large language models.',
      },
      {
        type: 'callout',
        variant: 'example',
        title: 'Tensor Parallelism in a Feed-Forward Layer',
        text: 'Consider a feed-forward layer with weight matrix W of shape [4096, 16384]. With 4-way tensor parallelism, W is split column-wise into four shards of shape [4096, 4096], one per device. Each device computes its partial output Y_i = X * W_i, then an all-reduce sums the partial results. This distributes both memory and computation evenly.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Pipeline Parallelism',
      },
      {
        type: 'paragraph',
        text: 'Pipeline parallelism assigns sequential groups of layers to different devices, creating a pipeline where micro-batches flow through devices in sequence. GPipe and PipeDream introduced techniques to reduce the "pipeline bubble" (idle time when devices wait for data), including micro-batch interleaving and asynchronous scheduling.',
      },
      {
        type: 'definition',
        term: 'Pipeline Bubble',
        definition: 'The idle time at the beginning and end of a pipeline parallel training step when some devices have no micro-batch to process. The bubble fraction decreases as the number of micro-batches increases relative to the number of pipeline stages.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Pipeline Bubble Overhead',
        text: 'With P pipeline stages and M micro-batches, the bubble fraction is approximately (P-1)/M. For 4 stages and 4 micro-batches, 75% of the pipeline is wasted in the bubble. Increasing to 32 micro-batches reduces the bubble to under 10%. Always use many more micro-batches than pipeline stages to maintain high device utilization.',
      },
      {
        type: 'equation',
        latex: '\\text{Bubble fraction} \\approx \\frac{P - 1}{M}',
        label: 'Equation 8.3: Pipeline bubble overhead decreases with more micro-batches (M) relative to pipeline stages (P).',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Hybrid (3D) Parallelism',
      },
      {
        type: 'paragraph',
        text: 'In practice, the largest models use a combination of all three parallelism strategies. A typical setup might use tensor parallelism within a node (where NVLink provides high bandwidth), pipeline parallelism across nodes, and data parallelism across groups of nodes.',
      },
      {
        type: 'table',
        headers: ['Framework', 'Parallelism Support', 'Notable Features'],
        rows: [
          ['Megatron-LM', 'Tensor + Pipeline + Data', 'NVIDIA\'s reference for large language model training'],
          ['DeepSpeed (ZeRO)', 'Data + Pipeline (ZeRO-3)', 'Memory-efficient optimizer state sharding'],
          ['FSDP (PyTorch)', 'Sharded Data Parallel', 'Native PyTorch, shards params/grads/optimizer states'],
          ['Alpa', 'Automated Tensor + Pipeline', 'Automatic parallelism strategy search via ILP'],
        ],
        caption: 'Table 8.3: Major frameworks for hybrid parallelism.',
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Matching Parallelism to Topology',
        text: 'Use tensor parallelism within a single node where NVLink provides 600+ GB/s bandwidth. Use pipeline parallelism across nodes connected by InfiniBand (100-400 Gb/s). Use data parallelism across groups of nodes. This hierarchical mapping minimizes communication over the slowest links.',
      },
    ],
    order: 2,
    keyConcepts: [
      { term: 'Model Parallelism', definition: 'A strategy that distributes different parts of a model across devices, enabling training of models that exceed single-device memory capacity.' },
      { term: 'Pipeline Parallelism', definition: 'A form of model parallelism that assigns sequential groups of layers to different devices, processing micro-batches in a pipeline fashion.' },
    ],
  },
  {
    id: 'ch08-s4',
    heading: 'Mixed Precision Training',
    body: 'Mixed precision training uses lower-precision number formats (typically FP16 or BF16) for most computations while maintaining FP32 for critical operations. This approach can nearly double training throughput on modern GPUs with tensor cores while using significantly less memory.\n\nThe key technique is maintaining a FP32 master copy of weights while performing forward and backward passes in half precision. Gradients are computed in FP16/BF16 and then cast to FP32 for the weight update. This preserves the precision of the update step, which is most sensitive to numerical errors.\n\nLoss scaling is essential for FP16 training to prevent gradient underflow. Small gradient values that are representable in FP32 may round to zero in FP16. Loss scaling multiplies the loss by a large factor before backpropagation (scaling up gradients) and then divides the gradients after the backward pass. Dynamic loss scaling automatically adjusts the scale factor during training.\n\nBFloat16 (BF16), developed for Google\'s TPUs and now supported on NVIDIA Ampere and newer GPUs, uses the same exponent range as FP32 but with reduced mantissa precision. This eliminates the need for loss scaling because BF16 can represent the same range of values as FP32. BF16 is increasingly preferred over FP16 for training due to this simplicity, though FP16 remains important for inference on older hardware.',
    blocks: [
      {
        type: 'paragraph',
        text: 'Mixed precision training uses lower-precision number formats (typically FP16 or BF16) for most computations while maintaining FP32 for critical operations. This approach can nearly double training throughput on modern GPUs with tensor cores while using significantly less memory.',
      },
      {
        type: 'definition',
        term: 'Mixed Precision Training',
        definition: 'A training technique that uses lower-precision floating-point formats (FP16 or BF16) for the computationally intensive forward and backward passes while retaining FP32 precision for the weight update step. This yields up to 2x throughput improvement with minimal accuracy loss.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'The Mixed Precision Recipe',
      },
      {
        type: 'paragraph',
        text: 'The key technique is maintaining a FP32 master copy of weights while performing forward and backward passes in half precision. Gradients are computed in FP16/BF16 and then cast to FP32 for the weight update. This preserves the precision of the update step, which is most sensitive to numerical errors.',
      },
      {
        type: 'list',
        ordered: true,
        items: [
          'Maintain FP32 master weights (the "source of truth" for parameters).',
          'Cast weights to FP16/BF16 for the forward pass.',
          'Compute loss and backward pass in FP16/BF16.',
          'Cast gradients back to FP32.',
          'Update FP32 master weights using the FP32 gradients.',
        ],
      },
      {
        type: 'callout',
        variant: 'note',
        title: 'Why FP32 Master Weights?',
        text: 'Weight updates are typically tiny (learning rate * gradient, e.g., 1e-4 * 1e-3 = 1e-7). In FP16, values smaller than ~6e-8 round to zero, meaning many weight updates would be silently lost. By accumulating updates in FP32 (minimum representable: ~1.4e-45), no update is lost. The FP32 master weights are the true parameters; the FP16 copies are just for fast computation.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Loss Scaling for FP16',
      },
      {
        type: 'paragraph',
        text: 'Loss scaling is essential for FP16 training to prevent gradient underflow. Small gradient values that are representable in FP32 may round to zero in FP16. Loss scaling multiplies the loss by a large factor before backpropagation (scaling up gradients) and then divides the gradients after the backward pass. Dynamic loss scaling automatically adjusts the scale factor during training.',
      },
      {
        type: 'equation',
        latex: '\\hat{L} = s \\cdot L, \\quad \\hat{g} = \\frac{1}{s} \\nabla_{\\theta} \\hat{L}',
        label: 'Equation 8.4: Loss scaling multiplies loss by scale s before backprop, then divides gradients by s to recover true values.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'BFloat16: The Simpler Alternative',
      },
      {
        type: 'paragraph',
        text: 'BFloat16 (BF16), developed for Google\'s TPUs and now supported on NVIDIA Ampere and newer GPUs, uses the same exponent range as FP32 but with reduced mantissa precision. This eliminates the need for loss scaling because BF16 can represent the same range of values as FP32.',
      },
      {
        type: 'table',
        headers: ['Format', 'Sign Bits', 'Exponent Bits', 'Mantissa Bits', 'Range', 'Loss Scaling Needed'],
        rows: [
          ['FP32', '1', '8', '23', '~1.4e-45 to ~3.4e38', 'No'],
          ['FP16', '1', '5', '10', '~6e-8 to 65504', 'Yes'],
          ['BF16', '1', '8', '7', '~1.4e-45 to ~3.4e38', 'No'],
          ['FP8 (E4M3)', '1', '4', '3', '~0.015 to 448', 'Yes'],
        ],
        caption: 'Table 8.4: Comparison of floating-point formats used in ML training.',
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Prefer BF16 When Available',
        text: 'If your hardware supports BF16 (NVIDIA Ampere/Hopper GPUs or Google TPUs), prefer BF16 over FP16 for training. BF16 eliminates the need for loss scaling, simplifying the training pipeline and reducing a common source of training instability. Reserve FP16 for inference on older hardware that lacks BF16 support.',
      },
      {
        type: 'code',
        language: 'python',
        code: '# PyTorch automatic mixed precision (AMP)\nscaler = torch.cuda.amp.GradScaler()  # Only needed for FP16\n\nfor batch in dataloader:\n    optimizer.zero_grad()\n    with torch.cuda.amp.autocast(dtype=torch.bfloat16):\n        output = model(batch)\n        loss = loss_fn(output, targets)\n    # With BF16, no scaler needed:\n    loss.backward()\n    optimizer.step()',
        caption: 'PyTorch AMP with BF16 is simpler than FP16 because no gradient scaler is required.',
      },
    ],
    order: 3,
    keyConcepts: [
      { term: 'Mixed Precision Training', definition: 'A technique that uses lower-precision formats (FP16/BF16) for most computation while maintaining FP32 for numerically sensitive operations, improving speed and reducing memory.' },
      { term: 'Loss Scaling', definition: 'A technique used in FP16 training that scales the loss value up before backpropagation to prevent small gradients from underflowing to zero.' },
    ],
  },
  {
    id: 'ch08-s5',
    heading: 'Gradient Management and Communication',
    body: 'Efficient gradient communication is often the bottleneck in distributed training. For a model with billions of parameters, each gradient synchronization step must transfer gigabytes of data across the network. Optimizing this communication is essential for achieving good scaling efficiency.\n\nGradient compression reduces communication volume by transmitting approximate gradients. Techniques include gradient quantization (reducing precision of transmitted gradients), sparsification (transmitting only the largest gradients), and error feedback (accumulating compression error for future correction). These methods can reduce communication by 10-100x with minimal impact on convergence.\n\nGradient accumulation is a practical technique for simulating larger batch sizes without additional devices. Instead of synchronizing gradients after every micro-batch, gradients are accumulated locally over multiple micro-batches before synchronization. This reduces communication frequency and allows training with effectively larger batch sizes on limited hardware.\n\nOverlapping computation with communication is critical for hiding communication latency. By starting gradient communication for earlier layers while later layers are still computing, the communication overhead can be partially or fully masked. Modern frameworks implement this through bucket-based gradient reduction, where gradients are grouped into buckets that are communicated as soon as all gradients in the bucket are available.',
    blocks: [
      {
        type: 'paragraph',
        text: 'Efficient gradient communication is often the bottleneck in distributed training. For a model with billions of parameters, each gradient synchronization step must transfer gigabytes of data across the network. Optimizing this communication is essential for achieving good scaling efficiency.',
      },
      {
        type: 'callout',
        variant: 'note',
        title: 'The Communication Bottleneck',
        text: 'A model with 7 billion FP32 parameters requires transferring 28 GB of gradient data per synchronization step. On a 100 Gbps InfiniBand network, this alone takes ~2.2 seconds per step — potentially exceeding the computation time. At 175B parameters, the problem becomes 25x worse. Communication optimization is not optional at scale; it is the primary engineering challenge.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Gradient Compression',
      },
      {
        type: 'paragraph',
        text: 'Gradient compression reduces communication volume by transmitting approximate gradients. Techniques include gradient quantization (reducing precision of transmitted gradients), sparsification (transmitting only the largest gradients), and error feedback (accumulating compression error for future correction). These methods can reduce communication by 10-100x with minimal impact on convergence.',
      },
      {
        type: 'definition',
        term: 'Gradient Sparsification',
        definition: 'A compression technique that transmits only the top-k largest gradient values (by magnitude), typically 0.1-1% of the total. The remaining small gradients are accumulated locally in an error feedback buffer and added to the next step\'s gradients, ensuring no gradient information is permanently lost.',
      },
      {
        type: 'table',
        headers: ['Technique', 'Compression Ratio', 'Convergence Impact', 'Complexity'],
        rows: [
          ['Gradient Quantization (1-bit)', '32x', 'Minimal with error feedback', 'Low'],
          ['Top-k Sparsification (0.1%)', '1000x', 'Minimal with error feedback', 'Moderate'],
          ['Random Sparsification', '10-100x', 'Moderate, needs larger learning rate', 'Low'],
          ['PowerSGD (low-rank)', '10-100x', 'Minimal', 'Moderate'],
        ],
        caption: 'Table 8.5: Gradient compression techniques and their trade-offs.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Gradient Accumulation',
      },
      {
        type: 'paragraph',
        text: 'Gradient accumulation is a practical technique for simulating larger batch sizes without additional devices. Instead of synchronizing gradients after every micro-batch, gradients are accumulated locally over multiple micro-batches before synchronization. This reduces communication frequency and allows training with effectively larger batch sizes on limited hardware.',
      },
      {
        type: 'code',
        language: 'python',
        code: '# Gradient accumulation: simulate batch_size * accum_steps\naccum_steps = 4\nfor i, batch in enumerate(dataloader):\n    loss = model(batch) / accum_steps  # Scale loss\n    loss.backward()                     # Accumulate gradients\n    if (i + 1) % accum_steps == 0:\n        optimizer.step()                # Update after N steps\n        optimizer.zero_grad()           # Reset gradients',
        caption: 'Gradient accumulation divides the loss by the number of accumulation steps to maintain correct gradient magnitude.',
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Gradient Accumulation as a Budget Strategy',
        text: 'If you cannot afford many GPUs, gradient accumulation lets you simulate large-batch training on limited hardware. For example, 4 GPUs with 8 accumulation steps gives an effective batch size equivalent to 32 GPUs — at the cost of 8x longer wall-clock time per step but with the same convergence behavior.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Overlapping Communication and Computation',
      },
      {
        type: 'paragraph',
        text: 'Overlapping computation with communication is critical for hiding communication latency. By starting gradient communication for earlier layers while later layers are still computing, the communication overhead can be partially or fully masked. Modern frameworks implement this through bucket-based gradient reduction, where gradients are grouped into buckets that are communicated as soon as all gradients in the bucket are available.',
      },
      {
        type: 'callout',
        variant: 'example',
        title: 'Bucket-Based Gradient Reduction',
        text: 'PyTorch DDP groups gradients into 25 MB buckets by default. As the backward pass progresses from the last layer toward the first, each bucket triggers an all-reduce as soon as all its gradients are computed. While the network transfers bucket N, the GPU continues computing gradients for bucket N+1. With well-tuned bucket sizes, communication can be almost entirely hidden behind computation.',
      },
    ],
    order: 4,
    keyConcepts: [
      { term: 'Gradient Compression', definition: 'Techniques that reduce the volume of gradient data communicated between devices during distributed training, including quantization and sparsification.' },
      { term: 'Gradient Accumulation', definition: 'A technique that sums gradients over multiple micro-batches before performing a weight update, effectively simulating larger batch sizes.' },
    ],
  },
];

export const glossary: GlossaryTerm[] = [
  { term: 'Data Parallelism', definition: 'Distributing training data across devices, each holding a complete model copy, and synchronizing gradients after each step.' },
  { term: 'Model Parallelism', definition: 'Distributing different parts of a model across devices to handle models that exceed single-device memory.' },
  { term: 'Mixed Precision', definition: 'Using lower-precision number formats for most computations while maintaining higher precision for sensitive operations.' },
  { term: 'All-Reduce', definition: 'A collective communication primitive that aggregates data from all devices and distributes the result back.' },
  { term: 'FSDP', definition: 'Fully Sharded Data Parallel, a PyTorch strategy that shards model parameters, gradients, and optimizer states across devices.' },
  { term: 'DeepSpeed', definition: 'A Microsoft optimization library for distributed training that provides ZeRO optimizer states sharding and other efficiency techniques.' },
  { term: 'BFloat16', definition: 'A 16-bit floating-point format with the same exponent range as FP32, enabling mixed precision training without loss scaling.' },
];

export const keyTakeaways: string[] = [
  'Data parallelism is the simplest and most common distributed training approach, but model parallelism is essential for the largest models.',
  'Mixed precision training can nearly double throughput and halve memory usage with minimal impact on model quality.',
  'The linear scaling rule for learning rate breaks down at very large batch sizes, requiring warmup and specialized optimizers.',
  'Gradient communication is often the bottleneck in distributed training, motivating compression and overlap techniques.',
  'Production training systems combine data, tensor, and pipeline parallelism in hybrid configurations matched to hardware topology.',
];
