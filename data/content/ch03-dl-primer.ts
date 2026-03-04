import type { ChapterSection, GlossaryTerm } from '~/types/chapter';

export const sections: ChapterSection[] = [
  {
    id: 'ch03-s1',
    heading: 'Neural Network Fundamentals',
    body: 'Neural networks are the computational backbone of modern deep learning. At their core, they are compositions of linear transformations followed by nonlinear activation functions, organized into layers. Each layer transforms its input through a weight matrix multiplication, adds a bias vector, and applies an activation function to produce its output.\n\nThe simplest neural network is the single-layer perceptron, which can only learn linearly separable functions. By stacking multiple layers, deep neural networks gain the ability to learn hierarchical representations of data. Early layers typically capture low-level features (edges, textures), while deeper layers compose these into increasingly abstract representations (objects, concepts).\n\nFrom a systems perspective, understanding neural network architecture is essential for making informed decisions about memory requirements, computational complexity, and hardware utilization. The number of parameters directly determines memory consumption, while the number of floating-point operations (FLOPs) determines computational cost. These quantities scale differently with model depth and width, creating important design trade-offs.\n\nThe universal approximation theorem tells us that sufficiently wide neural networks can approximate any continuous function. However, this theoretical guarantee says nothing about the practical challenges of training such networks or deploying them efficiently. The gap between what is theoretically possible and what is practically achievable is where ML systems engineering lives.',
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
