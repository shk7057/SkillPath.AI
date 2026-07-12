import { JOB_ROLES } from "@/lib/skillpath/jobRoles";

type SkillDefinition = {
  name: string;
  aliases: string[];
};

type RoleDefinition = {
  name: string;
  description: string;
  requiredSkills: string[];
  questionBank: {
    Easy: string[];
    Medium: string[];
    Advanced: string[];
  };
};

export const ROLE_DEFINITIONS: RoleDefinition[] = [
  {
    name: "Frontend Developer",
    description:
      "Best fit for candidates showing strong UI implementation, accessibility awareness, and modern React-based development.",
    requiredSkills: [
      "HTML",
      "CSS",
      "JavaScript",
      "React",
      "TypeScript",
      "Next.js",
      "Responsive Design",
      "Accessibility",
      "Tailwind CSS",
      "Git"
    ],
    questionBank: {
      Easy: [
        "Tell me about a frontend project where you improved the user experience.",
        "How do you approach building a responsive page from a design?"
      ],
      Medium: [
        "Describe a project where you made a UI decision that balanced user needs and engineering constraints.",
        "How have you improved accessibility or performance in a frontend project?"
      ],
      Advanced: [
        "Walk me through how you would structure a scalable frontend architecture for a growing product.",
        "Tell me about a frontend tradeoff you made between delivery speed, maintainability, and performance."
      ]
    }
  },
  {
    name: "AI Engineer",
    description:
      "Best fit for candidates who build and ship AI systems, model workflows, and practical LLM-powered features.",
    requiredSkills: [
      "Python",
      "LLMs",
      "Prompt Engineering",
      "Machine Learning",
      "REST APIs",
      "Docker",
      "AWS",
      "Git"
    ],
    questionBank: {
      Easy: [
        "Tell me about an AI/ML project you built from start to finish.",
        "How do you decide when to use an LLM versus a traditional ML approach?"
      ],
      Medium: [
        "Describe a time you improved an AI feature by tuning prompts, data, or evaluation criteria.",
        "How do you evaluate whether an AI product is actually useful for users?"
      ],
      Advanced: [
        "Walk me through how you would design a reliable AI system that can be deployed and monitored in production.",
        "Tell me about a tradeoff you made between model quality, latency, cost, and maintainability."
      ]
    }
  },
  {
    name: "Full Stack Developer",
    description:
      "Strong path for candidates who combine product-facing frontend work with APIs, databases, and backend logic.",
    requiredSkills: [
      "JavaScript",
      "TypeScript",
      "React",
      "Node.js",
      "REST APIs",
      "SQL",
      "MongoDB",
      "Git",
      "Testing",
      "System Design"
    ],
    questionBank: {
      Easy: [
        "Tell me about a project where you built both the frontend and backend parts.",
        "How do you think about data flow between a client and server in your projects?"
      ],
      Medium: [
        "Describe a feature where backend decisions affected the user experience and how you handled it.",
        "How have you designed an API or database structure for one of your projects?"
      ],
      Advanced: [
        "Walk me through how you would design a reliable full stack feature used by thousands of users.",
        "Tell me about a time you had to debug an issue that crossed both frontend and backend systems."
      ]
    }
  },
  {
    name: "Product Analyst",
    description:
      "Good match for candidates who show analytical thinking, experimentation, and the ability to turn product data into decisions.",
    requiredSkills: [
      "SQL",
      "Excel",
      "Python",
      "Data Visualization",
      "A/B Testing",
      "Analytics",
      "Communication",
      "Stakeholder Management",
      "Dashboards",
      "Product Sense"
    ],
    questionBank: {
      Easy: [
        "Tell me about a time you used data to understand a user or product problem.",
        "How would you evaluate whether a new product feature is working?"
      ],
      Medium: [
        "Describe how you would design an analysis for a drop in user conversion.",
        "Tell me about a time you presented data insights to help someone make a product decision."
      ],
      Advanced: [
        "How would you design and interpret an experiment for a feature with conflicting business goals?",
        "Walk me through the metrics you would use to evaluate product health for a student-focused app."
      ]
    }
  },
  {
    name: "UI Engineer",
    description:
      "Strong fit for candidates who bridge design and code with reusable components, polished interfaces, and system thinking.",
    requiredSkills: [
      "React",
      "TypeScript",
      "Design Systems",
      "CSS",
      "Figma",
      "Accessibility",
      "Responsive Design",
      "Performance Optimization",
      "Storybook",
      "Tailwind CSS"
    ],
    questionBank: {
      Easy: [
        "Tell me about a project where you translated a design into a polished interface.",
        "How do you keep UI work consistent across multiple screens or components?"
      ],
      Medium: [
        "Describe a time you improved a component for reusability, accessibility, or maintainability.",
        "How have you collaborated with designers when a design was hard to implement as-is?"
      ],
      Advanced: [
        "Walk me through how you would build and govern a scalable component library for a product team.",
        "Tell me about a UI engineering decision where performance, accessibility, and design fidelity were all in tension."
      ]
    }
  }
];

