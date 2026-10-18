export interface CartexQuestion {
  id: number;
  text: string;
  image?: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface CartexExam {
  title: string;
  cover: string;
  pdf?: string;
  questions: CartexQuestion[];
}

export interface SignCategory {
  id: string;
  title: string;
  icon: string;
  kind: 'grid' | 'concepts' | 'lines';
  arg?: string;
}

export interface SignGridItem {
  img: string;
  title: string;
}

export interface ConceptColor {
  title: string;
  desc: string;
  color: string;
}

export interface ConceptShape {
  title: string;
  desc: string;
  img: string;
}

export interface LineItem {
  img: string;
  title: string;
}

export interface MetaInfo {
  title: string;
  home1?: string;
  home2?: string;
  help1?: string;
  help2?: string;
  sectionsTitle?: string;
  examsTitle?: string;
  signsTitle?: string;
}
