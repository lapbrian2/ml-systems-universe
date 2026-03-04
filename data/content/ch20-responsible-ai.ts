import type { ChapterSection, GlossaryTerm } from '~/types/chapter';

export const sections: ChapterSection[] = [
  {
    id: 'ch20-s1',
    heading: 'Frontier Models and Foundation Models',
    body: 'Foundation models are large-scale models trained on broad data that can be adapted to a wide range of downstream tasks. GPT-4, Claude, Gemini, and Llama represent the current frontier of language models, while DALL-E, Stable Diffusion, and Midjourney lead in image generation. These models have demonstrated remarkable capabilities that were unexpected even a few years ago.\n\nThe systems challenges of foundation models are immense. Training GPT-4-class models requires thousands of GPUs running for months, costing millions of dollars. Serving these models at scale requires sophisticated infrastructure for batching, caching, and load balancing to meet latency requirements while managing costs. The infrastructure for foundation models has become a major area of ML systems engineering.\n\nThe emergent capabilities of large models, abilities that appear suddenly as models scale beyond certain size thresholds, have surprised the research community. In-context learning, chain-of-thought reasoning, and instruction following all emerged without being explicitly trained for. Understanding when and why these capabilities emerge is an active and important research question.\n\nThe democratization of foundation models through open weights (Llama, Mistral) and efficient fine-tuning methods (LoRA, QLoRA) has broadened access beyond a few large corporations. This ecosystem shift enables researchers and smaller organizations to build on top of foundation models without the enormous cost of training from scratch.',
    order: 0,
    keyConcepts: [
      { term: 'Foundation Model', definition: 'A large-scale model trained on broad data that can be adapted to diverse downstream tasks through fine-tuning, prompting, or in-context learning.' },
      { term: 'Emergent Capabilities', definition: 'Abilities that appear suddenly as models scale beyond certain thresholds, such as in-context learning and chain-of-thought reasoning.' },
    ],
  },
  {
    id: 'ch20-s2',
    heading: 'Generative AI Systems',
    body: 'Generative AI systems create new content including text, images, audio, video, and code. These systems have moved from research curiosities to mainstream products in just a few years, fundamentally changing how people create, communicate, and work. The systems engineering challenges of generative AI are distinct from discriminative ML.\n\nLarge language models (LLMs) generate text through autoregressive prediction, producing one token at a time based on the preceding context. The serving challenge is that this sequential generation process is inherently memory-bandwidth-bound, making efficient KV-cache management, speculative decoding, and quantization critical for practical deployment.\n\nDiffusion models for image generation work by learning to reverse a noise-addition process, iteratively denoising random noise into coherent images. The multi-step generation process makes diffusion models computationally expensive, motivating techniques like classifier-free guidance, distilled diffusion, and consistency models that reduce the number of required denoising steps.\n\nMultimodal models that process and generate across multiple modalities (text, images, audio) represent the frontier of generative AI. Systems like GPT-4V, Gemini, and Claude demonstrate that a single model can understand and reason across modalities. Building and serving these models requires infrastructure that can handle heterogeneous data types and complex generation pipelines.',
    order: 1,
    keyConcepts: [
      { term: 'Autoregressive Generation', definition: 'A generation method where each output token is produced sequentially, conditioned on all previously generated tokens.' },
      { term: 'Diffusion Model', definition: 'A generative model that creates data by learning to reverse a gradual noise-addition process, iteratively refining random noise into coherent outputs.' },
    ],
  },
  {
    id: 'ch20-s3',
    heading: 'Emerging Trends in ML Systems',
    body: 'The trend toward ever-larger models continues, but is increasingly complemented by work on making models more efficient and accessible. Mixture-of-experts (MoE) architectures activate only a subset of parameters for each input, achieving the capacity of very large models with the computational cost of much smaller ones. Mixtral and GShard demonstrate that MoE can be practically deployed at scale.\n\nRetrieval-augmented generation (RAG) combines the generative capabilities of LLMs with information retrieval from external knowledge bases. This approach addresses hallucination by grounding model outputs in factual sources and enables models to access up-to-date information beyond their training data. RAG systems require careful integration of vector databases, retrieval strategies, and generation pipelines.\n\nAI agents that can use tools, browse the web, write and execute code, and interact with APIs represent a new paradigm for ML systems. These systems require infrastructure for tool registration, execution sandboxing, multi-step planning, and safety guardrails. The systems challenges of reliable, safe, and useful AI agents are among the most important in current ML engineering.\n\nOn-device AI is evolving rapidly with powerful language models running locally on smartphones and laptops. Apple Intelligence, Google Gemini Nano, and quantized open models demonstrate that meaningful AI capabilities can be delivered without cloud connectivity. This trend has implications for privacy, latency, and the distribution of AI capabilities.',
    order: 2,
    keyConcepts: [
      { term: 'Mixture of Experts', definition: 'An architecture that routes each input to a subset of specialized expert networks, achieving large model capacity with lower per-input computational cost.' },
      { term: 'Retrieval-Augmented Generation', definition: 'A technique that enhances LLM outputs by retrieving relevant information from external knowledge bases, reducing hallucination and enabling access to current information.' },
    ],
  },
  {
    id: 'ch20-s4',
    heading: 'Scaling Laws and Compute Trends',
    body: 'Scaling laws describe the predictable relationship between model size, dataset size, compute budget, and model performance. The Chinchilla scaling laws showed that many large models were under-trained relative to their size, suggesting that optimal training involves scaling data proportionally with parameters. These laws enable principled resource allocation for training.\n\nCompute requirements for frontier models have been doubling approximately every 6-10 months, significantly faster than hardware improvements. This gap is filled by algorithmic efficiency improvements, better training recipes, and growing investment in ML compute infrastructure. The economics of large-scale training are reshaping the AI industry.\n\nThe end of traditional Moore\'s Law scaling has shifted attention to domain-specific hardware, novel computing paradigms, and algorithmic efficiency. Optical computing, neuromorphic chips, and quantum-classical hybrid approaches are being explored as potential paths to continued performance scaling beyond conventional semiconductor limits.\n\nThe concentration of compute resources among a few large organizations raises concerns about equitable access to frontier AI capabilities. Initiatives like the National AI Research Resource, public compute programs, and efficient training methods aim to broaden access. The tension between compute requirements and accessibility is a defining challenge for the field.',
    order: 3,
    keyConcepts: [
      { term: 'Scaling Laws', definition: 'Empirical relationships that predict how model performance improves as a function of model size, dataset size, and compute budget.' },
      { term: 'Chinchilla Scaling', definition: 'The finding that optimal training requires scaling training data proportionally with model parameters, not just increasing model size alone.' },
    ],
  },
  {
    id: 'ch20-s5',
    heading: 'Future Directions for ML Systems',
    body: 'The future of ML systems lies at the intersection of several converging trends: more capable models, more efficient hardware, better software abstractions, and evolving societal expectations around safety and governance. Engineers who understand all of these dimensions will be best positioned to shape the field.\n\nAutomated ML engineering, where AI systems help design, train, optimize, and deploy other AI systems, is an emerging trend that could dramatically accelerate progress. Current examples include automated architecture search, self-improving code generation, and AI-assisted debugging. As these capabilities mature, the role of the ML systems engineer will evolve from hands-on implementation to oversight and guidance.\n\nSafety and alignment research aims to ensure that increasingly capable AI systems remain beneficial and controllable. This includes technical work on RLHF (Reinforcement Learning from Human Feedback), constitutional AI, and interpretability, as well as governance work on evaluation standards, deployment guidelines, and international coordination.\n\nThe integration of ML into every aspect of computing, from operating systems to databases to networking, represents a fundamental shift in how software is built. ML systems engineering is becoming a core competency across all of computer science, not just a specialized subfield. This integration creates enormous opportunities for engineers who understand both ML and systems fundamentals.',
    order: 4,
    keyConcepts: [
      { term: 'AI Safety', definition: 'Research and practices aimed at ensuring AI systems remain beneficial, controllable, and aligned with human values as capabilities increase.' },
      { term: 'RLHF', definition: 'Reinforcement Learning from Human Feedback, a technique for aligning language model behavior with human preferences through reward modeling.' },
    ],
  },
];

