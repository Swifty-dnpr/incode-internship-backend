export class Filters {
  price?: {
    $gt?: number;
    $lt?: number;
  };
  stock?: {
    $gt?: number;
  };
  category_title?: string;
}
