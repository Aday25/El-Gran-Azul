import CategoryPage from "./CategoryPage";
import scienceExplorationBg from "../../assets/categories-backgrounds/science-exploration-background.png";

const ScienceExplorationPage: React.FC = () => {
  return (
    <CategoryPage
      title="Ciencia y Exploración"
      intro="Acompaña a los científicos en sus descubrimientos bajo el mar y aprende cómo la tecnología nos ayuda a conocer mejor el océano profundo."
      slug="science-exploration"
      background={scienceExplorationBg}
    />
  );
};

export default ScienceExplorationPage;
