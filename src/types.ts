export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  shortDescription: string;
  description: string;
  ingredients: string[];
  usage: string;
  rating: number;
  salesCount: number;
  isNew?: boolean;
}

export interface Feedback {
  id: string;
  name: string;
  avatar: string;
  role: string;
  rating: number;
  comment: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}
