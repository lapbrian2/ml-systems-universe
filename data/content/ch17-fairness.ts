import type { ChapterSection, GlossaryTerm } from '~/types/chapter';

export const sections: ChapterSection[] = [
  {
    id: 'ch17-s1',
    heading: 'Fairness in ML Systems',
    body: 'Fairness in machine learning concerns whether ML systems treat different demographic groups equitably. As ML systems increasingly make or inform consequential decisions in hiring, lending, criminal justice, and healthcare, ensuring these systems do not perpetuate or amplify societal biases has become a critical engineering and ethical responsibility.\n\nFairness is not a single, universally agreed-upon concept. Multiple mathematical definitions exist, and they often conflict with each other. Demographic parity requires equal positive prediction rates across groups. Equal opportunity requires equal true positive rates. Calibration requires that predictions mean the same thing for all groups. The impossibility theorem shows that these definitions cannot all be satisfied simultaneously except in trivial cases.\n\nBias can enter ML systems at every stage of the pipeline. Historical bias exists in the training data itself, reflecting past discriminatory decisions. Representation bias occurs when certain groups are underrepresented in the data. Measurement bias arises when features are less accurately measured for some groups. Aggregation bias occurs when a single model is used for populations with fundamentally different patterns.\n\nAddressing fairness requires a sociotechnical approach that combines technical methods with domain expertise, stakeholder engagement, and ongoing monitoring. Purely technical solutions are insufficient because fairness depends on context, values, and the specific ways in which harm manifests. ML engineers must work with domain experts, affected communities, and policy stakeholders to define and implement appropriate fairness criteria.',
    blocks: [
      {
        type: 'paragraph',
        text: 'Fairness in machine learning concerns whether ML systems treat different demographic groups equitably. As ML systems increasingly make or inform consequential decisions in hiring, lending, criminal justice, and healthcare, ensuring these systems do not perpetuate or amplify societal biases has become a critical engineering and ethical responsibility.',
      },
      {
        type: 'definition',
        term: 'Algorithmic Fairness',
        definition: 'The study and practice of ensuring that ML systems do not produce systematically disadvantageous outcomes for members of protected demographic groups such as those defined by race, gender, age, or disability status.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'High-Stakes Impact',
        text: 'ML systems are already making or influencing decisions about who gets hired, who receives a loan, who is flagged by the criminal justice system, and who receives medical treatment. Unfair systems can cause real, measurable harm to vulnerable populations at scale.',
      },
      {
        type: 'callout',
        variant: 'example',
        title: 'The COMPAS Recidivism Algorithm',
        text: 'ProPublica\'s 2016 investigation of the COMPAS recidivism prediction tool found that Black defendants were nearly twice as likely as white defendants to be incorrectly classified as high-risk for reoffending, while white defendants were more likely to be incorrectly classified as low-risk. Northpointe (the vendor) countered that the tool was calibrated: among defendants scored as high-risk, similar proportions of Black and white defendants actually reoffended. This disagreement illustrates the impossibility theorem in practice -- COMPAS satisfied predictive parity but violated error-rate balance across racial groups.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Competing Definitions of Fairness',
      },
      {
        type: 'paragraph',
        text: 'Fairness is not a single, universally agreed-upon concept. Multiple mathematical definitions exist, and they often conflict with each other. Choosing which definition to optimize for is ultimately a value judgment that must be made in the context of each specific application.',
      },
      {
        type: 'equation',
        latex: 'P(\\hat{Y}=1 \\mid G=a) = P(\\hat{Y}=1 \\mid G=b)',
        label: 'Equation 17.1: Demographic Parity. The probability of a positive prediction must be equal across groups G=a and G=b. This criterion ignores the true label Y entirely, requiring equal selection rates regardless of qualification differences.',
      },
      {
        type: 'equation',
        latex: 'P(\\hat{Y}=1 \\mid Y=1, G=a) = P(\\hat{Y}=1 \\mid Y=1, G=b)',
        label: 'Equation 17.2: Equal Opportunity (Equalized Odds, relaxed). Among truly qualified individuals (Y=1), the probability of being selected must be equal across groups. The full equalized odds criterion additionally requires equal false positive rates.',
      },
      {
        type: 'equation',
        latex: '\\text{Disparate Impact Ratio} = \\frac{P(\\hat{Y}=1 \\mid G=\\text{unprivileged})}{P(\\hat{Y}=1 \\mid G=\\text{privileged})}',
        label: 'Equation 17.3: Disparate Impact Ratio. A value below 0.8 (the four-fifths rule) is commonly used as evidence of disparate impact in US employment law.',
      },
      {
        type: 'table',
        headers: ['Fairness Criterion', 'Formal Requirement', 'Intuition', 'When to Use'],
        rows: [
          ['Demographic Parity', 'P(\u0177=1|G=a) = P(\u0177=1|G=b)', 'Equal positive prediction rates across groups', 'When equal representation is the primary goal (e.g., hiring quotas)'],
          ['Equal Opportunity', 'P(\u0177=1|Y=1,G=a) = P(\u0177=1|Y=1,G=b)', 'Equal true positive rates across groups', 'When missing qualified individuals equally across groups matters most'],
          ['Equalized Odds', 'TPR and FPR equal across groups', 'Equal error rates for both positive and negative classes', 'When both false positives and false negatives carry significant costs'],
          ['Predictive Parity', 'P(Y=1|\u0177=1,G=a) = P(Y=1|\u0177=1,G=b)', 'Predictions mean the same thing for all groups', 'When trust in positive predictions must be equal across groups'],
          ['Calibration', 'P(Y=1|S=s,G=a) = P(Y=1|S=s,G=b)', 'At each score level, outcomes are equal across groups', 'When decision-makers rely on predicted probabilities'],
          ['Individual Fairness', 'Similar individuals get similar predictions', 'Treats like cases alike', 'When a meaningful similarity metric exists for individuals'],
        ],
        caption: 'Table 17.1: Common mathematical fairness definitions, their formal requirements, and guidance on when each is most appropriate.',
      },
      {
        type: 'callout',
        variant: 'note',
        title: 'The Impossibility Theorem',
        text: 'Chouldechova (2017) and Kleinberg et al. (2016) independently proved that demographic parity, equal opportunity, and predictive parity cannot all be satisfied simultaneously unless the base rates are equal across groups or the classifier is perfect. This means every fairness-aware system must make explicit trade-offs. There is no "fair by default" -- engineers and stakeholders must choose which definition of fairness to prioritize for each deployment context.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Sources of Bias in the ML Pipeline',
      },
      {
        type: 'paragraph',
        text: 'Bias can enter ML systems at every stage of the pipeline, from data collection through model deployment. Understanding these sources is essential for effective mitigation.',
      },
      {
        type: 'list',
        ordered: false,
        items: [
          'Historical bias: Training data reflects past discriminatory decisions (e.g., biased hiring records perpetuate gender imbalance)',
          'Representation bias: Certain groups are underrepresented in the data, leading to worse performance for those groups',
          'Measurement bias: Features are less accurately measured for some groups (e.g., credit scores for immigrants, health metrics for minorities)',
          'Aggregation bias: A single model is used for populations with fundamentally different underlying patterns',
          'Evaluation bias: Benchmarks or test sets do not adequately represent all groups',
          'Deployment bias: A system is used in contexts or for populations it was not designed for',
          'Feedback loop bias: Model predictions influence future data collection, reinforcing existing disparities over time',
        ],
      },
      {
        type: 'callout',
        variant: 'example',
        title: 'Amazon\'s Hiring Algorithm',
        text: 'In 2018, Reuters reported that Amazon scrapped an internal ML recruiting tool that showed systematic bias against women. The system was trained on 10 years of hiring data, which reflected the male-dominated tech industry. It penalized resumes containing the word "women\'s" (as in "women\'s chess club captain") and downgraded graduates of all-women\'s colleges. The system learned to replicate historical hiring patterns rather than identify the best candidates. This is a textbook example of historical bias: the training data encoded decades of gender discrimination in tech hiring.',
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Sociotechnical Approach',
        text: 'Purely technical solutions to fairness are insufficient. Effective fairness work requires collaboration between ML engineers, domain experts, affected communities, and policy stakeholders. Always start by asking: who might be harmed, and how? Map the stakeholders, understand the decision context, and let those considerations drive the choice of fairness criteria.',
      },
      {
        type: 'paragraph',
        text: 'Addressing fairness requires a sociotechnical approach that combines technical methods with domain expertise, stakeholder engagement, and ongoing monitoring. ML engineers must work with diverse teams to define and implement appropriate fairness criteria for each specific deployment context.',
      },
    ],
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
    blocks: [
      {
        type: 'paragraph',
        text: 'Explainability refers to the ability to understand why an ML model made a particular prediction. As models are deployed in high-stakes domains, stakeholders including regulators, end users, and domain experts increasingly demand explanations alongside predictions.',
      },
      {
        type: 'definition',
        term: 'Explainability',
        definition: 'The capacity to provide human-understandable reasons for why an ML model produced a specific output, enabling trust, debugging, and regulatory compliance.',
      },
      {
        type: 'definition',
        term: 'Interpretability',
        definition: 'The degree to which a human can understand the internal mechanics of a model. Interpretability is an inherent property of the model itself, whereas explainability can be achieved through post-hoc methods applied to any model.',
      },
      {
        type: 'callout',
        variant: 'note',
        title: 'Regulatory Requirements',
        text: 'The EU\'s GDPR includes a "right to explanation" for automated decisions, and the EU AI Act imposes transparency obligations on high-risk AI systems. The US Equal Credit Opportunity Act requires lenders to provide specific reasons for credit denials. Similar regulations are emerging globally, making explainability a practical engineering requirement, not just a nice-to-have.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Local Explanation Methods',
      },
      {
        type: 'paragraph',
        text: 'Local explanation methods provide reasons for individual predictions. These are especially valuable in user-facing applications where each affected person deserves to understand the basis for their outcome.',
      },
      {
        type: 'equation',
        latex: '\\phi_i(f, x) = \\sum_{S \\subseteq N \\setminus \\{i\\}} \\frac{|S|!(|N|-|S|-1)!}{|N|!} \\left[ f(S \\cup \\{i\\}) - f(S) \\right]',
        label: 'Equation 17.4: Shapley value for feature i. The contribution of feature i is its average marginal contribution across all possible feature coalitions S. This provides a theoretically grounded, unique attribution satisfying efficiency, symmetry, dummy, and additivity axioms.',
      },
      {
        type: 'code',
        language: 'python',
        code: 'import shap\nimport numpy as np\nfrom sklearn.ensemble import GradientBoostingClassifier\n\n# Train a model on tabular data\nmodel = GradientBoostingClassifier(n_estimators=100)\nmodel.fit(X_train, y_train)\n\n# Create SHAP explainer and compute values\nexplainer = shap.TreeExplainer(model)\nshap_values = explainer.shap_values(X_test)\n\n# Visualize feature importance for a single prediction\nshap.force_plot(\n    explainer.expected_value,\n    shap_values[0],       # SHAP values for first test instance\n    X_test.iloc[0],       # Feature values for first test instance\n    feature_names=feature_names\n)\n\n# Global summary: which features matter most overall\nshap.summary_plot(shap_values, X_test, feature_names=feature_names)',
        caption: 'Computing and visualizing SHAP values for a gradient boosting classifier. TreeExplainer is optimized for tree-based models; use KernelExplainer for model-agnostic explanations.',
      },
      {
        type: 'table',
        headers: ['Method', 'Approach', 'Strengths', 'Limitations'],
        rows: [
          ['LIME', 'Fits a local interpretable surrogate model in the neighborhood of each prediction', 'Model-agnostic, intuitive explanations', 'Explanations can be unstable; neighborhood definition is arbitrary'],
          ['SHAP', 'Uses game-theoretic Shapley values to attribute feature contributions', 'Theoretically grounded, consistent, additive', 'Computationally expensive for large feature sets (exact: exponential)'],
          ['Counterfactual', 'Finds minimal changes to input that would flip the prediction', 'Actionable ("change X to get a different result")', 'Multiple valid counterfactuals may exist; may suggest infeasible changes'],
          ['Attention Weights', 'Uses transformer attention as feature importance proxy', 'Built into model, no extra computation', 'Attention is not explanation; does not reliably indicate feature importance'],
          ['Integrated Gradients', 'Accumulates gradients along path from baseline to input', 'Satisfies sensitivity and implementation invariance axioms', 'Requires choosing a baseline; can be noisy for individual features'],
        ],
        caption: 'Table 17.2: Comparison of popular local explanation methods.',
      },
      {
        type: 'callout',
        variant: 'example',
        title: 'SHAP in Practice',
        text: 'For a loan denial, SHAP might reveal: income contributed -0.3 to the score, credit history contributed +0.5, and employment length contributed -0.4. This tells the applicant exactly which factors drove the decision and by how much. Crucially, SHAP values sum to the difference between the model\'s prediction and its average prediction, providing a complete and consistent decomposition.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Global Explanation Methods',
      },
      {
        type: 'paragraph',
        text: 'Global explanation methods reveal the overall behavior patterns of a model. Unlike local methods that explain one prediction at a time, global methods summarize what the model has learned across the entire dataset.',
      },
      {
        type: 'list',
        ordered: false,
        items: [
          'Feature importance: Ranks features by their average influence on predictions (e.g., mean absolute SHAP value)',
          'Partial dependence plots (PDPs): Show the marginal effect of one or two features on the predicted outcome, averaging over all other features',
          'Accumulated Local Effects (ALE): Similar to PDPs but handle correlated features correctly by using conditional instead of marginal distributions',
          'Concept-based explanations (TCAV): Identify high-level human-understandable concepts (e.g., "striped texture") and measure their influence on model predictions',
          'Global surrogate models: Train an interpretable model (decision tree, rule list) to approximate the black-box model\'s predictions across the dataset',
        ],
      },
      {
        type: 'heading',
        level: 3,
        text: 'Inherently Interpretable Models',
      },
      {
        type: 'paragraph',
        text: 'Inherently interpretable models like decision trees, linear models, and rule lists provide explanations by design rather than through post-hoc analysis. Generalized additive models (GAMs) offer a compelling middle ground with learned nonlinear feature functions but an additive structure that remains transparent.',
      },
      {
        type: 'code',
        language: 'python',
        code: 'from interpret.glassbox import ExplainableBoostingClassifier\n\n# EBM: a modern GAM with automatic interaction detection\nebm = ExplainableBoostingClassifier(\n    interactions=10,      # Automatically detect top-10 pairwise interactions\n    max_bins=256,\n    outer_bags=8,\n    inner_bags=0\n)\nebm.fit(X_train, y_train)\n\n# EBMs match gradient boosting accuracy on many tabular tasks\nprint(f"AUC: {roc_auc_score(y_test, ebm.predict_proba(X_test)[:, 1]):.4f}")\n\n# Global explanation: each feature\'s learned shape function\nfrom interpret import show\nebm_global = ebm.explain_global()\nshow(ebm_global)  # Interactive visualization of all feature shapes\n\n# Local explanation for a single prediction\nebm_local = ebm.explain_local(X_test[:5], y_test[:5])\nshow(ebm_local)',
        caption: 'Explainable Boosting Machines (EBMs) from InterpretML provide glass-box accuracy competitive with gradient boosting while remaining fully interpretable.',
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'When to Choose Interpretability',
        text: 'Before reaching for a complex black-box model, consider whether an interpretable model achieves acceptable accuracy for your task. In many tabular-data applications, the accuracy gap is small (often less than 1-2% AUC), and the gains in transparency, debuggability, and regulatory compliance are substantial. Modern GAMs like EBMs and NODE-GAMs close the gap further.',
      },
    ],
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
    blocks: [
      {
        type: 'paragraph',
        text: 'Bias auditing systematically evaluates an ML system for unfair treatment of protected groups. An audit typically involves disaggregating performance metrics by demographic groups, testing for disparate impact, and evaluating the system\'s behavior on targeted test cases designed to reveal biased patterns.',
      },
      {
        type: 'definition',
        term: 'Bias Audit',
        definition: 'A structured process of evaluating an ML system\'s predictions and performance metrics across demographic groups to identify and quantify unfair treatment or disparate outcomes. Audits should be conducted before deployment and regularly thereafter.',
      },
      {
        type: 'definition',
        term: 'Disparate Impact',
        definition: 'A legal and statistical concept where a facially neutral policy or system disproportionately harms a protected group. In ML, disparate impact occurs when a model\'s predictions or errors are unevenly distributed across demographic groups, even if the protected attribute is not used as an input feature.',
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'The Four-Fifths Rule',
        text: 'A common legal heuristic for disparate impact: if the selection rate for a protected group is less than 80% (four-fifths) of the rate for the highest-performing group, the system may be considered to have disparate impact. While not a complete fairness analysis, it is a useful initial screening tool widely used in US employment discrimination law.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Computing Fairness Metrics',
      },
      {
        type: 'paragraph',
        text: 'The first step in any bias audit is computing fairness metrics disaggregated by protected attributes. Libraries like Fairlearn and AIF360 provide standardized tools for this analysis. Below is a practical workflow for computing key fairness metrics.',
      },
      {
        type: 'code',
        language: 'python',
        code: 'from fairlearn.metrics import (\n    MetricFrame,\n    demographic_parity_difference,\n    demographic_parity_ratio,\n    equalized_odds_difference,\n)\nfrom sklearn.metrics import accuracy_score, precision_score, recall_score\nimport pandas as pd\n\n# Compute disaggregated metrics by protected attribute\nmetric_frame = MetricFrame(\n    metrics={\n        "accuracy": accuracy_score,\n        "precision": precision_score,\n        "recall": recall_score,\n    },\n    y_true=y_test,\n    y_pred=y_pred,\n    sensitive_features=sensitive_test  # e.g., gender or race\n)\n\n# View per-group performance\nprint("Per-group metrics:")\nprint(metric_frame.by_group)\n\n# Compute summary fairness metrics\nprint(f"\\nDemographic parity difference: "\n      f"{demographic_parity_difference(y_test, y_pred, sensitive_features=sensitive_test):.4f}")\nprint(f"Demographic parity ratio: "\n      f"{demographic_parity_ratio(y_test, y_pred, sensitive_features=sensitive_test):.4f}")\nprint(f"Equalized odds difference: "\n      f"{equalized_odds_difference(y_test, y_pred, sensitive_features=sensitive_test):.4f}")',
        caption: 'Computing disaggregated fairness metrics using Fairlearn. MetricFrame provides per-group breakdowns of any sklearn-compatible metric.',
      },
      {
        type: 'code',
        language: 'python',
        code: 'from aif360.datasets import BinaryLabelDataset\nfrom aif360.metrics import BinaryLabelDatasetMetric, ClassificationMetric\nimport numpy as np\n\n# Create AIF360 dataset with protected attribute metadata\ndataset = BinaryLabelDataset(\n    df=df,\n    label_names=["outcome"],\n    protected_attribute_names=["race"],\n    favorable_label=1,\n    unfavorable_label=0\n)\n\n# Compute dataset-level bias metrics (before model training)\nmetric = BinaryLabelDatasetMetric(\n    dataset,\n    unprivileged_groups=[{"race": 0}],\n    privileged_groups=[{"race": 1}]\n)\nprint(f"Disparate impact ratio: {metric.disparate_impact():.4f}")\nprint(f"Statistical parity difference: {metric.statistical_parity_difference():.4f}")\n\n# After model training, compute classification fairness metrics\nclassification_metric = ClassificationMetric(\n    dataset_true, dataset_pred,\n    unprivileged_groups=[{"race": 0}],\n    privileged_groups=[{"race": 1}]\n)\nprint(f"Equal opportunity difference: {classification_metric.equal_opportunity_difference():.4f}")\nprint(f"Average odds difference: {classification_metric.average_odds_difference():.4f}")\nprint(f"Theil index: {classification_metric.theil_index():.4f}")',
        caption: 'Bias detection using IBM AIF360. The library supports both dataset-level and model-level fairness metrics with a rich set of pre-built debiasing algorithms.',
      },
      {
        type: 'callout',
        variant: 'example',
        title: 'Healthcare Algorithm Bias',
        text: 'Obermeyer et al. (2019) discovered that a widely-used healthcare algorithm, affecting 200 million patients annually in the US, exhibited significant racial bias. The algorithm used healthcare cost as a proxy for healthcare need. Because Black patients historically had less access to healthcare and therefore lower costs at equivalent levels of illness, the algorithm systematically underestimated the health needs of Black patients. At any given risk score, Black patients were significantly sicker than white patients with the same score. Fixing the label (using health measures instead of cost) reduced bias by 84%.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Pre-Processing Methods',
      },
      {
        type: 'paragraph',
        text: 'Pre-processing fairness methods modify the training data to reduce bias before training. These techniques intervene at the data layer, making them model-agnostic and applicable regardless of the downstream model architecture.',
      },
      {
        type: 'list',
        ordered: false,
        items: [
          'Resampling: Over-sample underrepresented groups or under-sample overrepresented groups to balance group representation in the training data',
          'Reweighting: Assign higher weights to examples from disadvantaged groups to equalize their influence during training, adjusting for both group and label imbalances',
          'Fair representation learning: Learn a transformed feature space that removes protected attribute information while preserving task-relevant features (e.g., Zemel et al. Learning Fair Representations)',
          'Disparate impact remover: Transform features to reduce correlation with the protected attribute while preserving rank ordering within groups',
          'Label correction: Identify and correct labels that are likely to reflect historical bias rather than true outcomes',
        ],
      },
      {
        type: 'heading',
        level: 3,
        text: 'In-Processing Methods',
      },
      {
        type: 'paragraph',
        text: 'In-processing methods incorporate fairness constraints directly into the training objective, enabling the model to jointly optimize for accuracy and fairness. These approaches tend to achieve better accuracy-fairness trade-offs than pre- or post-processing methods because they can make nuanced adjustments throughout the learning process.',
      },
      {
        type: 'callout',
        variant: 'example',
        title: 'Adversarial Debiasing',
        text: 'In adversarial debiasing, the main model learns task predictions while a secondary adversary network tries to predict the protected attribute (e.g., gender) from the model\'s internal representations. The main model is trained to maximize task accuracy while minimizing the adversary\'s ability to recover the protected attribute, effectively removing protected information from the learned representations.',
      },
      {
        type: 'equation',
        latex: '\\mathcal{L}_{\\text{total}} = \\mathcal{L}_{\\text{task}}(\\theta) - \\lambda \\cdot \\mathcal{L}_{\\text{adversary}}(\\phi)',
        label: 'Equation 17.5: Adversarial debiasing loss. The task loss trains the predictor, while the negated adversary loss encourages the model to learn representations from which the protected attribute cannot be recovered. Lambda controls the fairness-accuracy trade-off.',
      },
      {
        type: 'code',
        language: 'python',
        code: 'from fairlearn.reductions import ExponentiatedGradient, DemographicParity\nfrom sklearn.linear_model import LogisticRegression\n\n# Use Fairlearn\'s ExponentiatedGradient for constrained optimization\n# This wraps any sklearn estimator with fairness constraints\nconstraint = DemographicParity()  # or EqualizedOdds(), TruePositiveRateParity()\n\nmitigator = ExponentiatedGradient(\n    estimator=LogisticRegression(max_iter=1000),\n    constraints=constraint,\n    eps=0.01  # Tolerance for constraint violation\n)\n\nmitigator.fit(X_train, y_train, sensitive_features=sensitive_train)\ny_pred_fair = mitigator.predict(X_test)\n\n# Compare fairness before and after mitigation\nfrom fairlearn.metrics import demographic_parity_difference\nprint(f"Before: DPD = {demographic_parity_difference(y_test, y_pred_orig, sensitive_features=sensitive_test):.4f}")\nprint(f"After:  DPD = {demographic_parity_difference(y_test, y_pred_fair, sensitive_features=sensitive_test):.4f}")',
        caption: 'Applying in-processing fairness constraints using Fairlearn\'s ExponentiatedGradient reduction. This method wraps any sklearn estimator and enforces a chosen fairness constraint during training.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Post-Processing Methods',
      },
      {
        type: 'paragraph',
        text: 'Post-processing methods adjust model outputs after training to satisfy fairness criteria. These are attractive because they do not require retraining the model and can be applied to any classifier, including proprietary models available only via API.',
      },
      {
        type: 'code',
        language: 'python',
        code: 'from fairlearn.postprocessing import ThresholdOptimizer\n\n# ThresholdOptimizer finds group-specific thresholds\n# that satisfy a fairness constraint while maximizing accuracy\npostprocessor = ThresholdOptimizer(\n    estimator=trained_model,\n    constraints="equalized_odds",  # or "demographic_parity"\n    objective="accuracy_score",\n    prefit=True                    # Model is already trained\n)\n\npostprocessor.fit(X_val, y_val, sensitive_features=sensitive_val)\ny_pred_adjusted = postprocessor.predict(X_test, sensitive_features=sensitive_test)\n\n# The optimizer selects different thresholds per group\n# to equalize error rates across demographic groups',
        caption: 'Post-processing threshold optimization using Fairlearn. Group-specific classification thresholds are selected to satisfy equalized odds or demographic parity constraints.',
      },
      {
        type: 'table',
        headers: ['Stage', 'Method', 'Pros', 'Cons'],
        rows: [
          ['Pre-processing', 'Resampling, reweighting, fair representations', 'Model-agnostic, simple to implement, addresses root cause in data', 'May discard useful information, limited effectiveness for complex bias'],
          ['Pre-processing', 'Disparate impact remover, label correction', 'Can be combined with any downstream model', 'Requires access to protected attributes in training data'],
          ['In-processing', 'Adversarial debiasing', 'Learns fair representations end-to-end', 'Requires modifying training loop, adversary can be unstable'],
          ['In-processing', 'Constrained optimization (ExponentiatedGradient)', 'Best accuracy-fairness trade-offs, theoretically grounded', 'Computationally expensive, model-specific implementation'],
          ['In-processing', 'Regularization (prejudice remover)', 'Simple to add to existing objectives', 'Sensitive to regularization strength, fairness criterion fixed'],
          ['Post-processing', 'Threshold adjustment', 'No retraining needed, easy to apply and explain', 'Requires protected attribute at inference time, limited bias types'],
          ['Post-processing', 'Calibration (Platt scaling per group)', 'Ensures predictions are equally reliable across groups', 'Only fixes calibration bias, not other fairness violations'],
        ],
        caption: 'Table 17.3: Comprehensive comparison of bias mitigation approaches by pipeline stage, method, advantages, and limitations.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'No Silver Bullet',
        text: 'No single mitigation technique addresses all forms of bias. A comprehensive fairness strategy typically combines methods from multiple stages and includes ongoing monitoring after deployment to detect bias drift over time. The choice of mitigation method depends on the fairness definition prioritized, whether protected attributes are available, and whether the model can be retrained.',
      },
    ],
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
    blocks: [
      {
        type: 'paragraph',
        text: 'AI governance encompasses the policies, processes, and organizational structures that ensure ML systems are developed and deployed responsibly. Effective governance includes clear ownership of AI systems, defined approval processes for high-risk deployments, and mechanisms for ongoing monitoring and accountability.',
      },
      {
        type: 'definition',
        term: 'AI Governance',
        definition: 'The framework of organizational policies, processes, roles, and technical infrastructure that ensures ML systems are developed, deployed, and operated in a responsible, accountable, and compliant manner.',
      },
      {
        type: 'definition',
        term: 'Responsible AI',
        definition: 'An umbrella framework encompassing fairness, accountability, transparency, ethics, safety, and privacy in AI systems. Responsible AI goes beyond technical performance to consider the broader societal impact of ML deployments.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Model Cards and Datasheets',
      },
      {
        type: 'paragraph',
        text: 'Model cards and datasheets provide standardized documentation for ML models and datasets respectively. These artifacts promote transparency and informed decision-making by making the characteristics, limitations, and intended use of ML artifacts explicit.',
      },
      {
        type: 'table',
        headers: ['Artifact', 'Documents', 'Key Sections', 'Introduced By'],
        rows: [
          ['Model Card', 'A trained ML model', 'Intended use, performance by group, limitations, ethical considerations', 'Mitchell et al. (2019)'],
          ['Datasheet', 'A dataset', 'Collection process, composition, intended use, potential biases, maintenance plan', 'Gebru et al. (2021)'],
          ['System Card', 'An end-to-end AI system', 'Architecture, components, interaction effects, deployment context', 'OpenAI (2023)'],
          ['Nutrition Label', 'A model or dataset', 'At-a-glance fairness, performance, and data quality metrics in a standardized visual format', 'Holland et al. (2018)'],
        ],
        caption: 'Table 17.4: Standard documentation artifacts for ML transparency and their origins.',
      },
      {
        type: 'code',
        language: 'python',
        code: '# Generating a model card with Fairlearn + sklearn\nfrom fairlearn.metrics import MetricFrame\nfrom sklearn.metrics import accuracy_score, f1_score\nimport json\n\ndef generate_model_card(model, X_test, y_test, sensitive_features, model_name):\n    """Generate a structured model card as a dictionary."""\n    y_pred = model.predict(X_test)\n\n    # Compute disaggregated metrics\n    mf = MetricFrame(\n        metrics={"accuracy": accuracy_score, "f1": f1_score},\n        y_true=y_test,\n        y_pred=y_pred,\n        sensitive_features=sensitive_features\n    )\n\n    model_card = {\n        "model_name": model_name,\n        "model_type": type(model).__name__,\n        "intended_use": "FILL: Describe the intended deployment context",\n        "out_of_scope_uses": "FILL: Describe uses the model was NOT designed for",\n        "overall_performance": {\n            "accuracy": float(mf.overall["accuracy"]),\n            "f1": float(mf.overall["f1"]),\n        },\n        "disaggregated_performance": mf.by_group.to_dict(),\n        "fairness_metrics": {\n            "max_accuracy_gap": float(mf.difference()["accuracy"]),\n            "max_f1_gap": float(mf.difference()["f1"]),\n        },\n        "limitations": "FILL: Known failure modes and limitations",\n        "ethical_considerations": "FILL: Potential risks and mitigations",\n    }\n    return model_card\n\ncard = generate_model_card(model, X_test, y_test, sensitive_test, "LoanApproval-v2")\nprint(json.dumps(card, indent=2))',
        caption: 'Programmatically generating a model card with disaggregated performance metrics. This template should be extended with qualitative sections filled in by the team.',
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Writing Effective Model Cards',
        text: 'A good model card should be written for its audience. Include quantitative performance metrics disaggregated by demographic groups, clearly state what the model should NOT be used for, and describe known failure modes. Treat it as a living document that is updated as the model evolves. Model cards are most valuable when they are honest about limitations, not when they serve as marketing materials.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Regulatory Landscape',
      },
      {
        type: 'paragraph',
        text: 'Regulatory frameworks for AI are evolving rapidly across the globe. ML engineers must be aware of the regulatory requirements in the jurisdictions where their systems are deployed.',
      },
      {
        type: 'table',
        headers: ['Risk Level', 'EU AI Act Requirements', 'Examples'],
        rows: [
          ['Unacceptable', 'Banned entirely', 'Social scoring, real-time biometric surveillance (with exceptions), manipulative AI targeting vulnerabilities'],
          ['High-Risk', 'Conformity assessment, ongoing monitoring, transparency, human oversight, data governance', 'Hiring and recruitment, lending and credit scoring, criminal justice, medical devices, critical infrastructure'],
          ['Limited-Risk', 'Transparency obligations (disclose AI involvement)', 'Chatbots, deepfake generation, emotion recognition'],
          ['Minimal-Risk', 'No specific requirements (voluntary codes of conduct)', 'Spam filters, video game AI, inventory management'],
        ],
        caption: 'Table 17.5: EU AI Act risk classification framework with representative system examples.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Evolving Regulations',
        text: 'AI regulation is a fast-moving field. The EU AI Act, China\'s AI regulations, Canada\'s AIDA, Brazil\'s AI framework, and proposed US legislation create a complex patchwork of requirements. Organizations deploying globally must track multiple regulatory regimes and design systems that can adapt to varying compliance requirements. Non-compliance penalties under the EU AI Act can reach 35 million euros or 7% of global annual revenue.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Internal Governance Structures',
      },
      {
        type: 'paragraph',
        text: 'Internal governance structures provide the organizational scaffolding for responsible AI practices. Without clear roles, processes, and accountability mechanisms, even technically sound fairness measures can fail to be implemented consistently.',
      },
      {
        type: 'list',
        ordered: true,
        items: [
          'AI Ethics Board: Provides guidance on difficult decisions and ensures consistency across the organization. Should include diverse perspectives from engineering, legal, ethics, and affected communities.',
          'Model Review Process: Gates deployment decisions based on fairness, safety, and reliability evaluations. Every high-risk model should pass a structured review before production deployment.',
          'Incident Response Procedures: Defines how to detect, escalate, and remediate unexpected harm from deployed systems. Include rollback procedures and communication plans.',
          'Audit Trail: Maintains records of all decisions, data versions, model versions, and fairness evaluations for accountability and regulatory compliance.',
          'Continuous Monitoring: Tracks fairness metrics in production to detect bias drift caused by changing data distributions, population shifts, or feedback loops.',
        ],
      },
      {
        type: 'callout',
        variant: 'note',
        title: 'Governance Is Not Just Compliance',
        text: 'While regulatory compliance is important, effective AI governance goes beyond checking boxes. It creates a culture of responsibility where every team member considers the potential impacts of their work and has clear channels for raising concerns. The best governance frameworks are proactive, not reactive -- they catch potential harms during design, not after deployment.',
      },
    ],
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
    blocks: [
      {
        type: 'paragraph',
        text: 'Accountability in ML systems requires technical infrastructure for auditability and organizational processes for responsibility. Every prediction should be traceable to the model version, data version, and configuration that produced it.',
      },
      {
        type: 'definition',
        term: 'ML Accountability',
        definition: 'The combination of technical audit trails and organizational responsibility structures that enable tracing every prediction back to its model, data, and configuration, and assigning clear responsibility for system outcomes.',
      },
      {
        type: 'callout',
        variant: 'note',
        title: 'The Audit Trail',
        text: 'A complete audit trail for an ML prediction includes: the model version (weights, architecture, hyperparameters), the training data version, the feature values at inference time, the prediction itself, and any post-processing applied. This enables full reproducibility and root cause analysis. Modern ML platforms like MLflow and Weights & Biases provide tooling for maintaining these audit trails.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Fairness Monitoring in Production',
      },
      {
        type: 'paragraph',
        text: 'Deploying a fair model is not enough -- fairness must be continuously monitored in production. Data distributions shift over time, user populations change, and feedback loops can amplify initially small disparities. A comprehensive monitoring system tracks fairness metrics alongside standard performance metrics and alerts when thresholds are violated.',
      },
      {
        type: 'code',
        language: 'python',
        code: 'import numpy as np\nfrom dataclasses import dataclass\nfrom typing import Optional\n\n@dataclass\nclass FairnessAlert:\n    metric: str\n    group: str\n    value: float\n    threshold: float\n    severity: str  # "warning" or "critical"\n\ndef monitor_fairness(\n    y_pred: np.ndarray,\n    sensitive: np.ndarray,\n    y_true: Optional[np.ndarray] = None,\n    dp_threshold: float = 0.05,\n    eod_threshold: float = 0.1,\n    dir_threshold: float = 0.8,  # Disparate impact ratio\n) -> list[FairnessAlert]:\n    """Monitor fairness metrics and return alerts for violations."""\n    alerts: list[FairnessAlert] = []\n    groups = np.unique(sensitive)\n    rates = {g: y_pred[sensitive == g].mean() for g in groups}\n\n    # Check demographic parity\n    max_rate = max(rates.values())\n    for group, rate in rates.items():\n        diff = abs(rate - max_rate)\n        if diff > dp_threshold:\n            alerts.append(FairnessAlert(\n                metric="demographic_parity_difference",\n                group=str(group),\n                value=diff,\n                threshold=dp_threshold,\n                severity="critical" if diff > 2 * dp_threshold else "warning"\n            ))\n\n    # Check disparate impact ratio (four-fifths rule)\n    min_rate = min(rates.values())\n    if max_rate > 0:\n        di_ratio = min_rate / max_rate\n        if di_ratio < dir_threshold:\n            alerts.append(FairnessAlert(\n                metric="disparate_impact_ratio",\n                group="overall",\n                value=di_ratio,\n                threshold=dir_threshold,\n                severity="critical" if di_ratio < 0.6 else "warning"\n            ))\n\n    # Check equalized odds (requires ground truth)\n    if y_true is not None:\n        for group in groups:\n            mask = sensitive == group\n            tpr = y_pred[mask & (y_true == 1)].mean() if (y_true[mask] == 1).any() else 0\n            fpr = y_pred[mask & (y_true == 0)].mean() if (y_true[mask] == 0).any() else 0\n            # Compare against overall TPR/FPR\n            overall_tpr = y_pred[y_true == 1].mean()\n            if abs(tpr - overall_tpr) > eod_threshold:\n                alerts.append(FairnessAlert(\n                    metric="equalized_odds_tpr",\n                    group=str(group),\n                    value=abs(tpr - overall_tpr),\n                    threshold=eod_threshold,\n                    severity="warning"\n                ))\n    return alerts',
        caption: 'A production fairness monitoring function that checks demographic parity, disparate impact ratio, and equalized odds, returning structured alerts when thresholds are exceeded.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Human-in-the-Loop Systems',
      },
      {
        type: 'paragraph',
        text: 'Human-in-the-loop systems maintain human oversight for consequential decisions. Rather than fully automating high-stakes decisions, these systems present ML predictions alongside explanations and let human decision-makers make the final call.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Automation Bias',
        text: 'Automation bias is the tendency for humans to over-rely on automated recommendations, effectively rubber-stamping ML outputs. Interface design must actively counteract this by requiring the human to engage with the evidence, not just see the recommendation. Studies show that simply displaying a confidence score is insufficient to prevent automation bias. Effective designs include requiring the human to form an initial judgment before seeing the model\'s prediction.',
      },
      {
        type: 'table',
        headers: ['Oversight Level', 'Description', 'Use Case', 'Risk'],
        rows: [
          ['Human-in-the-loop', 'Human makes every decision with ML assistance', 'Medical diagnosis, criminal sentencing, loan decisions', 'Automation bias, decision fatigue at scale'],
          ['Human-on-the-loop', 'ML acts autonomously but human monitors and can intervene', 'Content moderation, fraud detection, autonomous vehicles', 'Alert fatigue, delayed intervention'],
          ['Human-out-of-the-loop', 'Fully automated with no real-time human oversight', 'Spam filtering, recommendation systems, ad targeting', 'No recourse for errors, feedback loop amplification'],
        ],
        caption: 'Table 17.6: Levels of human oversight in ML systems, appropriate use cases, and associated risks.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Feedback and Contestability',
      },
      {
        type: 'paragraph',
        text: 'Feedback mechanisms allow affected individuals to contest ML decisions and provide information that improves the system. Contestability is increasingly recognized as a fundamental right when algorithmic decisions have significant impact on individuals.',
      },
      {
        type: 'callout',
        variant: 'example',
        title: 'Contestability in Practice',
        text: 'A well-designed contestability system for loan decisions would: (1) provide a plain-language explanation of the denial, (2) identify the top factors that influenced the decision, (3) suggest concrete actions the applicant could take to improve their outcome, (4) offer a clear, accessible process for human review of the automated decision, and (5) track contest outcomes to identify systematic errors in the model. The US Fair Credit Reporting Act already requires adverse action notices with specific reasons for denial.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Proactive Harm Assessment',
      },
      {
        type: 'paragraph',
        text: 'Proactive harm assessment evaluates potential negative impacts before deployment rather than reacting to harm after it occurs. This practice is increasingly required by regulation and is good engineering that prevents costly failures.',
      },
      {
        type: 'list',
        ordered: true,
        items: [
          'Identify affected populations and potential harms by mapping all stakeholders who interact with or are impacted by the system',
          'Assess likelihood and severity of each harm using structured risk matrices',
          'Evaluate existing safeguards and their adequacy through red-teaming and adversarial testing',
          'Define monitoring metrics and alert thresholds to detect unexpected harm in production',
          'Establish escalation and remediation procedures including model rollback criteria',
          'Schedule regular reassessment as the system, user population, and deployment context evolve',
        ],
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Start Early, Iterate Often',
        text: 'Impact assessments are most valuable when started early in the development process, not as a checkbox before launch. Early assessment can redirect development toward safer designs before significant engineering investment has been made. Treat fairness and accountability as first-class requirements throughout the ML lifecycle -- from problem formulation through monitoring in production.',
      },
      {
        type: 'paragraph',
        text: 'Building accountable ML systems is not solely a technical challenge. It requires organizational commitment, diverse teams, clear processes, and a culture that prioritizes the wellbeing of affected populations alongside system performance. The technical tools and frameworks described in this chapter are necessary but not sufficient -- they must be embedded in organizations and processes that take responsibility for the outcomes of the systems they build.',
      },
    ],
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
  { term: 'SHAP', definition: 'SHapley Additive exPlanations, a game-theoretic method that attributes each feature\'s contribution to a prediction using Shapley values from cooperative game theory.' },
  { term: 'Demographic Parity', definition: 'A fairness criterion requiring equal positive prediction rates across demographic groups, regardless of true qualification rates.' },
  { term: 'Equalized Odds', definition: 'A fairness criterion requiring equal true positive rates and equal false positive rates across demographic groups.' },
  { term: 'Disparate Impact', definition: 'When a system\'s outcomes disproportionately affect a protected group, even without explicit use of the protected attribute.' },
  { term: 'Adversarial Debiasing', definition: 'A technique that trains a model jointly with an adversary to remove protected attribute information from learned representations.' },
  { term: 'Calibration', definition: 'The property that predicted probabilities match observed frequencies, particularly across different demographic groups.' },
  { term: 'Fairlearn', definition: 'An open-source Python library from Microsoft for assessing and improving fairness of ML models, providing metrics and mitigation algorithms.' },
  { term: 'AIF360', definition: 'AI Fairness 360, an open-source toolkit from IBM containing fairness metrics, bias detection tools, and mitigation algorithms for ML systems.' },
];

export const keyTakeaways: string[] = [
  'Multiple fairness definitions exist and often conflict; choosing which to prioritize requires explicit value judgments and stakeholder input.',
  'Bias can enter ML systems at every pipeline stage, from data collection through model development to deployment, and feedback loops can amplify initial disparities.',
  'Real-world bias incidents (COMPAS, Amazon hiring, healthcare algorithms) demonstrate the importance of proactive bias detection and the limitations of purely technical solutions.',
  'Explainability methods like SHAP and LIME provide post-hoc explanations, but inherently interpretable models like EBMs offer transparency by design with competitive accuracy.',
  'Fairness metrics must be computed using disaggregated analysis; aggregate metrics can mask significant disparities between demographic groups.',
  'AI governance requires organizational structures (ethics boards, review processes) alongside technical tools (model cards, audit trails, monitoring dashboards).',
  'Proactive impact assessment before deployment is more effective and less costly than reacting to harm after it occurs.',
  'Continuous fairness monitoring in production is essential because data distributions shift, populations change, and feedback loops can amplify bias over time.',
];

export const learningObjectives: string[] = [
  'Compare mathematical fairness definitions including demographic parity, equal opportunity, equalized odds, and calibration',
  'Identify sources of bias at each stage of the ML pipeline from data collection through deployment',
  'Compute fairness metrics using Fairlearn and AIF360 to detect disparate impact and error-rate imbalances',
  'Apply pre-processing, in-processing, and post-processing debiasing techniques and evaluate their trade-offs',
  'Apply explainability methods such as SHAP and LIME to interpret model predictions for stakeholders',
  'Design an AI governance framework with model cards, audit trails, and ethics review processes',
  'Evaluate the impossibility theorem and articulate the trade-offs inherent in fairness-aware system design',
  'Implement continuous fairness monitoring for ML systems deployed in production',
];
