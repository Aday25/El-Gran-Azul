import CategoryPage from "./CategoryPage";
import marineLifeBg from "../../assets/categories-backgrounds/marine-life-background.png";

const MarineLifePage: React.FC = () => {
  return (
    <CategoryPage
      title="Vida Marina"
      intro="Explora la asombrosa diversidad de especies marinas y descubre su papel esencial en el equilibrio del planeta."
      slug="marine-life"
      background={marineLifeBg}
    />
  );
};

export default MarineLifePage;
