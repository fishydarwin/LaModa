import { User } from './user';
import { Category } from './category';
import { Article } from './article';

export const USERS: User[] = [
  { id: 1, name: 'Administrator', password_obfuscated:'abcdefghijk', email: 'admin@lamoda.ro', role: 'admin' },
  { id: 2, name: 'Ioana Dan', password_obfuscated:'abcdefghijk', email: 'ioana.dan@abc.ro', role: 'user' },
  { id: 3, name: 'Alina Buzău', password_obfuscated:'abcdefghijk', email: 'alii.buzbuz@abc.ro', role: 'user' },
  { id: 4, name: 'Selena Komeiji', password_obfuscated:'abcdefghijk', email: 'selekk12@abc.ro', role: 'moderator' }
]; 

export const CATEGORIES: Category[] = [
  { id: 1, name: "Îmbrăcăminte", system_category: true },
  { id: 2, name: "Pantofi", system_category: true },
  { id: 3, name: "Coafuri", system_category: true },
  { id: 4, name: "Machiaj", system_category: true },
  { id: 5, name: "Manichiură", system_category: true }
]

export const ARTICLES: Article[] = [
  { id: 1, id_author: 1, id_category: 1, name: 'Pullover stradă', summary: 'Descoperă modelele de pullover pentru primăvară în cea mai nouă colecție a noastră', attachment_array: [
    {id: 1, id_article: 1, attachment_url: '/assets/mock-data-images/pullover1.jpg' },
    {id: 2, id_article: 1, attachment_url: '/assets/mock-data-images/pullover2.jpg' },
    {id: 3, id_article: 1, attachment_url: '/assets/mock-data-images/pullover3.jpg' }
  ]},
  { id: 2, id_author: 2, id_category: 2, name: 'Vanși modele noi', summary: 'Ultimul model de Vanși, cu un design nou și inovator, ce redefinesc standardele stilului', attachment_array: [
    {id: 4, id_article: 2, attachment_url: '/assets/mock-data-images/vans1.webp' },
    {id: 5, id_article: 2, attachment_url: '/assets/mock-data-images/vans2.jpg' },
    {id: 6, id_article: 2, attachment_url: '/assets/mock-data-images/vans3.webp' }
  ]},
  { id: 3, id_author: 2, id_category: 3, name: 'Păr scurt primăvară', summary: 'Împrospătează-ți look-ul cu o tunsoare modernă pentru păr scurt deosebit', attachment_array: [
    {id: 7, id_article: 3, attachment_url: '/assets/mock-data-images/shorthair1.jpg' },
    {id: 8, id_article: 3, attachment_url: '/assets/mock-data-images/shorthair2.jpg' },
    {id: 9, id_article: 3, attachment_url: '/assets/mock-data-images/shorthair3.jpeg' }
  ]},
  { id: 4, id_author: 3, id_category: 4, name: 'Eyeliner 2024', summary: 'Explorează trendurile în moda eyeliner pentru anul 2024 și descoperă cele mai recente tehnici și stiluri', attachment_array: [
    {id: 10, id_article: 4, attachment_url: '/assets/mock-data-images/eyeliner1.webp' },
    {id: 11, id_article: 4, attachment_url: '/assets/mock-data-images/eyeliner2.jpeg' },
    {id: 12, id_article: 4, attachment_url: '/assets/mock-data-images/eyeliner3.jpg' }
  ]},
  { id: 5, id_author: 4, id_category: 5, name: 'Albastru stiletto', summary: 'Încântă-ți simțurile cu unghii albastre stiletto, adăugând o notă de eleganță și stil la fiecare pas', attachment_array: [
    {id: 13, id_article: 5, attachment_url: '/assets/mock-data-images/stiletto1.jpg' },
    {id: 14, id_article: 5, attachment_url: '/assets/mock-data-images/stiletto2.jpg.avif' },
    {id: 15, id_article: 5, attachment_url: '/assets/mock-data-images/stiletto3.webp.jpeg' }
  ]}
];
