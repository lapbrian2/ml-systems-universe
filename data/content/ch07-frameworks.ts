import type { ChapterSection, GlossaryTerm } from '~/types/chapter';

export const sections: ChapterSection[] = [
  {
    id: 'ch07-s1',
    heading: 'The ML Framework Landscape',
    body: 'Machine learning frameworks provide the foundational software layer between model definitions and hardware execution. They abstract the complexity of tensor operations, automatic differentiation, GPU memory management, and distributed computation, allowing researchers and engineers to focus on model design rather than low-level implementation details.\n\nThe framework landscape has consolidated around three major players: PyTorch, TensorFlow, and JAX. Each embodies different design philosophies with distinct trade-offs. PyTorch prioritizes developer experience and flexibility. TensorFlow emphasizes production deployment and ecosystem completeness. JAX focuses on functional programming, composability, and high-performance computing.\n\nFramework choice has profound implications for the entire ML stack. It influences debugging workflows, deployment options, hardware compatibility, community support, and the availability of pre-trained models and libraries. Organizations must consider not just the current feature set but the long-term trajectory and community momentum of each framework.\n\nBeyond the big three, specialized frameworks serve specific domains. ONNX Runtime provides cross-framework inference optimization. TensorRT optimizes for NVIDIA GPU deployment. Core ML and TFLite Micro target mobile and embedded devices respectively. Understanding this ecosystem is essential for making informed infrastructure decisions.',
    order: 0,
    keyConcepts: [
      { term: 'ML Framework', definition: 'A software library that provides high-level APIs for defining, training, and deploying neural networks, handling tensor operations, automatic differentiation, and hardware acceleration.' },
      { term: 'ONNX', definition: 'Open Neural Network Exchange, an open format for representing ML models that enables interoperability between different frameworks.' },
    ],
  },
  {
    id: 'ch07-s2',
    heading: 'PyTorch: Flexibility and Research',
    body: 'PyTorch has become the dominant framework in ML research due to its intuitive Pythonic interface and dynamic computational graph (eager execution). Every operation executes immediately, making debugging as simple as inserting print statements or using standard Python debuggers. This define-by-run approach matches how researchers think about models.\n\nPyTorch\'s autograd system automatically records operations on tensors and computes gradients through reverse-mode automatic differentiation. The computational graph is rebuilt on every forward pass, enabling dynamic architectures that vary from input to input, such as recursive neural networks or models with data-dependent control flow.\n\nFor production deployment, PyTorch offers TorchScript (a subset of Python that can be JIT compiled) and torch.export for ahead-of-time compilation. PyTorch 2.0 introduced torch.compile, which uses a graph capture and compilation approach to achieve significant speedups without requiring code changes. This bridges the gap between PyTorch\'s research flexibility and production performance.\n\nThe PyTorch ecosystem includes Hugging Face Transformers for pre-trained models, PyTorch Lightning for training boilerplate reduction, and torchvision/torchaudio/torchtext for domain-specific functionality. This rich ecosystem, combined with strong community momentum, makes PyTorch the default choice for most new ML projects.',
    order: 1,
    keyConcepts: [
      { term: 'Eager Execution', definition: 'A programming model where operations execute immediately as they are called, enabling intuitive debugging but potentially sacrificing optimization opportunities.' },
      { term: 'torch.compile', definition: 'PyTorch\'s graph capture and compilation system that automatically optimizes eager-mode code for significant performance improvements without code changes.' },
    ],
  },
  {
    id: 'ch07-s3',
    heading: 'TensorFlow: Production and Scale',
    body: 'TensorFlow was designed from the ground up for production ML at Google scale. Its original design centered on static computational graphs that are defined once and then executed repeatedly, enabling aggressive compiler optimizations, distributed execution, and deployment across diverse hardware targets.\n\nTensorFlow 2.0 adopted eager execution by default, matching PyTorch\'s developer experience. The tf.function decorator allows selectively tracing Python functions into optimized graphs, providing a middle ground between ease of use and performance. Keras, integrated as TensorFlow\'s high-level API, provides a user-friendly interface for common model architectures.\n\nTensorFlow\'s strongest advantage is its comprehensive deployment ecosystem. TensorFlow Serving provides a battle-tested model serving system. TFLite enables deployment on mobile devices and microcontrollers. TensorFlow.js runs models in web browsers. TF Extended (TFX) provides an end-to-end ML pipeline platform. This breadth of deployment targets is unmatched.\n\nFor large-scale training, TensorFlow offers robust distributed strategies through tf.distribute, supporting data parallelism, model parallelism, and parameter server architectures. Integration with TPUs provides access to Google\'s custom ML accelerators, which can offer significant cost and performance advantages for large training jobs.',
    order: 2,
    keyConcepts: [
      { term: 'Static Graph', definition: 'A computational graph that is fully defined before execution, enabling compiler optimizations, distributed execution, and deployment to diverse targets.' },
      { term: 'TensorFlow Serving', definition: 'A flexible, high-performance serving system for ML models designed for production environments, supporting model versioning and A/B testing.' },
    ],
  },
  {
    id: 'ch07-s4',
    heading: 'JAX: Functional ML Computing',
    body: 'JAX brings a functional programming paradigm to ML computing, built on top of XLA (Accelerated Linear Algebra) compiler. JAX programs are written as pure functions that transform data, which enables powerful composition of transformations like automatic differentiation, vectorization, parallelization, and JIT compilation.\n\nJAX\'s core transformations are composable and orthogonal. jax.grad computes gradients. jax.vmap automatically vectorizes functions across batch dimensions. jax.pmap parallelizes across devices. jax.jit compiles functions for accelerated execution. These transformations can be composed freely, enabling patterns that would be cumbersome in other frameworks.\n\nThe functional approach brings significant advantages for research into new training algorithms, novel architectures, and custom hardware targeting. Because JAX programs are pure functions without side effects, the XLA compiler can perform aggressive optimizations including operation fusion, memory planning, and automatic device placement.\n\nJAX\'s ecosystem is growing rapidly with libraries like Flax and Haiku for neural network modules, Optax for optimization, and JAX-based implementations of major model architectures. Google DeepMind has standardized on JAX for research, and it is increasingly used for large-scale training of foundation models. However, JAX has a steeper learning curve than PyTorch and a smaller community.',
    order: 3,
    keyConcepts: [
      { term: 'XLA', definition: 'Accelerated Linear Algebra, a domain-specific compiler that optimizes tensor computations for multiple hardware targets including GPUs and TPUs.' },
      { term: 'Function Transformations', definition: 'JAX\'s composable operations (grad, vmap, pmap, jit) that transform pure functions to add capabilities like differentiation, vectorization, and parallelization.' },
    ],
  },
  {
    id: 'ch07-s5',
    heading: 'Computational Graphs and Compilation',
    body: 'Computational graphs are the fundamental abstraction underlying all ML frameworks. They represent the sequence of mathematical operations that transform inputs into outputs, with nodes representing operations and edges representing data flow. The structure of this graph determines what optimizations are possible.\n\nStatic graphs (TensorFlow 1.x, compiled modes) enable whole-program optimization: the compiler can see all operations before any execution occurs, allowing it to fuse operations, eliminate redundancy, optimize memory allocation, and plan device placement. The trade-off is reduced flexibility and harder debugging.\n\nDynamic graphs (PyTorch eager, TensorFlow eager) build the graph on-the-fly during execution, providing maximum flexibility for dynamic control flow and easy debugging. Modern frameworks bridge this gap through tracing-based compilation (torch.compile, tf.function) that captures dynamic graphs and compiles them for subsequent executions.\n\nThe trend toward ML compilers is reshaping the framework landscape. Projects like Apache TVM, MLIR, and Triton provide compiler infrastructure that can optimize ML workloads across diverse hardware. These compilers sit between frameworks and hardware, enabling a clean separation of concerns where framework developers focus on usability and compiler developers focus on performance.',
    order: 4,
    keyConcepts: [
      { term: 'Computational Graph', definition: 'A directed graph representation of mathematical operations where nodes are operations and edges represent data flow, forming the basis of automatic differentiation and optimization.' },
      { term: 'Graph Compilation', definition: 'The process of analyzing and optimizing a computational graph before execution, enabling operation fusion, memory optimization, and hardware-specific acceleration.' },
    ],
  },
];

