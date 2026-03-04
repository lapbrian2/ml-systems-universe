import type { ChapterSection, GlossaryTerm } from '@/types/chapter';

export const sections: ChapterSection[] = [
  {
    id: 'ch19-s1',
    heading: 'ML for Social Impact',
    body: 'Machine learning has enormous potential to address pressing social challenges when applied thoughtfully and responsibly. From improving healthcare outcomes to advancing climate science to enhancing education, ML systems can amplify human capability in ways that benefit society broadly. However, realizing this potential requires careful attention to the specific needs and constraints of each application domain.\n\nEffective ML for social impact requires deep collaboration between ML engineers and domain experts. Models must be designed for the realities of deployment in resource-constrained settings, where high-end GPUs may not be available, internet connectivity may be intermittent, and end users may have limited technical literacy. These constraints demand creative engineering solutions.\n\nThe measurement of social impact presents unique challenges. Unlike commercial metrics that are easily quantifiable, social outcomes may be difficult to measure, may manifest over long time horizons, and may involve competing stakeholder interests. Defining appropriate metrics and evaluation frameworks is a critical first step that requires community engagement.\n\nOpen-source tools, pre-trained models, and shared datasets lower the barrier to deploying ML for social good. Organizations like Partnership on AI, AI for Good Foundation, and Google.org support this work through funding, expertise, and infrastructure. Academic programs and competitions also channel ML talent toward impactful applications.',
    order: 0,
    keyConcepts: [
      { term: 'AI for Social Good', definition: 'The application of ML and AI technologies to address pressing social and environmental challenges, from healthcare to climate to education.' },
      { term: 'Domain Adaptation', definition: 'Adapting ML models trained on one dataset or domain to work effectively in a different but related domain, essential for deploying models in new social contexts.' },
    ],
  },
  {
    id: 'ch19-s2',
    heading: 'Healthcare AI Applications',
    body: 'Healthcare is one of the most promising and consequential domains for ML applications. Medical image analysis, drug discovery, clinical decision support, and genomic analysis all benefit from ML\'s ability to find patterns in complex, high-dimensional data. The stakes are high: effective healthcare AI can save lives, while errors can cause serious harm.\n\nMedical image analysis is among the most mature healthcare AI applications. ML models can detect diabetic retinopathy from retinal scans, identify cancerous lesions in radiology images, and segment anatomical structures for surgical planning. These systems often achieve accuracy comparable to specialist physicians, particularly in screening applications where they can reduce the burden on limited medical expertise.\n\nDrug discovery has been transformed by ML approaches that predict molecular properties, generate novel drug candidates, and optimize clinical trial designs. AlphaFold\'s protein structure prediction breakthrough demonstrates the transformative potential of ML in biology. ML accelerates the drug development pipeline by reducing the need for expensive wet-lab experiments.\n\nDeployment of healthcare AI faces unique regulatory and ethical challenges. Medical devices incorporating ML must obtain regulatory approval (FDA clearance in the US, CE marking in the EU). Clinical validation requires rigorous testing on diverse patient populations. Integration with electronic health records and clinical workflows requires interoperability standards and careful user experience design.',
    order: 1,
    keyConcepts: [
      { term: 'Medical Image Analysis', definition: 'The application of ML to interpret medical imaging data (X-rays, MRI, pathology slides) for diagnosis, screening, and treatment planning.' },
      { term: 'Clinical Decision Support', definition: 'ML systems that assist healthcare providers in making diagnostic or treatment decisions by analyzing patient data and medical evidence.' },
    ],
  },
  {
    id: 'ch19-s3',
    heading: 'Climate and Environmental AI',
    body: 'ML systems contribute to climate action through improved weather and climate modeling, energy system optimization, environmental monitoring, and materials discovery for clean energy technologies. These applications leverage ML\'s ability to model complex physical systems and extract patterns from large observational datasets.\n\nWeather forecasting has been revolutionized by ML approaches. GraphCast and Pangu-Weather demonstrate that ML models can match or exceed traditional numerical weather prediction models at a fraction of the computational cost. This efficiency enables more frequent forecasts, longer prediction horizons, and ensemble approaches that better quantify uncertainty.\n\nEnergy system optimization uses ML to balance supply and demand in power grids with increasing renewable energy penetration. ML forecasts renewable generation, predicts demand patterns, and optimizes battery storage dispatch. These applications directly reduce carbon emissions by enabling higher renewable energy utilization and reducing reliance on fossil fuel backup generation.\n\nEnvironmental monitoring through satellite imagery analysis enables tracking deforestation, monitoring biodiversity, detecting illegal mining, and assessing climate change impacts at global scale. ML automates the analysis of petabytes of satellite data that would be impossible to process manually, providing actionable information for conservation and policy decisions.',
    order: 2,
    keyConcepts: [
      { term: 'Climate AI', definition: 'ML applications that contribute to climate change mitigation and adaptation, including weather prediction, energy optimization, and environmental monitoring.' },
      { term: 'ML Weather Prediction', definition: 'Data-driven weather forecasting using neural networks trained on historical weather data, achieving accuracy comparable to physics-based models at lower computational cost.' },
    ],
  },
  {
    id: 'ch19-s4',
    heading: 'Education and Accessibility',
    body: 'ML-powered educational tools can personalize learning experiences, provide intelligent tutoring, automate assessment, and make education more accessible to underserved populations. Adaptive learning systems adjust content difficulty and sequencing based on individual student performance, providing each learner with an optimized path through the material.\n\nNatural language processing enables powerful educational applications including automated essay scoring, question generation, language learning assistants, and content summarization. Large language models can serve as interactive tutoring systems that explain concepts, answer questions, and provide worked examples in a conversational format.\n\nAccessibility applications use ML to break down barriers for people with disabilities. Speech recognition enables voice-controlled interfaces. Computer vision powers image description for the visually impaired. Sign language recognition bridges communication gaps. Real-time translation and captioning make content accessible across languages and hearing abilities.\n\nDeploying ML in education requires special attention to equity, privacy, and developmental appropriateness. Systems must work equally well for students from diverse backgrounds and not reinforce existing educational inequities. Student data privacy protections are essential, particularly for younger learners. And the role of ML should complement rather than replace human teachers and mentors.',
    order: 3,
    keyConcepts: [
      { term: 'Adaptive Learning', definition: 'Educational technology that adjusts content difficulty, sequencing, and presentation based on individual student performance and learning patterns.' },
      { term: 'Assistive Technology', definition: 'ML-powered tools that help people with disabilities interact with technology and access information, including speech recognition, image description, and sign language recognition.' },
    ],
  },
  {
    id: 'ch19-s5',
    heading: 'Humanitarian AI Applications',
    body: 'Humanitarian applications of ML address urgent needs in disaster response, poverty alleviation, food security, and conflict prevention. ML systems can process satellite imagery to assess disaster damage, predict food insecurity from economic and environmental indicators, and optimize resource allocation for humanitarian organizations.\n\nDisaster response benefits from ML through rapid damage assessment, population displacement estimation, and resource need prediction. After natural disasters, satellite and aerial imagery analysis can provide damage maps within hours, guiding relief efforts to the most affected areas. Social media analysis provides real-time situational awareness during emergencies.\n\nAgricultural applications of ML help smallholder farmers in developing regions by providing crop disease detection, yield prediction, and precision agriculture guidance through mobile phone applications. These tools can significantly improve food security by enabling earlier intervention for crop diseases and better resource allocation.\n\nThe deployment of humanitarian AI requires navigating challenges around data availability, infrastructure limitations, and cultural context. Many humanitarian settings have poor data coverage, unreliable connectivity, and diverse languages and customs. Successful humanitarian AI projects invest heavily in understanding local context, building local capacity, and ensuring that technology serves rather than displaces existing community structures.',
    order: 4,
    keyConcepts: [
      { term: 'Disaster Response AI', definition: 'ML applications that support humanitarian response to natural disasters through rapid damage assessment, population tracking, and resource optimization.' },
      { term: 'Precision Agriculture', definition: 'The use of ML and sensor data to optimize agricultural practices at fine spatial scales, improving yields while reducing resource waste.' },
    ],
  },
];

