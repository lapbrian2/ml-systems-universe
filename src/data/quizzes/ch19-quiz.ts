import type { ChapterQuiz } from '@/types/quiz';

export const ch19Quiz: ChapterQuiz = {
  chapterId: 'ch19',
  title: 'AI for Good Quiz',
  description: 'Test your understanding of beneficial ML applications in healthcare, climate, and social impact.',
  passingScore: 70,
  selectCount: 5,
  pool: [
    {
      id: 'ch19-q1',
      question: 'How is ML being applied in healthcare diagnostics?',
      options: [
        'Only for administrative hospital management',
        'ML models analyze medical images, pathology slides, and clinical data to assist in detecting diseases like cancer, diabetic retinopathy, and cardiac conditions',
        'ML has completely replaced human doctors in all diagnostic tasks',
        'Healthcare does not benefit from ML applications',
      ],
      correctIndex: 1,
      explanation:
        'ML systems have shown expert-level performance in detecting certain conditions from medical images (retinal scans, mammograms, skin lesions). They augment clinicians by flagging potential issues, providing second opinions, and enabling screening at scale in underserved areas.',
      difficulty: 'easy',
    },
    {
      id: 'ch19-q2',
      question: 'What unique challenges arise when deploying ML in healthcare settings?',
      options: [
        'Healthcare data is always abundant and perfectly labeled',
        'Strict regulatory requirements (FDA approval), patient privacy (HIPAA), high stakes of errors, distribution shift across populations, and the need for explainability',
        'Healthcare ML systems do not need to be accurate',
        'The only challenge is computational cost',
      ],
      correctIndex: 1,
      explanation:
        'Healthcare ML faces unique hurdles: regulatory approval (FDA for diagnostic tools), privacy mandates (HIPAA, GDPR), life-or-death stakes requiring high reliability, demographic variation (models must work across diverse populations), and clinical trust requiring explainable predictions.',
      difficulty: 'medium',
    },
    {
      id: 'ch19-q3',
      question: 'How can ML contribute to climate change mitigation?',
      options: [
        'ML cannot help with climate change',
        'By optimizing energy grids, improving weather and climate modeling, enabling smart agriculture, monitoring deforestation, and accelerating materials discovery for clean energy',
        'Only by reducing AI\'s own carbon footprint',
        'By replacing all fossil fuel power plants with AI',
      ],
      correctIndex: 1,
      explanation:
        'ML contributes to climate action through: optimizing power grid dispatch and renewable integration, improving climate simulation resolution, enabling precision agriculture (reducing waste), satellite-based deforestation monitoring, and discovering new battery and solar materials.',
      difficulty: 'easy',
    },
    {
      id: 'ch19-q4',
      question: 'What is the concept of "AI for social good" and what principles guide it?',
      options: [
        'Any AI application that generates profit',
        'Using AI to address societal challenges while ensuring equitable access, avoiding harm, respecting privacy, and involving affected communities in design decisions',
        'AI that receives positive media coverage',
        'AI systems that are open source',
      ],
      correctIndex: 1,
      explanation:
        'AI for social good is guided by principles of beneficence (positive impact), equity (reaching underserved populations), accountability (clear ownership), participatory design (involving affected communities), and do-no-harm (avoiding unintended negative consequences).',
      difficulty: 'medium',
    },
    {
      id: 'ch19-q5',
      question: 'What role does ML play in autonomous vehicle systems?',
      options: [
        'ML only controls the car radio and entertainment system',
        'ML handles perception (detecting objects and road features), prediction (forecasting other agents\' behavior), and planning (deciding safe driving actions)',
        'Autonomous vehicles do not use ML',
        'ML only handles navigation routing',
      ],
      correctIndex: 1,
      explanation:
        'Autonomous vehicles rely on ML across the stack: computer vision for object detection and lane recognition, prediction models for anticipating pedestrian and vehicle behavior, and planning/control systems for making safe driving decisions in complex environments.',
      difficulty: 'easy',
    },
    {
      id: 'ch19-q6',
      question: 'What is a key risk when applying ML to high-stakes social domains?',
      options: [
        'The models might become too accurate',
        'Algorithmic bias can perpetuate or amplify existing societal inequities, particularly when training data reflects historical discrimination',
        'The only risk is computational cost',
        'ML applications in social domains are always risk-free',
      ],
      correctIndex: 1,
      explanation:
        'ML systems trained on historical data can encode past discrimination (e.g., biased hiring, criminal justice risk scores, loan decisions). Without careful auditing, these systems can systematically disadvantage marginalized groups at scale, amplifying rather than reducing inequality.',
      difficulty: 'medium',
    },
    {
      id: 'ch19-q7',
      question: 'How is NLP being used for beneficial applications?',
      options: [
        'NLP has no beneficial applications',
        'Language translation for refugee services, mental health chatbots, accessibility tools for the visually impaired, and crisis response through social media analysis',
        'NLP is only used for chatbots on commercial websites',
        'NLP can only process English text',
      ],
      correctIndex: 1,
      explanation:
        'NLP enables: breaking language barriers for displaced populations, early detection of mental health crises through text analysis, screen readers and text-to-speech for accessibility, and analyzing social media during natural disasters to coordinate emergency response.',
      difficulty: 'medium',
    },
    {
      id: 'ch19-q8',
      question: 'What is the challenge of "deploying AI in low-resource settings"?',
      options: [
        'There are no challenges; AI works the same everywhere',
        'Limited connectivity, power constraints, lack of labeled local data, need for models that work on low-cost hardware, and cultural/linguistic adaptation requirements',
        'Low-resource settings have more data available',
        'AI is only designed for high-resource environments',
      ],
      correctIndex: 1,
      explanation:
        'Deploying AI in developing regions faces: intermittent connectivity (requiring on-device inference), limited power (energy-efficient models), scarce local labeled data (transfer learning, few-shot), low-cost hardware (extreme optimization), and the need for localization.',
      difficulty: 'hard',
    },
    {
      id: 'ch19-q9',
      question: 'What is precision agriculture, and how does ML enable it?',
      options: [
        'Growing crops in a laboratory',
        'Using ML to analyze satellite imagery, soil sensors, and weather data to optimize irrigation, fertilization, and pest management at a field-by-field or plant-by-plant level',
        'Farming with more precise hand tools',
        'ML is not used in agriculture',
      ],
      correctIndex: 1,
      explanation:
        'Precision agriculture uses ML to process multi-spectral satellite imagery, IoT sensor data, and weather forecasts to make targeted decisions: irrigating only dry zones, applying pesticides only where pests are detected, and predicting optimal harvest times — reducing waste and environmental impact.',
      difficulty: 'hard',
    },
    {
      id: 'ch19-q10',
      question: 'Why is participatory design important for AI-for-good projects?',
      options: [
        'It is not important; AI experts know best',
        'Involving affected communities in the design process ensures the system addresses real needs, avoids unintended harms, and builds trust and adoption',
        'It only matters for commercial AI products',
        'Participatory design slows down development without benefit',
      ],
      correctIndex: 1,
      explanation:
        'Without community input, well-intentioned AI projects can fail to address actual needs, impose external assumptions, or cause unintended negative consequences. Participatory design ensures solutions are contextually appropriate, culturally sensitive, and genuinely beneficial.',
      difficulty: 'hard',
    },
  ],
};