export const glossary: GlossaryTerm[] = [
  { term: 'Foundation Model', definition: 'A large model trained on broad data that serves as the basis for adaptation to many downstream tasks.' },
  { term: 'Generative AI', definition: 'AI systems that create new content (text, images, audio, code) rather than classifying or predicting existing data.' },
  { term: 'Scaling Laws', definition: 'Empirical relationships predicting model performance as a function of scale in parameters, data, and compute.' },
  { term: 'Mixture of Experts', definition: 'An architecture activating different subsets of parameters for different inputs, achieving large capacity with lower per-input cost.' },
  { term: 'RAG', definition: 'Retrieval-Augmented Generation, combining LLM generation with external knowledge retrieval to improve accuracy and reduce hallucination.' },
  { term: 'LoRA', definition: 'Low-Rank Adaptation, an efficient fine-tuning method that adds small trainable matrices to frozen model weights.' },
  { term: 'RLHF', definition: 'Reinforcement Learning from Human Feedback, used to align model behavior with human preferences.' },
];

export const keyTakeaways: string[] = [
  'Foundation models have created a new paradigm where most ML starts from pre-trained models rather than from scratch.',
  'Serving large generative models efficiently is a major systems challenge requiring KV-cache management, quantization, and batching innovations.',
  'Mixture of Experts and retrieval-augmented generation are key architectural trends for scaling capabilities efficiently.',
  'Scaling laws enable principled decisions about how to allocate compute, data, and parameters for optimal training.',
  'The integration of ML into every aspect of computing makes ML systems engineering a broadly essential skill.',
  'AI safety and alignment are increasingly critical as model capabilities grow, requiring both technical and governance approaches.',
];