export const KNOWN_SKILLS: SkillDefinition[] = [
  { name: "HTML", aliases: ["html", "html5"] },
  { name: "CSS", aliases: ["css", "css3"] },
  { name: "JavaScript", aliases: ["javascript", "js", "ecmascript"] },
  { name: "TypeScript", aliases: ["typescript", "ts"] },
  { name: "React", aliases: ["react", "react.js"] },
  { name: "Next.js", aliases: ["next.js", "nextjs"] },
  { name: "Vue.js", aliases: ["vue", "vue.js"] },
  { name: "Angular", aliases: ["angular", "angularjs"] },
  { name: "Redux", aliases: ["redux"] },
  { name: "Tailwind CSS", aliases: ["tailwind", "tailwind css"] },
  { name: "Responsive Design", aliases: ["responsive design", "responsive", "mobile-first"] },
  { name: "Accessibility", aliases: ["accessibility", "a11y", "wcag", "screen reader"] },
  { name: "Design Systems", aliases: ["design system", "design systems", "component library"] },
  { name: "Storybook", aliases: ["storybook"] },
  { name: "Performance Optimization", aliases: ["performance optimization", "performance", "optimization"] },
  { name: "Webpack", aliases: ["webpack"] },
  { name: "GraphQL", aliases: ["graphql"] },
  { name: "Git", aliases: ["git", "github", "gitlab"] },
  { name: "Node.js", aliases: ["node", "node.js", "nodejs"] },
  { name: "Express.js", aliases: ["express", "express.js"] },
  { name: "NestJS", aliases: ["nestjs", "nest.js"] },
  { name: "REST APIs", aliases: ["rest api", "rest apis", "api integration", "apis"] },
  { name: "SQL", aliases: ["sql", "mysql", "postgres", "postgresql"] },
  { name: "PostgreSQL", aliases: ["postgresql", "postgres"] },
  { name: "MySQL", aliases: ["mysql"] },
  { name: "MongoDB", aliases: ["mongodb", "mongo db", "mongo"] },
  { name: "Redis", aliases: ["redis"] },
  { name: "Firebase", aliases: ["firebase"] },
  { name: "Python", aliases: ["python"] },
  { name: "Django", aliases: ["django"] },
  { name: "Flask", aliases: ["flask"] },
  { name: "FastAPI", aliases: ["fastapi", "fast api"] },
  { name: "Java", aliases: ["java"] },
  { name: "Spring Boot", aliases: ["spring boot", "springboot"] },
  { name: "C#", aliases: ["c#", "csharp", ".net"] },
  { name: "ASP.NET Core", aliases: ["asp.net core", "aspnet core", ".net core"] },
  { name: "Go", aliases: ["go", "golang"] },
  { name: "PHP", aliases: ["php"] },
  { name: "Laravel", aliases: ["laravel"] },
  { name: "Ruby on Rails", aliases: ["ruby on rails", "rails", "ror"] },
  { name: "Microservices", aliases: ["microservices", "microservice"] },
  { name: "Testing", aliases: ["testing", "jest", "cypress", "playwright", "unit test"] },
  { name: "System Design", aliases: ["system design", "architecture design"] },
  { name: "Excel", aliases: ["excel", "spreadsheet"] },
  { name: "Power BI", aliases: ["power bi", "powerbi"] },
  { name: "Tableau", aliases: ["tableau"] },
  { name: "Pandas", aliases: ["pandas"] },
  { name: "NumPy", aliases: ["numpy"] },
  { name: "Statistics", aliases: ["statistics", "statistical analysis"] },
  { name: "Data Visualization", aliases: ["data visualization", "visualization", "power bi", "tableau"] },
  { name: "A/B Testing", aliases: ["a/b testing", "ab testing", "experiment", "experimentation"] },
  { name: "Analytics", aliases: ["analytics", "analysis", "google analytics", "mixpanel"] },
  { name: "ETL", aliases: ["etl", "data pipeline", "pipelines"] },
  { name: "Data Warehousing", aliases: ["data warehousing", "data warehouse", "warehouse"] },
  { name: "Snowflake", aliases: ["snowflake"] },
  { name: "BigQuery", aliases: ["bigquery", "big query"] },
  { name: "Apache Spark", aliases: ["spark", "apache spark"] },
  { name: "Airflow", aliases: ["airflow", "apache airflow"] },
  { name: "dbt", aliases: ["dbt"] },
  { name: "Machine Learning", aliases: ["machine learning", "ml"] },
  { name: "Deep Learning", aliases: ["deep learning", "neural network", "neural networks"] },
  { name: "TensorFlow", aliases: ["tensorflow", "tensor flow"] },
  { name: "PyTorch", aliases: ["pytorch", "py torch"] },
  { name: "NLP", aliases: ["nlp", "natural language processing"] },
  { name: "Computer Vision", aliases: ["computer vision", "cv"] },
  { name: "LLMs", aliases: ["llm", "llms", "large language model", "large language models", "gpt"] },
  { name: "Prompt Engineering", aliases: ["prompt engineering", "prompt design"] },
  { name: "Docker", aliases: ["docker"] },
  { name: "Kubernetes", aliases: ["kubernetes", "k8s"] },
  { name: "AWS", aliases: ["aws", "amazon web services"] },
  { name: "Azure", aliases: ["azure", "microsoft azure"] },
  { name: "GCP", aliases: ["gcp", "google cloud", "google cloud platform"] },
  { name: "Linux", aliases: ["linux", "ubuntu"] },
  { name: "Terraform", aliases: ["terraform"] },
  { name: "CI/CD", aliases: ["ci/cd", "cicd", "continuous integration", "continuous delivery"] },
  { name: "Jenkins", aliases: ["jenkins"] },
  { name: "Monitoring", aliases: ["monitoring", "observability", "grafana", "prometheus"] },
  { name: "React Native", aliases: ["react native"] },
  { name: "Flutter", aliases: ["flutter"] },
  { name: "Dart", aliases: ["dart"] },
  { name: "Kotlin", aliases: ["kotlin"] },
  { name: "Android", aliases: ["android"] },
  { name: "Swift", aliases: ["swift"] },
  { name: "iOS", aliases: ["ios", "iphone"] },
  { name: "Network Security", aliases: ["network security"] },
  { name: "SIEM", aliases: ["siem"] },
  { name: "Incident Response", aliases: ["incident response"] },
  { name: "Vulnerability Assessment", aliases: ["vulnerability assessment", "vulnerability scanning"] },
  { name: "Penetration Testing", aliases: ["penetration testing", "pentesting", "pen test"] },
  { name: "IAM", aliases: ["iam", "identity and access management"] },
  { name: "Zero Trust", aliases: ["zero trust"] },
  { name: "Splunk", aliases: ["splunk"] },
  { name: "Cloud Security", aliases: ["cloud security"] },
  { name: "OWASP", aliases: ["owasp"] },
  { name: "Communication", aliases: ["communication", "presentation", "storytelling"] },
  { name: "Stakeholder Management", aliases: ["stakeholder management", "stakeholders", "cross-functional"] },
  { name: "Dashboards", aliases: ["dashboard", "dashboards", "reporting"] },
  { name: "Product Sense", aliases: ["product sense", "product thinking", "user research"] },
  { name: "Figma", aliases: ["figma"] },
  { name: "User Research", aliases: ["user research", "ux research"] },
  { name: "Wireframing", aliases: ["wireframing", "wireframes"] },
  { name: "Prototyping", aliases: ["prototyping", "prototype"] },
  { name: "Usability Testing", aliases: ["usability testing", "usability test"] },
  { name: "Jira", aliases: ["jira"] },
  { name: "Manual Testing", aliases: ["manual testing"] },
  { name: "API Testing", aliases: ["api testing", "postman"] },
  { name: "Selenium", aliases: ["selenium"] },
  { name: "Cypress", aliases: ["cypress"] },
  { name: "Playwright", aliases: ["playwright"] },
  { name: "Troubleshooting", aliases: ["troubleshooting", "technical support"] },
  { name: "Active Directory", aliases: ["active directory", "ad"] },
  { name: "Windows", aliases: ["windows"] },
  { name: "macOS", aliases: ["macos", "mac os", "mac"] },
  { name: "ServiceNow", aliases: ["servicenow", "service now"] }
];

export const COMMON_RESUME_SECTIONS = [
  { name: "Summary", aliases: ["summary", "profile", "objective"] },
  { name: "Experience", aliases: ["experience", "work experience", "internship"] },
  { name: "Projects", aliases: ["projects", "project experience"] },
  { name: "Skills", aliases: ["skills", "technical skills", "core skills"] },
  { name: "Education", aliases: ["education", "academic background"] }
];

export const COMMON_RESUME_KEYWORDS = [
  "impact",
  "results",
  "collaboration",
  "communication",
  "leadership",
  "performance",
  "testing",
  "analysis"
];

export function getRoleNames() {
  return JOB_ROLES.map((role) => role.title);
}
