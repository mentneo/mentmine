// Firestore collection name for services
export const SERVICES_COLLECTION = 'services';

// Default service images are used when a service is created without an image
export const defaultServiceImages = [
  '/assets/services/mentoring.jpg',
  '/assets/services/webdev.jpg',
  '/assets/services/appdev.jpg',
  '/assets/services/design.jpg',
  '/assets/services/career.jpg',
];

// Static services data
export const services = [
  {
    id: 'mentoring',
    title: '1-on-1 Mentoring',
    description: 'Get personalized guidance from industry experts who will help you navigate your learning journey and career path.',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
    features: [
      'Tailored guidance for your specific needs',
      'Regular progress tracking and feedback',
      'Industry-relevant advice and connections',
      'Portfolio and resume review'
    ],
    price: 'From ₹999/session'
  },
  {
    id: 'fullstack',
    title: 'Full-Stack Development',
    description: 'Master both frontend and backend development with our comprehensive hands-on training program.',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
    features: [
      'Frontend technologies (HTML, CSS, JavaScript frameworks)',
      'Backend development (Node.js, Python, etc.)',
      'Database design and management',
      'Building complete web applications'
    ],
    price: 'From ₹12,999'
  },
  {
    id: 'career',
    title: 'Career Acceleration',
    description: 'Get the skills, guidance, and connections you need to fast-track your tech career growth.',
    image: 'https://images.unsplash.com/photo-1453928582365-b6ad33cbcf64?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1746&q=80',
    features: [
      'Resume building and optimization',
      'Interview preparation',
      'Networking opportunities',
      'Job placement assistance'
    ],
    price: 'From ₹8,999'
  },
  {
    id: 'projectbased',
    title: 'Project-Based Learning',
    description: 'Learn by doing with real-world projects that build your portfolio and solidify your skills.',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
    features: [
      'Industry-relevant project frameworks',
      'Guided development process',
      'Code reviews and feedback',
      'Portfolio-ready final projects'
    ],
    price: 'From ₹5,999'
  },
  {
    id: 'specialization',
    title: 'Tech Specialization',
    description: 'Dive deep into specialized tech domains like AI, cloud computing, cybersecurity, and more.',
    image: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1548&q=80',
    features: [
      'In-depth knowledge in specialized areas',
      'Hands-on projects and case studies',
      'Industry certifications preparation',
      'Latest tools and technologies'
    ],
    price: 'From ₹15,999'
  },
  {
    id: 'corporate',
    title: 'Corporate Training',
    description: 'Upskill your team with customized training programs designed for your company\'s specific needs.',
    image: 'https://images.unsplash.com/photo-1552581234-26160f608093?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
    features: [
      'Customized curriculum',
      'Flexible scheduling',
      'Progress tracking and reporting',
      'Team-based learning activities'
    ],
    price: 'Custom pricing'
  }
];
