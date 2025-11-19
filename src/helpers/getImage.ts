import {Project} from "../@types/context";

export const getImage = (project: Project | null) => {
  switch (project) {
    case Project.DeepNude:
      return "https://bot.deep-nudes.com/static/DN.png";
    case Project.AIDeepNudes:
      return "https://bot.deep-nudes.com/static/AIDN.png";
    default:
      return "https://bot.deep-nudes.com/static/DN.png";
  }

}