export const glossary: GlossaryTerm[] = [
  { term: 'PyTorch', definition: 'An open-source ML framework developed by Meta, known for its intuitive eager execution and dominance in research.' },
  { term: 'TensorFlow', definition: 'An open-source ML framework developed by Google, known for its comprehensive deployment ecosystem and production-readiness.' },
  { term: 'JAX', definition: 'A numerical computing library by Google built on XLA, featuring composable function transformations and a functional programming paradigm.' },
  { term: 'Eager Execution', definition: 'A mode where operations run immediately when called, simplifying debugging at the potential cost of optimization opportunities.' },
  { term: 'JIT Compilation', definition: 'Just-In-Time compilation that optimizes code during execution rather than beforehand, balancing flexibility with performance.' },
  { term: 'Autograd', definition: 'Automatic differentiation engine that records operations and computes gradients, the backbone of neural network training in modern frameworks.' },
];

export const keyTakeaways: string[] = [
  'Framework choice has far-reaching implications for debugging, deployment, hardware support, and ecosystem access.',
  'PyTorch dominates research with its flexible eager execution; TensorFlow leads in production deployment breadth.',
  'JAX offers a unique functional approach with composable transformations but has a steeper learning curve.',
  'The trend toward ML compilers (torch.compile, XLA, TVM) is bridging the gap between framework flexibility and hardware performance.',
  'Computational graphs are the fundamental abstraction enabling automatic differentiation, optimization, and hardware-portable execution.',
];
