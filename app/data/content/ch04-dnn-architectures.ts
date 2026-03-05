import type { ChapterSection, GlossaryTerm } from '~/types/chapter';

export const sections: ChapterSection[] = [
  {
    id: 'ch04-s1',
    heading: 'Convolutional Neural Networks (CNNs)',
    body: 'Convolutional Neural Networks exploit spatial structure in data by applying learned filters that slide across the input. This weight-sharing mechanism dramatically reduces the number of parameters compared to fully connected layers, making CNNs both more efficient and more effective for grid-structured data like images, audio spectrograms, and time series.\n\nThe core building blocks of CNNs are convolutional layers, pooling layers, and fully connected layers. Convolutional layers apply filters that detect local patterns like edges and textures. Pooling layers reduce spatial dimensions, providing translation invariance and reducing computation. The hierarchical stacking of these layers enables progressively more abstract feature extraction.\n\nFrom a systems perspective, CNNs have predictable and regular memory access patterns, which makes them well-suited for GPU acceleration. The convolution operation can be implemented as matrix multiplication (im2col) or using specialized algorithms like Winograd or FFT-based convolution, each with different performance characteristics depending on filter size and input dimensions.\n\nArchitectural innovations like ResNets introduced skip connections that enable training of very deep networks (100+ layers) by providing gradient shortcuts. MobileNets introduced depthwise separable convolutions that factorize standard convolutions into cheaper operations, reducing computation by 8-9x with minimal accuracy loss. These efficiency-focused architectures are particularly important for edge deployment.',
    blocks: [
      {
        type: 'paragraph',
        text: 'Convolutional Neural Networks exploit spatial structure in data by applying learned filters that slide across the input. This weight-sharing mechanism dramatically reduces the number of parameters compared to fully connected layers, making CNNs both more efficient and more effective for grid-structured data like images, audio spectrograms, and time series.',
      },
      {
        type: 'definition',
        term: 'Convolution',
        definition: 'A mathematical operation that slides a learned filter (kernel) across input data, computing a dot product at each position. In CNNs, convolutions detect local patterns while sharing weights across all spatial positions, dramatically reducing parameter count compared to fully connected layers.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Core Building Blocks',
      },
      {
        type: 'paragraph',
        text: 'The core building blocks of CNNs are convolutional layers, pooling layers, and fully connected layers. Convolutional layers apply filters that detect local patterns like edges and textures. Pooling layers reduce spatial dimensions, providing translation invariance and reducing computation.',
      },
      {
        type: 'list',
        ordered: false,
        items: [
          'Convolutional layers — Apply learned filters to detect local patterns (edges, textures, shapes)',
          'Pooling layers — Reduce spatial dimensions via max or average pooling, providing translation invariance',
          'Batch normalization — Normalizes activations between layers, stabilizing and accelerating training',
          'Fully connected layers — Combine high-level features for final classification or regression',
        ],
      },
      {
        type: 'heading',
        level: 3,
        text: 'Systems Performance of CNNs',
      },
      {
        type: 'paragraph',
        text: 'From a systems perspective, CNNs have predictable and regular memory access patterns, which makes them well-suited for GPU acceleration. The convolution operation can be implemented using several algorithms with different performance trade-offs.',
      },
      {
        type: 'table',
        headers: ['Algorithm', 'Approach', 'Best For', 'Trade-off'],
        rows: [
          ['im2col + GEMM', 'Convert convolution to matrix multiplication', 'General purpose', 'Extra memory for unrolled matrix'],
          ['Winograd', 'Reduce multiplications via transform', 'Small filters (3x3)', 'Numerical precision loss'],
          ['FFT-based', 'Convolution via frequency domain', 'Large filters', 'Memory overhead, padding'],
          ['Direct', 'Naive nested loop implementation', 'Small inputs, debugging', 'Slow on large inputs'],
        ],
        caption: 'Table 4.1: Convolution implementation strategies and their trade-offs.',
      },
      {
        type: 'callout',
        variant: 'note',
        title: 'cuDNN Auto-Tuning',
        text: 'NVIDIA\'s cuDNN library automatically benchmarks multiple convolution algorithms for each layer configuration and selects the fastest one. Setting torch.backends.cudnn.benchmark = True enables this auto-tuning, which can yield 10-30% speedups when input sizes are fixed across iterations.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Key Architectural Innovations',
      },
      {
        type: 'paragraph',
        text: 'Architectural innovations like ResNets introduced skip connections that enable training of very deep networks (100+ layers) by providing gradient shortcuts. MobileNets introduced depthwise separable convolutions that factorize standard convolutions into cheaper operations, reducing computation by 8-9x with minimal accuracy loss.',
      },
      {
        type: 'definition',
        term: 'Depthwise Separable Convolution',
        definition: 'A factorization of standard convolution into two steps: a depthwise convolution (one filter per input channel) and a pointwise 1x1 convolution (mixing channels). This reduces computation by a factor of roughly k^2 where k is the kernel size, with minimal accuracy loss.',
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Choosing a CNN Architecture',
        text: 'For cloud deployment where accuracy is paramount, use ResNet-50 or EfficientNet-B4 as strong baselines. For mobile deployment, start with MobileNetV3 or EfficientNet-Lite. For edge/TinyML, use MobileNetV2 with aggressive quantization. Always benchmark against your latency budget before adding complexity.',
      },
      {
        type: 'callout',
        variant: 'example',
        title: 'ResNet Skip Connections',
        text: 'In a ResNet block, the input x is added to the output of two convolutional layers: y = F(x) + x. This simple addition provides a gradient highway that allows training of networks with 152+ layers. Without skip connections, networks deeper than ~20 layers suffer from degradation where adding more layers actually increases training error.',
      },
    ],
    order: 0,
    keyConcepts: [
      { term: 'Convolution', definition: 'A mathematical operation that slides a learned filter across input data, detecting local patterns while sharing weights across spatial positions.' },
      { term: 'Depthwise Separable Convolution', definition: 'A factorization of standard convolution into depthwise and pointwise operations that dramatically reduces computation and parameters.' },
    ],
  },
  {
    id: 'ch04-s2',
    heading: 'Recurrent Neural Networks (RNNs)',
    body: 'Recurrent Neural Networks process sequential data by maintaining a hidden state that captures information from previous time steps. At each step, the RNN updates its hidden state based on the current input and the previous state, creating a form of memory that enables processing of variable-length sequences.\n\nVanilla RNNs suffer from the vanishing and exploding gradient problems, which make it difficult to learn long-range dependencies. Long Short-Term Memory (LSTM) networks address this through a gating mechanism with forget, input, and output gates that control information flow. Gated Recurrent Units (GRUs) provide a simpler alternative with fewer parameters and comparable performance.\n\nThe sequential nature of RNNs creates significant systems challenges. Because each time step depends on the previous output, RNN computation cannot be easily parallelized across the sequence dimension. This fundamentally limits throughput on parallel hardware like GPUs, which is a major motivation for the shift toward Transformer architectures.\n\nDespite their limitations, RNNs remain relevant for certain applications, particularly in resource-constrained environments. Their per-step memory footprint is constant regardless of sequence length, which can be advantageous for streaming applications on edge devices. Additionally, recent work on linear RNNs and state-space models has renewed interest in recurrent architectures with improved parallelism.',
    blocks: [
      {
        type: 'paragraph',
        text: 'Recurrent Neural Networks process sequential data by maintaining a hidden state that captures information from previous time steps. At each step, the RNN updates its hidden state based on the current input and the previous state, creating a form of memory that enables processing of variable-length sequences.',
      },
      {
        type: 'definition',
        term: 'Hidden State',
        definition: 'The internal memory vector of a recurrent network that is updated at each time step based on the current input and the previous hidden state. It encodes a compressed summary of the sequence processed so far and serves as the network\'s working memory.',
      },
      {
        type: 'equation',
        latex: '\\mathbf{h}_t = \\tanh(\\mathbf{W}_{hh}\\mathbf{h}_{t-1} + \\mathbf{W}_{xh}\\mathbf{x}_t + \\mathbf{b})',
        label: 'Equation 4.1: Vanilla RNN update rule. The hidden state h_t depends on both the previous hidden state h_{t-1} and current input x_t.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'LSTM and GRU: Gated Recurrence',
      },
      {
        type: 'paragraph',
        text: 'Vanilla RNNs suffer from the vanishing and exploding gradient problems, which make it difficult to learn long-range dependencies. Long Short-Term Memory (LSTM) networks address this through a gating mechanism that controls information flow.',
      },
      {
        type: 'definition',
        term: 'LSTM',
        definition: 'Long Short-Term Memory network, a gated RNN variant that uses three gates (forget, input, output) and a cell state to learn long-range dependencies. The gates learn which information to retain, add, or output at each time step, mitigating the vanishing gradient problem.',
      },
      {
        type: 'table',
        headers: ['Architecture', 'Parameters (per layer)', 'Gates', 'Long-Range Memory', 'Training Speed'],
        rows: [
          ['Vanilla RNN', '~n^2 (small)', 'None', 'Poor (vanishing gradients)', 'Fast per step'],
          ['LSTM', '~4n^2', 'Forget, Input, Output', 'Good (cell state highway)', 'Slower per step'],
          ['GRU', '~3n^2', 'Reset, Update', 'Good (comparable to LSTM)', 'Faster than LSTM'],
        ],
        caption: 'Table 4.2: Comparison of recurrent architectures where n is the hidden size.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'The Parallelism Problem',
      },
      {
        type: 'paragraph',
        text: 'The sequential nature of RNNs creates significant systems challenges. Because each time step depends on the previous output, RNN computation cannot be easily parallelized across the sequence dimension. This fundamentally limits throughput on parallel hardware like GPUs.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Sequential Bottleneck',
        text: 'An RNN processing a sequence of length T must perform T sequential steps, regardless of how many GPU cores are available. A Transformer processes all T positions in parallel. For a sequence of 1000 tokens on a modern GPU with thousands of cores, this sequential bottleneck means RNNs may be 10-100x slower than Transformers for training, even though each individual step is cheaper.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Continued Relevance',
      },
      {
        type: 'paragraph',
        text: 'Despite their limitations, RNNs remain relevant for certain applications, particularly in resource-constrained environments. Their per-step memory footprint is constant regardless of sequence length, which can be advantageous for streaming applications on edge devices.',
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'When RNNs Still Win',
        text: 'Consider RNNs for (1) streaming applications where data arrives one token at a time and you need constant-memory processing, (2) edge devices where the O(n^2) memory of Transformers is prohibitive, and (3) online learning scenarios where the model must continuously adapt. State-space models like Mamba offer a modern take on recurrence with improved parallelism during training.',
      },
      {
        type: 'callout',
        variant: 'note',
        title: 'The Return of Recurrence',
        text: 'Recent work on linear RNNs and state-space models (S4, Mamba) has renewed interest in recurrent architectures. These models achieve linear-time complexity during inference while being parallelizable during training, potentially combining the best of both recurrent and attention-based approaches.',
      },
    ],
    order: 1,
    keyConcepts: [
      { term: 'LSTM', definition: 'Long Short-Term Memory, a gated RNN variant that uses forget, input, and output gates to learn long-range dependencies in sequential data.' },
      { term: 'Hidden State', definition: 'The internal memory vector of a recurrent network that is updated at each time step, encoding information about the sequence processed so far.' },
    ],
  },
  {
    id: 'ch04-s3',
    heading: 'Transformers and Attention',
    body: 'The Transformer architecture, introduced in the "Attention Is All You Need" paper, has revolutionized deep learning by replacing recurrence with self-attention. Self-attention computes relationships between all positions in a sequence simultaneously, enabling rich contextual representations and full parallelism during training.\n\nThe core mechanism is scaled dot-product attention: queries, keys, and values are computed from the input, and attention weights are determined by the compatibility between queries and keys. Multi-head attention extends this by running multiple attention operations in parallel, allowing the model to attend to information from different representation subspaces.\n\nFrom a systems perspective, the self-attention mechanism has O(n^2) computational and memory complexity with respect to sequence length. This quadratic scaling is the primary bottleneck for processing long sequences and has motivated extensive research into efficient attention variants. Linear attention, sparse attention, and sliding window attention reduce this cost while preserving most of the modeling capacity.\n\nTransformers have become the dominant architecture across natural language processing, computer vision (Vision Transformers), and multimodal learning. Their uniform structure makes them particularly amenable to hardware optimization: the attention and feed-forward layers are composed of large matrix multiplications that map efficiently onto GPU tensor cores. This hardware compatibility, combined with strong scaling properties, has driven the trend toward ever-larger Transformer models.',
    blocks: [
      {
        type: 'paragraph',
        text: 'The Transformer architecture, introduced in the "Attention Is All You Need" paper (Vaswani et al., 2017), has revolutionized deep learning by replacing recurrence with self-attention. Self-attention computes relationships between all positions in a sequence simultaneously, enabling rich contextual representations and full parallelism during training.',
      },
      {
        type: 'quote',
        text: 'Attention Is All You Need.',
        attribution: 'Vaswani et al., NeurIPS 2017 — the paper that introduced the Transformer architecture',
      },
      {
        type: 'aha',
        highlight: '"Attention Is All You Need" — removing recurrence enabled massive parallelization',
        explanation: 'The Transformer\'s key insight was that recurrence (processing tokens one at a time) was not necessary for sequence modeling. By replacing it with self-attention, every token can attend to every other token in parallel. This single architectural change unlocked the ability to train on massive datasets using thousands of GPUs simultaneously, directly enabling the scaling revolution from BERT to GPT-4.',
        analogy: 'Imagine reading a book one word at a time (RNN) versus being able to see the entire page at once and draw connections between any words simultaneously (Transformer). The parallel "seeing everything at once" approach is what makes Transformers so fast to train.',
      },
      {
        type: 'definition',
        term: 'Self-Attention',
        definition: 'A mechanism that computes weighted relationships between all positions in a sequence simultaneously. Each element computes a query (what am I looking for?), key (what do I contain?), and value (what information do I provide?), enabling rich contextual representations.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Scaled Dot-Product Attention',
      },
      {
        type: 'equation',
        latex: '\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V',
        label: 'Equation 4.2: Scaled dot-product attention. Queries Q and keys K are multiplied and scaled by sqrt(d_k) to prevent softmax saturation, then applied to values V.',
      },
      {
        type: 'paragraph',
        text: 'The core mechanism is scaled dot-product attention: queries, keys, and values are computed from the input, and attention weights are determined by the compatibility between queries and keys. Multi-head attention extends this by running multiple attention operations in parallel, allowing the model to attend to information from different representation subspaces.',
      },
      {
        type: 'figure',
        src: '',
        alt: 'Detailed diagram of the Transformer architecture showing the encoder-decoder structure, multi-head attention mechanism, positional encoding, feed-forward networks, and residual connections with layer normalization.',
        caption: 'Figure 4.1: The Transformer Architecture',
        component: 'TransformerArchitecture',
      },
      {
        type: 'callout',
        variant: 'note',
        title: 'Why Scale by sqrt(d_k)?',
        text: 'Without scaling, the dot products between queries and keys grow in magnitude with the dimension d_k, pushing the softmax into regions with extremely small gradients. Dividing by sqrt(d_k) keeps the variance of the dot products at 1 regardless of dimension, ensuring stable training dynamics.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'The Quadratic Scaling Challenge',
      },
      {
        type: 'paragraph',
        text: 'From a systems perspective, the self-attention mechanism has O(n^2) computational and memory complexity with respect to sequence length n. This quadratic scaling is the primary bottleneck for processing long sequences.',
      },
      {
        type: 'table',
        headers: ['Attention Variant', 'Complexity', 'Approach', 'Trade-off'],
        rows: [
          ['Full attention', 'O(n^2)', 'All pairs computed', 'Best quality, highest cost'],
          ['Sparse attention', 'O(n * sqrt(n))', 'Attend to fixed patterns', 'Misses some long-range dependencies'],
          ['Linear attention', 'O(n)', 'Kernel approximation of softmax', 'Quality degradation on some tasks'],
          ['Sliding window', 'O(n * w)', 'Local window of size w', 'Loses global context beyond window'],
          ['Flash Attention', 'O(n^2) compute, O(n) memory', 'IO-aware tiling', 'Exact attention with reduced memory'],
        ],
        caption: 'Table 4.3: Efficient attention variants and their complexity-quality trade-offs.',
      },
      {
        type: 'inline-check',
        question: 'Why does self-attention scale quadratically with sequence length?',
        options: ['Because attention matrices are n\u00D7n', 'Due to gradient vanishing', 'Because of batch normalization', 'Due to weight sharing'],
        correctIndex: 0,
        explanation: 'Self-attention computes the product Q\u00B7K^T, where Q and K each have n rows (one per token in the sequence). The resulting attention matrix is n\u00D7n, meaning every token computes a compatibility score with every other token. This produces n\u00B2 entries that must be computed and stored, giving O(n\u00B2) time and memory complexity.',
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Flash Attention is Usually the Right Choice',
        text: 'Flash Attention (Dao et al., 2022) computes exact self-attention with O(n) memory instead of O(n^2) by using tiled computation that is aware of the GPU memory hierarchy. It does not change the math — it changes how the computation is scheduled on hardware. Always use Flash Attention when available; it is strictly better than naive attention.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Universal Dominance',
      },
      {
        type: 'paragraph',
        text: 'Transformers have become the dominant architecture across natural language processing, computer vision (Vision Transformers), and multimodal learning. Their uniform structure makes them particularly amenable to hardware optimization: the attention and feed-forward layers are composed of large matrix multiplications that map efficiently onto GPU tensor cores.',
      },
      {
        type: 'stat',
        value: 175,
        suffix: 'B',
        label: 'Parameters in GPT-3, one of the largest dense transformer models',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Scaling Is Not Free',
        text: 'The trend toward ever-larger Transformer models relies on the empirical observation that bigger models trained on more data perform better. However, training GPT-3 (175B parameters) required an estimated $4.6 million in compute, and GPT-4 likely cost over $100 million. The environmental and financial costs of scaling must be weighed against the diminishing marginal returns at extreme scale.',
      },
    ],
    order: 2,
    keyConcepts: [
      { term: 'Self-Attention', definition: 'A mechanism that computes weighted relationships between all positions in a sequence, enabling each element to attend to all other elements simultaneously.' },
      { term: 'Multi-Head Attention', definition: 'An extension of self-attention that runs multiple attention operations in parallel, each learning different relationship patterns in different subspaces.' },
    ],
  },
  {
    id: 'ch04-s4',
    heading: 'Neural Architecture Search (NAS)',
    body: 'Neural Architecture Search automates the design of neural network architectures by searching over a defined space of possible designs. Rather than relying on human intuition and manual experimentation, NAS uses optimization algorithms to discover architectures that are optimized for specific objectives like accuracy, latency, or model size.\n\nEarly NAS methods used reinforcement learning or evolutionary algorithms to search over discrete architecture spaces, requiring thousands of GPU hours per search. Modern approaches like differentiable NAS (DARTS) relax the discrete search space to be continuous, enabling gradient-based optimization that is orders of magnitude more efficient.\n\nHardware-aware NAS incorporates hardware constraints directly into the search objective. Rather than finding the most accurate architecture and then compressing it, hardware-aware NAS discovers architectures that are inherently efficient on the target platform. This approach has produced architectures like EfficientNet and MNASNet that achieve better accuracy-efficiency trade-offs than hand-designed models.\n\nFrom a systems engineering perspective, NAS raises important questions about the cost of architecture search versus the benefit of the discovered architecture. A search that requires 1000 GPU hours to find an architecture that saves 10% inference cost only pays for itself at sufficient deployment scale. Practitioners must weigh NAS costs against the expected lifetime benefits of improved architecture efficiency.',
    blocks: [
      {
        type: 'paragraph',
        text: 'Neural Architecture Search automates the design of neural network architectures by searching over a defined space of possible designs. Rather than relying on human intuition and manual experimentation, NAS uses optimization algorithms to discover architectures that are optimized for specific objectives like accuracy, latency, or model size.',
      },
      {
        type: 'definition',
        term: 'Neural Architecture Search (NAS)',
        definition: 'Automated methods for discovering optimal neural network architectures by algorithmically searching over a defined space of possible layer types, connections, and hyperparameters. NAS can optimize for multiple objectives simultaneously, such as accuracy and inference latency.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Evolution of NAS Methods',
      },
      {
        type: 'paragraph',
        text: 'Early NAS methods used reinforcement learning or evolutionary algorithms to search over discrete architecture spaces, requiring thousands of GPU hours per search. Modern approaches like differentiable NAS (DARTS) relax the discrete search space to be continuous, enabling gradient-based optimization that is orders of magnitude more efficient.',
      },
      {
        type: 'table',
        headers: ['NAS Method', 'Search Strategy', 'GPU Hours', 'Key Innovation'],
        rows: [
          ['NASNet (2017)', 'Reinforcement learning', '~48,000', 'First large-scale NAS success'],
          ['AmoebaNet (2018)', 'Evolutionary algorithms', '~3,150', 'Tournament selection over architectures'],
          ['DARTS (2019)', 'Gradient-based (differentiable)', '~4', 'Continuous relaxation of search space'],
          ['Once-for-All (2020)', 'Progressive shrinking', '~40', 'Train one supernetwork, extract subnets'],
        ],
        caption: 'Table 4.4: Evolution of NAS efficiency, from thousands of GPU hours to single-digit hours.',
      },
      {
        type: 'callout',
        variant: 'note',
        title: 'The Efficiency Revolution',
        text: 'The cost of NAS has dropped by four orders of magnitude in just a few years: from 48,000 GPU hours (NASNet) to about 4 GPU hours (DARTS). This makes NAS accessible to teams without massive compute budgets and opens the door to task-specific and hardware-specific architecture optimization.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Hardware-Aware NAS',
      },
      {
        type: 'paragraph',
        text: 'Hardware-aware NAS incorporates hardware constraints directly into the search objective. Rather than finding the most accurate architecture and then compressing it, hardware-aware NAS discovers architectures that are inherently efficient on the target platform.',
      },
      {
        type: 'definition',
        term: 'Hardware-Aware NAS',
        definition: 'NAS methods that incorporate hardware performance metrics (latency, energy, memory) directly into the search objective function. The search jointly optimizes accuracy and efficiency on the target deployment platform, producing architectures like EfficientNet and MNASNet.',
      },
      {
        type: 'callout',
        variant: 'example',
        title: 'EfficientNet: NAS Success Story',
        text: 'EfficientNet was discovered through hardware-aware NAS that optimized for both accuracy and FLOPs. The resulting architecture family achieves ImageNet accuracy comparable to much larger models at a fraction of the compute cost. EfficientNet-B0 matches ResNet-50 accuracy with 5.3M parameters versus 25.6M — a 4.8x reduction.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Cost-Benefit Analysis',
      },
      {
        type: 'paragraph',
        text: 'From a systems engineering perspective, NAS raises important questions about the cost of architecture search versus the benefit of the discovered architecture. Practitioners must weigh NAS costs against the expected lifetime benefits of improved architecture efficiency.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'NAS ROI Calculation',
        text: 'A NAS search costing 1,000 GPU hours at $3/hour = $3,000 that finds an architecture saving 10% inference cost only breaks even if the model serves enough traffic. If inference costs $10,000/month, the 10% savings ($1,000/month) pays back the search cost in 3 months. For lower-volume deployments, manual architecture selection or transfer from published NAS results may be more cost-effective.',
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Practical NAS Advice',
        text: 'Before running your own NAS, check if a published NAS-discovered architecture (EfficientNet, MNASNet, Once-for-All) already fits your constraints. If you must run NAS, use efficient methods like DARTS or Once-for-All, and define a tight search space informed by known good architectures to reduce search cost.',
      },
    ],
    order: 3,
    keyConcepts: [
      { term: 'Neural Architecture Search', definition: 'Automated methods for discovering optimal neural network architectures by searching over a defined space of possible designs using optimization algorithms.' },
      { term: 'Hardware-Aware NAS', definition: 'NAS methods that incorporate hardware performance metrics (latency, energy, memory) directly into the search objective function.' },
    ],
  },
  {
    id: 'ch04-s5',
    heading: 'Architecture Design Principles',
    body: 'Effective architecture design is guided by several key principles that balance model capacity, computational efficiency, and practical deployability. The principle of progressive complexity suggests starting with simpler architectures and adding complexity only when justified by improved performance on the target task.\n\nDepth versus width is a fundamental design dimension. Deeper networks can represent more complex functions but are harder to train and more prone to gradient issues. Wider networks are more parallelizable and easier to train but may be less parameter-efficient. Modern architectures often combine moderate depth with strategic width variation across layers.\n\nCompound scaling, introduced by EfficientNet, provides a principled approach to scaling architectures. Rather than scaling only depth, width, or resolution independently, compound scaling adjusts all three dimensions simultaneously according to a fixed ratio. This approach consistently outperforms single-dimension scaling across different computational budgets.\n\nThe trend toward modular, composable architecture components has accelerated with the success of Transformers. Standard building blocks like attention layers, feed-forward networks, and normalization layers can be combined in various configurations. This modularity simplifies implementation, enables code reuse, and facilitates systematic ablation studies to understand the contribution of each component.',
    blocks: [
      {
        type: 'paragraph',
        text: 'Effective architecture design is guided by several key principles that balance model capacity, computational efficiency, and practical deployability. The principle of progressive complexity suggests starting with simpler architectures and adding complexity only when justified by improved performance on the target task.',
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'The Progressive Complexity Principle',
        text: 'Start with the simplest architecture that could reasonably solve your problem. A logistic regression, a small CNN, or a compact Transformer — get a baseline working end-to-end first. Only add complexity (more layers, attention heads, auxiliary losses) when you have evidence that the simple approach falls short. This approach minimizes debugging time and maximizes understanding.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Depth vs. Width',
      },
      {
        type: 'paragraph',
        text: 'Depth versus width is a fundamental design dimension. Deeper networks can represent more complex functions but are harder to train and more prone to gradient issues. Wider networks are more parallelizable and easier to train but may be less parameter-efficient.',
      },
      {
        type: 'table',
        headers: ['Property', 'Deep (Many Layers)', 'Wide (Large Layers)'],
        rows: [
          ['Representation power', 'More complex functions with fewer total parameters', 'Requires more parameters for same complexity'],
          ['Training difficulty', 'Vanishing/exploding gradients, needs skip connections', 'Easier to train, more stable gradients'],
          ['Parallelism', 'Limited by sequential layer dependencies', 'Each layer parallelizes well across GPU cores'],
          ['Memory pattern', 'Many small activations', 'Fewer but larger activations'],
          ['Inference latency', 'Limited by layer count (sequential)', 'Limited by largest layer width'],
        ],
        caption: 'Table 4.5: Depth vs. width trade-offs in architecture design.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Compound Scaling',
      },
      {
        type: 'definition',
        term: 'Compound Scaling',
        definition: 'A method for uniformly scaling network depth, width, and input resolution together using a fixed compound coefficient. Introduced by EfficientNet, this approach yields more balanced and efficient architectures than scaling any single dimension alone.',
      },
      {
        type: 'equation',
        latex: '\\text{depth: } d = \\alpha^\\phi, \\quad \\text{width: } w = \\beta^\\phi, \\quad \\text{resolution: } r = \\gamma^\\phi \\quad \\text{s.t. } \\alpha \\cdot \\beta^2 \\cdot \\gamma^2 \\approx 2',
        label: 'Equation 4.3: EfficientNet compound scaling. The constraint ensures FLOPs roughly double for each unit increase in the compound coefficient phi.',
      },
      {
        type: 'paragraph',
        text: 'Compound scaling adjusts depth, width, and resolution simultaneously according to a fixed ratio. This approach consistently outperforms single-dimension scaling across different computational budgets.',
      },
      {
        type: 'callout',
        variant: 'note',
        title: 'Why Compound Scaling Works',
        text: 'Scaling only one dimension leads to diminishing returns. A very deep but narrow network wastes depth on low-resolution features. A very wide but shallow network cannot build hierarchical representations. A high-resolution input fed to a small network wastes the additional detail. Compound scaling ensures all three dimensions grow in harmony.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Modular, Composable Design',
      },
      {
        type: 'paragraph',
        text: 'The trend toward modular, composable architecture components has accelerated with the success of Transformers. Standard building blocks like attention layers, feed-forward networks, and normalization layers can be combined in various configurations.',
      },
      {
        type: 'list',
        ordered: false,
        items: [
          'Self-attention blocks — Capture global dependencies within a sequence or spatial region',
          'Feed-forward networks (FFN) — Per-position nonlinear transformations that add model capacity',
          'Layer normalization — Stabilizes activations and accelerates convergence',
          'Skip connections — Enable gradient flow and allow the network to learn residual mappings',
          'Positional encoding — Inject position information into position-agnostic attention operations',
        ],
      },
      {
        type: 'callout',
        variant: 'example',
        title: 'Composable Architecture in Practice',
        text: 'A standard Transformer block is: LayerNorm -> Self-Attention -> Residual Add -> LayerNorm -> FFN -> Residual Add. By simply stacking N of these identical blocks and varying N, dimension, and number of heads, you get architectures ranging from BERT-base (12 blocks, 110M params) to GPT-3 (96 blocks, 175B params). This composability dramatically simplifies implementation and systematic experimentation.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Ablation Before Publication',
        text: 'Modular design facilitates ablation studies — experiments that remove or modify one component at a time to measure its contribution. Before deploying a complex architecture, ablate each component to verify it contributes meaningful performance improvement. Complexity that does not improve metrics is technical debt.',
      },
    ],
    order: 4,
    keyConcepts: [
      { term: 'Compound Scaling', definition: 'A method for uniformly scaling network depth, width, and input resolution together using a fixed ratio, producing more balanced and efficient architectures.' },
      { term: 'Skip Connection', definition: 'A shortcut that adds the input of a layer directly to its output, enabling gradient flow through very deep networks and facilitating training.' },
    ],
  },
];

