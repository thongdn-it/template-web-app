export interface WineModel {
  wine: string;
  winery: string;
  rating: {
    average: string;
    reviews: string;
  };
  location: string;
  image: string;
  id: number;
}
