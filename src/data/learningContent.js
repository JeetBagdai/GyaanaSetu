// src/data/learningContent.js

export const SEMESTERS = [
  { id: '3', label: 'Semester 3' },
  { id: '4', label: 'Semester 4' },
  { id: '5', label: 'Semester 5' },
  { id: '6', label: 'Semester 6' },
  { id: '7', label: 'Semester 7' },
  { id: '8', label: 'Semester 8' }
];

export const SUBJECTS_DATA = [
  // Semester 3
  { code: '24MAC131', title: 'Fourier Transform, Mathematical logic and Advanced Linear Algebra', sem: 3, L: 2, T: 2, P: 0, J: 0 },
  { code: '24AML132', title: 'Computer Organization and Architecture', sem: 3, L: 3, T: 0, P: 0, J: 0 },
  { code: '24AML133', title: 'Artificial Intelligence', sem: 3, L: 3, T: 0, P: 2, J: 0 },
  { code: '24AML134', title: 'Data Structures & Applications', sem: 3, L: 3, T: 0, P: 2, J: 0 },
  { code: '24AML135', title: 'Microcontroller and Embedded Systems', sem: 3, L: 1, T: 2, P: 2, J: 0 },
  { code: '24AML136', title: 'Object Oriented Programming using Java', sem: 3, L: 0, T: 0, P: 2, J: 2 },
  { code: '24AML137', title: 'Innovative Project Lab (Social Concern)', sem: 3, L: 0, T: 0, P: 0, J: 2 },
  { code: '24SFT138', title: 'Soft Skill - 1', sem: 3, L: 0, T: 0, P: 2, J: 0 },

  // Semester 4
  { code: '24MAC141', title: 'Statistics, Probability and Graph theory', sem: 4, L: 2, T: 2, P: 0, J: 0 },
  { code: '24AML142', title: 'Operating System', sem: 4, L: 3, T: 0, P: 0, J: 0 },
  { code: '24AML143', title: 'Database Management System', sem: 4, L: 2, T: 0, P: 2, J: 0 },
  { code: '24AML144', title: 'Design and Analysis of Algorithms', sem: 4, L: 3, T: 0, P: 2, J: 0 },
  { code: '24AML145', title: 'Machine Learning', sem: 4, L: 1, T: 2, P: 2, J: 0 },
  { code: '24AML146', title: 'Cloud Computing & Applications', sem: 4, L: 0, T: 0, P: 2, J: 2 },
  { code: '24CIP147', title: 'Constitution of India, Professional Ethics, IKS and UHV', sem: 4, L: 0, T: 2, P: 0, J: 0 },
  { code: '24SFT148', title: 'Soft Skill-II', sem: 4, L: 0, T: 2, P: 0, J: 0 },
  { code: '24AML149', title: 'Internship – I & IPL (Social Concern)', sem: 4, L: 0, T: 0, P: 2, J: 2 },

  // Semester 5
  { code: '24AML151', title: 'Software Engineering, Project Management & Finance', sem: 5, L: 3, T: 0, P: 0, J: 0 },
  { code: '24AML152', title: 'Automata Theory & Computations', sem: 5, L: 2, T: 1, P: 1, J: 0 },
  { code: '24AML153', title: 'Computer Networks & Security', sem: 5, L: 3, T: 0, P: 2, J: 0 },
  { code: '24AML154', title: 'Advanced Machine Learning', sem: 5, L: 3, T: 0, P: 2, J: 0 },
  { code: '24AML155', title: 'Virtual Reality & Augmented Reality', sem: 5, L: 0, T: 0, P: 2, J: 2 },
  { code: '24AML156x', title: 'Open Elective - I', sem: 5, L: 3, T: 0, P: 0, J: 0 },
  { code: '24AML157', title: 'Employability Skills - I', sem: 5, L: 0, T: 2, P: 0, J: 0 },
  { code: '24AML158', title: 'Internship-II/ IPL', sem: 5, L: 0, T: 0, P: 2, J: 2 },

  // Semester 6
  { code: '24AML161', title: 'Deep Learning', sem: 6, L: 2, T: 0, P: 2, J: 0 },
  { code: '24AML162', title: 'Natural Language Processing', sem: 6, L: 2, T: 0, P: 2, J: 0 },
  { code: '24AML163', title: 'Generative Artificial Intelligence', sem: 6, L: 3, T: 0, P: 1, J: 1 },
  { code: '24AML164', title: 'Image Processing & Computer Vision', sem: 6, L: 0, T: 0, P: 2, J: 2 },
  { code: '24AML165x', title: 'Professional Elective – I', sem: 6, L: 3, T: 0, P: 0, J: 0 },
  { code: '24AML166x', title: 'Professional Elective – II (MOOC)', sem: 6, L: 3, T: 0, P: 0, J: 0 },
  { code: '24AML167x', title: 'Open Elective - II', sem: 6, L: 3, T: 0, P: 0, J: 0 },
  { code: '24AML168', title: 'Employability Skills - II', sem: 6, L: 0, T: 0, P: 2, J: 0 },

  // Semester 7
  { code: '24AML171', title: 'Agentic Artificial Intelligence', sem: 7, L: 2, T: 0, P: 2, J: 0 },
  { code: '24AML172x', title: 'Professional Elective – III', sem: 7, L: 3, T: 0, P: 0, J: 0 },
  { code: '24AML173x', title: 'Professional Elective – IV (MOOC)', sem: 7, L: 3, T: 0, P: 0, J: 0 },
  { code: '24AML174', title: 'Research Methodology & Intellectual Property Rights', sem: 7, L: 2, T: 0, P: 0, J: 0 },
  { code: '24AML175', title: 'Project Work Phase – I', sem: 7, L: 0, T: 0, P: 0, J: 10 },

  // Semester 8
  { code: '24AML181x', title: 'Professional Elective – V (MOOC)', sem: 8, L: 3, T: 0, P: 0, J: 0 },
  { code: '24AML182', title: 'Internship-III', sem: 8, L: 0, T: 0, P: 16, J: 0 },
  { code: '24AML183', title: 'Project Work Phase-II', sem: 8, L: 0, T: 0, P: 0, J: 12 },
];

