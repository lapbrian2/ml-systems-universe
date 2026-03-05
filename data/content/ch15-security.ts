import type { ChapterSection, GlossaryTerm } from '~/types/chapter';

export const sections: ChapterSection[] = [
  {
    id: 'ch15-s1',
    heading: 'Adversarial Attacks on ML Systems',
    body: 'Adversarial attacks exploit vulnerabilities in ML models to cause incorrect predictions through carefully crafted inputs. These attacks reveal fundamental limitations in how neural networks learn and generalize, with implications ranging from academic curiosity to serious safety and security concerns in deployed systems.\n\nEvasion attacks manipulate inputs at inference time to fool the model. The Fast Gradient Sign Method (FGSM) adds a small perturbation in the direction of the loss gradient, creating inputs that look identical to humans but cause misclassification. Projected Gradient Descent (PGD) iteratively refines this perturbation within an epsilon-ball, producing stronger attacks. These perturbations are typically imperceptible to human observers.\n\nPoisoning attacks corrupt the training data to implant backdoors or degrade model performance. An attacker who can influence the training dataset (through web scraping, crowdsourced labeling, or data supply chain compromise) can insert poisoned examples that cause the model to learn malicious behaviors triggered by specific patterns.\n\nModel extraction attacks aim to steal a model\'s functionality by querying it and training a copy. An attacker with API access to a deployed model can systematically query it and use the input-output pairs to train a surrogate model. This threatens intellectual property and can enable follow-up adversarial attacks. Rate limiting, output perturbation, and watermarking are defenses against extraction.',
    blocks: [
      {
        type: 'paragraph',
        text: 'Adversarial attacks exploit vulnerabilities in ML models to cause incorrect predictions through carefully crafted inputs. These attacks reveal fundamental limitations in how neural networks learn and generalize, with implications ranging from academic curiosity to serious safety and security concerns in deployed systems.',
      },
      {
        type: 'definition',
        term: 'Adversarial Example',
        definition: 'An input deliberately crafted with small, often imperceptible perturbations designed to cause a machine learning model to produce an incorrect prediction. Adversarial examples expose the gap between human perception and model decision boundaries.',
      },
      {
        type: 'figure',
        src: '',
        alt: 'Comprehensive threat model diagram for ML systems showing attack surfaces across the ML lifecycle: data poisoning at training time, evasion attacks at inference time, model extraction via API queries, and supply chain attacks on pre-trained models and dependencies.',
        caption: 'Figure 15.1: ML Security Threat Model',
        component: 'SecurityThreatModel',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Evasion Attacks',
      },
      {
        type: 'paragraph',
        text: 'Evasion attacks manipulate inputs at inference time to fool the model. The Fast Gradient Sign Method (FGSM) adds a small perturbation in the direction of the loss gradient, creating inputs that look identical to humans but cause misclassification.',
      },
      {
        type: 'equation',
        latex: 'x_{adv} = x + \\epsilon \\cdot \\text{sign}(\\nabla_x L(\\theta, x, y))',
        label: 'Equation 15.1: Fast Gradient Sign Method (FGSM). The adversarial input is created by adding a perturbation of magnitude epsilon in the direction of the loss gradient with respect to the input.',
      },
      {
        type: 'callout',
        variant: 'note',
        title: 'Imperceptible Perturbations',
        text: 'FGSM with epsilon = 8/255 on a 0-255 pixel scale changes each pixel by at most 3%. This is imperceptible to humans but can flip a classifier\'s prediction with high probability. PGD (Projected Gradient Descent) iteratively refines the perturbation within this epsilon-ball, producing even stronger attacks that defeat simple defenses.',
      },
      {
        type: 'table',
        headers: ['Attack Type', 'When It Occurs', 'Attacker Access', 'Example'],
        rows: [
          ['Evasion (FGSM, PGD)', 'Inference time', 'Model gradients (white-box) or outputs (black-box)', 'Adversarial patch on stop sign fools autonomous vehicle'],
          ['Poisoning', 'Training time', 'Training data pipeline', 'Backdoored training images cause targeted misclassification'],
          ['Model Extraction', 'Inference time', 'Query API access', 'Querying a model API to train a clone'],
          ['Membership Inference', 'Inference time', 'Model predictions', 'Determining if a specific record was in training data'],
        ],
        caption: 'Table 15.1: Major categories of adversarial attacks on ML systems.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Poisoning Attacks',
      },
      {
        type: 'paragraph',
        text: 'Poisoning attacks corrupt the training data to implant backdoors or degrade model performance. An attacker who can influence the training dataset can insert poisoned examples that cause the model to learn malicious behaviors triggered by specific patterns.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'The Backdoor Threat',
        text: 'A poisoning attacker can embed a "trigger pattern" (e.g., a small sticker) in training images labeled as a target class. The trained model performs normally on clean inputs but misclassifies any input containing the trigger. This backdoor persists through fine-tuning and is extremely difficult to detect through standard model evaluation.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Model Extraction Attacks',
      },
      {
        type: 'paragraph',
        text: 'Model extraction attacks aim to steal a model\'s functionality by querying it and training a copy. An attacker with API access to a deployed model can systematically query it and use the input-output pairs to train a surrogate model.',
      },
      {
        type: 'callout',
        variant: 'example',
        title: 'Model Extraction in Practice',
        text: 'Researchers demonstrated that a BERT-based sentiment classifier served via API could be replicated to 95% agreement using only 10,000 carefully chosen queries — costing under $5 in API fees. The extracted model then enabled efficient white-box adversarial attacks against the original. Defenses include rate limiting, returning only top-1 labels instead of probabilities, and adding controlled noise to outputs.',
      },
      {
        type: 'list',
        ordered: false,
        items: [
          'Rate limiting — Restrict the number of queries per user/IP to slow extraction.',
          'Output perturbation — Add small noise to probability outputs without affecting top-1 predictions.',
          'Watermarking — Embed verifiable signatures that transfer to extracted models.',
          'Prediction truncation — Return only the top label, not full probability distributions.',
        ],
      },
    ],
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
    blocks: [
      {
        type: 'heading',
        level: 3,
        text: 'Adversarial Training',
      },
      {
        type: 'paragraph',
        text: 'Adversarial training is the most well-studied defense, where models are trained on both clean and adversarially perturbed examples. During training, adversarial examples are generated on-the-fly and included in each batch.',
      },
      {
        type: 'definition',
        term: 'Adversarial Training',
        definition: 'A defense technique that augments training data with adversarially perturbed examples generated on-the-fly during training, forcing the model to learn decision boundaries that are robust to small input perturbations.',
      },
      {
        type: 'equation',
        latex: '\\min_\\theta \\mathbb{E}_{(x,y)}\\left[\\max_{\\|\\delta\\| \\leq \\epsilon} L(\\theta, x + \\delta, y)\\right]',
        label: 'Equation 15.2: Adversarial training as a min-max optimization. The inner maximization finds the worst-case perturbation delta within the epsilon-ball; the outer minimization trains model parameters theta to be robust to these worst-case perturbations.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'The Robustness-Accuracy Trade-off',
        text: 'Adversarial training typically reduces clean accuracy by 2-5% while significantly improving robustness. This trade-off is fundamental: making the model robust to worst-case perturbations constrains its capacity for standard inputs. For production systems, evaluate whether this accuracy cost is acceptable given the security requirements.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Certified Defenses',
      },
      {
        type: 'paragraph',
        text: 'Certified defenses provide provable guarantees that model predictions are robust within a specified perturbation radius. Randomized smoothing creates a smoothed classifier by averaging predictions over random noise perturbations.',
      },
      {
        type: 'callout',
        variant: 'note',
        title: 'Randomized Smoothing',
        text: 'Randomized smoothing works by classifying many noise-corrupted copies of the input and returning the majority vote. The statistical properties of Gaussian noise provide a certified radius within which the prediction is guaranteed not to change. The certification radius depends on the gap between the most and second-most probable classes.',
      },
      {
        type: 'table',
        headers: ['Defense Category', 'Approach', 'Guarantees', 'Trade-off'],
        rows: [
          ['Adversarial Training', 'Train on adversarial examples', 'Empirical robustness (no formal proof)', '2-5% clean accuracy loss, 3-10x training cost'],
          ['Certified Defenses', 'Randomized smoothing, interval bounds', 'Provable robustness within radius', 'Significant accuracy loss, limited radius'],
          ['Input Preprocessing', 'JPEG compression, spatial smoothing', 'None (broken by adaptive attacks)', 'Minimal accuracy cost, easy to deploy'],
          ['Detection', 'Statistical tests on inputs', 'None (arms race with attackers)', 'False positive management needed'],
        ],
        caption: 'Table 15.2: Adversarial defense categories compared.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Input Preprocessing Defenses',
      },
      {
        type: 'paragraph',
        text: 'Input preprocessing defenses attempt to remove adversarial perturbations before they reach the model. These approaches are simple to deploy but can be bypassed by adaptive attacks that account for the preprocessing.',
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Always Test Against Adaptive Attacks',
        text: 'Many published defenses were later broken by adaptive attacks that specifically target the defense mechanism. When evaluating any defense, always test it against an adaptive adversary that knows about the defense and optimizes against it. The AutoAttack benchmark provides a standardized set of strong adaptive attacks for evaluation.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Defense in Depth',
      },
      {
        type: 'paragraph',
        text: 'Defense in depth combines multiple protection layers rather than relying on any single defense. This layered approach makes attacks significantly harder while maintaining system usability.',
      },
      {
        type: 'list',
        ordered: true,
        items: [
          'Input validation — Reject out-of-distribution inputs that may indicate an attack.',
          'Adversarial training — Harden the model against known perturbation types.',
          'Confidence thresholds — Flag low-confidence predictions for human review.',
          'Output monitoring — Detect unusual prediction patterns that suggest adversarial probing.',
          'Rate limiting — Slow down potential model extraction attempts.',
        ],
      },
      {
        type: 'callout',
        variant: 'example',
        title: 'Defense in Depth for Autonomous Driving',
        text: 'A self-driving perception system combines adversarial training (robust to small perturbations), sensor fusion (cross-checking camera with LiDAR and radar), temporal consistency checks (flagging sudden classification changes between frames), and confidence-based fallback (reducing speed when any sensor reports low confidence). No single layer is foolproof, but together they raise the attack cost dramatically.',
      },
    ],
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
    blocks: [
      {
        type: 'paragraph',
        text: 'Federated learning enables collaborative model training across multiple data owners without sharing raw data. Each participant trains on their local data and shares only model updates, which are aggregated to improve a global model. This paradigm is particularly important for privacy-sensitive domains like healthcare, finance, and mobile applications.',
      },
      {
        type: 'definition',
        term: 'Federated Learning',
        definition: 'A distributed training paradigm where multiple participants (devices or organizations) collaboratively improve a shared model by training locally on private data and sharing only model updates — never raw data — with a central aggregation server.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Federated Averaging (FedAvg)',
      },
      {
        type: 'paragraph',
        text: 'Federated Averaging is the foundational federated learning algorithm. Each participating device performs multiple local training steps on its data, and the resulting model updates are averaged at a central server.',
      },
      {
        type: 'equation',
        latex: 'w_{t+1} = \\sum_{k=1}^{K} \\frac{n_k}{n} w_{t+1}^k',
        label: 'Equation 15.3: Federated Averaging aggregation, where w^k is the model update from client k, n_k is the number of samples on client k, and n is the total across all clients. The weighted average ensures clients with more data have proportionally more influence.',
      },
      {
        type: 'callout',
        variant: 'note',
        title: 'Communication Efficiency',
        text: 'FedAvg reduces communication by allowing each client to run multiple local SGD steps before sending an update. Instead of sending gradients after every batch (requiring thousands of communication rounds), clients train for 1-5 local epochs and send the resulting model delta. This makes federated learning practical over mobile networks with high latency.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Challenges in Federated Settings',
      },
      {
        type: 'table',
        headers: ['Challenge', 'Description', 'Mitigation'],
        rows: [
          ['Non-IID Data', 'Each participant\'s data has a different distribution', 'Personalized FL, FedProx regularization'],
          ['System Heterogeneity', 'Devices have different compute/bandwidth capabilities', 'Asynchronous aggregation, client selection'],
          ['Communication Cost', 'Model updates can be millions of parameters', 'Gradient compression, quantized updates'],
          ['Free Riders', 'Participants who benefit without contributing quality updates', 'Contribution scoring, incentive mechanisms'],
          ['Stragglers', 'Slow devices delay synchronous aggregation rounds', 'Deadline-based aggregation, dropping slow clients'],
        ],
        caption: 'Table 15.3: Key challenges in federated learning deployments.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Non-IID Data Degrades Convergence',
        text: 'When client data is highly non-IID (e.g., each mobile user has very different typing patterns), FedAvg can converge slowly or to a suboptimal solution. Client updates may point in conflicting directions, causing the global model to oscillate. FedProx adds a proximal term that regularizes local updates to stay close to the global model, significantly improving convergence in non-IID settings.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Secure Aggregation and Privacy',
      },
      {
        type: 'paragraph',
        text: 'Secure aggregation protocols ensure that the central server can compute the aggregate model update without seeing any individual participant\'s contribution. Combined with differential privacy, federated learning can provide strong privacy guarantees.',
      },
      {
        type: 'definition',
        term: 'Secure Aggregation',
        definition: 'A cryptographic protocol that enables the aggregation server to compute the sum of client updates without observing any individual client\'s contribution. Typically implemented using secret sharing or homomorphic encryption.',
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Layered Privacy Protection',
        text: 'For maximum privacy, combine three techniques: (1) Federated learning keeps raw data on-device, (2) Secure aggregation prevents the server from seeing individual updates, and (3) Differential privacy adds noise to updates so they cannot leak individual training examples. Each layer addresses a different threat model.',
      },
      {
        type: 'callout',
        variant: 'example',
        title: 'Cross-Silo Federated Learning in Healthcare',
        text: 'Multiple hospitals want to train a tumor detection model but cannot share patient data due to HIPAA regulations. Each hospital trains on its local imaging data and sends encrypted model updates to a secure aggregation server. The server computes the aggregate without seeing individual hospital updates. Differential privacy noise ensures no individual patient record can be reconstructed. The resulting model outperforms any single hospital\'s model by learning from diverse patient populations.',
      },
    ],
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
    blocks: [
      {
        type: 'paragraph',
        text: 'Differential privacy provides a mathematical framework for quantifying and limiting the privacy leakage of computations on sensitive data. Applied to ML, it ensures that the trained model does not reveal too much information about any individual training example.',
      },
      {
        type: 'definition',
        term: 'Differential Privacy',
        definition: 'A mathematical framework that guarantees the output of a computation does not reveal too much about any individual input record. Formally, a mechanism M is (epsilon, delta)-differentially private if for any two datasets differing in one record, the probability of any output changes by at most a factor of e^epsilon, with failure probability delta.',
      },
      {
        type: 'equation',
        latex: 'Pr[M(D) \\in S] \\leq e^{\\epsilon} \\cdot Pr[M(D\') \\in S] + \\delta',
        label: 'Equation 15.4: The (epsilon, delta)-differential privacy guarantee. For neighboring datasets D and D\' (differing in one record), the probability of any output set S changes by at most e^epsilon, with failure probability delta.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'DP-SGD: Private Gradient Descent',
      },
      {
        type: 'paragraph',
        text: 'The core mechanism is adding calibrated noise to gradients during training (DP-SGD). Each per-example gradient is clipped to a maximum norm, the clipped gradients are averaged, and Gaussian noise proportional to the sensitivity and privacy budget is added.',
      },
      {
        type: 'code',
        language: 'python',
        code: '# Simplified DP-SGD training step\ndef dp_sgd_step(model, batch, max_grad_norm, noise_multiplier):\n    per_example_grads = compute_per_example_gradients(model, batch)\n    # Step 1: Clip each gradient to max norm\n    clipped_grads = [\n        g * min(1, max_grad_norm / grad_norm(g))\n        for g in per_example_grads\n    ]\n    # Step 2: Average clipped gradients\n    avg_grad = sum(clipped_grads) / len(clipped_grads)\n    # Step 3: Add calibrated Gaussian noise\n    noise_std = noise_multiplier * max_grad_norm / len(batch)\n    noisy_grad = avg_grad + torch.randn_like(avg_grad) * noise_std\n    # Step 4: Update model\n    model.parameters -= learning_rate * noisy_grad',
        caption: 'Simplified DP-SGD algorithm showing the three key steps: clip, average, add noise.',
      },
      {
        type: 'callout',
        variant: 'note',
        title: 'Interpreting Epsilon',
        text: 'Epsilon is the privacy budget. Lower epsilon means stronger privacy. In practice: epsilon < 1 provides strong privacy guarantees, epsilon between 1 and 10 provides moderate privacy, and epsilon > 10 provides weak formal guarantees. Apple uses epsilon = 2 for local DP in iOS. Google uses epsilon = 1 for some Chrome data collection. Most ML research reports epsilon between 3 and 8.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'The Privacy-Utility Trade-off',
      },
      {
        type: 'paragraph',
        text: 'The privacy-utility trade-off is the fundamental challenge of differential privacy. Stronger privacy requires more noise, which degrades model quality.',
      },
      {
        type: 'table',
        headers: ['Epsilon', 'Privacy Level', 'Noise Impact', 'Typical Use Case'],
        rows: [
          ['0.1 - 1', 'Very strong', 'High noise, significant accuracy loss', 'Sensitive medical/financial data'],
          ['1 - 5', 'Strong', 'Moderate noise, noticeable accuracy loss', 'Production ML with privacy requirements'],
          ['5 - 10', 'Moderate', 'Low noise, small accuracy loss', 'Research benchmarks, less sensitive data'],
          ['> 10', 'Weak', 'Minimal noise, negligible accuracy loss', 'Formal compliance with minimal real protection'],
        ],
        caption: 'Table 15.4: Epsilon ranges and their practical implications.',
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Improving the Trade-off',
        text: 'Three techniques help achieve better utility at the same privacy budget: (1) Larger batch sizes reduce per-step noise relative to signal through subsampling amplification, (2) Pre-training on public data then privately fine-tuning reduces the number of private steps needed, (3) Choosing architectures with fewer parameters reduces the dimensionality of noise injection.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Privacy Budgeting',
      },
      {
        type: 'paragraph',
        text: 'Privacy budgeting and composition are practical concerns for deploying differential privacy. Each training step consumes a portion of the total privacy budget.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Budget Exhaustion',
        text: 'The privacy budget is consumed by every operation on the sensitive data — every training step, every evaluation, and every hyperparameter search iteration. Without careful budget management, teams can exhaust the budget during development, leaving none for the production model. Use the moments accountant or Renyi DP to track cumulative privacy cost, and allocate the budget across development phases upfront.',
      },
    ],
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
    blocks: [
      {
        type: 'paragraph',
        text: 'Production ML systems face security threats beyond adversarial examples, including model theft, data extraction, and supply chain attacks. A comprehensive security strategy must address threats at every layer of the ML stack, from data collection through model serving.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Hardening Model Serving Infrastructure',
      },
      {
        type: 'paragraph',
        text: 'Model serving infrastructure must be hardened against conventional security threats and ML-specific threats. Input validation, rate limiting, and prediction logging form the first line of defense.',
      },
      {
        type: 'list',
        ordered: false,
        items: [
          'Input validation — Reject malformed, out-of-range, or out-of-distribution inputs before they reach the model.',
          'Authentication and authorization — Ensure only authorized users and services can access model endpoints.',
          'Rate limiting — Prevent systematic querying for model extraction or adversarial probing.',
          'Prediction logging — Record all inputs and outputs for post-hoc analysis of suspicious patterns.',
          'Encrypted transport — Use TLS for all model serving traffic to prevent interception.',
        ],
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'OOD Detection as a Security Layer',
        text: 'Out-of-distribution detection serves double duty: it improves reliability by flagging inputs the model is uncertain about, and it provides a security layer by detecting adversarial inputs that are often statistically different from normal inputs. Implement OOD scoring as a pre-inference filter on all production endpoints.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Supply Chain Security',
      },
      {
        type: 'paragraph',
        text: 'Supply chain security is increasingly important as ML systems depend on pre-trained models, datasets, and libraries from external sources. A compromised pre-trained model could contain backdoors that activate on specific triggers.',
      },
      {
        type: 'definition',
        term: 'ML Supply Chain Security',
        definition: 'Practices for verifying the integrity, provenance, and safety of external components used in ML systems, including pre-trained models, datasets, third-party libraries, and training infrastructure. Compromised components can introduce backdoors, data poisoning, or vulnerabilities.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'The Pre-trained Model Threat',
        text: 'Downloading a pre-trained model from the internet is equivalent to running untrusted code. A backdoored model can pass standard evaluation benchmarks while containing hidden triggers that cause targeted misclassification. Always verify model provenance, use cryptographic checksums, and test for backdoor triggers before deploying third-party models.',
      },
      {
        type: 'table',
        headers: ['Attack Surface', 'Threat', 'Mitigation'],
        rows: [
          ['Pre-trained Models', 'Backdoors, hidden functionality', 'Verify provenance, test for triggers, fine-tune on trusted data'],
          ['Training Datasets', 'Poisoned examples, biased labels', 'Data validation, provenance tracking, outlier detection'],
          ['ML Libraries', 'Malicious code in dependencies', 'Pin versions, audit dependencies, use signed packages'],
          ['Training Infrastructure', 'Compromised cloud instances', 'Secure enclaves, access controls, audit logging'],
          ['Model Artifacts', 'Tampered weights in storage', 'Cryptographic signing, integrity verification'],
        ],
        caption: 'Table 15.5: ML supply chain attack surfaces and mitigations.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Model Watermarking',
      },
      {
        type: 'paragraph',
        text: 'ML model watermarking embeds verifiable signatures into models that survive common modifications like fine-tuning and pruning. Watermarks can prove model ownership in intellectual property disputes.',
      },
      {
        type: 'definition',
        term: 'Model Watermarking',
        definition: 'Techniques for embedding verifiable, robust signatures into ML models that can prove ownership and detect unauthorized redistribution. Watermarks must survive modifications like fine-tuning, pruning, and quantization while not degrading model performance.',
      },
      {
        type: 'callout',
        variant: 'note',
        title: 'White-Box vs. Black-Box Watermarks',
        text: 'White-box watermarks embed patterns directly in the model weights and require access to the weights to verify. Black-box watermarks embed patterns in the model\'s input-output behavior and can be verified by querying the model API with special trigger inputs. Black-box watermarks are harder to remove but also harder to embed without affecting model accuracy.',
      },
      {
        type: 'callout',
        variant: 'example',
        title: 'Watermarking in Practice',
        text: 'A company trains a proprietary image classifier and embeds a black-box watermark: the model always classifies a specific abstract pattern (the "key") as class 42. When the company discovers a competitor offering a suspiciously similar model, they query it with their key pattern. If the competitor\'s model also outputs class 42 with high confidence, it strongly suggests the model was copied or distilled from the original.',
      },
    ],
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

export const learningObjectives: string[] = [
  'Classify adversarial attacks on ML systems including evasion, poisoning, and model extraction techniques',
  'Compare defense strategies such as adversarial training, input validation, and certified robustness',
  'Explain how federated learning preserves privacy while enabling collaborative model training',
  'Analyze differential privacy guarantees and the privacy-utility trade-off in ML systems',
  'Design a defense-in-depth security strategy for a production ML deployment',
];
