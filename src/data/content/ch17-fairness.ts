import type { ChapterSection, GlossaryTerm } from '@/types/chapter';

export const sections: ChapterSection[] = [
  {
    id: 'ch17-s1',
    heading: 'Fairness in ML Systems',
    body: 'Fairness in machine learning concerns whether ML systems treat different demographic groups equitably. As ML systems increasingly make or inform consequential decisions in hiring, lending, criminal justice, and healthcare, ensuring these systems do not perpetuate or amplify societal biases has become a critical engineering and ethical responsibility.\n\nFairness is not a single, universally agreed-upon concept. Multiple mathematical definitions exist, and they often conflict with each other. Demographic parity requires equal positive prediction rates across groups. Equal opportunity requires equal true positive rates. Calibration requires that predictions mean the same thing for all groups. The impossibility theorem shows that these definitions cannot all be satisfied simultaneously except in trivial cases.\n\nBias can enter ML systems at every stage of the pipeline. Historical bias exists in the training data itself, reflecting past discriminatory decisions. Representation bias occurs when certain groups are underrepresented in the data. Measurement bias arises when features are less accurately measured for some groups. Aggregation bias occurs when a single model is used for populations with fundamentally different patterns.\n\nAddressing fairness requires a sociotechnical approach that combines technical methods with domain expertise, stakeholder engagement, and ongoing monitoring. Purely technical solutions are insufficient because fairness depends on context, values, and the specific ways in which harm manifests. ML engineers must work with domain experts, affected communities, and policy stakeholders to define and implement appropriate fairness criteria.',
    order: 0,
    keyConcepts: [
      { term: 'Algorithmic Fairness', definition: 'The study and practice of ensuring ML systems treat different demographic groups equitably, encompassing multiple mathematical definitions and sociotechnical approaches.' },
      { term: 'Impossibility Theorem', definition: 'The mathematical result showing that multiple common fairness definitions cannot be simultaneously satisfied, requiring explicit choices about which criteria to prioritize.' },
    ],
  },
  {
    id: 'ch17-s2',
    heading: 'Explainability and Interpretability',
    body: 'Explainability refers to the ability to understand why an ML model made a particular prediction. As models are deployed in high-stakes domains, stakeholders including regulators, end users, and domain experts increasingly demand explanations alongside predictions. The EU\'s GDPR and AI Act codify aspects of this demand into law.\n\nLocal explanation methods provide reasons for individual predictions. LIME (Local Interpretable Model-agnostic Explanations) fits a simple interpretable model to approximate the complex model\'s behavior in the neighborhood of each prediction. SHAP (SHapley Additive exPlanations) uses game-theoretic Shapley values to attribute each feature\'s contribution to the prediction.\n\nGlobal explanation methods reveal the overall behavior patterns of a model. Feature importance rankings show which features most influence predictions on average. Partial dependence plots show the marginal effect of individual features. Concept-based explanations identify high-level concepts that the model has learned to recognize.\n\nInherently interpretable models like decision trees, linear models, and rule lists provide explanations by design rather than through post-hoc analysis. For some applications, the small accuracy gap between interpretable and black-box models is a worthwhile trade-off for built-in transparency. Generalized additive models (GAMs) offer a middle ground with learned nonlinear features but additive structure.',
    order: 1,
    keyConcepts: [
      { term: 'Explainability', definition: 'The ability to understand and communicate why an ML model produced a specific prediction, essential for trust and accountability in high-stakes applications.' },
      { term: 'SHAP Values', definition: 'SHapley Additive exPlanations, a game-theoretic method that attributes each feature\'s contribution to a prediction based on its marginal contribution across all feature combinations.' },
    ],
  },
  {
    id: 'ch17-s3',
    heading: 'Bias Auditing and Mitigation',
    body: 'Bias auditing systematically evaluates an ML system for unfair treatment of protected groups. An audit typically involves disaggregating performance metrics by demographic groups, testing for disparate impact, and evaluating the system\'s behavior on targeted test cases designed to reveal biased patterns.\n\nPre-processing fairness methods modify the training data to reduce bias before training. Techniques include resampling to balance group representation, reweighting examples to equalize group influence, and learning fair representations that remove protected attribute information while preserving task-relevant features.\n\nIn-processing methods incorporate fairness constraints directly into the training objective. Adversarial debiasing trains a model while simultaneously training an adversary that tries to predict the protected attribute from model representations. Constrained optimization adds fairness metrics as constraints to the loss function. These approaches tend to achieve better accuracy-fairness trade-offs than pre-processing methods.\n\nPost-processing methods adjust model outputs after training to satisfy fairness criteria. Threshold adjustment sets different classification thresholds for different groups to equalize error rates. Calibration methods adjust confidence scores to be equally reliable across groups. Post-processing is attractive because it does not require retraining, but it can only fix limited types of bias.',
    order: 2,
    keyConcepts: [
      { term: 'Bias Audit', definition: 'A systematic evaluation of an ML system\'s treatment of different demographic groups through disaggregated metrics, disparate impact testing, and targeted test cases.' },
      { term: 'Adversarial Debiasing', definition: 'A training technique that removes protected attribute information from model representations by training an adversary that attempts to predict the attribute.' },
    ],
  },
  {
    id: 'ch17-s4',
    heading: 'AI Governance and Accountability',
    body: 'AI governance encompasses the policies, processes, and organizational structures that ensure ML systems are developed and deployed responsibly. Effective governance includes clear ownership of AI systems, defined approval processes for high-risk deployments, and mechanisms for ongoing monitoring and accountability.\n\nModel cards and datasheets provide standardized documentation for ML models and datasets respectively. Model cards describe the model\'s intended use, evaluated performance across demographic groups, known limitations, and ethical considerations. Datasheets for datasets document the data collection process, composition, intended use, and potential biases. These artifacts promote transparency and informed decision-making.\n\nRegulatory frameworks for AI are evolving rapidly. The EU AI Act classifies AI systems by risk level and imposes requirements ranging from transparency obligations for limited-risk systems to strict compliance requirements for high-risk systems. Similar regulations are emerging worldwide, making regulatory awareness an important competency for ML engineers.\n\nInternal governance structures typically include AI ethics boards, model review processes, and incident response procedures. An AI ethics board provides guidance on difficult decisions and ensures consistency across the organization. Model review processes gate deployment decisions based on fairness, safety, and reliability evaluations. Incident response procedures define how to handle unexpected harm from deployed systems.',
    order: 3,
    keyConcepts: [
      { term: 'AI Governance', definition: 'The organizational policies, processes, and structures that ensure ML systems are developed, deployed, and operated responsibly and accountably.' },
      { term: 'Model Card', definition: 'A standardized document that accompanies a trained ML model, describing its intended use, performance characteristics, limitations, and ethical considerations.' },
    ],
  },
  {
    id: 'ch17-s5',
    heading: 'Building Accountable ML Systems',
    body: 'Accountability in ML systems requires technical infrastructure for auditability and organizational processes for responsibility. Every prediction should be traceable to the model version, data version, and configuration that produced it. This audit trail enables root cause analysis when problems arise and demonstrates due diligence to regulators.\n\nHuman-in-the-loop systems maintain human oversight for consequential decisions. Rather than fully automating high-stakes decisions, these systems present ML predictions alongside explanations and let human decision-makers make the final call. The challenge is designing interfaces that inform without creating automation bias (over-reliance on the ML recommendation).\n\nFeedback mechanisms allow affected individuals to contest ML decisions and provide information that improves the system. A lending decision system, for example, should provide clear reasons for denials and an accessible appeals process. This feedback not only serves individual justice but also provides valuable signal for identifying and correcting systematic errors.\n\nProactive harm assessment evaluates potential negative impacts before deployment rather than reacting to harm after it occurs. Impact assessments consider who might be harmed, how harm might manifest, what safeguards are in place, and what monitoring will detect unexpected harm. This practice, increasingly required by regulation, is also good engineering that prevents costly failures.',
    order: 4,
    keyConcepts: [
      { term: 'Human-in-the-Loop', definition: 'A system design that maintains human oversight for consequential decisions, using ML predictions as inputs to human decision-making rather than full automation.' },
      { term: 'Impact Assessment', definition: 'A proactive evaluation of potential negative impacts of an ML system on affected populations, conducted before deployment.' },
    ],
  },
];

