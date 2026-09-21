export const SUBJECTS = [
  { id: 'se-pmf', label: 'Software Engineering', icon: '💻' },
  { id: 'adv-ml', label: 'Advanced Machine Learning', icon: '🤖' },
  { id: 'cn-sec', label: 'Computer Networks & Security', icon: '🔒' }
];

export const QUIZ_DATA = {
  'adv-ml': [
    {
      type: 'mcq',
      question: 'Which of the following is an unsupervised learning algorithm?',
      options: ['Linear Regression', 'Support Vector Machine', 'K-Means Clustering', 'Random Forest'],
      correctIndex: 2,
      explanation: 'K-Means Clustering does not require labeled data and groups data points based on similarity.'
    },
    {
      type: 'subjective',
      question: 'Explain the concept of Overfitting in Machine Learning models.',
      expectedAnswer: 'Overfitting occurs when a model learns the training data too well, including noise, resulting in poor generalization to new, unseen data.'
    }
  ],
  'cn-sec': [
    {
      type: 'subjective',
      question: 'Briefly describe the difference between TCP and UDP protocols.',
      expectedAnswer: 'TCP is connection-oriented and guarantees delivery, while UDP is connectionless, faster, but does not guarantee delivery.'
    }
  ]
};
