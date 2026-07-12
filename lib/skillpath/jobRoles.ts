export type JobRoleCategory =
  | "Frontend"
  | "Backend"
  | "Full Stack"
  | "Data"
  | "AI/ML"
  | "Mobile"
  | "DevOps/Cloud"
  | "Cybersecurity"
  | "Product/Design"
  | "QA/IT Support";

export type JobRole = {
  title: string;
  category: JobRoleCategory;
  requiredSkills: string[];
  optionalSkills: string[];
  description: string;
};

function role(
  title: string,
  category: JobRoleCategory,
  requiredSkills: string[],
  optionalSkills: string[],
  description: string
): JobRole {
  return {
    title,
    category,
    requiredSkills,
    optionalSkills,
    description
  };
}

export const JOB_ROLES: JobRole[] = [
  role(
    "Frontend Developer",
    "Frontend",
    ["HTML", "CSS", "JavaScript", "React", "Responsive Design", "Git"],
    ["TypeScript", "Next.js", "Tailwind CSS", "Accessibility", "Testing"],
    "Builds polished web interfaces with strong usability, responsiveness, and modern frontend tooling."
  ),
  role(
    "React Developer",
    "Frontend",
    ["JavaScript", "React", "TypeScript", "CSS", "Git"],
    ["Redux", "Next.js", "Testing", "Tailwind CSS", "REST APIs"],
    "Focuses on component-driven React applications, state management, and maintainable frontend architecture."
  ),
  role(
    "Next.js Developer",
    "Frontend",
    ["React", "Next.js", "TypeScript", "JavaScript", "Git"],
    ["Tailwind CSS", "REST APIs", "GraphQL", "Testing", "Performance Optimization"],
    "Builds production-ready React apps with Next.js, strong rendering strategy, and frontend performance awareness."
  ),
  role(
    "UI Engineer",
    "Frontend",
    ["HTML", "CSS", "JavaScript", "Design Systems", "Accessibility", "Figma"],
    ["React", "Storybook", "Tailwind CSS", "Performance Optimization", "Responsive Design"],
    "Bridges design and engineering by building reusable, accessible, high-quality interface systems."
  ),
  role(
    "Web Accessibility Engineer",
    "Frontend",
    ["HTML", "CSS", "JavaScript", "Accessibility", "Responsive Design", "Testing"],
    ["React", "Design Systems", "Storybook", "Performance Optimization"],
    "Improves inclusive web experiences by enforcing accessibility standards and better interaction design."
  ),
  role(
    "Vue.js Developer",
    "Frontend",
    ["HTML", "CSS", "JavaScript", "Vue.js", "REST APIs", "Git"],
    ["TypeScript", "Testing", "Tailwind CSS", "Responsive Design"],
    "Creates maintainable frontend applications using Vue.js, API integration, and scalable UI patterns."
  ),
  role(
    "Angular Developer",
    "Frontend",
    ["HTML", "CSS", "JavaScript", "TypeScript", "Angular", "REST APIs"],
    ["Testing", "Git", "Responsive Design", "Performance Optimization"],
    "Builds structured enterprise-grade frontend applications using Angular and TypeScript."
  ),
  role(
    "Frontend Performance Engineer",
    "Frontend",
    ["HTML", "CSS", "JavaScript", "Performance Optimization", "Webpack", "React"],
    ["Next.js", "Accessibility", "Testing", "Responsive Design"],
    "Optimizes rendering, bundle delivery, and interaction speed for modern web products."
  ),
  role(
    "Backend Developer",
    "Backend",
    ["Node.js", "REST APIs", "SQL", "Git", "System Design"],
    ["Docker", "Testing", "PostgreSQL", "Redis", "Microservices"],
    "Designs and builds reliable server-side systems, APIs, and database-backed application logic."
  ),
  role(
    "Node.js Developer",
    "Backend",
    ["Node.js", "JavaScript", "REST APIs", "MongoDB", "Git"],
    ["Express.js", "Testing", "Docker", "TypeScript", "Redis"],
    "Builds API services and backend applications using Node.js and JavaScript ecosystem tools."
  ),
  role(
    "Java Backend Developer",
    "Backend",
    ["Java", "Spring Boot", "SQL", "REST APIs", "Git"],
    ["Microservices", "Docker", "PostgreSQL", "System Design"],
    "Develops structured backend services in Java with Spring Boot and strong relational data modeling."
  ),
  role(
    "Python Backend Developer",
    "Backend",
    ["Python", "Django", "REST APIs", "SQL", "Git"],
    ["Flask", "FastAPI", "PostgreSQL", "Docker", "Testing"],
    "Builds backend products and APIs with Python frameworks and clean application logic."
  ),
  role(
    ".NET Developer",
    "Backend",
    ["C#", "ASP.NET Core", "SQL", "REST APIs", "Git"],
    ["Azure", "Testing", "Microservices", "System Design"],
    "Creates business applications and APIs on the Microsoft stack with strong backend fundamentals."
  ),
  role(
    "Go Backend Developer",
    "Backend",
    ["Go", "REST APIs", "SQL", "Git", "Docker"],
    ["Microservices", "Kubernetes", "PostgreSQL", "System Design"],
    "Builds fast backend services in Go with an emphasis on performance and scalable service design."
  ),
  role(
    "PHP Developer",
    "Backend",
    ["PHP", "Laravel", "SQL", "REST APIs", "Git"],
    ["MySQL", "Docker", "Testing", "JavaScript"],
    "Develops server-rendered and API-driven web applications using PHP and Laravel."
  ),
  role(
    "Ruby on Rails Developer",
    "Backend",
    ["Ruby on Rails", "SQL", "REST APIs", "Git", "JavaScript"],
    ["PostgreSQL", "Testing", "Docker", "CSS"],
    "Builds product-focused web applications quickly using Rails conventions and full-stack collaboration."
  ),
  role(
    "Full Stack Developer",
    "Full Stack",
    ["JavaScript", "TypeScript", "React", "Node.js", "REST APIs", "SQL", "Git"],
    ["Testing", "Docker", "MongoDB", "System Design", "Next.js"],
    "Ships end-to-end features across frontend, backend, API, and database layers."
  ),
  role(
    "MERN Stack Developer",
    "Full Stack",
    ["JavaScript", "React", "Node.js", "MongoDB", "REST APIs", "Git"],
    ["TypeScript", "Redux", "Docker", "Testing"],
    "Builds modern JavaScript applications across React, Node.js, and MongoDB."
  ),
  role(
    "MEAN Stack Developer",
    "Full Stack",
    ["JavaScript", "TypeScript", "Angular", "Node.js", "MongoDB", "REST APIs"],
    ["Git", "Testing", "Docker", "CSS"],
    "Develops Angular and Node.js applications with shared full-stack JavaScript patterns."
  ),
  role(
    "Full Stack JavaScript Developer",
    "Full Stack",
    ["JavaScript", "React", "Node.js", "SQL", "REST APIs", "Git"],
    ["Next.js", "MongoDB", "Docker", "Testing", "TypeScript"],
    "Builds product-ready applications with JavaScript across frontend, backend, and data layers."
  ),
  role(
    "JAMstack Developer",
    "Full Stack",
    ["HTML", "CSS", "JavaScript", "React", "Next.js", "Git"],
    ["GraphQL", "Tailwind CSS", "Performance Optimization", "Testing"],
    "Creates fast content and product experiences using modern frontend frameworks and API-driven content."
  ),
  role(
    "Product Engineer",
    "Full Stack",
    ["JavaScript", "TypeScript", "React", "Node.js", "SQL", "Git"],
    ["System Design", "REST APIs", "Testing", "Communication"],
    "Owns features end-to-end with equal focus on product UX, engineering quality, and shipping velocity."
  ),
  role(
    "Data Analyst",
    "Data",
    ["SQL", "Excel", "Data Visualization", "Analytics", "Dashboards"],
    ["Power BI", "Tableau", "Communication", "Stakeholder Management"],
    "Turns business and product data into clear reports, trends, and decision-ready insights."
  ),
  role(
    "BI Analyst",
    "Data",
    ["SQL", "Power BI", "Excel", "Dashboards", "Stakeholder Management"],
    ["Data Visualization", "Tableau", "Analytics", "Communication"],
    "Builds reporting layers and business intelligence assets that help teams monitor performance."
  ),
  role(
    "Analytics Engineer",
    "Data",
    ["SQL", "dbt", "Data Warehousing", "Snowflake", "Dashboards"],
    ["BigQuery", "Airflow", "Python", "Analytics"],
    "Owns trusted analytics datasets, semantic models, and clean reporting foundations."
  ),
  role(
    "Data Engineer",
    "Data",
    ["Python", "SQL", "ETL", "Data Warehousing", "Apache Spark", "Airflow"],
    ["Snowflake", "BigQuery", "Docker", "AWS"],
    "Builds pipelines and scalable data systems that make analytics and downstream models reliable."
  ),
  role(
    "SQL Developer",
    "Data",
    ["SQL", "PostgreSQL", "MySQL", "ETL", "Git"],
    ["Power BI", "Excel", "Data Warehousing", "Dashboards"],
    "Designs data queries, transformations, and reporting logic on relational data platforms."
  ),
  role(
    "Reporting Analyst",
    "Data",
    ["Excel", "SQL", "Power BI", "Dashboards", "Communication"],
    ["Tableau", "Analytics", "Stakeholder Management", "Data Visualization"],
    "Creates recurring reporting and business summaries that help teams understand performance clearly."
  ),
  role(
    "Business Data Analyst",
    "Data",
    ["Excel", "SQL", "Tableau", "Analytics", "Communication"],
    ["Power BI", "Dashboards", "Stakeholder Management", "Product Sense"],
    "Translates business questions into practical analysis, reporting, and decision support."
  ),
  role(
    "Machine Learning Engineer",
    "AI/ML",
    ["Python", "Machine Learning", "TensorFlow", "PyTorch", "SQL"],
    ["Docker", "AWS", "Git", "Deep Learning"],
    "Builds, trains, and deploys predictive models for real product and business workflows."
  ),
  role(
    "Data Scientist",
    "AI/ML",
    ["Python", "SQL", "Statistics", "Machine Learning", "Pandas", "NumPy"],
    ["Data Visualization", "Tableau", "Power BI", "Communication"],
    "Uses statistical thinking and modeling to extract insights, forecasts, and experiments from data."
  ),
  role(
    "NLP Engineer",
    "AI/ML",
    ["Python", "NLP", "Machine Learning", "Deep Learning", "PyTorch"],
    ["TensorFlow", "LLMs", "Prompt Engineering", "SQL"],
    "Builds language-focused AI systems for search, classification, assistants, and text understanding."
  ),
  role(
    "Computer Vision Engineer",
    "AI/ML",
    ["Python", "Computer Vision", "Deep Learning", "PyTorch", "TensorFlow"],
    ["Docker", "AWS", "Machine Learning", "Git"],
    "Develops image and video models for recognition, detection, and visual automation problems."
  ),
  role(
    "AI Engineer",
    "AI/ML",
    ["Python", "LLMs", "Prompt Engineering", "Machine Learning", "REST APIs"],
    ["AWS", "Docker", "NLP", "Git"],
    "Ships AI-powered product features using modern LLM workflows, APIs, and application logic."
  ),
  role(
    "Generative AI Engineer",
    "AI/ML",
    ["Python", "LLMs", "Prompt Engineering", "NLP", "REST APIs"],
    ["PyTorch", "AWS", "Docker", "Machine Learning"],
    "Builds production-facing generative AI features, tools, and assistant experiences."
  ),
  role(
    "Mobile App Developer",
    "Mobile",
    ["JavaScript", "React Native", "REST APIs", "Git", "Testing"],
    ["TypeScript", "Firebase", "Android", "iOS"],
    "Builds mobile product experiences with reusable app architecture and backend integration."
  ),
  role(
    "React Native Developer",
    "Mobile",
    ["JavaScript", "TypeScript", "React Native", "REST APIs", "Git"],
    ["Firebase", "Testing", "Android", "iOS"],
    "Creates cross-platform mobile applications using React Native and JavaScript tooling."
  ),
  role(
    "Flutter Developer",
    "Mobile",
    ["Flutter", "Dart", "REST APIs", "Git", "Firebase"],
    ["Testing", "Android", "iOS"],
    "Builds performant cross-platform mobile apps with Flutter and modern mobile tooling."
  ),
  role(
    "Android Developer",
    "Mobile",
    ["Kotlin", "Android", "REST APIs", "Git", "Testing"],
    ["Firebase", "Java", "CI/CD"],
    "Develops native Android applications with strong app architecture and API integration."
  ),
  role(
    "iOS Developer",
    "Mobile",
    ["Swift", "iOS", "REST APIs", "Git", "Testing"],
    ["Firebase", "CI/CD"],
    "Builds native iOS applications with attention to quality, performance, and mobile user experience."
  ),
  role(
    "Cross Platform Developer",
    "Mobile",
    ["Flutter", "React Native", "REST APIs", "Git", "Testing"],
    ["Firebase", "TypeScript", "Dart"],
    "Builds shared mobile products across iOS and Android with cross-platform frameworks."
  ),
  role(
    "DevOps Engineer",
    "DevOps/Cloud",
    ["Linux", "Docker", "Kubernetes", "AWS", "CI/CD", "Git"],
    ["Terraform", "Jenkins", "Monitoring", "System Design"],
    "Automates delivery pipelines, infrastructure, and deployment workflows for modern engineering teams."
  ),
  role(
    "Cloud Engineer",
    "DevOps/Cloud",
    ["AWS", "Azure", "GCP", "Linux", "Terraform", "Git"],
    ["Docker", "Kubernetes", "CI/CD", "Monitoring"],
    "Designs and operates cloud infrastructure across modern platforms with automation and reliability in mind."
  ),
  role(
    "Site Reliability Engineer",
    "DevOps/Cloud",
    ["Linux", "AWS", "Kubernetes", "Monitoring", "CI/CD", "Git"],
    ["Docker", "Terraform", "System Design"],
    "Improves reliability, observability, and operational resilience of production systems."
  ),
  role(
    "Platform Engineer",
    "DevOps/Cloud",
    ["Kubernetes", "Docker", "Terraform", "CI/CD", "Git", "Linux"],
    ["AWS", "Monitoring", "System Design"],
    "Builds internal platforms and golden paths that help product teams ship infrastructure safely."
  ),
  role(
    "Kubernetes Engineer",
    "DevOps/Cloud",
    ["Kubernetes", "Docker", "Linux", "Git", "CI/CD"],
    ["AWS", "Azure", "GCP", "Terraform"],
    "Specializes in container orchestration, scalable deployment workflows, and cluster operations."
  ),
  role(
    "Cloud Architect",
    "DevOps/Cloud",
    ["AWS", "Azure", "GCP", "Terraform", "System Design"],
    ["Cloud Security", "Kubernetes", "Communication", "Stakeholder Management"],
    "Designs high-level cloud solutions balancing scalability, security, and maintainability."
  ),
  role(
    "Security Analyst",
    "Cybersecurity",
    ["Network Security", "SIEM", "Incident Response", "Vulnerability Assessment", "Communication"],
    ["Splunk", "Linux", "OWASP", "Cloud Security"],
    "Monitors threats, triages incidents, and strengthens an organization's security posture."
  ),
  role(
    "SOC Analyst",
    "Cybersecurity",
    ["SIEM", "Incident Response", "Splunk", "Network Security", "Linux"],
    ["Vulnerability Assessment", "Communication", "Cloud Security"],
    "Works in a security operations center to monitor alerts, investigate incidents, and escalate threats."
  ),
  role(
    "Penetration Tester",
    "Cybersecurity",
    ["Penetration Testing", "OWASP", "Linux", "Python", "Network Security"],
    ["Vulnerability Assessment", "Cloud Security", "REST APIs", "Git"],
    "Finds and validates security weaknesses through controlled offensive security testing."
  ),
  role(
    "Application Security Engineer",
    "Cybersecurity",
    ["OWASP", "Penetration Testing", "REST APIs", "Git", "Cloud Security"],
    ["Python", "Node.js", "JavaScript", "Docker"],
    "Improves security of software delivery by embedding secure coding and testing into engineering workflows."
  ),
  role(
    "IAM Engineer",
    "Cybersecurity",
    ["IAM", "Zero Trust", "Azure", "AWS", "Active Directory"],
    ["Cloud Security", "Linux", "Communication"],
    "Designs identity and access controls that keep systems secure while supporting business access needs."
  ),
  role(
    "Cloud Security Engineer",
    "Cybersecurity",
    ["Cloud Security", "AWS", "Azure", "IAM", "Network Security"],
    ["Kubernetes", "Terraform", "SIEM", "Incident Response"],
    "Protects cloud-native systems through identity, monitoring, hardening, and incident readiness."
  ),
  role(
    "Product Manager",
    "Product/Design",
    ["Communication", "Stakeholder Management", "Product Sense", "Analytics", "Jira"],
    ["SQL", "A/B Testing", "Dashboards", "User Research"],
    "Aligns business goals, user needs, and engineering execution to ship valuable product outcomes."
  ),
  role(
    "Product Analyst",
    "Product/Design",
    ["SQL", "Excel", "Analytics", "A/B Testing", "Dashboards", "Product Sense"],
    ["Communication", "Stakeholder Management", "Power BI", "Tableau"],
    "Supports product decisions using data analysis, experiment thinking, and user behavior insights."
  ),
  role(
    "UX Designer",
    "Product/Design",
    ["Figma", "User Research", "Wireframing", "Prototyping", "Usability Testing"],
    ["Design Systems", "Communication", "Product Sense", "Accessibility"],
    "Designs user flows and interfaces grounded in research, usability, and product clarity."
  ),
  role(
    "UI/UX Designer",
    "Product/Design",
    ["Figma", "Wireframing", "Prototyping", "Usability Testing", "Design Systems"],
    ["User Research", "Accessibility", "CSS", "HTML"],
    "Combines visual interface craft with practical interaction design and user experience thinking."
  ),
  role(
    "Product Designer",
    "Product/Design",
    ["Figma", "User Research", "Design Systems", "Prototyping", "Accessibility"],
    ["Wireframing", "HTML", "CSS", "Communication"],
    "Owns product experience design from concept to polished interface and iterative improvement."
  ),
  role(
    "UX Researcher",
    "Product/Design",
    ["User Research", "Communication", "Product Sense", "Analytics", "Stakeholder Management"],
    ["Figma", "Usability Testing", "Dashboards"],
    "Generates user insights that shape product direction, design decisions, and prioritization."
  ),
  role(
    "QA Engineer",
    "QA/IT Support",
    ["Testing", "Manual Testing", "API Testing", "Git", "Communication"],
    ["Selenium", "Cypress", "Playwright", "SQL"],
    "Validates application quality through structured test coverage, bug reporting, and release support."
  ),
  role(
    "Test Automation Engineer",
    "QA/IT Support",
    ["Testing", "Selenium", "Cypress", "Playwright", "Git"],
    ["API Testing", "JavaScript", "TypeScript", "CI/CD"],
    "Builds automated quality workflows that improve release confidence and regression coverage."
  ),
  role(
    "Manual Tester",
    "QA/IT Support",
    ["Manual Testing", "API Testing", "Testing", "Communication", "Jira"],
    ["SQL", "Usability Testing", "Product Sense"],
    "Executes structured manual testing, reports defects clearly, and supports reliable product releases."
  ),
  role(
    "Performance Tester",
    "QA/IT Support",
    ["Testing", "API Testing", "Performance Optimization", "REST APIs", "Git"],
    ["Cypress", "Playwright", "CI/CD", "SQL"],
    "Focuses on performance bottlenecks, stability checks, and system behavior under load."
  ),
  role(
    "IT Support Specialist",
    "QA/IT Support",
    ["Troubleshooting", "Windows", "macOS", "Active Directory", "Communication"],
    ["ServiceNow", "Linux"],
    "Supports end users by resolving system, device, and access issues quickly and clearly."
  ),
  role(
    "Systems Administrator",
    "QA/IT Support",
    ["Linux", "Windows", "Active Directory", "Troubleshooting", "ServiceNow"],
    ["AWS", "Azure", "Git"],
    "Maintains internal systems, user access, and server reliability across business environments."
  ),
  role(
    "Help Desk Technician",
    "QA/IT Support",
    ["Troubleshooting", "Windows", "macOS", "ServiceNow", "Communication"],
    ["Active Directory", "Linux"],
    "Provides frontline technical support and resolves common hardware, software, and account issues."
  )
];

export function getJobRoleTitles() {
  return JOB_ROLES.map((role) => role.title);
}
