import CategoryPage from "./CategoryPage";
import worldRegionsBg from "../../assets/categories-backgrounds/world-regions-background.png";

const WorldRegionsPage: React.FC = () => {
  return (
    <CategoryPage
      title="Regiones del Mundo"
      intro="Viaja por los mares y océanos de cada región del planeta, y descubre cómo su biodiversidad y cultura marina los hacen únicos."
      slug="world-regions"
      background={worldRegionsBg}
    />
  );
};

export default WorldRegionsPage;
