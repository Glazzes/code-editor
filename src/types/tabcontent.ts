export type TabContent = {
  language: 'java' | 'python' | 'bash' | 'go' | 'javascript',
  code: string[],
  isActive: boolean;
}