import CategoryPage from "./CategoryPage";
import problemsThreatsBg from "../../assets/categories-backgrounds/problems-threats-background.png";

const ProblemsThreatsPage: React.FC = () => {
  return (
    <CategoryPage
      title="Problemas y Amenazas"
      intro="Descubre los principales retos que enfrentan los océanos, desde la contaminación hasta el cambio climático, y cómo podemos ayudar a protegerlos."
      slug="problems-threats"
      background={problemsThreatsBg}
    />
  );
};

export default ProblemsThreatsPage;
