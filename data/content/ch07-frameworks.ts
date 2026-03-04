import type { ChapterSection, GlossaryTerm } from '~/types/chapter';

export const sections: ChapterSection[] = [
  {
    id: 'ch07-s1',
    heading: 'The ML Framework Landscape',
    body: 'Machine learning frameworks provide the foundational software layer between model definitions and hardware execution. They abstract the complexity of tensor operations, automatic differentiation, GPU memory management, and distributed computation, allowing researchers and engineers to focus on model design rather than low-level implementation details.\n\nThe framework landscape has consolidated around three major players: PyTorch, TensorFlow, and JAX. Each embodies different design philosophies with distinct trade-offs. PyTorch prioritizes developer experience and flexibility. TensorFlow emphasizes production deployment and ecosystem completeness. JAX focuses on functional programming, composability, and high-performance computing.\n\nFramework choice has profound implications for the entire ML stack. It influences debugging workflows, deployment options, hardware compatibility, community support, and the availability of pre-trained models and libraries. Organizations must consider not just the current feature set but the long-term trajectory and community momentum of each framework.\n\nBeyond the big three, specialized frameworks serve specific domains. ONNX Runtime provides cross-framework inference optimization. TensorRT optimizes for NVIDIA GPU deployment. Core ML and TFLite Micro target mobile and embedded devices respectively. Understanding this ecosystem is essential for making informed infrastructure decisions.',
    blocks: [
      {
        type: 'paragraph',
        text: 'Machine learning frameworks provide the foundational software layer between model definitions and hardware execution. They abstract the complexity of tensor operations, automatic differentiation, GPU memory management, and distributed computation, allowing researchers and engineers to focus on model design rather than low-level implementation details.',
      },
      {
        type: 'definition',
        term: 'ML Framework',
        definition: 'A software library that provides high-level APIs for defining, training, and deploying neural networks, handling tensor operations, automatic differentiation, and hardware acceleration transparently.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'The Big Three: PyTorch, TensorFlow, and JAX',
      },
      {
        type: 'paragraph',
        text: 'The framework landscape has consolidated around three major players: PyTorch, TensorFlow, and JAX. Each embodies different design philosophies with distinct trade-offs. PyTorch prioritizes developer experience and flexibility. TensorFlow emphasizes production deployment and ecosystem completeness. JAX focuses on functional programming, composability, and high-performance computing.',
      },
      {
        type: 'table',
        headers: ['Dimension', 'PyTorch', 'TensorFlow', 'JAX'],
        rows: [
          ['Design Philosophy', 'Pythonic, eager-first', 'Production-first, graph-based', 'Functional, composable'],
          ['Default Execution', 'Eager (dynamic graph)', 'Eager (with tf.function)', 'JIT-compiled via XLA'],
          ['Primary Strength', 'Research flexibility', 'Deployment ecosystem', 'Composable transformations'],
          ['Developer', 'Meta (Facebook)', 'Google Brain', 'Google DeepMind'],
          ['Community Size', 'Largest (research)', 'Large (industry)', 'Growing (research)'],
        ],
        caption: 'Table 7.1: High-level comparison of the three dominant ML frameworks.',
      },
      {
        type: 'callout',
        variant: 'note',
        title: 'Framework Consolidation',
        text: 'As of 2024, PyTorch has become the dominant framework for research papers, while TensorFlow retains a strong position in production deployments. JAX is gaining momentum for large-scale training, particularly at Google DeepMind. Smaller frameworks like Caffe, Theano, and MXNet have largely been superseded.',
      },
      {
        type: 'paragraph',
        text: 'Framework choice has profound implications for the entire ML stack. It influences debugging workflows, deployment options, hardware compatibility, community support, and the availability of pre-trained models and libraries. Organizations must consider not just the current feature set but the long-term trajectory and community momentum of each framework.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Specialized Frameworks and Runtimes',
      },
      {
        type: 'paragraph',
        text: 'Beyond the big three, specialized frameworks serve specific domains. ONNX Runtime provides cross-framework inference optimization. TensorRT optimizes for NVIDIA GPU deployment. Core ML and TFLite Micro target mobile and embedded devices respectively. Understanding this ecosystem is essential for making informed infrastructure decisions.',
      },
      {
        type: 'list',
        ordered: false,
        items: [
          'ONNX Runtime — Cross-framework inference optimization via a standardized model format.',
          'TensorRT — NVIDIA\'s high-performance inference optimizer for GPU deployment.',
          'Core ML — Apple\'s framework for on-device ML on iOS, macOS, and Apple Silicon.',
          'TFLite Micro — TensorFlow\'s runtime for microcontrollers and embedded devices.',
          'OpenVINO — Intel\'s toolkit for optimizing inference on Intel hardware.',
        ],
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Choosing a Framework',
        text: 'If you are starting a new project, begin with PyTorch unless you have a specific reason not to. Its dominance in research means the largest ecosystem of pre-trained models, tutorials, and community support. Consider TensorFlow for production-heavy workflows with diverse deployment targets, and JAX for research into novel training algorithms or large-scale TPU training.',
      },
    ],
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
    blocks: [
      {
        type: 'paragraph',
        text: 'PyTorch has become the dominant framework in ML research due to its intuitive Pythonic interface and dynamic computational graph (eager execution). Every operation executes immediately, making debugging as simple as inserting print statements or using standard Python debuggers. This define-by-run approach matches how researchers think about models.',
      },
      {
        type: 'definition',
        term: 'Eager Execution',
        definition: 'A programming model where operations execute immediately when called, building the computational graph dynamically at runtime. This allows standard Python debugging tools and enables architectures with data-dependent control flow.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Autograd: Automatic Differentiation',
      },
      {
        type: 'paragraph',
        text: 'PyTorch\'s autograd system automatically records operations on tensors and computes gradients through reverse-mode automatic differentiation. The computational graph is rebuilt on every forward pass, enabling dynamic architectures that vary from input to input, such as recursive neural networks or models with data-dependent control flow.',
      },
      {
        type: 'code',
        language: 'python',
        code: 'import torch\n\n# Autograd example: compute gradients automatically\nx = torch.tensor([2.0, 3.0], requires_grad=True)\ny = x ** 2 + 3 * x  # y = x^2 + 3x\nloss = y.sum()\nloss.backward()      # Compute dy/dx\nprint(x.grad)         # tensor([7., 9.])  (2x + 3)',
        caption: 'PyTorch autograd computes gradients automatically by recording the forward pass.',
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Debugging with Eager Execution',
        text: 'One of PyTorch\'s greatest strengths is that you can insert standard Python breakpoints (import pdb; pdb.set_trace()) or print statements anywhere in your model. Because operations execute immediately, you can inspect intermediate tensor values, shapes, and gradients during debugging — just like debugging any Python program.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'From Research to Production: torch.compile',
      },
      {
        type: 'paragraph',
        text: 'For production deployment, PyTorch offers TorchScript (a subset of Python that can be JIT compiled) and torch.export for ahead-of-time compilation. PyTorch 2.0 introduced torch.compile, which uses a graph capture and compilation approach to achieve significant speedups without requiring code changes. This bridges the gap between PyTorch\'s research flexibility and production performance.',
      },
      {
        type: 'callout',
        variant: 'example',
        title: 'torch.compile in Action',
        text: 'Adding a single line — model = torch.compile(model) — can speed up training by 30-50% on supported hardware. Under the hood, PyTorch captures the computational graph using TorchDynamo, optimizes it with TorchInductor, and generates efficient kernel code. No changes to the model definition or training loop are needed.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'The PyTorch Ecosystem',
      },
      {
        type: 'paragraph',
        text: 'The PyTorch ecosystem includes Hugging Face Transformers for pre-trained models, PyTorch Lightning for training boilerplate reduction, and torchvision/torchaudio/torchtext for domain-specific functionality. This rich ecosystem, combined with strong community momentum, makes PyTorch the default choice for most new ML projects.',
      },
      {
        type: 'list',
        ordered: false,
        items: [
          'Hugging Face Transformers — Pre-trained models and fine-tuning pipelines for NLP, vision, and multimodal tasks.',
          'PyTorch Lightning — Reduces training boilerplate and standardizes project structure.',
          'torchvision / torchaudio / torchtext — Domain-specific datasets, transforms, and model architectures.',
          'FSDP (Fully Sharded Data Parallel) — Native distributed training with memory-efficient parameter sharding.',
        ],
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Dynamic Graphs and Reproducibility',
        text: 'PyTorch\'s dynamic graph construction means that the exact sequence of operations can vary between runs when using data-dependent control flow. This can make bit-for-bit reproducibility challenging. Use torch.manual_seed() and torch.use_deterministic_algorithms(True) when exact reproducibility is required.',
      },
    ],
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
    blocks: [
      {
        type: 'paragraph',
        text: 'TensorFlow was designed from the ground up for production ML at Google scale. Its original design centered on static computational graphs that are defined once and then executed repeatedly, enabling aggressive compiler optimizations, distributed execution, and deployment across diverse hardware targets.',
      },
      {
        type: 'definition',
        term: 'Static Computational Graph',
        definition: 'A computation graph that is fully defined before any execution occurs. The entire program structure is known ahead of time, enabling the compiler to perform global optimizations such as operation fusion, constant folding, and optimal memory planning.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'TensorFlow 2.0 and Keras',
      },
      {
        type: 'paragraph',
        text: 'TensorFlow 2.0 adopted eager execution by default, matching PyTorch\'s developer experience. The tf.function decorator allows selectively tracing Python functions into optimized graphs, providing a middle ground between ease of use and performance. Keras, integrated as TensorFlow\'s high-level API, provides a user-friendly interface for common model architectures.',
      },
      {
        type: 'code',
        language: 'python',
        code: 'import tensorflow as tf\n\n# tf.function traces Python into an optimized graph\n@tf.function\ndef train_step(model, x, y):\n    with tf.GradientTape() as tape:\n        predictions = model(x, training=True)\n        loss = loss_fn(y, predictions)\n    gradients = tape.gradient(loss, model.trainable_variables)\n    optimizer.apply_gradients(zip(gradients, model.trainable_variables))\n    return loss',
        caption: 'The @tf.function decorator traces eager Python code into an optimized static graph.',
      },
      {
        type: 'callout',
        variant: 'note',
        title: 'The tf.function Trade-off',
        text: 'The @tf.function decorator provides graph-mode performance while writing eager-style code. However, it has limitations: Python side effects (print, file I/O) only execute during tracing, not on subsequent calls. Python control flow must use tf.cond and tf.while_loop for graph-compatible branching and looping.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'The Deployment Ecosystem',
      },
      {
        type: 'paragraph',
        text: 'TensorFlow\'s strongest advantage is its comprehensive deployment ecosystem. No other framework matches the breadth of deployment targets that TensorFlow supports.',
      },
      {
        type: 'table',
        headers: ['Component', 'Target', 'Use Case'],
        rows: [
          ['TF Serving', 'Cloud / data center', 'Production model serving with versioning and A/B testing'],
          ['TFLite', 'Mobile / embedded', 'On-device inference for Android, iOS, and microcontrollers'],
          ['TensorFlow.js', 'Web browser', 'Client-side ML in JavaScript applications'],
          ['TFX', 'MLOps pipeline', 'End-to-end ML pipeline orchestration and management'],
          ['tf.distribute', 'Distributed training', 'Multi-GPU, multi-node, and TPU training strategies'],
        ],
        caption: 'Table 7.2: TensorFlow\'s deployment ecosystem covers every major target platform.',
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'When TensorFlow Shines',
        text: 'Choose TensorFlow when your primary concern is deploying models to diverse targets (mobile, web, embedded, cloud). Its end-to-end pipeline tooling (TFX) and battle-tested serving infrastructure (TF Serving) are particularly valuable for large organizations with established production ML systems.',
      },
      {
        type: 'paragraph',
        text: 'For large-scale training, TensorFlow offers robust distributed strategies through tf.distribute, supporting data parallelism, model parallelism, and parameter server architectures. Integration with TPUs provides access to Google\'s custom ML accelerators, which can offer significant cost and performance advantages for large training jobs.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'TensorFlow\'s Community Trajectory',
        text: 'While TensorFlow remains widely used in industry, its share of new research papers has declined significantly since 2020. Teams choosing TensorFlow should be aware that many cutting-edge models and techniques are first released as PyTorch implementations, sometimes with delayed or community-maintained TensorFlow ports.',
      },
    ],
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
    blocks: [
      {
        type: 'paragraph',
        text: 'JAX brings a functional programming paradigm to ML computing, built on top of XLA (Accelerated Linear Algebra) compiler. JAX programs are written as pure functions that transform data, which enables powerful composition of transformations like automatic differentiation, vectorization, parallelization, and JIT compilation.',
      },
      {
        type: 'definition',
        term: 'Pure Function',
        definition: 'A function that always produces the same output for the same input and has no side effects (no mutation of external state). Pure functions are the foundation of JAX\'s composable transformation model, enabling the compiler to reason about and aggressively optimize programs.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Composable Transformations',
      },
      {
        type: 'paragraph',
        text: 'JAX\'s core transformations are composable and orthogonal. These transformations can be applied independently or chained together, enabling patterns that would be cumbersome in other frameworks.',
      },
      {
        type: 'table',
        headers: ['Transformation', 'Function', 'Purpose'],
        rows: [
          ['jax.grad', 'Automatic differentiation', 'Computes gradients of scalar-valued functions'],
          ['jax.vmap', 'Auto-vectorization', 'Maps a function over batch dimensions without explicit loops'],
          ['jax.pmap', 'Parallelization', 'Distributes computation across multiple devices (GPUs/TPUs)'],
          ['jax.jit', 'JIT compilation', 'Compiles functions via XLA for accelerated execution'],
        ],
        caption: 'Table 7.3: JAX\'s four core function transformations.',
      },
      {
        type: 'code',
        language: 'python',
        code: 'import jax\nimport jax.numpy as jnp\n\n# Composable transformations: grad + jit + vmap\ndef loss_fn(params, x, y):\n    pred = jnp.dot(x, params)\n    return jnp.mean((pred - y) ** 2)\n\n# Compose: JIT-compile the gradient of the loss\nfast_grad = jax.jit(jax.grad(loss_fn))\n\n# Compose: vectorize over a batch of different param sets\nbatched_grad = jax.vmap(jax.grad(loss_fn), in_axes=(0, None, None))',
        caption: 'JAX transformations compose naturally: jit(grad(fn)) compiles the gradient computation.',
      },
      {
        type: 'callout',
        variant: 'note',
        title: 'XLA Under the Hood',
        text: 'Because JAX programs are pure functions without side effects, the XLA compiler can perform aggressive whole-program optimizations including operation fusion, memory planning, and automatic device placement. This often yields better performance than manually optimized code in eager-mode frameworks.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'The JAX Ecosystem',
      },
      {
        type: 'paragraph',
        text: 'JAX\'s ecosystem is growing rapidly with libraries like Flax and Haiku for neural network modules, Optax for optimization, and JAX-based implementations of major model architectures. Google DeepMind has standardized on JAX for research, and it is increasingly used for large-scale training of foundation models.',
      },
      {
        type: 'list',
        ordered: false,
        items: [
          'Flax — Google\'s neural network library for JAX with a focus on flexibility.',
          'Optax — Gradient processing and optimization library (SGD, Adam, etc.).',
          'Orbax — Checkpointing and serialization utilities for JAX models.',
          'Haiku — DeepMind\'s lightweight neural network library for JAX.',
        ],
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Steeper Learning Curve',
        text: 'JAX\'s functional paradigm requires thinking differently about state management. Unlike PyTorch where model parameters are mutable object attributes, JAX requires explicitly passing parameters as function arguments. Developers accustomed to object-oriented frameworks often find this transition challenging, but the benefits in composability and compiler optimization are substantial.',
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'When to Choose JAX',
        text: 'JAX excels when you need to compose novel training algorithms, experiment with custom gradients, scale across large TPU pods, or need the compiler to aggressively optimize your code. It is particularly well-suited for research into new optimization methods and large-scale foundation model training.',
      },
    ],
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
    blocks: [
      {
        type: 'paragraph',
        text: 'Computational graphs are the fundamental abstraction underlying all ML frameworks. They represent the sequence of mathematical operations that transform inputs into outputs, with nodes representing operations and edges representing data flow. The structure of this graph determines what optimizations are possible.',
      },
      {
        type: 'definition',
        term: 'Computational Graph',
        definition: 'A directed acyclic graph (DAG) where nodes represent mathematical operations (matmul, convolution, activation) and edges represent the flow of tensor data between operations. This graph is the foundation of automatic differentiation and compiler optimization in ML frameworks.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Static vs. Dynamic Graphs',
      },
      {
        type: 'paragraph',
        text: 'Static graphs (TensorFlow 1.x, compiled modes) enable whole-program optimization: the compiler can see all operations before any execution occurs, allowing it to fuse operations, eliminate redundancy, optimize memory allocation, and plan device placement. The trade-off is reduced flexibility and harder debugging.',
      },
      {
        type: 'paragraph',
        text: 'Dynamic graphs (PyTorch eager, TensorFlow eager) build the graph on-the-fly during execution, providing maximum flexibility for dynamic control flow and easy debugging. Modern frameworks bridge this gap through tracing-based compilation (torch.compile, tf.function) that captures dynamic graphs and compiles them for subsequent executions.',
      },
      {
        type: 'table',
        headers: ['Property', 'Static Graphs', 'Dynamic Graphs', 'Tracing-Based Compilation'],
        rows: [
          ['Graph Construction', 'Define-then-run', 'Define-by-run', 'Trace-then-compile'],
          ['Optimization Scope', 'Whole program', 'Per operation', 'Traced subgraphs'],
          ['Debugging', 'Difficult (no Python access)', 'Easy (standard Python tools)', 'Moderate (debug eager, deploy compiled)'],
          ['Dynamic Control Flow', 'Requires special ops', 'Native Python', 'Limited (graph breaks)'],
          ['Examples', 'TF 1.x, JAX/XLA', 'PyTorch eager, TF eager', 'torch.compile, tf.function'],
        ],
        caption: 'Table 7.4: Trade-offs between graph execution strategies.',
      },
      {
        type: 'callout',
        variant: 'note',
        title: 'The Convergence Trend',
        text: 'Modern frameworks are converging on a hybrid approach: write code in eager mode for development and debugging, then use tracing-based compilation (torch.compile, tf.function, jax.jit) for production performance. This "eager-first, compile-later" pattern gives developers the best of both worlds.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'ML Compilers: The Emerging Layer',
      },
      {
        type: 'paragraph',
        text: 'The trend toward ML compilers is reshaping the framework landscape. Projects like Apache TVM, MLIR, and Triton provide compiler infrastructure that can optimize ML workloads across diverse hardware. These compilers sit between frameworks and hardware, enabling a clean separation of concerns where framework developers focus on usability and compiler developers focus on performance.',
      },
      {
        type: 'list',
        ordered: false,
        items: [
          'XLA (Accelerated Linear Algebra) — Google\'s ML compiler, used by JAX and TensorFlow for TPU and GPU targets.',
          'TorchInductor — PyTorch 2.0\'s default compiler backend, generating Triton kernels for GPU execution.',
          'Apache TVM — Open-source compiler stack for deploying ML to diverse hardware targets.',
          'MLIR (Multi-Level IR) — LLVM-based infrastructure for building domain-specific compilers, increasingly used for ML.',
          'Triton — OpenAI\'s language for writing custom GPU kernels in Python-like syntax.',
        ],
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Graph Compilation in Practice',
        text: 'When using torch.compile or tf.function, start by profiling your model to identify which operations dominate runtime. Graph compilation benefits operations with predictable shapes most. If your model has many dynamic shapes or Python-heavy control flow, you may see "graph breaks" that limit the speedup. Use framework profiling tools (torch.profiler, TensorBoard) to diagnose compilation issues.',
      },
      {
        type: 'callout',
        variant: 'example',
        title: 'Operator Fusion by Compilers',
        text: 'Consider a sequence: y = ReLU(BatchNorm(Conv2d(x))). Without compilation, this requires three separate kernel launches and two intermediate memory writes. An ML compiler fuses these into a single kernel that reads x once, computes all three operations in registers, and writes the final y once. This eliminates two round-trips to GPU global memory, often yielding a 2-3x speedup for such sequences.',
      },
    ],
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
