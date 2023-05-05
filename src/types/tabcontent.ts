export type TabContent = {
  id: string;
  name: string;
  language: 'java' | 'python' | 'bash' | 'go' | 'javascript',
  code: string[],
}