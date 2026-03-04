import type { ChapterSection, GlossaryTerm } from '@/types/chapter';

export const sections: ChapterSection[] = [
  {
    id: 'ch15-s1',
    heading: 'Adversarial Attacks on ML Systems',
    body: 'Adversarial attacks exploit vulnerabilities in ML models to cause incorrect predictions through carefully crafted inputs. These attacks reveal fundamental limitations in how neural networks learn and generalize, with implications ranging from academic curiosity to serious safety and security concerns in deployed systems.\n\nEvasion attacks manipulate inputs at inference time to fool the model. The Fast Gradient Sign Method (FGSM) adds a small perturbation in the direction of the loss gradient, creating inputs that look identical to humans but cause misclassification. Projected Gradient Descent (PGD) iteratively refines this perturbation within an epsilon-ball, producing stronger attacks. These perturbations are typically imperceptible to human observers.\n\nPoisoning attacks corrupt the training data to implant backdoors or degrade model performance. An attacker who can influence the training dataset (through web scraping, crowdsourced labeling, or data supply chain compromise) can insert poisoned examples that cause the model to learn malicious behaviors triggered by specific patterns.\n\nModel extraction attacks aim to steal a model\'s functionality by querying it and training a copy. An attacker with API access to a deployed model can systematically query it and use the input-output pairs to train a surrogate model. This threatens intellectual property and can enable follow-up adversarial attacks. Rate limiting, output perturbation, and watermarking are defenses against extraction.',
    order: 0,
    keyConcepts: [
      { term: 'Adversarial Example', definition: 'An input deliberately crafted with small perturbations to cause a ML model to make incorrect predictions while appearing normal to humans.' },
      { term: 'Evasion Attack', definition: 'An attack that manipulates inputs at inference time to fool a deployed ML model, without access to the training process.' },
    ],
  },
  {
    id: 'ch15-s2',
    heading: 'Defenses Against Adversarial Attacks',
    body: 'Adversarial training is the most well-studied defense, where models are trained on both clean and adversarially perturbed examples. During training, adversarial examples are generated on-the-fly and included in each batch. This creates models that are more robust to known attack types, though typically at the cost of some accuracy on clean inputs.\n\nCertified defenses provide provable guarantees that model predictions are robust within a specified perturbation radius. Randomized smoothing, for example, creates a smoothed classifier by averaging predictions over random noise perturbations, with provable robustness guarantees derived from statistical theory. These methods trade accuracy for formal guarantees.\n\nInput preprocessing defenses attempt to remove adversarial perturbations before they reach the model. Techniques include input transformation (JPEG compression, spatial smoothing), feature squeezing (reducing color depth, spatial resolution), and input reconstruction using autoencoders or diffusion models. These approaches are simple to deploy but can be bypassed by adaptive attacks.\n\nDefense in depth combines multiple protection layers rather than relying on any single defense. A production ML system might use input validation, adversarial training, prediction confidence thresholds, and output monitoring together. This layered approach makes attacks significantly harder while maintaining system usability.',
    order: 1,
    keyConcepts: [
      { term: 'Adversarial Training', definition: 'A defense technique that includes adversarially perturbed examples during training to improve model robustness against such perturbations.' },
      { term: 'Certified Defense', definition: 'A robustness guarantee that provably ensures correct model predictions within a specified perturbation boundary around each input.' },
    ],
  },
  {
    id: 'ch15-s3',
    heading: 'Federated Learning for Privacy',
    body: 'Federated learning enables collaborative model training across multiple data owners without sharing raw data. Each participant trains on their local data and shares only model updates (gradients or parameters), which are aggregated to improve a global model. This paradigm is particularly important for privacy-sensitive domains like healthcare, finance, and mobile applications.\n\nFederated Averaging (FedAvg) is the foundational federated learning algorithm. Each participating device performs multiple local training steps on its data, and the resulting model updates are averaged at a central server. This reduces communication rounds compared to sending gradients after every batch, making federated learning practical over slow or intermittent network connections.\n\nFederated learning faces challenges including data heterogeneity (non-IID distributions across participants), system heterogeneity (varying compute and bandwidth across devices), communication efficiency (model updates can be large), and free-rider problems (participants who benefit without contributing). Solutions include personalized federated learning, gradient compression, and contribution-aware aggregation.\n\nSecure aggregation protocols ensure that the central server can compute the aggregate model update without seeing any individual participant\'s contribution. Combined with differential privacy, which adds calibrated noise to updates, federated learning can provide strong privacy guarantees. However, these protections add computational and communication overhead and can reduce model quality.',
    order: 2,
    keyConcepts: [
      { term: 'Federated Learning', definition: 'A distributed training paradigm where multiple participants collaboratively train a model by sharing only model updates, keeping raw data local.' },
      { term: 'Secure Aggregation', definition: 'A cryptographic protocol that allows aggregation of participants\' model updates without revealing any individual contribution to the server.' },
    ],
  },
  {
    id: 'ch15-s4',
    heading: 'Differential Privacy for ML',
    body: 'Differential privacy provides a mathematical framework for quantifying and limiting the privacy leakage of computations on sensitive data. Applied to ML, it ensures that the trained model does not reveal too much information about any individual training example, protecting against membership inference and data extraction attacks.\n\nThe core mechanism is adding calibrated noise to gradients during training (DP-SGD). Each per-example gradient is clipped to a maximum norm, the clipped gradients are averaged, and Gaussian noise proportional to the sensitivity and privacy budget is added. The resulting noisy gradient update provides formal privacy guarantees characterized by the epsilon and delta parameters.\n\nThe privacy-utility trade-off is the fundamental challenge of differential privacy. Stronger privacy (lower epsilon) requires more noise, which degrades model quality. Research on improving this trade-off focuses on better gradient clipping strategies, noise reduction through subsampling amplification, and architecture choices that are more amenable to private training.\n\nPrivacy budgeting and composition are practical concerns for deploying differential privacy. Each training step consumes a portion of the total privacy budget. The moments accountant and Renyi differential privacy provide tight composition bounds that track cumulative privacy loss. Organizations must decide on an acceptable total privacy budget and manage it across model development and deployment.',
    order: 3,
    keyConcepts: [
      { term: 'Differential Privacy', definition: 'A mathematical framework that limits the information a computation reveals about any individual data point, providing formal privacy guarantees.' },
      { term: 'DP-SGD', definition: 'Differentially Private Stochastic Gradient Descent, an algorithm that clips per-example gradients and adds calibrated noise to provide privacy during model training.' },
    ],
  },
  {
    id: 'ch15-s5',
    heading: 'Model Security in Production',
    body: 'Production ML systems face security threats beyond adversarial examples, including model theft, data extraction, and supply chain attacks. A comprehensive security strategy must address threats at every layer of the ML stack, from data collection through model serving.\n\nModel serving infrastructure must be hardened against conventional security threats (injection, authentication bypass) and ML-specific threats (adversarial inputs, model probing). Input validation should check for out-of-distribution inputs that may indicate an attack. Rate limiting prevents systematic model extraction. Prediction logging enables post-hoc analysis of suspicious query patterns.\n\nSupply chain security is increasingly important as ML systems depend on pre-trained models, datasets, and libraries from external sources. A compromised pre-trained model could contain backdoors that activate on specific triggers. Verifying the provenance and integrity of all components in the ML supply chain is essential.\n\nML model watermarking embeds verifiable signatures into models that survive common modifications like fine-tuning and pruning. Watermarks can prove model ownership in intellectual property disputes and detect unauthorized model redistribution. Both white-box methods (embedding patterns in weights) and black-box methods (embedding in input-output behavior) are active areas of research.',
    order: 4,
    keyConcepts: [
      { term: 'Model Watermarking', definition: 'Techniques for embedding verifiable signatures into ML models that survive modifications, enabling ownership verification and theft detection.' },
      { term: 'Supply Chain Security', definition: 'Practices for verifying the integrity and provenance of external components (models, datasets, libraries) used in ML systems.' },
    ],
  },
];

