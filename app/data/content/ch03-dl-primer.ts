import type { ChapterSection, GlossaryTerm } from '~/types/chapter';

export const sections: ChapterSection[] = [
  {
    id: 'ch03-s1',
    heading: 'Neural Network Fundamentals',
    body: 'Neural networks are the computational backbone of modern deep learning. At their core, they are compositions of linear transformations followed by nonlinear activation functions, organized into layers. Each layer transforms its input through a weight matrix multiplication, adds a bias vector, and applies an activation function to produce its output.\n\nThe simplest neural network is the single-layer perceptron, which can only learn linearly separable functions. By stacking multiple layers, deep neural networks gain the ability to learn hierarchical representations of data. Early layers typically capture low-level features (edges, textures), while deeper layers compose these into increasingly abstract representations (objects, concepts).\n\nFrom a systems perspective, understanding neural network architecture is essential for making informed decisions about memory requirements, computational complexity, and hardware utilization. The number of parameters directly determines memory consumption, while the number of floating-point operations (FLOPs) determines computational cost. These quantities scale differently with model depth and width, creating important design trade-offs.\n\nThe universal approximation theorem tells us that sufficiently wide neural networks can approximate any continuous function. However, this theoretical guarantee says nothing about the practical challenges of training such networks or deploying them efficiently. The gap between what is theoretically possible and what is practically achievable is where ML systems engineering lives.',
    blocks: [
      {
        type: 'paragraph',
        text: 'Neural networks are the computational backbone of modern deep learning. At their core, they are compositions of linear transformations followed by nonlinear activation functions, organized into layers. Each layer transforms its input through a weight matrix multiplication, adds a bias vector, and applies an activation function to produce its output.',
      },
      {
        type: 'definition',
        term: 'Neural Network',
        definition: 'A computational model composed of layers of interconnected nodes (neurons) that learn to transform inputs into outputs through adjustable weights and nonlinear activation functions. Each layer applies a linear transformation followed by a nonlinear activation.',
      },
      {
        type: 'equation',
        latex: '\\mathbf{h} = \\sigma(\\mathbf{W}\\mathbf{x} + \\mathbf{b})',
        label: 'Equation 3.1: A single neural network layer. Input vector x is multiplied by weight matrix W, bias b is added, and activation function sigma is applied element-wise to produce hidden representation h.',
      },
      {
        type: 'figure',
        caption: 'Forward and backward pass through a neural network. Blue arrows show the forward pass (input to output), orange arrows show gradient flow during backpropagation.',
        alt: 'Diagram of a 3-layer neural network with forward pass arrows flowing left to right in blue and backward pass gradient arrows flowing right to left in orange.',
        number: 'Figure 3.1',
        component: 'BackpropagationFlow',
      },
      {
        type: 'heading',
        level: 3,
        text: 'From Perceptrons to Deep Networks',
      },
      {
        type: 'paragraph',
        text: 'The simplest neural network is the single-layer perceptron, which can only learn linearly separable functions. By stacking multiple layers, deep neural networks gain the ability to learn hierarchical representations of data. Early layers typically capture low-level features (edges, textures), while deeper layers compose these into increasingly abstract representations (objects, concepts).',
      },
      {
        type: 'callout',
        variant: 'note',
        title: 'Hierarchical Representation Learning',
        text: 'In an image classification network, layer 1 might detect edges and color gradients. Layer 2 combines edges into corners and textures. Layer 3 assembles these into parts (eyes, wheels). Layer 4 recognizes whole objects (faces, cars). This progression from low-level to high-level features is the key insight behind deep learning\'s success.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Systems Implications of Network Architecture',
      },
      {
        type: 'paragraph',
        text: 'From a systems perspective, understanding neural network architecture is essential for making informed decisions about memory requirements, computational complexity, and hardware utilization. The number of parameters directly determines memory consumption, while the number of floating-point operations (FLOPs) determines computational cost.',
      },
      {
        type: 'table',
        headers: ['Property', 'Scales With', 'Systems Impact'],
        rows: [
          ['Parameters', 'Width^2 * Depth', 'Memory consumption, model size on disk'],
          ['FLOPs', 'Width^2 * Depth * Batch Size', 'Training time, GPU compute cost'],
          ['Activations', 'Width * Depth * Batch Size', 'Peak GPU memory during training'],
          ['Gradient Size', 'Same as Parameters', 'Communication cost in distributed training'],
        ],
        caption: 'Table 3.1: How key network properties scale and their systems implications.',
      },
      {
        type: 'stat',
        value: 12,
        suffix: ' GB',
        label: 'Memory for 1B params with Adam',
      },
      {
        type: 'stat',
        value: 4,
        suffix: ' bytes',
        label: 'Per parameter (FP32)',
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Estimating Memory Requirements',
        text: 'A quick rule of thumb: each parameter in float32 requires 4 bytes. During training with Adam optimizer, you need roughly 12 bytes per parameter (4 for weights, 4 for gradient, 4 for optimizer state). A 1-billion parameter model therefore needs approximately 12 GB just for parameters and optimizer state, before accounting for activations.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'The Universal Approximation Theorem',
      },
      {
        type: 'paragraph',
        text: 'The universal approximation theorem tells us that sufficiently wide neural networks can approximate any continuous function. However, this theoretical guarantee says nothing about the practical challenges of training such networks or deploying them efficiently. The gap between what is theoretically possible and what is practically achievable is where ML systems engineering lives.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Theory vs. Practice',
        text: 'The universal approximation theorem guarantees existence but not efficiency. A network that can theoretically approximate any function may require astronomically many parameters or be impossible to train with gradient descent. Practical deep learning relies on architectural inductive biases (convolutions for spatial data, attention for sequences) to make learning feasible.',
      },
    ],
    order: 0,
    keyConcepts: [
      { term: 'Neural Network', definition: 'A computational model composed of layers of interconnected nodes that learn to transform inputs into outputs through adjustable weights and nonlinear activation functions.' },
      { term: 'Universal Approximation', definition: 'The theoretical property that neural networks with sufficient width can approximate any continuous function to arbitrary precision.' },
    ],
  },
  {
    id: 'ch03-s2',
    heading: 'Backpropagation and Gradient Computation',
    body: 'Backpropagation is the algorithm that makes deep learning possible. It efficiently computes the gradient of the loss function with respect to every parameter in the network by applying the chain rule of calculus from the output layer back through the network. This process enables gradient-based optimization of networks with millions or billions of parameters.\n\nThe forward pass computes the network output by propagating inputs through each layer sequentially. The backward pass then propagates error gradients in reverse, computing how each parameter contributed to the total loss. This symmetry between forward and backward passes has profound implications for system design: the backward pass requires approximately twice the computation and memory of the forward pass.\n\nMemory consumption during backpropagation is a critical systems concern. The standard implementation requires storing all intermediate activations from the forward pass to compute gradients during the backward pass. For deep networks, this can consume tens of gigabytes of GPU memory. Techniques like gradient checkpointing trade computation for memory by recomputing activations during the backward pass instead of storing them.\n\nAutomatic differentiation, the generalization of backpropagation, is a core feature of modern ML frameworks. PyTorch uses dynamic computational graphs (define-by-run), while TensorFlow historically used static graphs (define-and-run). This design choice has significant implications for debugging, performance optimization, and deployment flexibility.',
    blocks: [
      {
        type: 'aha',
        highlight: 'Backpropagation is just the chain rule of calculus applied recursively through the network.',
        explanation: 'Despite its mystique, backpropagation is not a novel mathematical discovery. It is a systematic bookkeeping method for applying the chain rule at every layer. The brilliance lies in efficiency: rather than computing each gradient independently (which would be impossibly slow), backprop reuses intermediate results from deeper layers, turning an exponential problem into a linear one.',
        analogy: 'A factory assembly line where each station gets a note saying "here is how much the final product was off -- your contribution to the error was this much." Each station passes the note backward to the previous station, adjusted for its own work. No station needs to understand the entire factory to know how to improve.',
      },
      {
        type: 'paragraph',
        text: 'Backpropagation is the algorithm that makes deep learning possible. It efficiently computes the gradient of the loss function with respect to every parameter in the network by applying the chain rule of calculus from the output layer back through the network. This process enables gradient-based optimization of networks with millions or billions of parameters.',
      },
      {
        type: 'definition',
        term: 'Backpropagation',
        definition: 'An algorithm for efficiently computing the gradient of the loss function with respect to every parameter in a neural network by recursively applying the chain rule of calculus from the output layer backward through the network.',
      },
      {
        type: 'equation',
        latex: '\\frac{\\partial L}{\\partial \\mathbf{W}_l} = \\frac{\\partial L}{\\partial \\mathbf{h}_l} \\cdot \\frac{\\partial \\mathbf{h}_l}{\\partial \\mathbf{W}_l}',
        label: 'Equation 3.2: The chain rule applied at layer l. The gradient of loss L with respect to weights W_l is computed by chaining the gradient through the layer output h_l.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Forward and Backward Passes',
      },
      {
        type: 'paragraph',
        text: 'The forward pass computes the network output by propagating inputs through each layer sequentially. The backward pass then propagates error gradients in reverse, computing how each parameter contributed to the total loss. This symmetry between forward and backward passes has profound implications for system design.',
      },
      {
        type: 'stat',
        value: 2,
        suffix: 'x',
        label: 'Backward pass compute vs forward pass',
      },
      {
        type: 'callout',
        variant: 'note',
        title: 'The 2x Rule',
        text: 'The backward pass requires approximately twice the computation and memory of the forward pass. This means that during training, roughly two-thirds of the total compute is spent on gradient computation. This ratio has direct implications for GPU utilization and training cost estimation.',
      },
      {
        type: 'inline-check',
        question: 'During neural network training, approximately what fraction of total computation is spent on the backward pass (gradient computation)?',
        options: ['About one-quarter (25%)', 'About one-third (33%)', 'About two-thirds (67%)', 'About half (50%)'],
        correctIndex: 2,
        explanation: 'The backward pass requires roughly 2x the computation of the forward pass. Since total compute = forward + backward, the backward pass accounts for about 2/3 of the total. This is why training is much more expensive than inference.',
        hint: 'If the backward pass costs 2x the forward pass, what fraction of (1x + 2x) is 2x?',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Memory Challenges and Gradient Checkpointing',
      },
      {
        type: 'paragraph',
        text: 'Memory consumption during backpropagation is a critical systems concern. The standard implementation requires storing all intermediate activations from the forward pass to compute gradients during the backward pass. For deep networks, this can consume tens of gigabytes of GPU memory.',
      },
      {
        type: 'definition',
        term: 'Gradient Checkpointing',
        definition: 'A memory optimization technique that reduces peak memory usage during training by discarding some intermediate activations during the forward pass and recomputing them during the backward pass. This trades roughly 20-30% additional computation for up to 60-70% memory reduction.',
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'When to Use Gradient Checkpointing',
        text: 'Enable gradient checkpointing when your model fits in GPU memory for inference but runs out of memory during training. In PyTorch, use torch.utils.checkpoint.checkpoint() on memory-intensive layers. This is especially effective for Transformer models with many attention layers.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Automatic Differentiation Frameworks',
      },
      {
        type: 'paragraph',
        text: 'Automatic differentiation, the generalization of backpropagation, is a core feature of modern ML frameworks. The design choice between static and dynamic graphs has significant implications for debugging, performance optimization, and deployment flexibility.',
      },
      {
        type: 'table',
        headers: ['Feature', 'Dynamic Graphs (PyTorch)', 'Static Graphs (TensorFlow 1.x)'],
        rows: [
          ['Graph construction', 'Built on-the-fly during execution', 'Defined before execution'],
          ['Debugging', 'Standard Python debugger works', 'Requires special tools (tfdbg)'],
          ['Control flow', 'Native Python if/for/while', 'Special tf.cond / tf.while_loop'],
          ['Performance', 'JIT compilation (torch.compile)', 'Ahead-of-time optimization'],
          ['Deployment', 'TorchScript or ONNX export', 'SavedModel, TF Lite, TF.js'],
        ],
        caption: 'Table 3.2: Dynamic vs. static computational graph approaches.',
      },
      {
        type: 'callout',
        variant: 'example',
        title: 'Backpropagation in PyTorch',
        text: 'In PyTorch, calling loss.backward() triggers the backward pass through the dynamic graph. Each tensor records the operations that created it, forming a chain that backward() traverses to compute gradients. The gradients accumulate in each parameter\'s .grad attribute, ready for the optimizer to apply updates.',
      },
    ],
    order: 1,
    keyConcepts: [
      { term: 'Backpropagation', definition: 'An algorithm for computing gradients of the loss function with respect to network parameters by efficiently applying the chain rule from output to input layers.' },
      { term: 'Gradient Checkpointing', definition: 'A memory optimization technique that recomputes intermediate activations during the backward pass instead of storing them, trading compute for reduced memory usage.' },
    ],
  },
  {
    id: 'ch03-s3',
    heading: 'Activation Functions',
    body: 'Activation functions introduce nonlinearity into neural networks, which is essential for learning complex patterns. Without nonlinear activations, a multi-layer network would reduce to a single linear transformation, regardless of its depth. The choice of activation function affects training dynamics, model expressiveness, and computational efficiency.\n\nThe Rectified Linear Unit (ReLU) and its variants dominate modern deep learning due to their simplicity and favorable gradient properties. ReLU computes max(0, x), which is computationally cheap and avoids the vanishing gradient problem that plagued earlier activation functions like sigmoid and tanh. However, ReLU suffers from the "dying ReLU" problem where neurons can become permanently inactive.\n\nVariants like Leaky ReLU, ELU, and GELU address the dying ReLU problem while maintaining computational efficiency. GELU (Gaussian Error Linear Unit) has become the standard activation in Transformer models, providing smooth gradients that improve training stability. Swish (x * sigmoid(x)) offers similar benefits and is used in EfficientNet and other modern architectures.\n\nFrom a systems perspective, activation function choice impacts quantization compatibility and hardware acceleration. ReLU is particularly hardware-friendly because it only requires a comparison operation. More complex activations like GELU require lookup tables or polynomial approximations on hardware without native support, which can impact inference latency on edge devices.',
    blocks: [
      {
        type: 'paragraph',
        text: 'Activation functions introduce nonlinearity into neural networks, which is essential for learning complex patterns. Without nonlinear activations, a multi-layer network would reduce to a single linear transformation, regardless of its depth. The choice of activation function affects training dynamics, model expressiveness, and computational efficiency.',
      },
      {
        type: 'definition',
        term: 'Activation Function',
        definition: 'A nonlinear function applied element-wise to the output of a neural network layer. Activation functions are what give neural networks the ability to learn complex, nonlinear relationships. Without them, any stack of layers collapses to a single linear transformation.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'ReLU and the Vanishing Gradient Problem',
      },
      {
        type: 'paragraph',
        text: 'The Rectified Linear Unit (ReLU) and its variants dominate modern deep learning due to their simplicity and favorable gradient properties. ReLU computes max(0, x), which is computationally cheap and avoids the vanishing gradient problem that plagued earlier activation functions like sigmoid and tanh.',
      },
      {
        type: 'equation',
        latex: '\\text{ReLU}(x) = \\max(0, x) \\qquad \\text{Leaky ReLU}(x) = \\max(\\alpha x, x)',
        label: 'Equation 3.3: ReLU and Leaky ReLU activation functions. Leaky ReLU uses a small slope alpha (typically 0.01) for negative inputs to prevent dying neurons.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'The Dying ReLU Problem',
        text: 'When a ReLU neuron receives only negative inputs, its output is always zero and its gradient is always zero. This means the neuron stops learning entirely and is effectively "dead." In large networks, a significant fraction of neurons can die during training, reducing model capacity. Leaky ReLU and ELU mitigate this by allowing small gradients for negative inputs.',
      },
      {
        type: 'inline-check',
        question: 'Why has GELU become the standard activation function in Transformer models instead of ReLU?',
        options: [
          'GELU uses fewer FLOPs than ReLU',
          'GELU provides smooth gradients that improve training stability',
          'GELU eliminates the need for normalization layers',
          'GELU was the first activation function to avoid vanishing gradients',
        ],
        correctIndex: 1,
        explanation: 'GELU produces smooth, continuous gradients (unlike ReLU\'s sharp zero-point), which helps Transformer training converge more reliably. It does cost more compute than ReLU, but the stability gains outweigh this on modern hardware.',
      },
      {
        type: 'mini-viz',
        vizType: 'activation',
        config: {},
      },
      {
        type: 'heading',
        level: 3,
        text: 'Modern Activation Functions',
      },
      {
        type: 'table',
        headers: ['Activation', 'Formula', 'Pros', 'Cons', 'Common Use'],
        rows: [
          ['ReLU', 'max(0, x)', 'Simple, fast, good gradients', 'Dying neurons', 'CNNs, general purpose'],
          ['Leaky ReLU', 'max(0.01x, x)', 'No dying neurons', 'Marginal improvement', 'When ReLU underperforms'],
          ['GELU', 'x * Phi(x)', 'Smooth, best for Transformers', 'More compute than ReLU', 'Transformers (BERT, GPT)'],
          ['Swish', 'x * sigmoid(x)', 'Smooth, self-gated', 'More compute than ReLU', 'EfficientNet family'],
          ['Sigmoid', '1 / (1 + e^(-x))', 'Bounded (0,1)', 'Vanishing gradients', 'Output layer (binary classification)'],
          ['Tanh', '(e^x - e^(-x)) / (e^x + e^(-x))', 'Zero-centered', 'Vanishing gradients', 'RNN hidden states (legacy)'],
        ],
        caption: 'Table 3.3: Comparison of common activation functions and their trade-offs.',
      },
      {
        type: 'paragraph',
        text: 'GELU (Gaussian Error Linear Unit) has become the standard activation in Transformer models, providing smooth gradients that improve training stability. Swish (x * sigmoid(x)) offers similar benefits and is used in EfficientNet and other modern architectures.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Hardware Implications',
      },
      {
        type: 'paragraph',
        text: 'From a systems perspective, activation function choice impacts quantization compatibility and hardware acceleration. ReLU is particularly hardware-friendly because it only requires a comparison operation. More complex activations like GELU require lookup tables or polynomial approximations on hardware without native support.',
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Choosing an Activation Function',
        text: 'For most applications, start with ReLU. If you are building a Transformer, use GELU. If you observe dying neurons (check the fraction of zero activations), switch to Leaky ReLU or ELU. For edge deployment where every microsecond matters, prefer ReLU for its hardware simplicity.',
      },
      {
        type: 'callout',
        variant: 'note',
        title: 'GELU on Edge Devices',
        text: 'GELU requires computing the Gaussian CDF, which has no closed-form solution. On devices without native support, it is typically approximated as GELU(x) = 0.5x(1 + tanh(sqrt(2/pi)(x + 0.044715x^3))). This polynomial approximation adds latency compared to ReLU\'s simple comparison, which can be significant at the scale of billions of operations.',
      },
    ],
    order: 2,
    keyConcepts: [
      { term: 'ReLU', definition: 'Rectified Linear Unit, an activation function that outputs max(0, x), widely used for its computational simplicity and effective gradient flow.' },
      { term: 'Vanishing Gradient', definition: 'A training problem where gradients become extremely small as they propagate through many layers, effectively preventing early layers from learning.' },
    ],
  },
  {
    id: 'ch03-s4',
    heading: 'Loss Functions and Optimization',
    body: 'Loss functions quantify how far the model predictions are from the desired outputs, providing the signal that drives learning. Cross-entropy loss is the standard choice for classification tasks, while mean squared error (MSE) is commonly used for regression. The choice of loss function encodes assumptions about the problem and can significantly influence model behavior.\n\nStochastic gradient descent (SGD) and its variants are the workhorses of deep learning optimization. Rather than computing gradients over the entire dataset (full batch gradient descent), SGD estimates gradients from small random subsets (mini-batches). This introduces noise that can actually help escape local minima and saddle points.\n\nModern optimizers like Adam, AdamW, and LAMB combine momentum (exponential moving average of gradients) with adaptive learning rates (per-parameter scaling based on gradient history). Adam is the default choice for most applications due to its robustness to hyperparameter settings. AdamW adds proper weight decay decoupling, which improves generalization.\n\nLearning rate scheduling is a critical component of training systems. Common strategies include linear warmup followed by cosine decay, step decay, and one-cycle scheduling. The learning rate schedule can be more important than the optimizer choice for achieving good performance. Distributed training often requires careful learning rate scaling to maintain convergence when increasing the effective batch size.',
    blocks: [
      {
        type: 'paragraph',
        text: 'Loss functions quantify how far the model predictions are from the desired outputs, providing the signal that drives learning. The choice of loss function encodes assumptions about the problem and can significantly influence model behavior.',
      },
      {
        type: 'definition',
        term: 'Loss Function',
        definition: 'A function that quantifies the discrepancy between model predictions and ground truth labels, providing the objective that the optimizer minimizes during training. The loss function encodes what "good predictions" means for a given task.',
      },
      {
        type: 'equation',
        latex: 'L_{\\text{CE}} = -\\sum_{i=1}^{C} y_i \\log(\\hat{y}_i)',
        label: 'Equation 3.4: Cross-entropy loss for classification with C classes. y_i is the true label (one-hot) and y-hat_i is the predicted probability for class i.',
      },
      {
        type: 'interactive-equation',
        latex: 'L_{\\text{CE}} = -\\frac{1}{ {{N}} }\\sum_{i=1}^{ {{N}} } y_i \\log({{yhat}})',
        variables: [
          { name: 'N', label: 'Sample size', min: 1, max: 100, step: 1, default: 10, unit: 'samples' },
          { name: 'yhat', label: 'Predicted prob', min: 0.01, max: 0.99, step: 0.01, default: 0.7 },
        ],
        computeResult: '-(1/N) * N * Math.log(yhat)',
        resultLabel: 'Cross-entropy loss',
      },
      {
        type: 'table',
        headers: ['Loss Function', 'Formula', 'Task', 'Key Property'],
        rows: [
          ['Cross-Entropy', '-sum(y * log(y-hat))', 'Classification', 'Penalizes confident wrong predictions heavily'],
          ['Mean Squared Error', '(1/N) * sum((y - y-hat)^2)', 'Regression', 'Penalizes large errors quadratically'],
          ['Mean Absolute Error', '(1/N) * sum(|y - y-hat|)', 'Regression', 'Robust to outliers'],
          ['Huber Loss', 'MSE if small error, MAE if large', 'Regression', 'Combines benefits of MSE and MAE'],
          ['Focal Loss', '-alpha * (1 - y-hat)^gamma * log(y-hat)', 'Imbalanced classification', 'Down-weights easy examples'],
        ],
        caption: 'Table 3.4: Common loss functions and their properties.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Stochastic Gradient Descent and Mini-Batches',
      },
      {
        type: 'paragraph',
        text: 'Stochastic gradient descent (SGD) and its variants are the workhorses of deep learning optimization. Rather than computing gradients over the entire dataset (full batch gradient descent), SGD estimates gradients from small random subsets (mini-batches). This introduces noise that can actually help escape local minima and saddle points.',
      },
      {
        type: 'callout',
        variant: 'note',
        title: 'The Benefit of Noise',
        text: 'The stochasticity in SGD is not merely a computational shortcut — it is a feature. The gradient noise from mini-batch sampling acts as implicit regularization, helping the optimizer find flatter minima that generalize better. This is why models trained with smaller batch sizes often generalize better than those trained with very large batches.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Modern Optimizers',
      },
      {
        type: 'paragraph',
        text: 'Modern optimizers like Adam, AdamW, and LAMB combine momentum (exponential moving average of gradients) with adaptive learning rates (per-parameter scaling based on gradient history). Adam is the default choice for most applications due to its robustness to hyperparameter settings. AdamW adds proper weight decay decoupling, which improves generalization.',
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Optimizer Selection Guide',
        text: 'Use AdamW as your default optimizer. It works well across most tasks and is forgiving of suboptimal learning rate choices. Use SGD with momentum for training CNNs when you can afford careful learning rate tuning — it often yields better final accuracy. For very large batch distributed training, consider LAMB or LARS which scale learning rates per layer.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Learning Rate Scheduling',
      },
      {
        type: 'paragraph',
        text: 'Learning rate scheduling is a critical component of training systems. The learning rate schedule can be more important than the optimizer choice for achieving good performance.',
      },
      {
        type: 'list',
        ordered: false,
        items: [
          'Linear warmup + cosine decay — Start with a low learning rate, ramp up linearly, then decay following a cosine curve. Standard for Transformers.',
          'Step decay — Reduce learning rate by a factor (e.g., 0.1) at fixed epoch milestones. Classic choice for CNNs.',
          'One-cycle — Ramp learning rate up and then down over one full training run. Fast convergence with good generalization.',
          'Reduce on plateau — Monitor validation loss and reduce learning rate when progress stalls. Simple but effective.',
        ],
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Learning Rate and Batch Size',
        text: 'When scaling to distributed training with larger effective batch sizes, the learning rate must be adjusted. The linear scaling rule suggests multiplying the learning rate by the batch size increase factor. However, this requires a warmup period to stabilize training. Without proper scaling, distributed training may diverge or converge to poor solutions.',
      },
      {
        type: 'playground',
        title: 'Learning Rate Explorer',
        description: 'Adjust the learning rate and training epochs to see how the loss curve changes. Too small and convergence is painfully slow; too large and training diverges.',
        parameters: [
          { name: 'learningRate', label: 'Learning Rate', min: 0.0001, max: 1.0, step: 0.0001, default: 0.01 },
          { name: 'epochs', label: 'Epochs', min: 10, max: 200, step: 5, default: 50 },
        ],
        computeFn: 'learningRateLoss',
        chartType: 'line',
      },
    ],
    order: 3,
    keyConcepts: [
      { term: 'Cross-Entropy Loss', definition: 'A loss function that measures the divergence between predicted probability distributions and true labels, standard for classification tasks.' },
      { term: 'Adam Optimizer', definition: 'An adaptive learning rate optimizer that combines momentum and per-parameter learning rate scaling, widely used for its robustness and fast convergence.' },
    ],
  },
  {
    id: 'ch03-s5',
    heading: 'Gradient Descent and Training Dynamics',
    body: 'Understanding the loss landscape is key to understanding why training neural networks is challenging. The loss surface of deep networks is high-dimensional and non-convex, containing many local minima, saddle points, and flat regions. Remarkably, research has shown that most local minima in deep networks achieve similar loss values, so the primary challenge is navigating saddle points and flat regions efficiently.\n\nBatch size is a critical hyperparameter that affects both training dynamics and systems performance. Larger batch sizes provide more accurate gradient estimates and enable better GPU utilization, but they can also lead to sharp minima that generalize poorly. The relationship between batch size, learning rate, and generalization is an active area of research.\n\nGradient clipping is a practical technique that prevents training instability by capping the magnitude of gradients. This is especially important for recurrent networks and Transformers, where gradient magnitudes can vary dramatically. Gradient clipping can be applied to individual parameter gradients or to the global gradient norm.\n\nConvergence diagnostics are essential for efficient training. Monitoring the training loss, validation loss, gradient norms, and learning rate over time helps identify issues like underfitting, overfitting, learning rate problems, and data quality issues. These diagnostics should be integrated into the training infrastructure as a first-class concern, not an afterthought.',
    blocks: [
      {
        type: 'paragraph',
        text: 'Understanding the loss landscape is key to understanding why training neural networks is challenging. The loss surface of deep networks is high-dimensional and non-convex, containing many local minima, saddle points, and flat regions.',
      },
      {
        type: 'definition',
        term: 'Loss Landscape',
        definition: 'The multidimensional surface defined by the loss function over all possible parameter values. Its geometry — including the distribution of minima, saddle points, and flat regions — determines how difficult a network is to train and how well gradient-based optimizers can navigate it.',
      },
      {
        type: 'callout',
        variant: 'note',
        title: 'Most Local Minima Are Good Enough',
        text: 'Research has shown that most local minima in deep networks achieve similar loss values. The primary challenge is not finding the global minimum but rather navigating saddle points and flat regions efficiently. In high-dimensional spaces, saddle points vastly outnumber local minima and can stall training for many iterations.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Batch Size: A Systems and Optimization Trade-off',
      },
      {
        type: 'paragraph',
        text: 'Batch size is a critical hyperparameter that affects both training dynamics and systems performance. Larger batch sizes provide more accurate gradient estimates and enable better GPU utilization, but they can also lead to sharp minima that generalize poorly.',
      },
      {
        type: 'table',
        headers: ['Batch Size', 'GPU Utilization', 'Gradient Quality', 'Generalization', 'Training Time'],
        rows: [
          ['Small (32-64)', 'Low', 'Noisy but regularizing', 'Often better', 'Slow (many iterations)'],
          ['Medium (256-1024)', 'Good', 'Balanced', 'Good', 'Moderate'],
          ['Large (4096+)', 'Excellent', 'Accurate but may overfit', 'May require tuning', 'Fast (fewer iterations)'],
        ],
        caption: 'Table 3.5: How batch size affects training dynamics and systems performance.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Gradient Clipping',
      },
      {
        type: 'definition',
        term: 'Gradient Clipping',
        definition: 'A technique that limits gradient magnitudes during training to prevent exploding gradients. Gradients exceeding a threshold are scaled down proportionally, maintaining their direction but capping their magnitude.',
      },
      {
        type: 'paragraph',
        text: 'Gradient clipping is a practical technique that prevents training instability by capping the magnitude of gradients. This is especially important for recurrent networks and Transformers, where gradient magnitudes can vary dramatically.',
      },
      {
        type: 'code',
        language: 'python',
        code: '# Global gradient norm clipping in PyTorch\ntorch.nn.utils.clip_grad_norm_(\n    model.parameters(),\n    max_norm=1.0  # Clip if global norm exceeds 1.0\n)\noptimizer.step()',
        caption: 'Example: Gradient clipping applied before the optimizer step in PyTorch.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Convergence Diagnostics',
      },
      {
        type: 'paragraph',
        text: 'Convergence diagnostics are essential for efficient training. Monitoring key metrics over time helps identify issues before they waste expensive compute hours.',
      },
      {
        type: 'list',
        ordered: false,
        items: [
          'Training loss — Should decrease steadily; plateaus suggest learning rate issues',
          'Validation loss — Divergence from training loss signals overfitting',
          'Gradient norms — Spikes indicate instability; consistently small values indicate vanishing gradients',
          'Learning rate — Verify the schedule is applied correctly',
          'GPU memory usage — Unexpected growth may indicate memory leaks in data loading',
        ],
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Build Diagnostics Into Your Training Loop',
        text: 'Convergence diagnostics should be integrated into the training infrastructure as a first-class concern, not an afterthought. Log these metrics to a tracking platform (W&B, MLflow, TensorBoard) from the start of every project. The cost of logging is negligible compared to the cost of a failed training run you cannot diagnose.',
      },
      {
        type: 'mini-viz',
        vizType: 'confusion-matrix',
        config: {},
      },
      {
        type: 'aha',
        highlight: 'Batch normalization stabilizes training by normalizing layer inputs to zero mean and unit variance.',
        explanation: 'Without batch normalization, each layer must constantly adapt to shifting input distributions caused by parameter updates in preceding layers (internal covariate shift). Batch norm eliminates this moving target, letting each layer learn independently. This is why adding batch norm often lets you use higher learning rates and train much faster -- each layer sees a stable input range.',
        analogy: 'Trying to learn archery while someone keeps moving the target. Batch normalization pins the target in place for each layer, so every layer can focus on improving its own aim rather than constantly adjusting for the moving inputs from the layer before it.',
      },
      {
        type: 'callout',
        variant: 'example',
        title: 'Diagnosing a Stuck Training Run',
        text: 'A training run plateaus at unexpectedly high loss after 5 epochs. Checking gradient norms reveals they dropped to near-zero values, suggesting vanishing gradients. The team switches from sigmoid to ReLU activations and adds batch normalization. The next run converges smoothly, reaching the target loss in 20 epochs.',
      },
    ],
    order: 4,
    keyConcepts: [
      { term: 'Loss Landscape', definition: 'The multidimensional surface defined by the loss function over all possible parameter values, whose geometry determines training difficulty.' },
      { term: 'Gradient Clipping', definition: 'A technique that limits gradient magnitudes during training to prevent exploding gradients and maintain training stability.' },
    ],
  },
];

