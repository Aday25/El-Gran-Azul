import CategoryPage from "./CategoryPage";
import oceanEcosystemsBg from "../../assets/categories-backgrounds/ocean-ecosystems-background.png";

const OceanEcosystemsPage: React.FC = () => {
  return (
    <CategoryPage
      title="Ecosistemas Oceánicos"
      intro="Sumérgete en los hábitats más fascinantes del océano y conoce cómo interactúan sus organismos para mantener la vida marina."
      slug="ocean-ecosystems"
      background={oceanEcosystemsBg}
    />
  );
};

export default OceanEcosystemsPage;