export const glossary: GlossaryTerm[] = [
  { term: 'Fairness', definition: 'The principle that ML systems should treat different demographic groups equitably, with multiple mathematical formulations.' },
  { term: 'Explainability', definition: 'The ability to understand and communicate why an ML model made a specific prediction.' },
  { term: 'Bias Audit', definition: 'Systematic evaluation of ML system behavior across demographic groups to identify unfair treatment.' },
  { term: 'Model Card', definition: 'Standardized documentation describing a model\'s capabilities, limitations, intended use, and fairness evaluation.' },
  { term: 'LIME', definition: 'Local Interpretable Model-agnostic Explanations, a method that explains individual predictions using locally fitted interpretable models.' },
  { term: 'Demographic Parity', definition: 'A fairness criterion requiring equal positive prediction rates across demographic groups.' },
  { term: 'Disparate Impact', definition: 'When a system\'s outcomes disproportionately affect a protected group, even without explicit use of the protected attribute.' },
];

export const keyTakeaways: string[] = [
  'Multiple fairness definitions exist and often conflict; choosing which to prioritize requires explicit value judgments and stakeholder input.',
  'Bias can enter ML systems at every pipeline stage, from data collection through model development to deployment.',
  'Explainability methods like SHAP and LIME provide post-hoc explanations, but inherently interpretable models offer transparency by design.',
  'AI governance requires organizational structures (ethics boards, review processes) alongside technical tools (model cards, audit trails).',
  'Proactive impact assessment before deployment is more effective and less costly than reacting to harm after it occurs.',
];
