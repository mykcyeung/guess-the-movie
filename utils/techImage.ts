type TechIcon = {
  name: string;
  icon: string;
}

type ContactIcon = {
  name: string;
  icon: string;
  link: string;
}

export const frontend: TechIcon[] = [
  { name: 'Javascript', icon: 'javascript.png' },
  { name: 'React', icon: 'react.svg' },
  { name: 'NextJs', icon: 'nextjs.svg' },
];

export const backend: TechIcon[] = [
  { name: 'API Gateway', icon: 'apigateway.png' },
  { name: 'Lambda', icon: 'lambda.png' },
  { name: 'Rekognition', icon: 'rekognition.png' },
  { name: 'Amplify', icon: 'amplify.png' },
];

export const contact: ContactIcon[] = [
  { name: 'Linkedin', icon: 'linkedinbw.svg', link: "www.linkedin.com/in/jay-yeung-aa7926254"},
  { name: 'github', icon: 'github.svg', link: "https://github.com/mykcyeung" },
  { name: 'Whatsapp', icon: 'whatsappbw.svg', link: "https://wa.me/447826182904" }
]