export const glossary: GlossaryTerm[] = [
  { term: 'CNN', definition: 'Convolutional Neural Network, an architecture that uses learned filters and weight sharing to efficiently process grid-structured data like images.' },
  { term: 'RNN', definition: 'Recurrent Neural Network, an architecture that processes sequential data by maintaining and updating a hidden state across time steps.' },
  { term: 'Transformer', definition: 'An architecture based on self-attention mechanisms that processes all sequence positions in parallel, dominant in modern NLP and vision.' },
  { term: 'Attention Mechanism', definition: 'A learned weighting scheme that allows models to focus on the most relevant parts of the input when producing each output.' },
  { term: 'NAS', definition: 'Neural Architecture Search, automated methods for discovering optimal network architectures through algorithmic search.' },
  { term: 'ResNet', definition: 'Residual Network, a CNN architecture that uses skip connections to enable training of very deep networks (100+ layers).' },
  { term: 'Vision Transformer (ViT)', definition: 'A Transformer architecture adapted for image processing by treating image patches as sequence tokens.' },
];

export const keyTakeaways: string[] = [
  'CNNs exploit spatial structure through weight sharing and are highly efficient on parallel hardware due to regular computation patterns.',
  'The sequential nature of RNNs fundamentally limits their parallelism, motivating the shift to Transformer architectures.',
  'Transformers achieve strong performance through self-attention but face O(n^2) scaling challenges with sequence length.',
  'Hardware-aware NAS discovers architectures optimized for specific deployment targets, outperforming hand-designed models.',
  'Architecture design involves balancing depth, width, and resolution, with compound scaling providing a principled approach.',
  'The choice of architecture has profound systems implications for memory usage, computational cost, and hardware utilization.',
];

export const learningObjectives: string[] = [
  'Compare CNN, RNN, and Transformer architectures in terms of structure and capabilities',
  'Explain the self-attention mechanism and why it revolutionized sequence modeling',
  'Analyze architectural trade-offs including parameter count, computational cost, and accuracy',
  'Evaluate when to apply each architecture family based on data type and task requirements',
  'Describe how modern architectures like Vision Transformers bridge the gap between vision and language',
];