export const SUBJECTS_BY_SEM = SEMESTERS.reduce((acc, sem) => {
  acc[sem.id] = SUBJECTS_DATA.filter(s => s.sem == sem.id).map(s => s.title);
  return acc;
}, {});

export function getPracticalSubjects(sem) {
  return SUBJECTS_DATA.filter(s => 
    s.sem == sem && 
    s.P > 0 && 
    !s.title.toLowerCase().includes('soft skill') &&
    !s.title.toLowerCase().includes('employability')
  ).map(s => s.title);
}

export function getProjectSubjects(sem) {
  // Pure project subjects: J > 0 and L=0, T=0, P=0
  return SUBJECTS_DATA.filter(s => s.sem == sem && s.J > 0 && s.L === 0 && s.T === 0 && s.P === 0).map(s => s.title);
}

export function getTheorySubjects(sem) {
  // Not pure project subjects (meaning they have L, T, or P)
  return SUBJECTS_DATA.filter(s => s.sem == sem && !(s.J > 0 && s.L === 0 && s.T === 0 && s.P === 0)).map(s => s.title);
}

// Map Subject -> Modules
export const MODULES_BY_SUBJECT = {
  'Computer Organization and Architecture': [
    { id: 'COA_M1', title: 'Module 1', file: '/content/Sem3/COA/Module_1.pdf' },
    { id: 'COA_M2', title: 'Module 2', file: '/content/Sem3/COA/Module_2(Second Half).pdf' },
    { id: 'COA_M3', title: 'Module 3', file: '/content/Sem3/COA/Module_3.pdf' },
    { id: 'COA_M4', title: 'Module 4', file: '/content/Sem3/COA/Module_4.pdf' },
    { id: 'COA_M5', title: 'Module 5', file: '/content/Sem3/COA/Module_5.pdf' }
  ]
};

// Fallback generator for subjects without explicit PDFs yet
export function getModulesForSubject(subject) {
  if (MODULES_BY_SUBJECT[subject]) {
    return MODULES_BY_SUBJECT[subject];
  }
  // Return empty list so we can show "Coming soon" state
  return [];
}