export const glossary: GlossaryTerm[] = [
  { term: 'Adversarial Attack', definition: 'Techniques that manipulate inputs or training data to cause ML models to make incorrect or malicious predictions.' },
  { term: 'Federated Learning', definition: 'Distributed ML training where data stays on participant devices and only model updates are shared.' },
  { term: 'Differential Privacy', definition: 'A mathematical framework providing formal guarantees about the privacy of individual data points in computations.' },
  { term: 'FGSM', definition: 'Fast Gradient Sign Method, an efficient adversarial attack that perturbs inputs along the gradient direction.' },
  { term: 'Data Poisoning', definition: 'An attack that corrupts training data to cause the model to learn malicious behaviors or degrade in performance.' },
  { term: 'Membership Inference', definition: 'An attack that determines whether a specific data point was used in training, potentially revealing private information.' },
  { term: 'Secure Aggregation', definition: 'Cryptographic protocols that enable server-side aggregation of updates without revealing individual contributions.' },
];

export const keyTakeaways: string[] = [
  'Adversarial attacks reveal fundamental vulnerabilities in neural networks that have real security implications for deployed systems.',
  'Defense in depth combining adversarial training, input validation, and monitoring is more robust than any single defense.',
  'Federated learning enables collaborative training without sharing raw data, but requires careful protocol design to prevent information leakage.',
  'Differential privacy provides formal mathematical guarantees about privacy at the cost of some model utility.',
  'Production ML security must address conventional threats alongside ML-specific vulnerabilities including model theft and supply chain attacks.',
];