export const glossary: GlossaryTerm[] = [
  { term: 'AI for Good', definition: 'The application of artificial intelligence to address societal challenges in areas like health, climate, education, and humanitarian response.' },
  { term: 'Healthcare AI', definition: 'ML applications in medicine including medical imaging, drug discovery, and clinical decision support.' },
  { term: 'Climate AI', definition: 'ML applications addressing climate change through weather prediction, energy optimization, and environmental monitoring.' },
  { term: 'Adaptive Learning', definition: 'Educational technology that personalizes content and difficulty based on individual student performance.' },
  { term: 'Precision Agriculture', definition: 'Data-driven farming practices that optimize resource use at fine spatial scales using ML and sensor data.' },
  { term: 'Assistive Technology', definition: 'Technology that helps people with disabilities access information and interact with their environment.' },
];

export const keyTakeaways: string[] = [
  'Effective ML for social impact requires deep collaboration between ML engineers and domain experts in each application area.',
  'Healthcare AI shows enormous promise in medical imaging and drug discovery but faces stringent regulatory and ethical requirements.',
  'Climate AI applications in weather prediction and energy optimization can directly reduce carbon emissions.',
  'Accessibility applications of ML break down barriers for people with disabilities across speech, vision, and language.',
  'Humanitarian AI must navigate challenges of data scarcity, infrastructure limitations, and cultural context in deployment.',
];