export const glossary: GlossaryTerm[] = [
  { term: 'Backpropagation', definition: 'The primary algorithm for training neural networks, computing gradients by applying the chain rule from the output layer backward through the network.' },
  { term: 'Activation Function', definition: 'A nonlinear function applied element-wise to layer outputs, enabling neural networks to learn complex nonlinear relationships.' },
  { term: 'Loss Function', definition: 'A function that quantifies the discrepancy between model predictions and ground truth labels, providing the objective for optimization.' },
  { term: 'Stochastic Gradient Descent', definition: 'An optimization algorithm that updates model parameters using gradients estimated from random mini-batches of training data.' },
  { term: 'Learning Rate', definition: 'A hyperparameter that controls the step size of parameter updates during gradient descent optimization.' },
  { term: 'Mini-batch', definition: 'A small subset of the training data used to estimate gradients in stochastic optimization, balancing accuracy and computational cost.' },
  { term: 'FLOPs', definition: 'Floating-Point Operations, a measure of computational cost commonly used to compare the efficiency of different neural network architectures.' },
];

export const keyTakeaways: string[] = [
  'Neural networks learn hierarchical representations through compositions of linear transformations and nonlinear activation functions.',
  'Backpropagation requires storing intermediate activations, making memory management a critical systems concern for deep networks.',
  'Activation function choice affects not only training dynamics but also hardware compatibility and inference efficiency.',
  'Modern optimizers like Adam provide robust training by combining momentum with adaptive per-parameter learning rates.',
  'The backward pass requires approximately twice the computation and memory of the forward pass, which impacts training system design.',
];

export const learningObjectives: string[] = [
  'Explain the fundamental principles of deep learning including backpropagation and gradient descent',
  'Compare activation functions and their impact on network training dynamics',
  'Analyze the role of loss functions in guiding model optimization',
  'Implement a basic neural network training loop with forward and backward passes',
  'Evaluate regularization techniques for preventing overfitting in deep models',
];
