import EmanuelePic from "../../assets/images/profileEmanuele.webp";
import MarijaPic from "../../assets/images/marijaPic.webp";
import { TeamMember } from "../../types/common";

/**
 * People shown on the public "Om oss" page.
 * Names, roles, e-mails and photos are taken unchanged from components/data/teamMembers.tsx.
 * That file is left as it is (it is no longer rendered publicly); only these two people
 * are presented on the public site.
 */
export const publicTeam: TeamMember[] = [
  {
    name: "Emanuele De Negri",
    role: "Fullstack-utvecklare",
    email: "it-digital@mambylysolutions.se",
    imageUrl: EmanuelePic,
  },
  {
    name: "Marija Markova",
    role: "Relationsansvarig",
    email: "intern@mambylysolutions.se",
    imageUrl: MarijaPic,
  },
];
